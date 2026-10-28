import type { ScheduleEvent } from "../types/content";

// PLACEHOLDER: horarios y actividades provisionales.
// Fuente futura: tabla public.schedule_events (ordenada por starts_at).
// Al conectarlo, crear src/services/schedule.ts con getScheduleEvents() y
// reemplazar este import en src/pages/Agenda.tsx. Las horas llevan offset
// para que la agrupacion por dia no dependa de la zona del navegador.

export const scheduleEvents: ScheduleEvent[] = [
  {
    id: "placeholder-event-1",
    title: "Registro y check-in",
    description: "Recoge tu gafete y kit de bienvenida.",
    location: "Lobby",
    kind: "activity",
    startsAt: "2027-03-10T08:00:00-06:00",
    endsAt: "2027-03-10T09:00:00-06:00",
  },
  {
    id: "placeholder-event-2",
    title: "Ceremonia de inauguración",
    description: "Bienvenida, presentación de sponsors y revelación de retos.",
    location: "Auditorio principal",
    kind: "ceremony",
    startsAt: "2027-03-10T09:00:00-06:00",
    endsAt: "2027-03-10T10:00:00-06:00",
  },
  {
    id: "placeholder-event-3",
    title: "Inicio del hacking",
    description: "Los equipos comienzan a trabajar en su reto.",
    location: null,
    kind: "hacking",
    startsAt: "2027-03-10T10:00:00-06:00",
    endsAt: null,
  },
  {
    id: "placeholder-event-4",
    title: "Taller por confirmar",
    description: "Taller técnico impartido por un sponsor.",
    location: "Sala por confirmar",
    kind: "workshop",
    startsAt: "2027-03-10T12:00:00-06:00",
    endsAt: "2027-03-10T13:00:00-06:00",
  },
  {
    id: "placeholder-event-5",
    title: "Comida",
    description: null,
    location: "Comedor",
    kind: "meal",
    startsAt: "2027-03-10T14:00:00-06:00",
    endsAt: "2027-03-10T15:00:00-06:00",
  },
  {
    id: "placeholder-event-6",
    title: "Mentorías",
    description: "Sesiones con mentores de la industria para revisar avances.",
    location: "Por confirmar",
    kind: "activity",
    startsAt: "2027-03-10T17:00:00-06:00",
    endsAt: "2027-03-10T19:00:00-06:00",
  },
  {
    id: "placeholder-event-7",
    title: "Cena",
    description: null,
    location: "Comedor",
    kind: "meal",
    startsAt: "2027-03-10T20:00:00-06:00",
    endsAt: "2027-03-10T21:00:00-06:00",
  },
  {
    id: "placeholder-event-8",
    title: "Desayuno",
    description: null,
    location: "Comedor",
    kind: "meal",
    startsAt: "2027-03-11T08:00:00-06:00",
    endsAt: "2027-03-11T09:00:00-06:00",
  },
  {
    id: "placeholder-event-9",
    title: "Cierre de entregas",
    description: "Fecha límite para subir el entregable de tu equipo.",
    location: null,
    kind: "deadline",
    startsAt: "2027-03-11T12:00:00-06:00",
    endsAt: null,
  },
  {
    id: "placeholder-event-10",
    title: "Presentaciones ante el jurado",
    description: "Cada equipo finalista presenta su solución.",
    location: "Auditorio principal",
    kind: "activity",
    startsAt: "2027-03-11T15:00:00-06:00",
    endsAt: "2027-03-11T19:00:00-06:00",
  },
  {
    id: "placeholder-event-11",
    title: "Premiación y clausura",
    description: null,
    location: "Auditorio principal",
    kind: "ceremony",
    startsAt: "2027-03-11T19:30:00-06:00",
    endsAt: "2027-03-11T21:00:00-06:00",
  },
];
