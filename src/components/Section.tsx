import type { ReactNode } from "react";

// Fondos alternados como los posts: negro, cobalto y azul electrico
const tones = {
  dark: "bg-navy-dark",
  cobalt: "bg-cobalt",
  electric: "bg-electric",
};

type SectionProps = {
  id?: string;
  tone?: keyof typeof tones;
  className?: string;
  children: ReactNode;
};

// scroll-mt deja espacio para el header fijo al navegar a /pagina#seccion
export function Section({
  id,
  tone = "dark",
  className = "",
  children,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`${tones[tone]} relative overflow-hidden scroll-mt-16 px-6 md:px-10 lg:px-20 py-16 md:py-24 ${className}`}
    >
      <div className="relative max-w-6xl mx-auto">{children}</div>
    </section>
  );
}

type SectionHeadingProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "center" | "left";
};

export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-3xl mb-10 md:mb-14 ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="poster-title text-4xl md:text-6xl">{title}</h2>
      {description && (
        <p className="mt-4 text-lg md:text-xl font-light italic text-white/80">
          {description}
        </p>
      )}
    </div>
  );
}
