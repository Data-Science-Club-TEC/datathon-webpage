import { useEffect, useRef, useState, type FormEvent } from "react";
import { Link } from "react-router";
import { ArrowLeftIcon, ArrowRightIcon } from "../components/icons.tsx";
import {
  clearProgress,
  loadProgress,
  saveProgress,
  STEPS,
  type DraftField,
  type FieldErrors,
  type RegistrationDraft,
} from "../components/registration/draft.ts";
import { Spinner } from "../components/registration/fields.tsx";
import RegistrationSuccess from "../components/registration/RegistrationSuccess.tsx";
import Ridges from "../components/registration/Ridges.tsx";
import StepAcademic from "../components/registration/StepAcademic.tsx";
import StepEmail from "../components/registration/StepEmail.tsx";
import StepExperience from "../components/registration/StepExperience.tsx";
import StepPersonal from "../components/registration/StepPersonal.tsx";
import StepProfiles from "../components/registration/StepProfiles.tsx";
import StepRail from "../components/registration/StepRail.tsx";
import StepReview from "../components/registration/StepReview.tsx";
import StepTeam from "../components/registration/StepTeam.tsx";
import { buttonStyles } from "../components/registration/styles.ts";
import TopoLines from "../components/registration/TopoLines.tsx";
import {
  firstInvalidStep,
  toPayload,
  validateStep,
} from "../components/registration/validation.ts";
import { edition } from "../data/datathon.ts";
import { submitRegistration, uploadCv } from "../services/registration.ts";
import type { RegistrationResult } from "../types/registration.ts";
import { formatShortDate } from "../utils/format.ts";

const pad = (n: number) => String(n).padStart(2, "0");
const editionYear = new Date(edition.startsAt).getFullYear();

