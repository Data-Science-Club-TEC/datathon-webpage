import { edition } from "../../data/datathon";
import { academicPrograms } from "../../data/registration";
import type {
  AcademicLevel,
  Gender,
  ProgramLevel,
  RegistrationPayload,
  TeamAction,
  TeamPreference,
} from "../../types/registration";
import {
  OTHER_SCHOOL,
  STEPS,
  type FieldErrors,
  type RegistrationDraft,
  type StepId,
} from "./draft";

// Validacion del lado del cliente: da feedback inmediato y replica los CHECK
// de la DB, pero no sustituye la validacion del servidor (RLS + RPC).

export const MIN_AGE = 16; // PLACEHOLDER: edad minima por confirmar con el comite
export const MAX_HACKATHONS = 50;
export const CV_MAX_BYTES = 5 * 1024 * 1024;

// Mismo patron que users_email_format_check
const EMAIL_RE = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
const NAME_RE = /^\p{L}[\p{L}\p{M}\s'.-]*$/u;
const PHONE_RE = /^\d{10}$/;
export const TEAM_CODE_RE = /^[A-Z0-9]{6,8}$/;

const CHOOSE = "Selecciona una opción";

export const isValidEmail = (email: string) => EMAIL_RE.test(email.trim());

export const programLevelFor = (level: AcademicLevel | ""): ProgramLevel =>
  level === "masters" || level === "doctorate" ? "postgraduate" : "undergraduate";

// Enlaces de perfil: deben ser URLs https del sitio correcto y apuntar al
// perfil (no a un repositorio o proyecto). Se guardan en forma canonica.
export type ProfileKind = "github" | "devpost" | "linkedin";

const PROFILE_RULES: Record<
  ProfileKind,
  {
    domain: string;
    host: RegExp;
    example: string;
    // Devuelve el usuario si la ruta es la de un perfil, o null
    profileId: (parts: string[]) => string | null;
    pathError: string;
    canonical: (id: string) => string;
  }
> = {
  github: {
    domain: "github.com",
    host: /^(www\.)?github\.com$/i,
    example: "https://github.com/tu-usuario",
    profileId: (parts) =>
      parts.length === 1 && /^[A-Za-z0-9](?:[A-Za-z0-9-]{0,38})$/.test(parts[0])
        ? parts[0]
        : null,
    pathError: "Usa el enlace a tu perfil (github.com/usuario), no a un repositorio",
    canonical: (id) => `https://github.com/${id}`,
  },
  devpost: {
    domain: "devpost.com",
    host: /^(www\.)?devpost\.com$/i,
    example: "https://devpost.com/tu-usuario",
    profileId: (parts) =>
      parts.length === 1 && /^[A-Za-z0-9_-]{1,60}$/.test(parts[0]) ? parts[0] : null,
    pathError: "Usa el enlace a tu perfil (devpost.com/usuario), no a un proyecto",
    canonical: (id) => `https://devpost.com/${id}`,
  },
  linkedin: {
    domain: "linkedin.com",
    host: /^([a-z]{2,3}\.)?linkedin\.com$/i,
    example: "https://www.linkedin.com/in/tu-usuario",
    profileId: (parts) =>
      parts.length === 2 &&
      parts[0].toLowerCase() === "in" &&
      /^[A-Za-z0-9_%-]{3,100}$/.test(parts[1])
        ? parts[1]
        : null,
    pathError: "Usa el enlace a tu perfil (linkedin.com/in/usuario)",
    canonical: (id) => `https://www.linkedin.com/in/${id}`,
  },
};

export const profileExample = (kind: ProfileKind) => PROFILE_RULES[kind].example;

export type ProfileCheck = { ok: true; url: string } | { ok: false; error: string };

export function checkProfileUrl(kind: ProfileKind, raw: string): ProfileCheck {
  const rule = PROFILE_RULES[kind];
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return { ok: false, error: `Escribe la URL completa, por ejemplo ${rule.example}` };
  }
  if (url.protocol !== "https:") {
    return { ok: false, error: "La URL debe empezar con https://" };
  }
  if (!rule.host.test(url.hostname)) {
    return { ok: false, error: `Debe ser un enlace de ${rule.domain}` };
  }
  const parts = url.pathname.split("/").filter(Boolean);
  if (parts.length === 0) {
    return { ok: false, error: "Falta tu usuario al final del enlace" };
  }
  const id = rule.profileId(parts);
  return id ? { ok: true, url: rule.canonical(id) } : { ok: false, error: rule.pathError };
}

