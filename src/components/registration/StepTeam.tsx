import { useState, type ReactNode } from "react";
import { edition } from "../../data/datathon.ts";
import { interestAreaSuggestions } from "../../data/registration.ts";
import { findTeamByCode, IS_MOCK_SERVICE } from "../../services/registration.ts";
import type { TeamPreference, TeamVisibility } from "../../types/registration.ts";
import {
  GlobeIcon,
  KeyIcon,
  LockIcon,
  PlusIcon,
  SearchIcon,
  SkipIcon,
  UsersIcon,
} from "../icons.tsx";
import type { StepProps } from "./draft.ts";
import { ChoiceCards, Field, Spinner } from "./fields.tsx";
import { buttonStyles, inputClass } from "./styles.ts";
import { TEAM_CODE_RE } from "./validation.ts";

const preferenceOptions: {
  value: TeamPreference;
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    value: "has_team",
    title: "Ya tengo equipo",
    description: "Únete con el código que te compartió tu capitán.",
    icon: <KeyIcon className="h-5 w-5" />,
  },
  {
    value: "looking",
    title: "Sigo buscando uno",
    description: "Te conectamos con personas según tu área de interés.",
    icon: <SearchIcon className="h-5 w-5" />,
  },
  {
    value: "create_team",
    title: "Quiero crear un equipo",
    description: "Serás capitán e invitarás a tus compañeros.",
    icon: <PlusIcon className="h-5 w-5" />,
  },
  {
    value: "skip",
    title: "Omitir por ahora",
    description: "Puedes decidirlo antes del evento.",
    icon: <SkipIcon className="h-5 w-5" />,
  },
];

const visibilityOptions: {
  value: TeamVisibility;
  title: string;
  description: string;
  icon: ReactNode;
}[] = [
  {
    value: "private",
    title: "Privado",
    description: "Solo entra quien tenga el código. Lo recibirás al terminar.",
    icon: <LockIcon className="h-5 w-5" />,
  },
  {
    value: "public",
    title: "Público",
    description: "Aparece para quienes buscan equipo y pueden unirse.",
    icon: <GlobeIcon className="h-5 w-5" />,
  },
];

const panelClass =
  "animate-step-in rounded-xl border border-white/10 bg-white/[0.02] p-5 md:p-6";

function JoinTeam({ draft, errors, update }: StepProps) {
  const [status, setStatus] = useState<
    "idle" | "loading" | "invalid" | "not-found" | "failed"
  >("idle");

  const search = async () => {
    if (!TEAM_CODE_RE.test(draft.teamCode)) {
      setStatus("invalid");
      return;
    }
    setStatus("loading");
    try {
      const preview = await findTeamByCode(draft.teamCode);
      update({ teamPreview: preview });
      setStatus(preview ? "idle" : "not-found");
    } catch {
      setStatus("failed");
    }
  };

  const preview = draft.teamPreview;
  const isFull = preview !== null && preview.memberCount >= edition.maxTeamSize;
  const localErrors = {
    invalid: "El código tiene de 6 a 8 letras o números.",
    "not-found": "No encontramos un equipo con ese código. Revísalo con tu capitán.",
    failed: "No pudimos buscar el equipo. Intenta de nuevo.",
  };
  const localError =
    status === "invalid" || status === "not-found" || status === "failed"
      ? localErrors[status]
      : undefined;

  return (
    <div className={panelClass}>
      <Field
        label="Código del equipo"
        hint="Tiene de 6 a 8 letras o números."
        error={localError ?? errors.teamCode}
      >
        {(control) => (
          <div className="flex flex-col gap-3 sm:flex-row">
            <input
              {...control}
              type="text"
              autoComplete="off"
              autoCapitalize="characters"
              spellCheck={false}
              maxLength={8}
              placeholder="AB12CD34"
              value={draft.teamCode}
              onChange={(e) => {
                update({
                  teamCode: e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 8),
                  teamPreview: null,
                });
                setStatus("idle");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  void search();
                }
              }}
              className={`${inputClass} font-mono uppercase tracking-[0.25em] sm:max-w-64`}
            />
            <button
              type="button"
              onClick={() => void search()}
              disabled={status === "loading" || !draft.teamCode}
              className={buttonStyles.secondary}
            >
              {status === "loading" ? <Spinner /> : <SearchIcon className="h-4 w-4" />}
              Buscar equipo
            </button>
          </div>
        )}
      </Field>

      {preview && (
        <div
          className={`animate-step-in mt-5 flex items-center gap-4 rounded-lg border p-4 ${
            isFull ? "border-danger/40 bg-danger/5" : "border-blue/40 bg-blue/10"
          }`}
        >
          <UsersIcon className={`h-6 w-6 shrink-0 ${isFull ? "text-danger" : "text-blue"}`} />
          <div className="min-w-0">
            <p className="truncate font-poppins font-semibold text-white">{preview.name}</p>
            <p className="text-[13px] text-white/60">
              {preview.memberCount} de {edition.maxTeamSize} integrantes ·{" "}
              {isFull ? "Equipo completo" : "Hay lugar para ti"}
            </p>
          </div>
        </div>
      )}

      {IS_MOCK_SERVICE && (
        <p className="mt-4 text-[13px] text-white/40">
          Modo demo: los códigos que empiezan con X no existen y los que empiezan
          con F pertenecen a un equipo lleno.
        </p>
      )}
    </div>
  );
}

