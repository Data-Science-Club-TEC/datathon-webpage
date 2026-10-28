import type { AutoCamelCase } from "./utils";

// Tipos del contenido de las paginas Datathon, Agenda y FAQ.
// Cada *Row describe la forma prevista de la fila en Supabase (snake_case);
// el tipo sin sufijo es lo que consumen los componentes (camelCase).
// Hoy los datos viven en src/data/*; cuando existan las tablas, un servicio en
// src/services/ hara el select y convertira Row -> tipo de frontend.

// Tabla prevista: public.editions (una fila por edicion del datathon)
export interface EditionRow {
  id: string;
  name: string;
  tagline: string;
  description: string;
  starts_at: string; // ISO 8601 con offset (timestamptz)
  ends_at: string;
  venue_name: string;
  venue_address: string;
  venue_map_url: string | null;
  modality: string;
  min_team_size: number; // Debe coincidir con la regla de public.team_members
  max_team_size: number;
}

export type Edition = AutoCamelCase<EditionRow>;

// Tabla prevista: public.challenges (FK edition_id)
export interface ChallengeRow {
  id: string;
  title: string;
  description: string;
  sponsor_name: string | null;
  tags: string[];
  sort_order: number;
}

export type Challenge = AutoCamelCase<ChallengeRow>;

// Tabla prevista: public.prizes (FK edition_id)
export interface PrizeRow {
  id: string;
  place: number;
  title: string;
  amount_mxn: number | null; // null = monto por confirmar
  description: string;
}

export type Prize = AutoCamelCase<PrizeRow>;

export type ScheduleEventKind =
  | "ceremony"
  | "workshop"
  | "hacking"
  | "meal"
  | "deadline"
  | "activity";

// Tabla prevista: public.schedule_events (FK edition_id)
export interface ScheduleEventRow {
  id: string;
  title: string;
  description: string | null;
  location: string | null;
  kind: ScheduleEventKind;
  starts_at: string; // ISO 8601 con offset (timestamptz)
  ends_at: string | null;
}

export type ScheduleEvent = AutoCamelCase<ScheduleEventRow>;

export type FaqCategory = "general" | "registration" | "teams" | "event";

// Tabla prevista: public.faqs
export interface FaqRow {
  id: string;
  category: FaqCategory;
  question: string;
  answer: string;
  sort_order: number;
}

export type Faq = AutoCamelCase<FaqRow>;
