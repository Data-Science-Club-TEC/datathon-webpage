import type { ReactNode } from "react";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
};

// Encabezado de las paginas internas; deja espacio arriba para el header fijo
export default function PageHeader({
  eyebrow,
  title,
  description,
  children,
}: PageHeaderProps) {
  return (
    <section className="section-dark relative overflow-hidden px-6 md:px-20 pt-36 md:pt-44 pb-16 md:pb-20 text-center">
      {/*Glow*/}
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(700px circle at 50% 0%, rgba(204, 192, 252, 0.55), transparent 65%)",
        }}
      />

      <div className="relative z-10 max-w-3xl mx-auto">
        {eyebrow && (
          <p className="font-poppins font-semibold text-sm md:text-base uppercase tracking-[0.2em] text-blue">
            {eyebrow}
          </p>
        )}
        <h1 className="mt-3 font-poppins font-bold text-4xl md:text-[56px] text-white text-glow leading-tight">
          {title}
        </h1>
        {description && (
          <p className="font-poppins mt-5 text-white/70 text-[16px] md:text-[18px]">
            {description}
          </p>
        )}
        {children && <div className="mt-8">{children}</div>}
      </div>
    </section>
  );
}
