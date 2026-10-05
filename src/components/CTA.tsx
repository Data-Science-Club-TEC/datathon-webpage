import { useEffect, useRef, useState, type MouseEvent } from "react";

{
  /*D-Day*/
}
const TARGET_DATE = new Date("2027-03-10T09:00:00");

function getTimeLeft() {
  const diff = Math.max(TARGET_DATE.getTime() - Date.now(), 0);
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

const pad = (n: number) => n.toString().padStart(2, "0");

export default function CTA() {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft);
  const [meshPos, setMeshPos] = useState({ x: 50, y: 40 });
  const [btnOffset, setBtnOffset] = useState({ x: 0, y: 0 });

  const sectionRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const id = setInterval(() => setTimeLeft(getTimeLeft()), 1000);
    return () => clearInterval(id);
  }, []);

  {
    /*Background mesh*/
  }
  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = section.getBoundingClientRect();
    setMeshPos({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });

    const btn = buttonRef.current;
    if (!btn) return;

    const btnRect = btn.getBoundingClientRect();
    const btnCenterX = btnRect.left + btnRect.width / 2;
    const btnCenterY = btnRect.top + btnRect.height / 2;
    const dx = e.clientX - btnCenterX;
    const dy = e.clientY - btnCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const radius = 200;

    if (distance < radius) {
      const strength = 1 - distance / radius;
      setBtnOffset({ x: dx * strength * 0.35, y: dy * strength * 0.35 });
    } else {
      setBtnOffset({ x: 0, y: 0 });
    }
  };

  const handleMouseLeave = () => setBtnOffset({ x: 0, y: 0 });

  const countdownItems = [
    { label: "Días", value: timeLeft.days },
    { label: "Horas", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Seg", value: timeLeft.seconds },
  ];

  return (
    <section
      ref={sectionRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative overflow-hidden animate-pulse-bg px-6 py-24 md:py-32 text-center"
    >
      {/*Follow mouse*/}
      <div
        className="pointer-events-none absolute inset-0 opacity-60 transition-[background] duration-300 ease-out"
        style={{
          background: `radial-gradient(600px circle at ${meshPos.x}% ${meshPos.y}%, rgba(204, 192, 252, 1), transparent 60%)`,
        }}
      />

      <div className="relative z-10 max-w-2xl mx-auto">
        <h2 className="font-poppins font-bold text-3xl md:text-[48px] text-white text-glow leading-tight">
          ¿Quieres saber más?
        </h2>
        <p className="font-poppins mt-4 text-white/70 text-[16px] md:text-[18px]">
          Conoce retos, premios, agenda y todo lo que necesitas saber para
          formar parte del próximo Datathon
        </p>

        {/*Countdown*/}
        <div className="mt-10 flex justify-center gap-3 md:gap-5">
          {countdownItems.map(({ label, value }) => (
            <div
              key={label}
              className="flex flex-col items-center justify-center bg-white/5 border border-white/10 rounded-xl w-16 md:w-20 py-3"
            >
              <span className="font-poppins font-bold text-2xl md:text-3xl text-white tabular-nums">
                {pad(value)}
              </span>
              <span className="text-[11px] uppercase tracking-wide text-white/50 mt-1">
                {label}
              </span>
            </div>
          ))}
        </div>

        <a
          ref={buttonRef}
          href="#"
          style={{ transform: `translate(${btnOffset.x}px, ${btnOffset.y}px)` }}
          className="btn-glow mt-12 inline-flex items-center justify-center bg-blue rounded-full px-12 py-5 font-poppins font-semibold text-xl text-navy transition-transform duration-200 ease-out hover:scale-105"
        >
          Ver detalles del Datathon
        </a>
      </div>
    </section>
  );
}
