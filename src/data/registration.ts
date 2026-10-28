import type {
  AcademicLevel,
  AcademicProgram,
  Gender,
  School,
} from "../types/registration";

// PLACEHOLDER: catalogos de prueba para el formulario de inscripcion.
// Fuente futura: public.schools y public.academic_programs (filtrando
// is_active = true). Los ids reales seran UUID; al conectarlo, cargar estos
// catalogos con un select en src/services/registration.ts.

export const schools: School[] = [
  {
    id: "placeholder-school-tec",
    name: "Tecnológico de Monterrey",
    shortName: "TEC",
  },
  {
    id: "placeholder-school-uanl",
    name: "Universidad Autónoma de Nuevo León",
    shortName: "UANL",
  },
];

export const academicPrograms: AcademicProgram[] = [
  { id: "placeholder-ug-ico", code: "ICO", name: "Ingeniería en Computación", level: "undergraduate" },
  { id: "placeholder-ug-ida", code: "IDA", name: "Ingeniería en Ciencia de Datos", level: "undergraduate" },
  { id: "placeholder-ug-lma", code: "LMA", name: "Licenciatura en Matemáticas", level: "undergraduate" },
  { id: "placeholder-ug-lfi", code: "LFI", name: "Licenciatura en Física", level: "undergraduate" },
  { id: "placeholder-ug-iin", code: "IIN", name: "Ingeniería Industrial", level: "undergraduate" },
  { id: "placeholder-ug-imt", code: "IMT", name: "Ingeniería Mecatrónica", level: "undergraduate" },
  { id: "placeholder-ug-arq", code: "ARQ", name: "Arquitectura", level: "undergraduate" },
  { id: "placeholder-ug-soc", code: "SOC", name: "Ciencias Sociales", level: "undergraduate" },
  { id: "placeholder-ug-eco", code: "ECO", name: "Economía", level: "undergraduate" },
  { id: "placeholder-ug-neg", code: "NEG", name: "Negocios", level: "undergraduate" },
  { id: "placeholder-ug-bio", code: "BIO", name: "Biociencias", level: "undergraduate" },
  { id: "placeholder-ug-med", code: "MED", name: "Medicina", level: "undergraduate" },
  { id: "placeholder-pg-mcd", code: "MCD", name: "Maestría en Ciencia de Datos", level: "postgraduate" },
  { id: "placeholder-pg-mcc", code: "MCC", name: "Maestría en Ciencias Computacionales", level: "postgraduate" },
  { id: "placeholder-pg-mia", code: "MIA", name: "Maestría en Inteligencia Artificial", level: "postgraduate" },
  { id: "placeholder-pg-mba", code: "MBA", name: "Maestría en Administración (MBA)", level: "postgraduate" },
  { id: "placeholder-pg-dcc", code: "DCC", name: "Doctorado en Ciencias Computacionales", level: "postgraduate" },
];

export const genderOptions: { value: Gender; label: string }[] = [
  { value: "female", label: "Mujer" },
  { value: "male", label: "Hombre" },
  { value: "non_binary", label: "No binario" },
  { value: "other", label: "Otro" },
  { value: "prefer_not_to_say", label: "Prefiero no decir" },
];

export const academicLevelOptions: { value: AcademicLevel; label: string }[] = [
  { value: "freshman", label: "Primer año" },
  { value: "sophomore", label: "Segundo año" },
  { value: "junior", label: "Tercer año" },
  { value: "senior", label: "Cuarto año o más" },
  { value: "graduate", label: "Recién egresado(a)" },
  { value: "masters", label: "Maestría" },
  { value: "doctorate", label: "Doctorado" },
  { value: "other", label: "Otro" },
];

// Areas sugeridas para "Sigo buscando equipo"; la persona puede escribir otra
export const interestAreaSuggestions = [
  "Machine Learning",
  "Análisis de datos",
  "Visualización",
  "Ingeniería de datos",
  "Desarrollo de software",
  "Negocio y estrategia",
  "Diseño y presentación",
];
