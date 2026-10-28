// Cordillera del encabezado: las tres capas del logo (lavanda, azul, navy)
// dibujadas como una grafica de areas, con puntos de datos en la cresta del
// fondo. Las cimas quedan a la derecha para no competir con el titulo.

type Point = [number, number];

const BACK: Point[] = [
  [0, 196], [110, 182], [220, 190], [330, 160], [430, 172], [540, 128],
  [640, 146], [740, 96], [840, 118], [950, 58], [1040, 84], [1130, 30],
  [1230, 72], [1330, 52], [1440, 86],
];
const MIDDLE: Point[] = [
  [0, 212], [150, 200], [290, 210], [420, 186], [560, 202], [690, 170],
  [820, 190], [960, 140], [1080, 166], [1200, 122], [1320, 150], [1440, 132],
];
const FRONT: Point[] = [
  [0, 226], [200, 214], [380, 224], [560, 208], [760, 222], [940, 198],
  [1120, 214], [1300, 194], [1440, 206],
];

const HEIGHT = 240;
const line = (points: Point[]) => points.map(([x, y], i) => `${i ? "L" : "M"}${x} ${y}`).join(" ");
const area = (points: Point[]) => `${line(points)} L1440 ${HEIGHT} L0 ${HEIGHT} Z`;

// La cima mas alta del fondo se marca como "pico" de la serie
const PEAK = BACK.reduce((best, p) => (p[1] < best[1] ? p : best));

export default function Ridges({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox={`0 0 1440 ${HEIGHT}`}
      preserveAspectRatio="xMidYMax slice"
      aria-hidden="true"
      className={className}
    >
      {/*Ejes de la grafica*/}
      {[60, 120, 180].map((y) => (
        <line key={y} x1="0" x2="1440" y1={y} y2={y} strokeDasharray="2 10" className="stroke-white/[0.05]" />
      ))}

      <path d={area(BACK)} className="fill-lavender/[0.07]" />
      <path d={line(BACK)} fill="none" strokeWidth="1.25" className="stroke-lavender/35" />
      {BACK.map(([x, y]) => (
        <circle key={x} cx={x} cy={y} r="2.5" className="fill-lavender/60" />
      ))}
      <circle cx={PEAK[0]} cy={PEAK[1]} r="9" className="fill-lavender/15" />
      <circle cx={PEAK[0]} cy={PEAK[1]} r="4" className="fill-lavender" />

      <path d={area(MIDDLE)} className="fill-blue/[0.12]" />
      <path d={line(MIDDLE)} fill="none" strokeWidth="1.25" className="stroke-blue/45" />

      {/*Capa del frente del color del fondo: funciona como "suelo" del contenido*/}
      <path d={area(FRONT)} className="fill-navy-dark" />
      <path d={line(FRONT)} fill="none" strokeWidth="1" className="stroke-blue/20" />
    </svg>
  );
}