export default function StepTeam(props: StepProps) {
  const { draft, errors, update } = props;

  return (
    <div className="flex flex-col gap-6">
      <ChoiceCards
        label="Elige una opción"
        name="teamPreference"
        options={preferenceOptions}
        value={draft.teamPreference}
        onChange={(teamPreference) => update({ teamPreference })}
        error={errors.teamPreference}
      />

      {draft.teamPreference === "has_team" && <JoinTeam {...props} />}

      {draft.teamPreference === "looking" && (
        <div className={panelClass}>
          <Field
            label="Área de interés"
            hint="Elige una sugerencia o escribe la tuya."
            error={errors.interestArea}
          >
            {(control) => (
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {interestAreaSuggestions.map((area) => {
                    const selected = draft.interestArea === area;
                    return (
                      <button
                        key={area}
                        type="button"
                        aria-pressed={selected}
                        onClick={() => update({ interestArea: area })}
                        className={`rounded-full border px-3.5 py-1.5 text-[13px] font-medium transition-colors ${
                          selected
                            ? "border-blue bg-blue text-navy"
                            : "border-white/15 text-white/70 hover:border-white/35 hover:text-white"
                        }`}
                      >
                        {area}
                      </button>
                    );
                  })}
                </div>
                <input
                  {...control}
                  type="text"
                  maxLength={150}
                  placeholder="Por ejemplo: series de tiempo, NLP, finanzas"
                  value={draft.interestArea}
                  onChange={(e) => update({ interestArea: e.target.value })}
                  className={inputClass}
                />
              </div>
            )}
          </Field>
        </div>
      )}

      {draft.teamPreference === "create_team" && (
        <div className={`${panelClass} flex flex-col gap-6`}>
          <Field label="Nombre del equipo" error={errors.newTeamName}>
            {(control) => (
              <input
                {...control}
                type="text"
                maxLength={80}
                value={draft.newTeamName}
                onChange={(e) => update({ newTeamName: e.target.value })}
                className={inputClass}
              />
            )}
          </Field>
          <ChoiceCards
            label="Visibilidad"
            name="newTeamVisibility"
            options={visibilityOptions}
            value={draft.newTeamVisibility}
            onChange={(newTeamVisibility) => update({ newTeamVisibility })}
          />
          <p className="text-[13px] text-white/50">
            Serás el capitán. Los equipos son de {edition.minTeamSize} a{" "}
            {edition.maxTeamSize} integrantes.
          </p>
        </div>
      )}

      {draft.teamPreference === "skip" && (
        <p className={`${panelClass} text-sm text-white/65`}>
          Sin problema. Recuerda que para competir necesitas un equipo de{" "}
          {edition.minTeamSize} a {edition.maxTeamSize} personas antes del evento.
        </p>
      )}
    </div>
  );
}
