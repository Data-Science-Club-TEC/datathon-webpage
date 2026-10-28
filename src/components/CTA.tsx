import { useEffect, useState } from "react";
import ButtonLink from "./ButtonLink.tsx";
import Orb from "./Orb.tsx";
import { edition } from "../data/datathon.ts";

// D-Day: misma fecha que la pagina /datathon
const TARGET_DATE = new Date(edition.startsAt);

function getTimeLeft() {
  const diff = Math.max(TARGET_DATE.getTime() - Date.now(), 0);
  return [
    { label: "Días", value: Math.floor(diff / 86_400_000) },
    { label: "Horas", value: Math.floor(diff / 3_600_000) % 24 },
    { label: "Min", value: Math.floor(diff / 60_000) % 60 },
    { label: "Seg", value: Math.floor(diff / 1000) % 60 },
  ];
}

export default function CTA() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="relative overflow-hidden bg-navy-dark px-6 md:px-10 lg:px-20 py-20 md:py-32">
      <Orb className="absolute aspect-square w-[120vw] -left-[60vw] -bottom-[40vw] md:w-[640px] md:-left-40 md:-bottom-60" />

      <div className="relative z-10 max-w-6xl mx-auto grid gap-12 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="eyebrow">{edition.name}</p>
          <h2 className="poster-title mt-4 text-5xl md:text-7xl">
            ¿Quieres saber más?
          </h2>
          <p className="mt-4 text-xl font-light italic text-white/85">
            Retos, premios, agenda y todo lo que necesitas para formar parte
            del próximo Datathon.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <ButtonLink to="/datathon">Ver detalles</ButtonLink>
            <ButtonLink to="/agenda" variant="secondary">
              Ver agenda
            </ButtonLink>
          </div>
        </div>

        <div role="timer" aria-label="Tiempo restante para el Datathon">
          <p className="eyebrow mb-4">Faltan</p>
          <div className="grid grid-cols-4 border-y border-white/15 divide-x divide-white/15">
            {timeLeft.map(({ label, value }) => (
              <div key={label} className="py-5 text-center">
                <span className="block poster-title text-4xl md:text-6xl tabular-nums">
                  {String(value).padStart(2, "0")}
                </span>
                <span className="mt-2 block font-mono text-[11px] uppercase tracking-widest text-white/60">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
