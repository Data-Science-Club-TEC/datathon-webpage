import type { Challenge, Edition, Prize } from "../types/content";

// PLACEHOLDER: todo el contenido de este archivo es provisional.
// Fuente futura: tablas public.editions, public.challenges y public.prizes.
// Al conectarlo, crear src/services/datathon.ts con getEdition(),
// getChallenges() y getPrizes(), y reemplazar estos imports en las paginas.

export const registrationHref = "/inscripcion";

// Monterrey usa UTC-6 todo el año (sin horario de verano desde 2022)
export const edition: Edition = {
  id: "placeholder-edition",
  name: "Datathon 2027",
  tagline: "Datos reales, retos reales, 36 horas para resolverlos.",
  description:
    "El Datathon es una competencia de ciencia de datos organizada por el Data Science Club en la que equipos de estudiantes resuelven retos propuestos por empresas usando datos reales. Durante el evento tendrás acceso a mentores, talleres y la oportunidad de presentar tu solución ante un jurado de la industria.",
  startsAt: "2027-03-10T09:00:00-06:00",
  endsAt: "2027-03-11T21:00:00-06:00",
  venueName: "Sede por confirmar",
  venueAddress: "Monterrey, Nuevo León",
  venueMapUrl: null,
  modality: "Presencial",
  minTeamSize: 2,
  maxTeamSize: 4,
};

export const challenges: Challenge[] = [
  {
    id: "placeholder-challenge-1",
    title: "Reto 1: Por confirmar",
    description:
      "Descripción del reto propuesto por el sponsor. Aquí irá el problema a resolver, el tipo de datos disponibles y los criterios de evaluación.",
    sponsorName: null,
    tags: ["Machine Learning", "Finanzas"],
    sortOrder: 1,
  },
  {
    id: "placeholder-challenge-2",
    title: "Reto 2: Por confirmar",
    description:
      "Descripción del reto propuesto por el sponsor. Aquí irá el problema a resolver, el tipo de datos disponibles y los criterios de evaluación.",
    sponsorName: null,
    tags: ["Visualización", "Retail"],
    sortOrder: 2,
  },
  {
    id: "placeholder-challenge-3",
    title: "Reto 3: Por confirmar",
    description:
      "Descripción del reto propuesto por el sponsor. Aquí irá el problema a resolver, el tipo de datos disponibles y los criterios de evaluación.",
    sponsorName: null,
    tags: ["Optimización", "Logística"],
    sortOrder: 3,
  },
];

export const prizes: Prize[] = [
  {
    id: "placeholder-prize-1",
    place: 1,
    title: "Primer lugar",
    amountMxn: null,
    description: "Premio en efectivo y beneficios de sponsors por confirmar.",
  },
  {
    id: "placeholder-prize-2",
    place: 2,
    title: "Segundo lugar",
    amountMxn: null,
    description: "Premio en efectivo y beneficios de sponsors por confirmar.",
  },
  {
    id: "placeholder-prize-3",
    place: 3,
    title: "Tercer lugar",
    amountMxn: null,
    description: "Premio en efectivo y beneficios de sponsors por confirmar.",
  },
];