export default function Inscripcion() {
  const [initial] = useState(loadProgress);
  const [draft, setDraft] = useState<RegistrationDraft>(initial.draft);
  const [step, setStep] = useState(initial.step);
  const [maxStep, setMaxStep] = useState(initial.maxStep);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<RegistrationResult | null>(null);

  const panelRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Que enfocar despues del siguiente render: el titulo del paso nuevo o el
  // primer campo con error. Se resuelve en un efecto para que el paso ya exista
  // en el DOM, incluso cuando el cambio viene de una respuesta asincrona.
  const pendingFocus = useRef<"step" | "error" | null>(null);

  useEffect(() => {
    if (!result) saveProgress({ draft, step, maxStep });
  }, [draft, step, maxStep, result]);

  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    if (target === "step") {
      panelRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      headingRef.current?.focus({ preventScroll: true });
    } else {
      panelRef.current
        ?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"] input')
        ?.focus();
    }
  }, [step, errors]);

  // Cambiar un campo borra su error; el resto se queda hasta volver a validar
  const update = (patch: Partial<RegistrationDraft>) => {
    setDraft((d) => ({ ...d, ...patch }));
    setErrors((e) => {
      const keys = Object.keys(patch) as DraftField[];
      if (!keys.some((key) => key in e)) return e;
      const next = { ...e };
      for (const key of keys) delete next[key];
      return next;
    });
  };

  const changeCv = (file: File | null) => {
    setCvFile(file);
    setErrors((e) => {
      if (!e.cv) return e;
      const next = { ...e };
      delete next.cv;
      return next;
    });
  };

  const goTo = (index: number) => {
    pendingFocus.current = "step";
    setStep(index);
    setMaxStep((m) => Math.max(m, index));
    setErrors({});
    setSubmitError(null);
  };

  const showErrors = (stepErrors: FieldErrors) => {
    pendingFocus.current = "error";
    setErrors(stepErrors);
  };

  const submit = async () => {
    // Un paso anterior pudo quedar invalido (p. ej. el CV se pierde al recargar)
    const invalid = firstInvalidStep(draft, cvFile);
    if (invalid !== -1 && STEPS[invalid].id !== "review") {
      goTo(invalid);
      setErrors(validateStep(STEPS[invalid].id, draft, cvFile));
      return;
    }
    if (!cvFile) return;

    // Honeypot lleno: es un bot. Se simula exito sin enviar nada.
    if (honeypot) {
      clearProgress();
      setResult({ teamCode: null });
      return;
    }

    setSubmitting(true);
    setSubmitError(null);
    try {
      const cvPath = await uploadCv(cvFile);
      const response = await submitRegistration(toPayload(draft, cvPath));
      clearProgress();
      setResult(response);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setSubmitError(
        "No pudimos enviar tu inscripción. Revisa tu conexión e inténtalo de nuevo.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const current = STEPS[step];
    const stepErrors = validateStep(current.id, draft, cvFile);
    if (Object.keys(stepErrors).length > 0) {
      showErrors(stepErrors);
      return;
    }
    if (current.id === "review") {
      void submit();
      return;
    }
    goTo(step + 1);
  };

  const current = STEPS[step];
  const isReview = current.id === "review";
  // El primer paso tiene sus propios botones hasta verificar el correo
  const showNext = current.id !== "email" || draft.emailVerified;
  const stepProps = { draft, errors, update };

  const renderStep = () => {
    switch (current.id) {
      case "email":
        return <StepEmail {...stepProps} onVerified={() => goTo(1)} />;
      case "personal":
        return <StepPersonal {...stepProps} />;
      case "academic":
        return <StepAcademic {...stepProps} />;
      case "experience":
        return <StepExperience {...stepProps} />;
      case "profiles":
        return <StepProfiles {...stepProps} cvFile={cvFile} onCvChange={changeCv} />;
      case "team":
        return <StepTeam {...stepProps} />;
      case "review":
        return (
          <StepReview
            {...stepProps}
            cvFile={cvFile}
            onEdit={goTo}
            honeypot={honeypot}
            onHoneypotChange={setHoneypot}
            submitError={submitError}
          />
        );
    }
  };

  return (
    // overflow-x-clip (no overflow-hidden) para no romper el sticky del panel lateral
    <section className="bg-navy-dark relative overflow-x-clip pt-32 pb-24 md:pt-40 md:pb-32">
      {/*Fondo: curvas de nivel y brillo*/}
      <TopoLines className="pointer-events-none absolute -top-16 -right-72 w-[1100px] max-w-none [mask-image:radial-gradient(ellipse_at_center,black_25%,transparent_70%)] md:-right-40" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-[560px] opacity-60"
        style={{
          background:
            "radial-gradient(640px circle at 12% 0%, rgba(204, 192, 252, 0.28), transparent 70%)",
        }}
      />

      <div className="relative px-6 md:px-12 lg:px-20">
        <div className="mx-auto max-w-6xl">
          {result ? (
            <RegistrationSuccess draft={draft} result={result} />
          ) : (
            <header className="max-w-2xl">
              <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1 font-brand text-lg font-semibold tracking-tight">
                <span>
                  <span className="text-blue">data</span>
                  <span className="text-lavender">thon</span>{" "}
                  <span className="text-white/85">{editionYear}</span>
                </span>
                <span className="font-mono text-xs font-normal uppercase tracking-[0.2em] text-white/40">
                  / inscripción
                </span>
              </p>
              <h1 className="mt-3 poster-title text-5xl text-white md:text-7xl">
                Asegura tu lugar
              </h1>
              <p className="mt-4 max-w-xl text-[16px] font-light italic text-white/80 md:text-xl">
                Completa tu registro en unos minutos. Puedes inscribirte con
                equipo, sin equipo o crear el tuyo.
              </p>
            </header>
          )}
        </div>
      </div>

      <Ridges className="relative mt-2 block h-[90px] w-full md:-mt-4 md:h-[220px]" />

      {!result && (
        // La tarjeta se monta sobre la cordillera; el panel lateral empieza debajo
        <div className="relative mt-2 px-6 md:-mt-28 md:px-12 lg:px-20">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[250px_minmax(0,1fr)] lg:gap-14">
            <aside className="md:pt-28 lg:sticky lg:top-28 lg:self-start">
              <StepRail
                current={step}
                maxStep={maxStep}
                onNavigate={goTo}
                disabled={submitting}
              />

              <div className="mt-10 hidden space-y-3 border-t border-white/10 pt-6 text-[13px] leading-relaxed text-white/50 lg:block">
                <p>
                  <span className="text-white/80">
                    {formatShortDate(edition.startsAt)}
                  </span>{" "}
                  · {edition.venueAddress}
                </p>
                <p>Tu avance se guarda mientras esta pestaña siga abierta.</p>
                <p>
                  ¿Dudas?{" "}
                  <Link to="/faq" className="text-lavender hover:underline">
                    Preguntas frecuentes
                  </Link>
                </p>
              </div>
            </aside>

            <div ref={panelRef} className="scroll-mt-28">
              {/*Tarjeta opaca y de esquinas rectas: banda azul electrico arriba, como los posts*/}
              <form
                noValidate
                onSubmit={handleSubmit}
                className="relative border-2 border-white/20 bg-navy shadow-[6px_6px_0_0_var(--color-cobalt)] md:shadow-[10px_10px_0_0_var(--color-cobalt)]"
              >
                <div key={step} className="animate-step-in">
                  <div className="dot-grid relative overflow-hidden bg-teal px-5 py-6 sm:px-8 sm:py-7 md:px-10 md:py-9">
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -right-2 -bottom-6 hidden select-none sm:block font-display text-[6rem] font-black leading-none text-cyan/15 sm:text-[9rem] md:text-[12rem]"
                    >
                      {pad(step + 1)}
                    </span>
                    <p className="relative flex items-center gap-3 font-mono text-xs uppercase tracking-[0.2em]">
                      <span className="whitespace-nowrap bg-cyan px-2 py-1 font-bold text-navy-dark">
                        Paso {pad(step + 1)} / {pad(STEPS.length)}
                      </span>
                      <span className="hidden text-white/80 sm:inline">{current.title}</span>
                    </p>
                    <h2
                      ref={headingRef}
                      tabIndex={-1}
                      className="poster-title relative mt-3 text-[1.65rem] text-white outline-none sm:text-3xl md:mt-4 md:text-5xl"
                    >
                      {current.heading}
                    </h2>
                    <p className="relative mt-3 max-w-xl text-[15px] font-light italic text-white/90">
                      {current.description}
                    </p>
                  </div>
                  <div
                    role="progressbar"
                    aria-label="Progreso de la inscripción"
                    aria-valuemin={1}
                    aria-valuemax={STEPS.length}
                    aria-valuenow={step + 1}
                    className="h-1.5 bg-navy-dark"
                  >
                    <div
                      className="h-full bg-cyan transition-[width] duration-500 ease-out"
                      style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
                    />
                  </div>

                  <div className="px-4 py-6 sm:px-8 sm:py-7 md:px-10 md:py-10">
                    <div>{renderStep()}</div>
                    <p className="mt-8 flex items-start gap-3 border-l-4 border-cyan bg-navy-dark/60 px-4 py-3 text-[14px] text-white/80">
                      <span className="mt-0.5 shrink-0 font-mono text-[11px] font-bold uppercase tracking-[0.2em] text-cyan">
                        Dato
                      </span>
                      {current.tip}
                    </p>
                  </div>
                </div>

                {(step > 0 || showNext) && (
                  <div className="flex flex-col-reverse items-stretch gap-3 border-t-2 border-white/10 bg-navy-dark px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 md:px-10">
                    {step > 0 ? (
                      <button
                        type="button"
                        onClick={() => goTo(step - 1)}
                        disabled={submitting}
                        className={buttonStyles.ghost}
                      >
                        <ArrowLeftIcon className="h-4 w-4" />
                        Atrás
                      </button>
                    ) : (
                      <span className="hidden sm:block" />
                    )}
                    {showNext && (
                      <button
                        type="submit"
                        disabled={submitting}
                        className={buttonStyles.primary}
                      >
                        {isReview ? (submitting ? "Enviando…" : "Enviar inscripción") : "Continuar"}
                        {submitting ? <Spinner /> : <ArrowRightIcon className="h-4 w-4" />}
                      </button>
                    )}
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
