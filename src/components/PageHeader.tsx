import type { ReactNode } from "react";
import Orb from "./Orb.tsx";

type PageHeaderProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  graphic?: "orb" | "sphere" | "both";
  spark?: boolean;
  children?: ReactNode;
};

const rise = (ms: number) => ({ animationDelay: `${ms}ms` });

// Encabezado tipo poster de las paginas internas; deja espacio arriba para el header fijo.
// El grafico solo sale por el borde derecho de la pantalla, nunca por arriba/abajo de la seccion.
export default function PageHeader({
  eyebrow,
  title,
  description,
  graphic = "orb",
  spark,
  children,
}: PageHeaderProps) {
  return (
    <section className="relative overflow-hidden bg-navy-dark px-6 md:px-10 lg:px-20 pt-28 md:pt-36 pb-16 md:pb-24 lg:min-h-[680px] lg:flex lg:items-center">
      <div className="absolute top-20 -right-24 w-72 sm:w-96 aspect-square lg:top-[calc(50%+2.5rem)] lg:-translate-y-1/2 lg:-right-32 lg:w-[520px]">
        <div className="parallax size-full">
          <Orb variant={graphic} spark={spark} className="size-full" />
        </div>
      </div>

      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {eyebrow && (
          <p className="eyebrow animate-rise" style={rise(0)}>
            {eyebrow}
          </p>
        )}
        <h1
          className="poster-title mt-4 max-w-4xl text-5xl sm:text-6xl md:text-8xl animate-rise"
          style={rise(100)}
        >
          {title}
        </h1>
        {description && (
          <p
            className="mt-5 max-w-xl text-xl md:text-2xl font-light italic text-white/85 animate-rise"
            style={rise(200)}
          >
            {description}
          </p>
        )}
        {children && (
          <div className="mt-10 animate-rise" style={rise(300)}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
