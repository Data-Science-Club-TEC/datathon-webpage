import type {
  AcademicLevel,
  Gender,
  TeamPreference,
  TeamPreview,
  TeamVisibility,
} from "../../types/registration";

// Estado del formulario mientras se llena. Usa valores "vacios" ("" o null)
// para distinguir "sin responder" de una respuesta; validation.ts lo convierte
// en RegistrationPayload al enviar.
export interface RegistrationDraft {
  // Correo
  email: string;
  emailVerified: boolean;
  // Datos personales
  firstName: string;
  lastName: string;
  phone: string; // 10 digitos, sin lada
  birthDate: string; // YYYY-MM-DD
  gender: Gender | "";
  // Formacion academica
  schoolId: string; // id del catalogo, OTHER_SCHOOL o ""
  schoolOther: string;
  academicLevel: AcademicLevel | "";
  programId: string;
  programNotListed: boolean;
  programOther: string;
  graduationMonth: string; // "01".."12"
  graduationYear: string;
  // Experiencia
  hasHackathonExperience: boolean | null;
  hackathonCount: number;
  hasWonHackathon: boolean | null;
  hasProgrammingExperience: boolean | null;
  hasDataScienceExperience: boolean | null;
  hasSystemDesignExperience: boolean | null;
  // Perfiles: URLs tal como las escribio la persona; al enviar se guardan en
  // forma canonica (validation.ts > checkProfileUrl)
  githubUrl: string;
  devpostUrl: string;
  linkedinUrl: string;
  portfolioUrl: string;
  // Equipo
  teamPreference: TeamPreference | "";
  teamCode: string;
  teamPreview: TeamPreview | null;
  interestArea: string;
  newTeamName: string;
  newTeamVisibility: TeamVisibility;
  // Confirmacion
  acceptPrivacy: boolean;
  acceptRules: boolean;
}

export type DraftField = keyof RegistrationDraft | "cv";
export type FieldErrors = Partial<Record<DraftField, string>>;

// Props comunes de cada paso del formulario
export type StepProps = {
  draft: RegistrationDraft;
  errors: FieldErrors;
  update: (patch: Partial<RegistrationDraft>) => void;
};

export const OTHER_SCHOOL = "other";

export const emptyDraft: RegistrationDraft = {
  email: "",
  emailVerified: false,
  firstName: "",
  lastName: "",
  phone: "",
  birthDate: "",
  gender: "",
  schoolId: "",
  schoolOther: "",
  academicLevel: "",
  programId: "",
  programNotListed: false,
  programOther: "",
  graduationMonth: "",
  graduationYear: "",
  hasHackathonExperience: null,
  hackathonCount: 1,
  hasWonHackathon: null,
  hasProgrammingExperience: null,
  hasDataScienceExperience: null,
  hasSystemDesignExperience: null,
  githubUrl: "",
  devpostUrl: "",
  linkedinUrl: "",
  portfolioUrl: "",
  teamPreference: "",
  teamCode: "",
  teamPreview: null,
  interestArea: "",
  newTeamName: "",
  newTeamVisibility: "private",
  acceptPrivacy: false,
  acceptRules: false,
};

export const STEPS = [
  {
    id: "email",
    tip: "Si el código no llega, revisa tu carpeta de spam.",
    title: "Correo",
    heading: "Verifica tu correo",
    description:
      "Te enviaremos un código de 6 dígitos. Así confirmamos que el correo es tuyo y protegemos tu inscripción.",
  },
  {
    id: "personal",
    tip: "Tu teléfono solo se usa para avisos del evento.",
    title: "Datos personales",
    heading: "Cuéntanos de ti",
    description: "Usaremos estos datos para tu gafete y para contactarte durante el evento.",
  },
  {
    id: "academic",
    tip: "Puedes volver a editar esto desde el último paso.",
    title: "Formación académica",
    heading: "¿Dónde estudias?",
    description: "Si tu escuela o carrera no aparece, puedes escribirla.",
  },
  {
    id: "experience",
    tip: "Responder con honestidad nos ayuda a armar mejores equipos.",
    title: "Experiencia",
    heading: "Tu experiencia",
    description:
      "No hay respuestas incorrectas: nos ayuda a balancear equipos y preparar talleres.",
  },
  {
    id: "profiles",
    tip: "Prueba que tus enlaces abran antes de continuar.",
    title: "Perfiles y CV",
    heading: "Perfiles y CV",
    description:
      "Los sponsors revisan estos perfiles para conocer a los participantes.",
  },
  {
    id: "team",
    tip: "¿Aún sin equipo? Puedes decidirlo después.",
    title: "Equipo",
    heading: "¿Tienes equipo?",
    description: "Puedes unirte a uno, crear el tuyo o decidirlo después.",
  },
  {
    id: "review",
    tip: "Puedes volver a cualquier paso antes de enviar.",
    title: "Confirmación",
    heading: "Revisa y confirma",
    description: "Verifica que todo esté correcto antes de enviar.",
  },
] as const;

export type StepId = (typeof STEPS)[number]["id"];

// Persistencia del borrador. sessionStorage (no localStorage) para que los
// datos personales no queden en el navegador al cerrar la pestaña; el CV, el
// honeypot y los consentimientos nunca se guardan. Cambiar la version de la
// llave cuando cambie la forma de RegistrationDraft.
// TODO(backend): con Supabase, emailVerified debe salir de la sesion
// (supabase.auth.getSession()), no de lo que diga el borrador guardado.
const STORAGE_KEY = "dsc-datathon-registration-v2";

export interface StoredProgress {
  draft: RegistrationDraft;
  step: number;
  maxStep: number;
}

export function loadProgress(): StoredProgress {
  const fallback = { draft: emptyDraft, step: 0, maxStep: 0 };
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw) as Partial<StoredProgress>;
    const lastStep = STEPS.length - 1;
    const maxStep = Math.min(Math.max(Number(parsed.maxStep) || 0, 0), lastStep);
    const step = Math.min(Math.max(Number(parsed.step) || 0, 0), maxStep);
    return {
      draft: { ...emptyDraft, ...parsed.draft, acceptPrivacy: false, acceptRules: false },
      step,
      maxStep,
    };
  } catch {
    return fallback;
  }
}

export function saveProgress({ draft, step, maxStep }: StoredProgress) {
  try {
    const safeDraft = { ...draft, acceptPrivacy: false, acceptRules: false };
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ draft: safeDraft, step, maxStep }),
    );
  } catch {
    // Sin almacenamiento disponible (modo privado, bloqueado): se ignora
  }
}

export function clearProgress() {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
  } catch {
    // Igual que arriba
  }
}
