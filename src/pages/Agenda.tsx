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

// Color del marcador por tipo; el naranja (chispa de los posts) marca lo que no te puedes perder
const kindStyles: Record<ScheduleEventKind, { label: string; dot: string }> = {
  ceremony: { label: "Ceremonia", dot: "bg-lavender" },
  workshop: { label: "Taller", dot: "bg-blue" },
  hacking: { label: "Hacking", dot: "bg-electric" },
  meal: { label: "Comida", dot: "bg-white/40" },
  deadline: { label: "Entrega", dot: "bg-ember" },
  activity: { label: "Actividad", dot: "bg-white/40" },
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
        spark={false}
        description="Ceremonias, talleres, comidas y entregas: así se viven los días del Datathon."
      />

      <Section className="pt-0 md:pt-0">
        {days.length === 0 ? (
          <p className="text-xl italic text-white/70">
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
            <p className="mt-4 mb-10 text-sm italic text-white/50">
              Horarios en hora de Monterrey. Sujetos a cambios.
            </p>

            <ol className="border-t border-white/15">
              {events.map((event) => {
                const kind = kindStyles[event.kind];
                return (
                  <li
                    key={event.id}
                    className="reveal grid gap-2 sm:grid-cols-[9rem_1fr] md:grid-cols-[12rem_1fr] sm:gap-8 border-b border-white/15 py-6 md:py-8"
                  >
                    <time
                      dateTime={event.startsAt}
                      className="font-display font-black text-2xl md:text-3xl tabular-nums"
                    >
                      {formatTime(event.startsAt)}
                      {event.endsAt && (
                        <span className="block text-base font-medium text-white/50">
                          hasta {formatTime(event.endsAt)}
                        </span>
                      )}
                    </time>

                    <div>
                      <p className="flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-white/60">
                        <span className={`h-2 w-2 rounded-full ${kind.dot}`} />
                        {kind.label}
                      </p>
                      <h3 className="mt-2 font-display font-bold text-xl md:text-2xl">
                        {event.title}
                      </h3>
                      {event.description && (
                        <p className="mt-2 text-white/70">{event.description}</p>
                      )}
                      {event.location && (
                        <p className="mt-3 flex items-center gap-2 text-sm text-white/80 underline underline-offset-4 decoration-white/30">
                          <MapPinIcon className="w-4 h-4" />
                          {event.location}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          </>
        )}
      </Section>

      <Section tone="cobalt" className="dot-grid">
        <div className="reveal flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <h2 className="poster-title text-4xl md:text-5xl">
            ¿Tienes dudas sobre el evento?
          </h2>
          <ButtonLink to="/faq">Ver preguntas frecuentes</ButtonLink>
        </div>
      </Section>
    </>
  );
}
