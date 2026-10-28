import { CheckIcon } from "../icons.tsx";
import AscentProgress from "./AscentProgress.tsx";
import { STEPS } from "./draft.ts";

type StepRailProps = {
  current: number;
  maxStep: number;
  onNavigate: (index: number) => void;
  disabled?: boolean;
};

const pad = (n: number) => String(n).padStart(2, "0");

function AscentCaption() {
  return (
    <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-white/35">
      <span>Inicio</span>
      <span>Cumbre</span>
    </div>
  );
}

// Progreso del formulario: perfil de elevacion + lista de pasos en desktop,
// solo el perfil en movil. Solo se puede saltar a pasos ya visitados.
export default function StepRail({
  current,
  maxStep,
  onNavigate,
  disabled = false,
}: StepRailProps) {
  return (
    <>
      {/*Movil*/}
      <div className="lg:hidden">
        <div className="flex items-baseline justify-between gap-4">
          <span className="font-poppins text-sm font-semibold text-white">
            {STEPS[current].title}
          </span>
          <span className="font-mono text-xs text-white/50">
            Paso {current + 1} de {STEPS.length}
          </span>
        </div>
        <AscentProgress total={STEPS.length} current={current} className="mt-3 max-h-20" />
        <AscentCaption />
      </div>

      {/*Desktop*/}
      <div className="hidden lg:block">
        <AscentProgress total={STEPS.length} current={current} />
        <AscentCaption />

        <nav aria-label="Pasos de la inscripción" className="mt-8">
          <ol>
            {STEPS.map((step, i) => {
              const isCurrent = i === current;
              const isDone = i < maxStep && !isCurrent;
              const isReachable = i <= maxStep && !disabled;
              return (
                <li key={step.id} className="relative pb-6 last:pb-0">
                  {i < STEPS.length - 1 && (
                    <span
                      aria-hidden="true"
                      className={`absolute left-[15.5px] top-9 bottom-1 w-px transition-colors ${
                        i < maxStep ? "bg-blue/50" : "bg-white/10"
                      }`}
                    />
                  )}
                  <button
                    type="button"
                    disabled={!isReachable}
                    onClick={() => onNavigate(i)}
                    aria-current={isCurrent ? "step" : undefined}
                    className="group flex w-full items-center gap-4 text-left disabled:cursor-default"
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-none border font-mono text-xs transition-colors ${
                        isCurrent
                          ? "border-ember bg-ember text-navy-dark font-bold"
                          : isDone
                            ? "border-blue bg-blue/15 text-blue"
                            : "border-white/15 text-white/40"
                      }`}
                    >
                      {isDone ? <CheckIcon className="h-4 w-4" /> : pad(i + 1)}
                    </span>
                    <span
                      className={`font-poppins text-[15px] transition-colors ${
                        isCurrent
                          ? "font-semibold text-white"
                          : i <= maxStep
                            ? "text-white/70 group-hover:text-white"
                            : "text-white/35"
                      }`}
                    >
                      {step.title}
                    </span>
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>
      </div>
    </>
  );
}
