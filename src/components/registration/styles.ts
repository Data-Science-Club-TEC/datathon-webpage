// Clases compartidas por los controles del formulario de inscripcion

export const labelClass =
  "flex items-baseline justify-between gap-3 text-sm font-medium text-white/85";

export const inputClass =
  "h-12 w-full rounded-lg border border-white/10 bg-navy-dark/70 px-4 text-[15px] text-white placeholder:text-white/30 outline-none transition-colors hover:border-white/20 focus:border-blue focus:ring-2 focus:ring-blue/25 aria-invalid:border-danger/70 disabled:cursor-not-allowed disabled:opacity-60 [color-scheme:dark]";

const buttonBase =
  "inline-flex h-12 items-center justify-center gap-2 rounded-full font-poppins font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

export const buttonStyles = {
  primary: `${buttonBase} btn-glow bg-blue px-7 text-navy hover:brightness-110 disabled:shadow-none disabled:hover:brightness-100`,
  secondary: `${buttonBase} border border-white/20 bg-white/5 px-6 text-white hover:border-white/40 hover:text-[#9fbfed]`,
  ghost: `${buttonBase} px-4 font-medium text-white/65 hover:text-white`,
};

export const messageClass = (isError: boolean) =>
  `text-[13px] ${isError ? "text-danger" : "text-white/45"}`;
