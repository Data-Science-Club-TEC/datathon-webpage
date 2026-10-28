import type { Faq, FaqCategory } from "../types/content";

// PLACEHOLDER: preguntas y respuestas provisionales, pendientes de validar
// con el comite organizador.
// Fuente futura: tabla public.faqs (ordenada por category, sort_order).
// Al conectarlo, crear src/services/faq.ts con getFaqs() y reemplazar este
// import en src/pages/Faq.tsx.

export const faqCategoryLabels: Record<FaqCategory, string> = {
  general: "General",
  registration: "Inscripción",
  teams: "Equipos",
  event: "Durante el evento",
};

export const faqs: Faq[] = [
  {
    id: "placeholder-faq-1",
    category: "general",
    question: "¿Qué es un datathon?",
    answer:
      "Es una competencia en la que equipos resuelven retos usando datos reales en un tiempo limitado. Se parece a un hackathon, pero el foco está en el análisis, el modelado y la comunicación de resultados.",
    sortOrder: 1,
  },
  {
    id: "placeholder-faq-2",
    category: "general",
    question: "¿Quién puede participar?",
    answer:
      "Estudiantes de licenciatura y posgrado. Los requisitos exactos de elegibilidad están por confirmar.",
    sortOrder: 2,
  },
  {
    id: "placeholder-faq-3",
    category: "general",
    question: "¿Necesito experiencia previa en ciencia de datos?",
    answer:
      "No es obligatoria. Habrá talleres y mentores durante el evento para apoyar a quienes van empezando.",
    sortOrder: 3,
  },
  {
    id: "placeholder-faq-4",
    category: "registration",
    question: "¿Cuánto cuesta participar?",
    answer: "Por confirmar.",
    sortOrder: 1,
  },
  {
    id: "placeholder-faq-5",
    category: "registration",
    question: "¿Cómo me inscribo?",
    answer:
      "Desde la sección de Inscripción de esta página. Necesitarás tus datos académicos, tus perfiles (GitHub, DevPost) y tu CV en PDF.",
    sortOrder: 2,
  },
  {
    id: "placeholder-faq-6",
    category: "registration",
    question: "¿Cuál es la fecha límite de inscripción?",
    answer: "Por confirmar.",
    sortOrder: 3,
  },
  {
    id: "placeholder-faq-7",
    category: "teams",
    question: "¿De cuántas personas es cada equipo?",
    answer: "Los equipos son de 2 a 4 integrantes, incluyendo al capitán.",
    sortOrder: 1,
  },
  {
    id: "placeholder-faq-8",
    category: "teams",
    question: "¿Puedo inscribirme sin equipo?",
    answer:
      "Sí. Al inscribirte puedes indicar que sigues buscando equipo y tu área de interés, o crear un equipo nuevo e invitar a otras personas con su código.",
    sortOrder: 2,
  },
  {
    id: "placeholder-faq-9",
    category: "teams",
    question: "¿Cuál es la diferencia entre un equipo público y uno privado?",
    answer:
      "A un equipo privado solo se entra con su código único. Los equipos públicos aparecen para que otras personas sin equipo puedan unirse.",
    sortOrder: 3,
  },
  {
    id: "placeholder-faq-10",
    category: "event",
    question: "¿Qué debo llevar?",
    answer:
      "Tu laptop, cargador e identificación. La lista completa está por confirmar.",
    sortOrder: 1,
  },
  {
    id: "placeholder-faq-11",
    category: "event",
    question: "¿Habrá comida?",
    answer: "Sí, los horarios de comida aparecen en la Agenda.",
    sortOrder: 2,
  },
  {
    id: "placeholder-faq-12",
    category: "event",
    question: "¿Qué se entrega al final?",
    answer:
      "Cada equipo entrega su solución antes del cierre de entregas. El formato del entregable está por confirmar.",
    sortOrder: 3,
  },
];
