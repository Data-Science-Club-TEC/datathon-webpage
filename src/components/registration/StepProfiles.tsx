import { useState } from "react";
import { LinkIcon } from "../icons.tsx";
import type { StepProps } from "./draft.ts";
import CvUpload from "./CvUpload.tsx";
import { Field } from "./fields.tsx";
import { inputClass } from "./styles.ts";
import {
  checkProfileUrl,
  profileExample,
  withHttps,
  type ProfileKind,
} from "./validation.ts";

type StepProfilesProps = StepProps & {
  cvFile: File | null;
  onCvChange: (file: File | null) => void;
};

type ProfileUrlFieldProps = {
  kind: ProfileKind;
  label: string;
  optional?: boolean;
  value: string;
  error?: string;
  onChange: (value: string) => void;
};

// Valida al salir del campo (no mientras se escribe) y confirma el enlace
// canonico que se va a guardar
function ProfileUrlField({
  kind,
  label,
  optional,
  value,
  error,
  onChange,
}: ProfileUrlFieldProps) {
  const [blurError, setBlurError] = useState<string>();
  const check = value.trim() ? checkProfileUrl(kind, value) : null;
  const shownError = error ?? blurError;

  return (
    <Field
      label={label}
      optional={optional}
      hint={`Ejemplo: ${profileExample(kind)}`}
      error={shownError}
      success={check?.ok ? check.url.replace(/^https:\/\/(www\.)?/, "") : undefined}
    >
      {(control) => (
        <div className="relative">
          <LinkIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
          <input
            {...control}
            type="url"
            inputMode="url"
            autoComplete="url"
            autoCapitalize="none"
            spellCheck={false}
            maxLength={200}
            placeholder={profileExample(kind)}
            value={value}
            onChange={(e) => {
              onChange(e.target.value);
              setBlurError(undefined);
            }}
            onBlur={() => {
              const fixed = withHttps(value);
              if (fixed !== value) onChange(fixed);
              if (!fixed) return;
              const result = checkProfileUrl(kind, fixed);
              setBlurError(result.ok ? undefined : result.error);
            }}
            className={`${inputClass} pl-10`}
          />
        </div>
      )}
    </Field>
  );
}

export default function StepProfiles({
  draft,
  errors,
  update,
  cvFile,
  onCvChange,
}: StepProfilesProps) {
  return (
    <div className="flex flex-col gap-7">
      <div className="grid gap-6 sm:grid-cols-2">
        <ProfileUrlField
          kind="github"
          label="GitHub"
          value={draft.githubUrl}
          error={errors.githubUrl}
          onChange={(githubUrl) => update({ githubUrl })}
        />
        <ProfileUrlField
          kind="devpost"
          label="DevPost"
          value={draft.devpostUrl}
          error={errors.devpostUrl}
          onChange={(devpostUrl) => update({ devpostUrl })}
        />
        <ProfileUrlField
          kind="linkedin"
          label="LinkedIn"
          optional
          value={draft.linkedinUrl}
          error={errors.linkedinUrl}
          onChange={(linkedinUrl) => update({ linkedinUrl })}
        />

        <Field label="Portfolio" optional error={errors.portfolioUrl}>
          {(control) => (
            <div className="relative">
              <LinkIcon className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
              <input
                {...control}
                type="url"
                inputMode="url"
                autoComplete="url"
                autoCapitalize="none"
                spellCheck={false}
                maxLength={300}
                placeholder="https://tu-sitio.com"
                value={draft.portfolioUrl}
                onChange={(e) => update({ portfolioUrl: e.target.value })}
                onBlur={() => {
                  const fixed = withHttps(draft.portfolioUrl);
                  if (fixed !== draft.portfolioUrl) update({ portfolioUrl: fixed });
                }}
                className={`${inputClass} pl-10`}
              />
            </div>
          )}
        </Field>
      </div>

      <CvUpload file={cvFile} onChange={onCvChange} error={errors.cv} />

      <p className="text-[13px] leading-relaxed text-white/45">
        Tu CV se guarda de forma privada y solo lo verán el comité organizador y
        los sponsors del evento.
      </p>
    </div>
  );
}
