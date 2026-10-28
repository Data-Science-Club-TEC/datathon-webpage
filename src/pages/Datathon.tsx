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
import { challenges, edition, prizes } from "../data/datathon.ts";
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
      value: `${hoursBetween(edition.startsAt, edition.endsAt)} h`,
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
      value: `Inicia ${formatTime(edition.startsAt)} · Termina ${formatTime(edition.endsAt)}`,
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

  const quickFacts = [
    `${formatShortDate(edition.startsAt)} – ${formatShortDate(edition.endsAt)}`,
    edition.venueAddress,
    edition.modality,
  ];

  return (
    <>
      <PageHeader
        eyebrow={edition.name}
        title="Detalles del Datathon"
        description={edition.tagline}
      >
        <div className="flex flex-wrap justify-center gap-3">
          {quickFacts.map((fact) => (
            <span
              key={fact}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 font-poppins text-sm text-white/80"
            >
              {fact}
            </span>
          ))}
        </div>
      </PageHeader>

      {/*Que es*/}
      <Section id="que-es">
        <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
          <SectionHeading
            eyebrow="El evento"
            title="¿Qué es el Datathon?"
            description={edition.description}
            align="left"
          />

          <div className="grid grid-cols-2 gap-4 md:gap-6">
            {stats.map(({ value, label }) => (
              <div
                key={label}
                className="flex flex-col items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 p-6 md:p-8 text-center"
              >
                <span className="font-poppins font-bold text-3xl md:text-[42px] text-blue text-glow tabular-nums">
                  {value}
                </span>
                <span className="text-sm md:text-base text-white/60">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/*Fecha y sede*/}
      <Section id="sede">
        <SectionHeading
          eyebrow="Logística"
          title="Fecha y sede"
          description="Todo lo que necesitas saber para llegar al evento."
        />

        <div className="grid gap-6 lg:grid-cols-2">
          <div className="grid gap-4 sm:grid-cols-2">
            {details.map(({ icon: Icon, label, value, detail }) => (
              <div
                key={label}
                className="flex flex-col gap-3 rounded-xl border border-white/10 bg-white/5 p-6"
              >
                <Icon className="w-7 h-7 text-blue" />
                <span className="text-xs uppercase tracking-wide text-white/50">
                  {label}
                </span>
                <span className="font-poppins font-semibold text-white">
                  {value}
                </span>
                <span className="text-sm text-white/60">{detail}</span>
              </div>
            ))}
          </div>

          {/*Mapa: placeholder hasta tener editions.venue_map_url*/}
          <div className="flex min-h-72 items-center justify-center rounded-xl border-2 border-dashed border-white/15 bg-white/5 p-8 text-center">
            <div>
              <MapPinIcon className="mx-auto w-10 h-10 text-blue" />
              <p className="mt-4 font-poppins font-semibold text-white">
                Mapa de la sede
              </p>
              <p className="mt-1 text-sm text-white/50">
                Estará disponible cuando se confirme la sede.
              </p>
              {edition.venueMapUrl && (
                <a
                  href={edition.venueMapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-block text-lavender/75 hover:underline"
                >
                  Abrir en Google Maps
                </a>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/*Retos*/}
      <Section id="retos">
        <SectionHeading
          eyebrow="Retos"
          title="Problemas reales de la industria"
          description="Cada reto es propuesto por un sponsor e incluye datos reales para trabajar."
        />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {challenges.map((challenge) => (
            <article
              key={challenge.id}
              className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/5 p-6 md:p-8 transition delay-100 ease-in-out hover:-translate-y-1 hover:border-blue/50"
            >
              <div className="flex flex-wrap gap-2">
                {challenge.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-blue/15 px-3 py-1 text-xs font-medium text-blue"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <h3 className="font-poppins font-semibold text-xl text-white">
                {challenge.title}
              </h3>
              <p className="text-[15px] text-white/70 leading-relaxed">
                {challenge.description}
              </p>
              <p className="mt-auto pt-2 text-sm text-lavender/75">
                Propuesto por: {challenge.sponsorName ?? "Sponsor por confirmar"}
              </p>
            </article>
          ))}
        </div>
      </Section>

      {/*Premios*/}
      <Section id="premios">
        <SectionHeading
          eyebrow="Premios"
          title="Lo que está en juego"
          description="Los tres mejores equipos se llevan premios en efectivo y beneficios de nuestros sponsors."
        />

        <div className="grid gap-6 md:grid-cols-3 md:items-end">
          {prizes.map((prize) => {
            const isFirst = prize.place === 1;
            return (
              <article
                key={prize.id}
                className={`${podiumOrder[prize.place] ?? ""} flex flex-col items-center gap-3 rounded-xl border p-8 text-center ${
                  isFirst
                    ? "btn-glow border-blue/60 bg-blue/10 md:py-14"
                    : "border-white/10 bg-white/5"
                }`}
              >
                <span
                  className={`font-poppins font-bold ${
                    isFirst ? "text-6xl text-blue text-glow" : "text-5xl text-lavender"
                  }`}
                >
                  {prize.place}º
                </span>
                <h3 className="font-poppins font-semibold text-xl text-white">
                  {prize.title}
                </h3>
                <p className="font-poppins font-bold text-2xl text-white tabular-nums">
                  {formatCurrency(prize.amountMxn)}
                </p>
                <p className="text-sm text-white/60">{prize.description}</p>
              </article>
            );
          })}
        </div>
      </Section>

      {/*CTA final*/}
      <Section className="pb-24 md:pb-32">
        <div className="rounded-2xl border border-white/10 bg-navy px-6 py-12 md:py-16 text-center">
          <h2 className="font-poppins font-bold text-3xl md:text-[42px] text-white text-glow leading-tight">
            ¿Listo para participar?
          </h2>
          <p className="font-poppins mt-4 text-white/70 text-[16px] md:text-[18px]">
            Revisa la agenda y resuelve tus dudas antes de inscribirte.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-4">
            <ButtonLink to="/agenda">Ver agenda</ButtonLink>
            <ButtonLink to="/faq" variant="secondary">
              Preguntas frecuentes
            </ButtonLink>
          </div>
        </div>
      </Section>
    </>
  );
}
