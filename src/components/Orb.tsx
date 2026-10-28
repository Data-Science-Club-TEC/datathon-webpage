// Graficos de los posts de DSC: esfera azul con chispa naranja y/o esfera hueca de alambre.
// Llenan a su padre (posicionado y cuadrado); nunca deben cruzar el borde superior/inferior de su seccion.
type OrbProps = {
  variant?: "orb" | "sphere" | "both";
  spark?: boolean;
  className?: string;
};

const latitudes = [-60, -30, 0, 30, 60].map((deg) => {
  const rad = (deg * Math.PI) / 180;
  return { cy: 100 * Math.sin(rad), rx: 100 * Math.cos(rad) };
});

function WireSphere({ className }: { className: string }) {
  return (
    <svg
      viewBox="-101 -101 202 202"
      fill="none"
      stroke="currentColor"
      strokeWidth="0.5"
      className={`-rotate-12 ${className}`}
    >
      <circle r="100" />
      {latitudes.map(({ cy, rx }) => (
        <ellipse key={cy} cy={cy} rx={rx} ry={rx * 0.2} />
      ))}
      {/*Meridianos desfasados: girando simulan una esfera 3D*/}
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <ellipse
          key={i}
          rx="100"
          ry="100"
          className="animate-meridian"
          style={{ animationDelay: `${-i * 2}s` }}
        />
      ))}
    </svg>
  );
}

export default function Orb({
  variant = "orb",
  spark = true,
  className = "",
}: OrbProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none ${className}`}>
      <div className="relative size-full animate-float">
        {variant !== "orb" && (
          <WireSphere className="absolute inset-0 size-full text-white/30" />
        )}
        {variant !== "sphere" && (
          <div
            className={`absolute ${variant === "both" ? "inset-[18%]" : "inset-0"}`}
          >
            <div className="size-full rounded-full bg-[radial-gradient(circle_at_30%_70%,#0a1580_0%,var(--color-electric)_55%,#4a6bff_100%)]" />
            {/*Chispa naranja orbitando el borde*/}
            {spark && (
              <div className="absolute inset-0 animate-orbit">
                <div className="absolute -top-[6%] left-[60%] w-1/4 aspect-square rounded-full bg-[radial-gradient(circle,var(--color-ember)_0%,rgb(255_106_43/0.35)_40%,transparent_70%)]" />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
