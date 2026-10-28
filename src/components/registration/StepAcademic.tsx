import {
  academicLevelOptions,
  academicPrograms,
  schools,
} from "../../data/registration.ts";
import type { AcademicLevel } from "../../types/registration.ts";
import { OTHER_SCHOOL, type StepProps } from "./draft.ts";
import { Checkbox, ChoiceCards, Field, Select } from "./fields.tsx";
import ProgramCombobox from "./ProgramCombobox.tsx";
import { inputClass } from "./styles.ts";
import { programLevelFor } from "./validation.ts";

const schoolOptions = [
  ...schools.map((school) => ({
    value: school.id,
    title: school.shortName ?? school.name,
    description: school.name,
  })),
  { value: OTHER_SCHOOL, title: "Otra", description: "Escríbela a continuación" },
];

const monthFormatter = new Intl.DateTimeFormat("es-MX", { month: "long" });
const months = Array.from({ length: 12 }, (_, i) => {
  const name = monthFormatter.format(new Date(2000, i, 1));
  return {
    value: String(i + 1).padStart(2, "0"),
    label: name.charAt(0).toUpperCase() + name.slice(1),
  };
});

// Desde 5 años atras (recien egresados) hasta 8 adelante
const currentYear = new Date().getFullYear();
const years = Array.from({ length: 14 }, (_, i) => String(currentYear - 5 + i));

export default function StepAcademic({ draft, errors, update }: StepProps) {
  const programLevel = programLevelFor(draft.academicLevel);
  const programOptions = academicPrograms.filter((p) => p.level === programLevel);
  const programLabel = programLevel === "postgraduate" ? "Posgrado" : "Carrera";

  const changeLevel = (academicLevel: AcademicLevel) => {
    // Si cambia de licenciatura a posgrado (o al reves), la carrera elegida ya no aplica
    const levelChanged = programLevelFor(academicLevel) !== programLevel;
    update(levelChanged ? { academicLevel, programId: "" } : { academicLevel });
  };

  return (
    <div className="flex flex-col gap-7">
      <ChoiceCards
        label="Escuela"
        name="school"
        options={schoolOptions}
        value={draft.schoolId}
        onChange={(schoolId) => update({ schoolId })}
        error={errors.schoolId}
        className="sm:grid-cols-3"
      />

      {draft.schoolId === OTHER_SCHOOL && (
        <Field label="Nombre de tu escuela" error={errors.schoolOther}>
          {(control) => (
            <input
              {...control}
              type="text"
              autoComplete="organization"
              maxLength={150}
              value={draft.schoolOther}
              onChange={(e) => update({ schoolOther: e.target.value })}
              className={inputClass}
            />
          )}
        </Field>
      )}

      <Field label="Grado de estudio" error={errors.academicLevel}>
        {(control) => (
          <Select
            {...control}
            value={draft.academicLevel}
            onChange={(e) => changeLevel(e.target.value as AcademicLevel)}
          >
            <option value="" disabled>
              Selecciona una opción
            </option>
            {academicLevelOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </Select>
        )}
      </Field>

      <div className="flex flex-col gap-4">
        {draft.programNotListed ? (
          <Field label={`Nombre de tu ${programLabel.toLowerCase()}`} error={errors.programOther}>
            {(control) => (
              <input
                {...control}
                type="text"
                maxLength={150}
                value={draft.programOther}
                onChange={(e) => update({ programOther: e.target.value })}
                className={inputClass}
              />
            )}
          </Field>
        ) : (
          <Field
            label={programLabel}
            hint={
              draft.academicLevel
                ? "Escribe para buscar, por ejemplo “datos” o “computación”."
                : "Primero selecciona tu grado de estudio."
            }
            error={errors.programId}
          >
            {(control) => (
              <ProgramCombobox
                key={programLevel}
                options={programOptions}
                value={draft.programId}
                onChange={(programId) => update({ programId })}
                control={control}
                placeholder={`Busca tu ${programLabel.toLowerCase()}`}
                disabled={!draft.academicLevel}
              />
            )}
          </Field>
        )}

        <Checkbox
          checked={draft.programNotListed}
          onChange={(programNotListed) => update({ programNotListed })}
        >
          Mi {programLabel.toLowerCase()} no aparece en la lista
        </Checkbox>
      </div>

      <Field
        label="Fecha de graduación"
        hint="Aproximada; si ya egresaste, la fecha en que terminaste."
        error={errors.graduationMonth}
      >
        {(control) => (
          <div className="grid grid-cols-[minmax(0,1fr)_8rem] gap-3">
            <Select
              {...control}
              aria-label="Mes de graduación"
              value={draft.graduationMonth}
              onChange={(e) => update({ graduationMonth: e.target.value })}
            >
              <option value="" disabled>
                Mes
              </option>
              {months.map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </Select>
            <Select
              aria-label="Año de graduación"
              aria-invalid={control["aria-invalid"]}
              value={draft.graduationYear}
              onChange={(e) => update({ graduationYear: e.target.value })}
            >
              <option value="" disabled>
                Año
              </option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </Select>
          </div>
        )}
      </Field>
    </div>
  );
}
