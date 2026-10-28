import type { ReactNode } from "react";

type SectionProps = {
  id?: string;
  className?: string;
  children: ReactNode;
};

// scroll-mt deja espacio para el header fijo al navegar a /pagina#seccion
export function Section({ id, className = "", children }: SectionProps) {
  return (
    <section
      id={id}
      className={`section-dark scroll-mt-28 px-6 md:px-20 py-16 md:py-20 ${className}`}
    >
      <div className="max-w-6xl mx-auto">{children}</div>
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
  align = "center",
}: SectionHeadingProps) {
  return (
    <div
      className={`max-w-2xl mb-12 ${align === "center" ? "mx-auto text-center" : ""}`}
    >
      {eyebrow && (
        <p className="font-poppins font-semibold text-sm uppercase tracking-[0.2em] text-blue mb-3">
          {eyebrow}
        </p>
      )}
      <h2 className="font-poppins font-bold text-3xl md:text-[42px] text-white text-glow leading-tight">
        {title}
      </h2>
      {description && (
        <p className="font-poppins mt-4 text-white/75 text-[16px] md:text-[18px]">
          {description}
        </p>
      )}
    </div>
  );
}