// Ayuda al escribir: "github.com/ana" o "http://..." se convierten a https://
export function withHttps(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return trimmed;
  if (/^http:\/\//i.test(trimmed)) return trimmed.replace(/^http:/i, "https:");
  if (!/^[a-z][a-z0-9+.-]*:/i.test(trimmed) && trimmed.includes(".")) {
    return `https://${trimmed}`;
  }
  return trimmed;
}

const canonicalProfile = (kind: ProfileKind, raw: string) => {
  const check = checkProfileUrl(kind, raw);
  return check.ok ? check.url : raw.trim();
};

function isHttpsUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.includes(".");
  } catch {
    return false;
  }
}

function ageOn(birthDate: string, today = new Date()) {
  const [year, month, day] = birthDate.split("-").map(Number);
  if (!year || !month || !day) return NaN;
  const hadBirthday =
    today.getMonth() + 1 > month ||
    (today.getMonth() + 1 === month && today.getDate() >= day);
  return today.getFullYear() - year - (hadBirthday ? 0 : 1);
}

function validateName(value: string, emptyMessage: string) {
  const name = value.trim();
  if (name.length < 2) return emptyMessage;
  if (name.length > 100) return "Máximo 100 caracteres";
  if (!NAME_RE.test(name)) return "Usa solo letras, espacios y guiones";
  return undefined;
}

const validators: Record<
  StepId,
  (draft: RegistrationDraft, cv: File | null) => FieldErrors
> = {
  email: (d) => {
    const errors: FieldErrors = {};
    if (!isValidEmail(d.email)) errors.email = "Escribe un correo válido";
    else if (!d.emailVerified) errors.email = "Verifica tu correo para continuar";
    return errors;
  },

  personal: (d) => {
    const errors: FieldErrors = {
      firstName: validateName(d.firstName, "Escribe tu nombre"),
      lastName: validateName(d.lastName, "Escribe tus apellidos"),
    };
    if (!PHONE_RE.test(d.phone)) errors.phone = "Escribe tu número a 10 dígitos";
    const age = ageOn(d.birthDate);
    if (Number.isNaN(age)) errors.birthDate = "Escribe tu fecha de nacimiento";
    else if (age < MIN_AGE) errors.birthDate = `Debes tener al menos ${MIN_AGE} años`;
    else if (age > 100) errors.birthDate = "Revisa la fecha";
    if (!d.gender) errors.gender = CHOOSE;
    return errors;
  },

  academic: (d) => {
    const errors: FieldErrors = {};
    if (!d.schoolId) errors.schoolId = "Selecciona tu escuela";
    else if (d.schoolId === OTHER_SCHOOL && d.schoolOther.trim().length < 2) {
      errors.schoolOther = "Escribe el nombre de tu escuela";
    }
    if (!d.academicLevel) errors.academicLevel = "Selecciona tu grado de estudio";
    if (d.programNotListed) {
      if (d.programOther.trim().length < 2) {
        errors.programOther = "Escribe el nombre de tu carrera";
      }
    } else {
      const level = programLevelFor(d.academicLevel);
      const isKnown = academicPrograms.some(
        (p) => p.id === d.programId && p.level === level,
      );
      if (!isKnown) {
        errors.programId = "Elige una opción de la lista o indica que no aparece";
      }
    }
    if (!d.graduationMonth || !d.graduationYear) {
      errors.graduationMonth = "Selecciona mes y año";
    }
    return errors;
  },

  experience: (d) => {
    const errors: FieldErrors = {};
    if (d.hasHackathonExperience === null) errors.hasHackathonExperience = CHOOSE;
    if (d.hasHackathonExperience) {
      if (
        !Number.isInteger(d.hackathonCount) ||
        d.hackathonCount < 1 ||
        d.hackathonCount > MAX_HACKATHONS
      ) {
        errors.hackathonCount = `Escribe un número entre 1 y ${MAX_HACKATHONS}`;
      }
      if (d.hasWonHackathon === null) errors.hasWonHackathon = CHOOSE;
    }
    if (d.hasProgrammingExperience === null) errors.hasProgrammingExperience = CHOOSE;
    if (d.hasDataScienceExperience === null) errors.hasDataScienceExperience = CHOOSE;
    if (d.hasSystemDesignExperience === null) errors.hasSystemDesignExperience = CHOOSE;
    return errors;
  },

  profiles: (d, cv) => {
    const errors: FieldErrors = {};
    const profileError = (kind: ProfileKind, value: string, emptyMessage?: string) => {
      if (!value.trim()) return emptyMessage;
      const check = checkProfileUrl(kind, value);
      return check.ok ? undefined : check.error;
    };
    errors.githubUrl = profileError("github", d.githubUrl, "Escribe el enlace a tu perfil de GitHub");
    errors.devpostUrl = profileError("devpost", d.devpostUrl, "Escribe el enlace a tu perfil de DevPost");
    errors.linkedinUrl = profileError("linkedin", d.linkedinUrl);
    if (d.portfolioUrl.trim() && !isHttpsUrl(d.portfolioUrl.trim())) {
      errors.portfolioUrl = "Usa una URL completa que empiece con https://";
    }
    if (!cv) errors.cv = "Sube tu CV en PDF";
    return errors;
  },

  team: (d) => {
    const errors: FieldErrors = {};
    if (!d.teamPreference) errors.teamPreference = "Elige una opción";
    if (d.teamPreference === "has_team") {
      if (!TEAM_CODE_RE.test(d.teamCode)) {
        errors.teamCode = "El código tiene de 6 a 8 letras o números";
      } else if (!d.teamPreview) {
        errors.teamCode = "Busca el equipo para confirmar el código";
      } else if (d.teamPreview.memberCount >= edition.maxTeamSize) {
        errors.teamCode = "Este equipo ya está completo";
      }
    }
    if (d.teamPreference === "looking") {
      const area = d.interestArea.trim();
      if (area.length < 2) errors.interestArea = "Cuéntanos qué área te interesa";
      else if (area.length > 150) errors.interestArea = "Máximo 150 caracteres";
    }
    if (d.teamPreference === "create_team") {
      const name = d.newTeamName.trim();
      if (name.length < 3 || name.length > 80) {
        errors.newTeamName = "El nombre debe tener entre 3 y 80 caracteres";
      }
    }
    return errors;
  },

  review: (d) => {
    const errors: FieldErrors = {};
    if (!d.acceptPrivacy) errors.acceptPrivacy = "Necesitamos tu consentimiento para continuar";
    if (!d.acceptRules) errors.acceptRules = "Debes aceptar el reglamento para participar";
    return errors;
  },
};

