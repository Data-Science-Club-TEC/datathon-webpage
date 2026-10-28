import { genderOptions } from "../../data/registration.ts";
import type { StepProps } from "./draft.ts";
import { AddonInput, Field, Group, Segmented } from "./fields.tsx";
import { inputClass } from "./styles.ts";
import { MIN_AGE } from "./validation.ts";

const toIsoDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

// Limites del selector de fecha (la validacion real esta en validation.ts)
const today = new Date();
const MAX_BIRTH_DATE = toIsoDate(
  new Date(today.getFullYear() - MIN_AGE, today.getMonth(), today.getDate()),
);
const MIN_BIRTH_DATE = `${today.getFullYear() - 100}-01-01`;

// 8112345678 -> 81 1234 5678
const formatPhone = (digits: string) =>
  [digits.slice(0, 2), digits.slice(2, 6), digits.slice(6, 10)]
    .filter(Boolean)
    .join(" ");

// Lee el input formateado. Si solo se borro un espacio, borra tambien el
// digito anterior; si no, el espacio reaparece y parece que no paso nada.
function parsePhoneInput(input: HTMLInputElement, previous: string) {
  const raw = input.value;
  let digits = raw.replace(/\D/g, "");
  const removedSeparator =
    digits === previous && raw.length < formatPhone(previous).length;
  if (removedSeparator) {
    const caret = input.selectionStart ?? raw.length;
    const digitsBeforeCaret = raw.slice(0, caret).replace(/\D/g, "").length;
    digits = digits.slice(0, Math.max(digitsBeforeCaret - 1, 0)) + digits.slice(digitsBeforeCaret);
  }
  return digits.slice(0, 10);
}

export default function StepPersonal({ draft, errors, update }: StepProps) {
  return (
    <div className="flex flex-col gap-5">
      <Group title="Identidad">
        <div className="grid gap-6 sm:grid-cols-2">
      <Field label="Nombre(s)" error={errors.firstName}>
        {(control) => (
          <input
            {...control}
            type="text"
            autoComplete="given-name"
            maxLength={100}
            value={draft.firstName}
            onChange={(e) => update({ firstName: e.target.value })}
            className={inputClass}
          />
        )}
      </Field>

      <Field label="Apellidos" error={errors.lastName}>
        {(control) => (
          <input
            {...control}
            type="text"
            autoComplete="family-name"
            maxLength={100}
            value={draft.lastName}
            onChange={(e) => update({ lastName: e.target.value })}
            className={inputClass}
          />
        )}
      </Field>

        </div>
      </Group>

      <Group title="Contacto y perfil">
        <div className="grid gap-6 sm:grid-cols-2">
      <Field
        label="Teléfono celular"
        hint="10 dígitos. Solo lo usaremos para avisos del evento."
        error={errors.phone}
      >
        {(control) => (
          <AddonInput
            {...control}
            addon="+52"
            type="tel"
            inputMode="numeric"
            autoComplete="tel-national"
            placeholder="81 1234 5678"
            value={formatPhone(draft.phone)}
            onChange={(e) => update({ phone: parsePhoneInput(e.target, draft.phone) })}
          />
        )}
      </Field>

      <Field label="Fecha de nacimiento" error={errors.birthDate}>
        {(control) => (
          <input
            {...control}
            type="date"
            autoComplete="bday"
            min={MIN_BIRTH_DATE}
            max={MAX_BIRTH_DATE}
            value={draft.birthDate}
            onChange={(e) => update({ birthDate: e.target.value })}
            className={inputClass}
          />
        )}
      </Field>

      <div className="sm:col-span-2">
        <Segmented
          label="Género"
          name="gender"
          options={genderOptions}
          value={draft.gender}
          onChange={(gender) => update({ gender })}
          error={errors.gender}
        />
      </div>
        </div>
      </Group>
    </div>
  );
}
