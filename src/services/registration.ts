import type {
  RegistrationPayload,
  RegistrationResult,
  TeamPreview,
} from "../types/registration";

// MOCK: este servicio simula el backend de la inscripcion. Cada funcion
// documenta la llamada real que la reemplaza. Las paginas solo importan desde
// aqui, asi que conectar Supabase no requiere tocar los componentes.
//
// Pendiente en la DB (ver server/prisma/schema.prisma):
//   - Migracion para registrations, deliverables y las columnas nuevas de users
//   - RPCs submit_registration y get_team_preview (SECURITY DEFINER)
//   - Bucket privado "cvs" con politicas por auth.uid()
//   - Captcha en Supabase Auth (Turnstile/hCaptcha) para frenar bots en el OTP
export const IS_MOCK_SERVICE = true;

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Alfabeto sin caracteres ambiguos (0/O, 1/I/L)
const CODE_ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";

function generateTeamCode() {
  const bytes = crypto.getRandomValues(new Uint8Array(8));
  return Array.from(bytes, (b) => CODE_ALPHABET[b % CODE_ALPHABET.length]).join("");
}

export async function requestEmailCode(email: string): Promise<void> {
  // TODO(backend): supabase.auth.signInWithOtp({ email, options: { shouldCreateUser: true, captchaToken } })
  void email;
  await wait(700);
}

// Mock: "000000" simula un codigo incorrecto; cualquier otro funciona
export async function verifyEmailCode(
  email: string,
  code: string,
): Promise<boolean> {
  // TODO(backend): supabase.auth.verifyOtp({ email, token: code, type: "email" })
  // Deja una sesion activa: auth.uid() es lo que RLS usa para asociar los datos.
  void email;
  await wait(600);
  return code !== "000000";
}

// Mock: codigos que empiezan con X no existen; con F, el equipo esta lleno
export async function findTeamByCode(code: string): Promise<TeamPreview | null> {
  // TODO(backend): supabase.rpc("get_team_preview", { p_code: code })
  // Devuelve solo nombre y numero de integrantes, nunca la lista de personas.
  await wait(500);
  if (code.startsWith("X")) return null;
  if (code.startsWith("F")) return { name: "Equipo completo (demo)", memberCount: 4 };
  return { name: "Equipo de prueba", memberCount: 2 };
}

export async function uploadCv(file: File): Promise<string> {
  // TODO(backend): supabase.storage.from("cvs").upload(`${uid}/cv.pdf`, file, { upsert: true, contentType: "application/pdf" })
  // El bucket es privado: se guarda la ruta, no una URL publica.
  void file;
  await wait(900);
  return "cvs/<auth-uid>/cv.pdf";
}

export async function submitRegistration(
  payload: RegistrationPayload,
): Promise<RegistrationResult> {
  // TODO(backend): supabase.rpc("submit_registration", { p_payload: payload })
  // Una sola funcion para que users, academic_information, registrations y el
  // equipo se escriban en una transaccion. Errores esperados que la UI debe
  // traducir: correo ya inscrito, equipo lleno, codigo de equipo invalido.
  await wait(1200);
  const team = payload.team;
  if (team?.action === "create" && team.visibility === "private") {
    return { teamCode: generateTeamCode() };
  }
  return { teamCode: null };
}