// Quita las llaves sin mensaje para poder usar Object.keys(errors).length
export function validateStep(
  step: StepId,
  draft: RegistrationDraft,
  cv: File | null,
): FieldErrors {
  const errors = validators[step](draft, cv);
  return Object.fromEntries(
    Object.entries(errors).filter(([, message]) => message),
  ) as FieldErrors;
}

// Primer paso con errores; sirve para regresar ahi antes de enviar
export const firstInvalidStep = (draft: RegistrationDraft, cv: File | null) =>
  STEPS.findIndex(
    (step) => Object.keys(validateStep(step.id, draft, cv)).length > 0,
  );

// Convierte el borrador ya validado al payload con columnas de la DB.
// Aplica las reglas de consistencia de los CHECK de registrations.
export function toPayload(
  d: RegistrationDraft,
  cvPath: string,
): RegistrationPayload {
  const hasExperience = d.hasHackathonExperience === true;
  const isOtherSchool = d.schoolId === OTHER_SCHOOL;

  let team: TeamAction | null = null;
  if (d.teamPreference === "has_team") {
    team = { action: "join", code: d.teamCode };
  } else if (d.teamPreference === "create_team") {
    team = {
      action: "create",
      name: d.newTeamName.trim(),
      visibility: d.newTeamVisibility,
    };
  }

  return {
    user: {
      name: d.firstName.trim(),
      last_name: d.lastName.trim(),
      email: d.email.trim().toLowerCase(),
      gender: d.gender as Gender,
      phone: `+52${d.phone}`,
      birth_date: d.birthDate,
      github_url: canonicalProfile("github", d.githubUrl),
      devpost_url: canonicalProfile("devpost", d.devpostUrl),
      cv_url: cvPath,
      linkedin_url: d.linkedinUrl.trim() ? canonicalProfile("linkedin", d.linkedinUrl) : null,
      portfolio_url: d.portfolioUrl.trim() || null,
    },
    academic_information: {
      academic_level: d.academicLevel as AcademicLevel,
      expected_graduation_date: `${d.graduationYear}-${d.graduationMonth}-01`,
      school_id: isOtherSchool ? null : d.schoolId,
      school_other: isOtherSchool ? d.schoolOther.trim() : null,
      program_id: d.programNotListed ? null : d.programId,
      program_other: d.programNotListed ? d.programOther.trim() : null,
    },
    registration: {
      has_hackathon_experience: hasExperience,
      hackathon_count: hasExperience ? d.hackathonCount : 0,
      has_won_hackathon: hasExperience && d.hasWonHackathon === true,
      has_programming_experience: d.hasProgrammingExperience === true,
      has_data_science_experience: d.hasDataScienceExperience === true,
      has_system_design_experience: d.hasSystemDesignExperience === true,
      team_preference: d.teamPreference as TeamPreference,
      interest_area: d.teamPreference === "looking" ? d.interestArea.trim() : null,
    },
    team,
  };
}
