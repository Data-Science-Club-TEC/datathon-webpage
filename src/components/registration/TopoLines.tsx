// Curvas de nivel de fondo: anillos concentricos deformados con senos.
// Deterministico (sin aleatoriedad) para que no cambie entre renders.

const CENTER_X = 620;
const CENTER_Y = 250;
const RINGS = 12;
const SAMPLES = 120;

function contour(k: number) {
  const radius = 46 + k * 40;
  const points = Array.from({ length: SAMPLES }, (_, i) => {
    const a = (i / SAMPLES) * Math.PI * 2;
    const wobble =
      1 +
      0.15 * Math.sin(3 * a + k * 0.55) +
      0.07 * Math.sin(5 * a - k * 0.35) +
      0.04 * Math.cos(2 * a + k);
    const x = CENTER_X + Math.cos(a) * radius * wobble * 1.3;
    const y = CENTER_Y + Math.sin(a) * radius * wobble * 0.85;
    return `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(1)}`;
  });
  return `${points.join(" ")} Z`;
}

const CONTOURS = Array.from({ length: RINGS }, (_, k) => contour(k));

export default function TopoLines({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 1240 700" aria-hidden="true" fill="none" className={className}>
      {CONTOURS.map((d, k) => (
        <path
          key={k}
          d={d}
          // Cada cuarta curva es "maestra", como en los mapas topograficos
          strokeWidth={k % 4 === 0 ? 1.4 : 0.8}
          className={k % 4 === 0 ? "stroke-lavender/[0.14]" : "stroke-lavender/[0.07]"}
        />
      ))}
    </svg>
  );
}
