import { useState } from "react";
import { edition } from "../../data/datathon.ts";
import type { RegistrationResult } from "../../types/registration.ts";
import ButtonLink from "../ButtonLink.tsx";
import { CheckIcon, CopyIcon, UsersIcon } from "../icons.tsx";
import AscentProgress from "./AscentProgress.tsx";
import { STEPS, type RegistrationDraft } from "./draft.ts";

type RegistrationSuccessProps = {
  draft: RegistrationDraft;
  result: RegistrationResult;
};

function teamMessage(d: RegistrationDraft) {
  switch (d.teamPreference) {
    case "has_team":
      return `Ya formas parte de ${d.teamPreview?.name ?? "tu equipo"}.`;
    case "looking":
      return `Te avisaremos cuando haya equipos que buscan a alguien con interés en ${d.interestArea.trim()}.`;
    case "create_team":
      return `Tu equipo “${d.newTeamName.trim()}” ya aparece en la lista de equipos públicos.`;
    default:
      return `Recuerda unirte o crear un equipo de ${edition.minTeamSize} a ${edition.maxTeamSize} personas antes del evento.`;
  }
}

const nextSteps = [
  {
    title: "Revisa la agenda",
    description: "Horarios de talleres, comidas y entregas.",
  },
  {
    title: "Arma tu equipo",
    description: `Los equipos compiten con ${edition.minTeamSize} a ${edition.maxTeamSize} integrantes.`,
  },
  {
    title: "Atento a tu correo",
    description: "Ahí llegarán los avisos y el acceso a los retos.",
  },
];

export default function RegistrationSuccess({ draft, result }: RegistrationSuccessProps) {
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!result.teamCode) return;
    try {
      await navigator.clipboard.writeText(result.teamCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Sin permiso de portapapeles: el codigo sigue visible para copiarlo a mano
    }
  };

  return (
    <div className="animate-step-in mx-auto max-w-2xl text-center">
      {/*Todo el ascenso recorrido: la bandera de la cumbre se enciende*/}
      <div className="mx-auto max-w-sm">
        <AscentProgress total={STEPS.length} current={STEPS.length - 1} complete />
      </div>
      <p className="mt-8 font-poppins text-sm font-semibold uppercase tracking-[0.2em] text-blue">
        Cumbre alcanzada · Inscripción completa
      </p>
      <h1 className="mt-3 font-poppins text-4xl font-bold leading-tight text-white text-glow md:text-[52px]">
        ¡Listo, {draft.firstName.trim()}!
      </h1>
      <p className="mx-auto mt-4 max-w-xl font-poppins text-white/70 md:text-lg">
        Tu lugar en el {edition.name} está registrado. Te enviaremos la
        confirmación a <span className="text-white">{draft.email}</span>.
      </p>

      {result.teamCode ? (
        <div className="mt-10 rounded-2xl border border-lavender/30 bg-navy/60 p-6 md:p-8">
          <p className="text-sm text-white/55">Código de “{draft.newTeamName.trim()}”</p>
          <p className="mt-3 font-mono text-3xl font-semibold tracking-[0.35em] text-lavender md:text-4xl">
            {result.teamCode}
          </p>
          <button
            type="button"
            onClick={() => void copyCode()}
            className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            {copied ? <CheckIcon className="h-4 w-4 text-blue" /> : <CopyIcon className="h-4 w-4" />}
            {copied ? "Copiado" : "Copiar código"}
          </button>
          <p className="mt-4 text-[13px] text-white/45">
            Compártelo con tus compañeros: solo quien tenga el código podrá unirse.
          </p>
        </div>
      ) : (
        <div className="mt-10 flex items-start gap-4 rounded-2xl border border-white/10 bg-navy/60 p-5 text-left md:p-6">
          <UsersIcon className="mt-0.5 h-6 w-6 shrink-0 text-blue" />
          <p className="text-white/75">{teamMessage(draft)}</p>
        </div>
      )}

      <ol className="mt-10 grid gap-4 text-left sm:grid-cols-3">
        {nextSteps.map((step, i) => (
          <li key={step.title} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
            <span className="font-mono text-xs text-blue">{String(i + 1).padStart(2, "0")}</span>
            <p className="mt-2 font-poppins font-semibold text-white">{step.title}</p>
            <p className="mt-1 text-[13px] text-white/55">{step.description}</p>
          </li>
        ))}
      </ol>

      <div className="mt-10 flex flex-wrap justify-center gap-4">
        <ButtonLink to="/agenda">Ver agenda</ButtonLink>
        <ButtonLink to="/" variant="secondary">
          Volver al inicio
        </ButtonLink>
      </div>
    </div>
  );
}
