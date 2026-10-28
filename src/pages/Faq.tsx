import { useState } from "react";
import PageHeader from "../components/PageHeader.tsx";
import ButtonLink from "../components/ButtonLink.tsx";
import FilterPills from "../components/FilterPills.tsx";
import { Section } from "../components/Section.tsx";
import { ChevronDownIcon } from "../components/icons.tsx";
// TODO(backend): reemplazar por getFaqs() de src/services/faq.ts cuando exista
// public.faqs (ver src/data/faq.ts)
import { faqCategoryLabels, faqs } from "../data/faq.ts";
import type { FaqCategory } from "../types/content.ts";

type CategoryFilter = FaqCategory | "all";

const categories = Object.keys(faqCategoryLabels) as FaqCategory[];

const filterOptions: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  ...categories.map((category) => ({
    value: category,
    label: faqCategoryLabels[category],
  })),
];

export default function Faq() {
  const [filter, setFilter] = useState<CategoryFilter>("all");
  const visibleCategories = filter === "all" ? categories : [filter];

  return (
    <>
      <PageHeader
        eyebrow="FAQ"
        title="Preguntas frecuentes"
        graphic="sphere"
        description="Resolvemos las dudas más comunes sobre inscripción, equipos y el evento."
      />

      <Section className="pt-0 md:pt-0">
        <FilterPills
          label="Categoría"
          options={filterOptions}
          value={filter}
          onChange={setFilter}
        />

        <div className="mt-12 flex flex-col gap-14">
          {visibleCategories.map((category) => {
            const items = faqs
              .filter((faq) => faq.category === category)
              .sort((a, b) => a.sortOrder - b.sortOrder);
            if (items.length === 0) return null;

            return (
              <div
                key={category}
                className="reveal grid gap-4 lg:grid-cols-[16rem_1fr] lg:gap-12"
              >
                <h2 className="poster-title text-2xl md:text-3xl">
                  {faqCategoryLabels[category]}
                </h2>

                <div className="border-t border-white/15">
                  {items.map((faq) => (
                    <details
                      key={faq.id}
                      className="group border-b border-white/15"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-5 font-display font-bold text-lg hover:text-sky [&::-webkit-details-marker]:hidden">
                        {faq.question}
                        <ChevronDownIcon className="w-5 h-5 shrink-0 text-sky transition-transform duration-300 group-open:rotate-180" />
                      </summary>
                      <p className="pb-6 max-w-2xl text-white/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </Section>

      <Section tone="cobalt" className="dot-grid">
        <div className="reveal flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="poster-title text-4xl md:text-5xl">
              ¿No encontraste tu respuesta?
            </h2>
            <p className="mt-3 text-lg italic font-light">
              Escríbenos por cualquiera de nuestras redes y te ayudamos.
            </p>
          </div>
          <ButtonLink to="#contacto">Ver contacto</ButtonLink>
        </div>
      </Section>
    </>
  );
}
