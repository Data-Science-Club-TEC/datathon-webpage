// Clases compartidas por los controles del formulario de inscripcion

export const labelClass =
  "flex items-baseline justify-between gap-3 text-sm font-semibold text-white";

export const inputClass =
  "h-12 w-full rounded-none border-2 border-white/20 bg-navy-dark px-4 text-base text-white md:text-[15px] placeholder:text-white/30 outline-none transition hover:border-white/40 focus:border-cyan focus:shadow-[4px_4px_0_0_var(--color-cobalt)] aria-invalid:border-danger disabled:cursor-not-allowed disabled:opacity-60 [color-scheme:dark]";

const buttonBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-none font-display font-bold uppercase tracking-wide text-sm transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-50";

export const buttonStyles = {
  primary: `${buttonBase} border-2 border-white bg-white px-7 text-navy-dark hover:border-lavender hover:bg-lavender`,
  secondary: `${buttonBase} border-2 border-white/40 px-6 text-white hover:bg-white/10`,
  ghost: `${buttonBase} px-4 text-white/65 hover:text-white`,
};

export const messageClass = (isError: boolean) =>
  `text-[13px] ${isError ? "text-danger" : "text-white/45"}`;
