import type { AutoCamelCase } from "./utils";

// Tipos de la inscripcion. Los enums y columnas replican
// server/prisma/schema.prisma (User, AcademicInformation, Registration, Team).

export type Gender =
  | "male"
  | "female"
  | "non_binary"
  | "prefer_not_to_say"
  | "other";

export type AcademicLevel =
  | "freshman"
  | "sophomore"
  | "junior"
  | "senior"
  | "graduate"
  | "masters"
  | "doctorate"
  | "other";

export type ProgramLevel = "undergraduate" | "postgraduate";

export type TeamPreference = "has_team" | "looking" | "create_team" | "skip";

export type TeamVisibility = "public" | "private";

// Catalogo: public.schools
export interface SchoolRow {
  id: string;
  name: string;
  short_name: string | null;
}

export type School = AutoCamelCase<SchoolRow>;

// Catalogo: public.academic_programs (level separa carreras de posgrados)
export interface AcademicProgramRow {
  id: string;
  code: string;
  name: string;
  level: ProgramLevel;
}

export type AcademicProgram = AutoCamelCase<AcademicProgramRow>;

// Lo que envia el formulario, con los nombres de columna de la DB.
// username y auth_user_id no van aqui: el backend genera el username y toma
// auth_user_id de la sesion verificada (auth.uid()).
export interface RegistrationPayload {
  user: {
    name: string;
    last_name: string;
    email: string;
    gender: Gender;
    phone: string;
    birth_date: string; // YYYY-MM-DD
    github_url: string;
    devpost_url: string;
    cv_url: string; // Ruta del objeto en Storage, no una URL publica
    linkedin_url: string | null;
    portfolio_url: string | null;
  };
  academic_information: {
    academic_level: AcademicLevel;
    expected_graduation_date: string; // YYYY-MM-01
    school_id: string | null;
    school_other: string | null;
    program_id: string | null;
    program_other: string | null;
  };
  registration: {
    has_hackathon_experience: boolean;
    hackathon_count: number;
    has_won_hackathon: boolean;
    has_programming_experience: boolean;
    has_data_science_experience: boolean;
    has_system_design_experience: boolean;
    team_preference: TeamPreference;
    interest_area: string | null;
  };
  team: TeamAction | null;
}

export type TeamAction =
  | { action: "join"; code: string }
  | { action: "create"; name: string; visibility: TeamVisibility };

// Vista minima de un equipo al buscarlo por codigo (sin lista de integrantes)
export interface TeamPreview {
  name: string;
  memberCount: number;
}

export interface RegistrationResult {
  teamCode: string | null;
}
