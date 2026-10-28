import { useState } from "react";
import PageHeader from "../components/PageHeader.tsx";
import ButtonLink from "../components/ButtonLink.tsx";
import FilterPills from "../components/FilterPills.tsx";
import { Section } from "../components/Section.tsx";
import { MapPinIcon } from "../components/icons.tsx";
// TODO(backend): reemplazar por getScheduleEvents() de src/services/schedule.ts
// cuando exista public.schedule_events (ver src/data/schedule.ts). Al volverse
// asincrono, mover la agrupacion por dia dentro del componente con useMemo.
import { scheduleEvents } from "../data/schedule.ts";
import type { ScheduleEvent, ScheduleEventKind } from "../types/content.ts";
import { dayKey, formatShortDate, formatTime } from "../utils/format.ts";

const kindStyles: Record<
  ScheduleEventKind,
  { label: string; className: string }
> = {
  ceremony: { label: "Ceremonia", className: "bg-lavender/15 text-lavender" },
  workshop: { label: "Taller", className: "bg-blue/15 text-blue" },
  hacking: { label: "Hacking", className: "bg-blue/25 text-white" },
  meal: { label: "Comida", className: "bg-white/10 text-white/80" },
  deadline: { label: "Entrega", className: "bg-lavender/30 text-white" },
  activity: { label: "Actividad", className: "bg-white/10 text-white/80" },
};

type ScheduleDay = { key: string; events: ScheduleEvent[] };

// Agrupa los eventos por dia (hora de Monterrey), en orden cronologico
const days = [...scheduleEvents]
  .sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime(),
  )
  .reduce<ScheduleDay[]>((acc, event) => {
    const key = dayKey(event.startsAt);
    const last = acc.at(-1);
    if (last?.key === key) {
      last.events.push(event);
    } else {
      acc.push({ key, events: [event] });
    }
    return acc;
  }, []);

const dayOptions = days.map((day, i) => ({
  value: day.key,
  label: `Día ${i + 1} · ${formatShortDate(day.events[0].startsAt)}`,
}));

export default function Agenda() {
  const [selectedDay, setSelectedDay] = useState(days[0]?.key ?? "");
  const events = days.find((day) => day.key === selectedDay)?.events ?? [];

  return (
    <>
      <PageHeader
        eyebrow="Agenda"
        title="Agenda del evento"
        description="Ceremonias, talleres, comidas y entregas: así se viven los días del Datathon."
      />

      <Section className="pt-0 md:pt-0">
        {days.length === 0 ? (
          <p className="text-center font-poppins text-white/70">
            La agenda se publicará próximamente.
          </p>
        ) : (
          <>
            <FilterPills
              label="Día del evento"
              options={dayOptions}
              value={selectedDay}
              onChange={setSelectedDay}
            />
            <p className="mt-4 mb-12 text-center text-sm text-white/50">
              Horarios en hora de Monterrey. Sujetos a cambios.
            </p>

            {/*Timeline*/}
            <ol className="mx-auto max-w-3xl">
              {events.map((event, i) => {
                const kind = kindStyles[event.kind];
                return (
                  <li
                    key={event.id}
                    className="grid grid-cols-[auto_1fr] gap-x-4 md:gap-x-8"
                  >
                    <div className="flex flex-col items-center">
                      <span className="mt-7 h-3 w-3 shrink-0 rounded-full bg-blue shadow-[0_0_10px_var(--color-blue)]" />
                      {i < events.length - 1 && (
                        <span className="w-px flex-1 bg-white/10" />
                      )}
                    </div>

                    <article className="mb-6 rounded-xl border border-white/10 bg-white/5 p-5 md:p-6">
                      <div className="flex flex-wrap items-center gap-3">
                        <time
                          dateTime={event.startsAt}
                          className="font-poppins font-semibold text-blue tabular-nums"
                        >
                          {formatTime(event.startsAt)}
                          {event.endsAt && ` – ${formatTime(event.endsAt)}`}
                        </time>
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${kind.className}`}
                        >
                          {kind.label}
                        </span>
                      </div>
                      <h3 className="mt-3 font-poppins font-semibold text-lg md:text-xl text-white">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="mt-2 text-[15px] text-white/70">
                          {event.description}
                        </p>
                      )}
                      {event.location && (
                        <p className="mt-3 flex items-center gap-2 text-sm text-lavender/75">
                          <MapPinIcon className="w-4 h-4" />
                          {event.location}
                        </p>
                      )}
                    </article>
                  </li>
                );
              })}
            </ol>
          </>
        )}

        <div className="mt-12 flex flex-col items-center gap-4 text-center">
          <p className="font-poppins text-white/70">¿Tienes dudas sobre el evento?</p>
          <ButtonLink to="/faq" variant="secondary">
            Ver preguntas frecuentes
          </ButtonLink>
        </div>
      </Section>
    </>
  );
}
