import type { ReactNode } from "react";
import type { StepProps } from "./draft.ts";
import { Field, Group, NumberStepper, YesNo } from "./fields.tsx";
import { MAX_HACKATHONS } from "./validation.ts";

function Rows({ title, children }: { title: string; children: ReactNode }) {
  return (
    <Group title={title}>
      <div className="flex flex-col divide-y divide-white/10 [&>*]:py-4 [&>*:first-child]:pt-0 [&>*:last-child]:pb-0">
        {children}
      </div>
    </Group>
  );
}

export default function StepExperience({ draft, errors, update }: StepProps) {
  return (
    <div className="flex flex-col gap-5">
      <Rows title="Hackathones">
        <YesNo
          label="¿Has participado en algún hackathon antes?"
          name="hasHackathonExperience"
          value={draft.hasHackathonExperience}
          onChange={(value) =>
            // Al responder "No" se reinician las preguntas dependientes (CHECK de registrations)
            update(
              value
                ? { hasHackathonExperience: true, hackathonCount: Math.max(draft.hackathonCount, 1) }
                : { hasHackathonExperience: false, hackathonCount: 1, hasWonHackathon: null },
            )
          }
          error={errors.hasHackathonExperience}
        />

        {draft.hasHackathonExperience && (
          <>
            <div className="animate-step-in">
              <Field label="¿En cuántos hackathones has participado?" error={errors.hackathonCount}>
                {(control) => (
                  <NumberStepper
                    {...control}
                    value={draft.hackathonCount}
                    min={1}
                    max={MAX_HACKATHONS}
                    onChange={(hackathonCount) => update({ hackathonCount })}
                  />
                )}
              </Field>
            </div>
            <div className="animate-step-in">
              <YesNo
                label="¿Has ganado algún hackathon?"
                name="hasWonHackathon"
                value={draft.hasWonHackathon}
                onChange={(hasWonHackathon) => update({ hasWonHackathon })}
                error={errors.hasWonHackathon}
              />
            </div>
          </>
        )}
      </Rows>

      <Rows title="Habilidades">
        <YesNo
          label="¿Tienes experiencia en programación?"
          name="hasProgrammingExperience"
          value={draft.hasProgrammingExperience}
          onChange={(hasProgrammingExperience) => update({ hasProgrammingExperience })}
          error={errors.hasProgrammingExperience}
        />
        <YesNo
          label="¿Tienes experiencia en ciencia de datos?"
          name="hasDataScienceExperience"
          value={draft.hasDataScienceExperience}
          onChange={(hasDataScienceExperience) => update({ hasDataScienceExperience })}
          error={errors.hasDataScienceExperience}
        />
        <YesNo
          label="¿Tienes experiencia en diseño de sistemas?"
          name="hasSystemDesignExperience"
          value={draft.hasSystemDesignExperience}
          onChange={(hasSystemDesignExperience) => update({ hasSystemDesignExperience })}
          error={errors.hasSystemDesignExperience}
        />
      </Rows>
    </div>
  );
}
