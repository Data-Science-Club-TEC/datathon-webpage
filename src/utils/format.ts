// Formato de fechas, horas y montos. Todo se muestra en hora de Monterrey,
// sin importar la zona horaria del navegador del visitante.
const LOCALE = "es-MX";
const TIME_ZONE = "America/Monterrey";

const dateFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  weekday: "long",
  day: "numeric",
  month: "long",
  year: "numeric",
});

const shortDateFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  weekday: "short",
  day: "numeric",
  month: "short",
});

const timeFormatter = new Intl.DateTimeFormat(LOCALE, {
  timeZone: TIME_ZONE,
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
});

// en-CA formatea como YYYY-MM-DD, util como llave para agrupar por dia
const dayKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

const currencyFormatter = new Intl.NumberFormat(LOCALE, {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const formatDate = (iso: string) =>
  capitalize(dateFormatter.format(new Date(iso)));

export const formatShortDate = (iso: string) =>
  capitalize(shortDateFormatter.format(new Date(iso)));

export const formatTime = (iso: string) => timeFormatter.format(new Date(iso));

export const dayKey = (iso: string) => dayKeyFormatter.format(new Date(iso));

export const formatCurrency = (amount: number | null) =>
  amount === null ? "Por confirmar" : currencyFormatter.format(amount);

const fileSizeFormatter = new Intl.NumberFormat(LOCALE, {
  maximumFractionDigits: 1,
});

export const formatFileSize = (bytes: number) =>
  bytes < 1024 * 1024
    ? `${fileSizeFormatter.format(bytes / 1024)} KB`
    : `${fileSizeFormatter.format(bytes / (1024 * 1024))} MB`;

export const hoursBetween = (startIso: string, endIso: string) =>
  Math.round(
    (new Date(endIso).getTime() - new Date(startIso).getTime()) / 3_600_000,
  );
