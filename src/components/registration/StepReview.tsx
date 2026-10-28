import type { ReactNode } from "react";
import {
  academicLevelOptions,
  academicPrograms,
  genderOptions,
  schools,
} from "../../data/registration.ts";
import { OTHER_SCHOOL, STEPS, type RegistrationDraft, type StepId, type StepProps } from "./draft.ts";
import { Checkbox } from "./fields.tsx";
import { checkProfileUrl, type ProfileKind } from "./validation.ts";

type StepReviewProps = StepProps & {
  cvFile: File | null;
  onEdit: (stepIndex: number) => void;
  honeypot: string;
  onHoneypotChange: (value: string) => void;
  submitError: string | null;
};

const dayFormatter = new Intl.DateTimeFormat("es-MX", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});
const monthFormatter = new Intl.DateTimeFormat("es-MX", {
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const formatDay = (iso: string) =>
  iso ? dayFormatter.format(new Date(`${iso}T00:00:00Z`)) : "—";

const yesNo = (value: boolean | null) => (value ? "Sí" : "No");

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// Muestra el enlace como se va a guardar, sin protocolo
function profileLabel(kind: ProfileKind, value: string) {
  if (!value.trim()) return "—";
  const check = checkProfileUrl(kind, value);
  return (check.ok ? check.url : value.trim()).replace(/^https:\/\/(www\.)?/, "");
}

function teamSummary(d: RegistrationDraft) {
  switch (d.teamPreference) {
    case "has_team":
      return `Unirme a ${d.teamPreview?.name ?? "equipo"} (${d.teamCode})`;
    case "looking":
      return `Buscando equipo · ${d.interestArea.trim()}`;
    case "create_team":
      return `Crear “${d.newTeamName.trim()}” · ${
        d.newTeamVisibility === "private" ? "Privado" : "Público"
      }`;
    case "skip":
      return "Lo decidiré después";
    default:
      return "—";
  }
}

function Summary({
  title,
  step,
  onEdit,
  rows,
}: {
  title: string;
  step: StepId;
  onEdit: (stepIndex: number) => void;
  rows: [string, ReactNode][];
}) {
  return (
    <section className="rounded-none border border-white/10 bg-white/[0.02] p-5">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h3 className="font-poppins font-semibold text-white">{title}</h3>
        <button
          type="button"
          onClick={() => onEdit(STEPS.findIndex((s) => s.id === step))}
          className="text-sm font-medium text-lavender hover:underline"
        >
          Editar
        </button>
      </div>
      <dl className="grid grid-cols-[minmax(0,auto)_minmax(0,1fr)] gap-x-5 gap-y-2.5 text-sm">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-white/45">{label}</dt>
            <dd className="break-words text-white/90">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export default function StepReview({
  draft: d,
  errors,
  update,
  cvFile,
  onEdit,
  honeypot,
  onHoneypotChange,
  submitError,
}: StepReviewProps) {
  const school =
    d.schoolId === OTHER_SCHOOL
      ? d.schoolOther.trim()
      : schools.find((s) => s.id === d.schoolId)?.name;
  const program = d.programNotListed
    ? d.programOther.trim()
    : academicPrograms.find((p) => p.id === d.programId)?.name;
  const level = academicLevelOptions.find((o) => o.value === d.academicLevel)?.label;
  const gender = genderOptions.find((o) => o.value === d.gender)?.label;
  const graduation =
    d.graduationYear && d.graduationMonth
      ? capitalize(
          monthFormatter.format(new Date(`${d.graduationYear}-${d.graduationMonth}-01T00:00:00Z`)),
        )
      : "—";
  const phone = `+52 ${d.phone.slice(0, 2)} ${d.phone.slice(2, 6)} ${d.phone.slice(6)}`;
  const hackathons = d.hasHackathonExperience
    ? `${d.hackathonCount} · ${d.hasWonHackathon ? "con al menos una victoria" : "sin victorias"}`
    : "Ninguno todavía";

  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-5 md:grid-cols-2">
        <Summary
          title="Datos personales"
          step="personal"
          onEdit={onEdit}
          rows={[
            ["Nombre", `${d.firstName.trim()} ${d.lastName.trim()}`],
            ["Correo", d.email],
            ["Teléfono", phone],
            ["Nacimiento", formatDay(d.birthDate)],
            ["Género", gender ?? "—"],
          ]}
        />
        <Summary
          title="Formación académica"
          step="academic"
          onEdit={onEdit}
          rows={[
            ["Escuela", school || "—"],
            ["Grado", level ?? "—"],
            ["Programa", program || "—"],
            ["Graduación", graduation],
          ]}
        />
        <Summary
          title="Experiencia"
          step="experience"
          onEdit={onEdit}
          rows={[
            ["Hackathones", hackathons],
            ["Programación", yesNo(d.hasProgrammingExperience)],
            ["Ciencia de datos", yesNo(d.hasDataScienceExperience)],
            ["Diseño de sistemas", yesNo(d.hasSystemDesignExperience)],
          ]}
        />
        <Summary
          title="Perfiles y CV"
          step="profiles"
          onEdit={onEdit}
          rows={[
            ["GitHub", profileLabel("github", d.githubUrl)],
            ["DevPost", profileLabel("devpost", d.devpostUrl)],
            ["LinkedIn", profileLabel("linkedin", d.linkedinUrl)],
            ["Portfolio", d.portfolioUrl.trim().replace(/^https:\/\//, "") || "—"],
            ["CV", cvFile?.name ?? "—"],
          ]}
        />
      </div>

      <Summary
        title="Equipo"
        step="team"
        onEdit={onEdit}
        rows={[["Preferencia", teamSummary(d)]]}
      />

      <div className="mt-3 flex flex-col gap-4 rounded-none border border-white/10 bg-white/[0.02] p-5 md:p-6">
        {/* PLACEHOLDER: enlazar a las paginas reales del aviso de privacidad y del reglamento */}
        <p className="text-[13px] text-white/50">
          Antes de enviar, lee el{" "}
          <a href="#" onClick={(e) => e.preventDefault()} className="text-lavender hover:underline">
            aviso de privacidad
          </a>{" "}
          y el{" "}
          <a href="#" onClick={(e) => e.preventDefault()} className="text-lavender hover:underline">
            reglamento del evento
          </a>
          .
        </p>
        <Checkbox
          checked={d.acceptPrivacy}
          onChange={(acceptPrivacy) => update({ acceptPrivacy })}
          error={errors.acceptPrivacy}
        >
          Acepto el aviso de privacidad y el tratamiento de mis datos personales
          para fines del Datathon.
        </Checkbox>
        <Checkbox
          checked={d.acceptRules}
          onChange={(acceptRules) => update({ acceptRules })}
          error={errors.acceptRules}
        >
          Acepto el reglamento y el código de conducta del evento.
        </Checkbox>
      </div>

      {/*Honeypot: invisible para personas; si un bot lo llena, el envio se descarta*/}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label>
          Sitio web
          <input
            type="text"
            name="website"
            tabIndex={-1}
            autoComplete="off"
            value={honeypot}
            onChange={(e) => onHoneypotChange(e.target.value)}
          />
        </label>
      </div>

      {submitError && (
        <p
          role="alert"
          className="rounded-none border border-danger/40 bg-danger/10 px-4 py-3 text-sm text-danger"
        >
          {submitError}
        </p>
      )}
    </div>
  );
}
