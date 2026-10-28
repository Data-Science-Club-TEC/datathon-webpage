import { useId } from "react";

// Progreso como perfil de elevacion: cada paso es un punto de la subida y el
// ultimo es la cumbre. Complementa la cordillera del encabezado (Ridges): alla
// estan las montañas del logo, aqui la ruta como grafica de linea.

const WIDTH = 320;
const HEIGHT = 112;
const PAD_X = 14;
const TOP = 26;
const BASE = 98;

// Altura relativa de la ruta (0 = base, 1 = cumbre): sube con descansos
const PROFILE = [0.06, 0.3, 0.22, 0.52, 0.44, 0.74, 1];

function heightAt(t: number) {
  const pos = t * (PROFILE.length - 1);
  const i = Math.floor(pos);
  const next = PROFILE[Math.min(i + 1, PROFILE.length - 1)];
  return PROFILE[i] + (next - PROFILE[i]) * (pos - i);
}

const linePath = (points: { x: number; y: number }[]) =>
  points.map((p, i) => `${i === 0 ? "M" : "L"}${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

type AscentProgressProps = {
  total: number;
  current: number;
  // Todo el recorrido completado (pantalla de exito)
  complete?: boolean;
  className?: string;
};

export default function AscentProgress({
  total,
  current,
  complete = false,
  className = "",
}: AscentProgressProps) {
  const gradientId = useId();
  const reached = complete ? total - 1 : current;

  const points = Array.from({ length: total }, (_, i) => {
    const t = total === 1 ? 1 : i / (total - 1);
    return {
      x: PAD_X + t * (WIDTH - PAD_X * 2),
      y: BASE - heightAt(t) * (BASE - TOP),
    };
  });
  const done = points.slice(0, reached + 1);
  const last = done[done.length - 1];
  const summit = points[points.length - 1];
  const areaPath = `${linePath(done)} L${last.x.toFixed(1)} ${HEIGHT} L${points[0].x.toFixed(1)} ${HEIGHT} Z`;

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      role="img"
      aria-label={
        complete
          ? "Inscripción completa"
          : `Progreso: paso ${current + 1} de ${total}`
      }
      className={`h-auto w-full overflow-visible ${className}`}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" style={{ stopColor: "var(--color-blue)", stopOpacity: 0.32 }} />
          <stop offset="100%" style={{ stopColor: "var(--color-blue)", stopOpacity: 0 }} />
        </linearGradient>
      </defs>

      {/*Ejes*/}
      {[TOP, (TOP + BASE) / 2, BASE].map((y) => (
        <line
          key={y}
          x1="0"
          x2={WIDTH}
          y1={y}
          y2={y}
          strokeDasharray="2 6"
          className="stroke-white/[0.07]"
        />
      ))}

      {/*Ruta pendiente y ruta recorrida*/}
      <path
        d={linePath(points)}
        fill="none"
        strokeWidth="1.5"
        strokeDasharray="3 5"
        className="stroke-white/20"
      />
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath(done)}
        fill="none"
        strokeWidth="2.25"
        strokeLinejoin="round"
        strokeLinecap="round"
        className="stroke-blue drop-shadow-[0_0_6px_rgba(109,161,234,0.7)]"
      />

      {/*Bandera en la cumbre*/}
      <g transform={`translate(${summit.x} ${summit.y})`}>
        <line x1="0" y1="-5" x2="0" y2="-22" strokeWidth="1.5" className="stroke-white/50" />
        <path
          d="M0 -22 L11 -18 L0 -14 Z"
          className={complete ? "fill-lavender" : "fill-white/30"}
        />
      </g>

      {points.map((p, i) => {
        const isDone = complete || i < reached;
        const isCurrent = !complete && i === reached;
        return (
          <g key={i}>
            {isCurrent && (
              <circle
                cx={p.x}
                cy={p.y}
                r="9"
                className="fill-lavender/25 [transform-box:fill-box] [transform-origin:center] motion-safe:animate-ping"
              />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={isCurrent ? 4.5 : 3.5}
              strokeWidth="1.25"
              className={
                isCurrent
                  ? "fill-lavender"
                  : isDone
                    ? "fill-blue"
                    : "fill-navy-dark stroke-white/30"
              }
            />
          </g>
        );
      })}
    </svg>
  );
}
