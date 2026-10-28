import PageHeader from "../components/PageHeader.tsx";
import ButtonLink from "../components/ButtonLink.tsx";
import { Section, SectionHeading } from "../components/Section.tsx";
import {
  BuildingIcon,
  CalendarIcon,
  ClockIcon,
  MapPinIcon,
} from "../components/icons.tsx";
// TODO(backend): reemplazar por getEdition(), getChallenges() y getPrizes()
// de src/services/datathon.ts cuando existan las tablas (ver src/data/datathon.ts)
import {
  challenges,
  edition,
  prizes,
  registrationHref,
} from "../data/datathon.ts";
import {
  formatCurrency,
  formatDate,
  formatShortDate,
  formatTime,
  hoursBetween,
} from "../utils/format.ts";

// Orden del podio en desktop: 2º, 1º, 3º
const podiumOrder: Record<number, string> = {
  1: "md:order-2",
  2: "md:order-1",
  3: "md:order-3",
};

export default function Datathon() {
  const stats = [
    {
      value: `${hoursBetween(edition.startsAt, edition.endsAt)}h`,
      label: "de competencia",
    },
    {
      value: `${edition.minTeamSize}–${edition.maxTeamSize}`,
      label: "integrantes por equipo",
    },
    { value: challenges.length, label: "retos" },
    { value: prizes.length, label: "lugares premiados" },
  ];

  const details = [
    {
      icon: CalendarIcon,
      label: "Fecha",
      value: formatDate(edition.startsAt),
      detail: `Termina el ${formatDate(edition.endsAt).toLowerCase()}`,
    },
    {
      icon: ClockIcon,
      label: "Horario",
      value: `${formatTime(edition.startsAt)} – ${formatTime(edition.endsAt)}`,
      detail: "Hora de Monterrey",
    },
    {
      icon: MapPinIcon,
      label: "Sede",
      value: edition.venueName,
      detail: edition.venueAddress,
    },
    {
      icon: BuildingIcon,
      label: "Modalidad",
      value: edition.modality,
      detail: `Equipos de ${edition.minTeamSize} a ${edition.maxTeamSize} personas`,
    },
  ];

  return (
    <>
      <PageHeader
        eyebrow={edition.name}
        title="Detalles del Datathon"
        spark={false}
        description={edition.tagline}
      >
        {/*Datos del evento como en los posts: lineas simples con separadores*/}
        <div className="flex flex-col gap-1 text-lg md:text-2xl">
          <p>
            {formatShortDate(edition.startsAt)} –{" "}
            {formatShortDate(edition.endsAt)}
          </p>
          <p>
            {edition.venueAddress} <span className="text-white/40">|</span>{" "}
            {edition.modality}
          </p>
          <a href="#sede" className="underline underline-offset-4 hover:text-sky">
            {edition.venueName}
          </a>
        </div>
      </PageHeader>

      {/*Que es: cifras grandes, sin tarjetas*/}
      <Section id="que-es">
        <div className="grid lg:grid-cols-2 lg:gap-12 lg:items-center">
          <SectionHeading
            eyebrow="01 — El evento"
            title="¿Qué es el Datathon?"
          />
          <p className="text-white/75 text-lg leading-relaxed">
            {edition.description}
          </p>
        </div>

        <dl className="mt-12 grid grid-cols-2 lg:grid-cols-4 gap-y-10 gap-x-6">
          {stats.map(({ value, label }) => (
            <div key={label} className="border-l-2 border-electric pl-4">
              <dt className="sr-only">{label}</dt>
              <dd className="poster-title text-5xl md:text-7xl tabular-nums">
                {value}
              </dd>
              <dd className="mt-2 font-mono text-xs uppercase tracking-widest text-white/60">
                {label}
              </dd>
            </div>
          ))}
        </dl>
      </Section>

      {/*Fecha y sede: banda cobalto*/}
      <Section id="sede" tone="cobalt">
        <SectionHeading
          eyebrow="02 — Logística"
          title="Fecha y sede"
          description="Todo lo que necesitas saber para llegar al evento."
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <dl className="divide-y divide-white/20 border-y border-white/20">
            {details.map(({ icon: Icon, label, value, detail }) => (
              <div key={label} className="flex gap-4 py-5">
                <Icon className="w-6 h-6 shrink-0 text-sky" />
                <div>
                  <dt className="font-mono text-xs uppercase tracking-widest text-white/60">
                    {label}
                  </dt>
                  <dd className="mt-1 font-display font-bold text-lg md:text-xl">
                    {value}
                  </dd>
                  <dd className="text-white/70">{detail}</dd>
                </div>
              </div>
            ))}
          </dl>

          {/*Mapa: placeholder hasta tener editions.venue_map_url*/}
          <div className="flex min-h-72 items-center justify-center rounded-lg border-2 border-dashed border-white/30 p-8 text-center">
            <div>
              <MapPinIcon className="mx-auto w-10 h-10 text-sky" />
              <p className="mt-4 font-display font-bold uppercase">
                Mapa de la sede
              </p>
              <p className="mt-1 text-sm text-white/70">
                Estará disponible cuando se confirme la sede.
              </p>
              {edition.venueMapUrl && (
                <a
                  href={edition.venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block underline underline-offset-4 hover:text-sky"
                >
                  Abrir en Google Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/*Retos: lista numerada editorial*/}
      <Section id="retos">
        <SectionHeading
          eyebrow="03 — Retos"
          title="Problemas reales de la industria"
          description="Cada reto es propuesto por un sponsor e incluye datos reales para trabajar."
        />

        <ol className="border-t border-white/15">
          {challenges.map((challenge, i) => (
            <li
              key={challenge.id}
              className="grid gap-4 md:grid-cols-[8rem_1fr_auto] md:gap-10 border-b border-white/15 py-8"
            >
              <span className="poster-title text-5xl md:text-7xl text-electric">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div>
                <h3 className="font-display font-bold text-xl md:text-2xl">
                  {challenge.title}
                </h3>
                <p className="mt-2 text-white/70 leading-relaxed">
                  {challenge.description}
                </p>
                <p className="mt-3 text-sm italic text-white/60">
                  Propuesto por:{" "}
                  {challenge.sponsorName ?? "Sponsor por confirmar"}
                </p>
              </div>
              <ul className="flex flex-wrap md:flex-col md:items-end gap-2">
                {challenge.tags.map((tag) => (
                  <li
                    key={tag}
                    className="font-mono text-xs uppercase tracking-wider text-sky"
                  >
                    #{tag}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      </Section>

      {/*Premios: podio con el 1er lugar en azul electrico*/}
      <Section id="premios">
        <SectionHeading
          eyebrow="04 — Premios"
          title="Lo que está en juego"
          description="Los tres mejores equipos se llevan premios en efectivo y beneficios de nuestros sponsors."
        />

        <div className="grid gap-4 md:grid-cols-3 md:items-end">
          {prizes.map((prize) => {
            const isFirst = prize.place === 1;
            return (
              <article
                key={prize.id}
                className={`${podiumOrder[prize.place] ?? ""} relative overflow-hidden rounded-lg p-8 ${
                  isFirst
                    ? "bg-electric md:pb-20"
                    : "border border-white/15"
                }`}
              >
                <span className="poster-title text-7xl md:text-8xl">
                  {prize.place}º
                </span>
                <h3 className="mt-4 font-display font-bold text-xl">
                  {prize.title}
                </h3>
                <p className="mt-1 font-display font-black text-3xl tabular-nums">
                  {formatCurrency(prize.amountMxn)}
                </p>
                <p className="mt-3 text-sm text-white/75">
                  {prize.description}
                </p>
              </article>
            );
          })}
        </div>
      </Section>

      {/*CTA final: poster azul electrico*/}
      <Section tone="electric">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="poster-title text-5xl md:text-7xl">
              ¿Listo para
              <br />
              participar?
            </h2>
            <p className="mt-4 text-xl font-light italic">
              Revisa la agenda y resuelve tus dudas antes de inscribirte.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <ButtonLink to={registrationHref}>Inscríbete</ButtonLink>
            <ButtonLink to="/agenda" variant="secondary">
              Ver agenda
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
