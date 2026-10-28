import { useState } from "react";
import PageHeader from "../components/PageHeader.tsx";
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
        description="Resolvemos las dudas más comunes sobre inscripción, equipos y el evento."
      />

      <Section className="pt-0 md:pt-0">
        <FilterPills
          label="Categoría"
          options={filterOptions}
          value={filter}
          onChange={setFilter}
        />

        <div className="mx-auto mt-12 flex max-w-3xl flex-col gap-12">
          {visibleCategories.map((category) => {
            const items = faqs
              .filter((faq) => faq.category === category)
              .sort((a, b) => a.sortOrder - b.sortOrder);
            if (items.length === 0) return null;

            return (
              <div key={category}>
                <h2 className="mb-4 font-poppins font-semibold text-xl md:text-2xl text-white">
                  {faqCategoryLabels[category]}
                </h2>

                {/*Acordeon*/}
                <div className="flex flex-col gap-3">
                  {items.map((faq) => (
                    <details
                      key={faq.id}
                      className="group rounded-xl border border-white/10 bg-white/5 transition-colors open:border-blue/40"
                    >
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 md:p-6 font-poppins font-medium text-white md:text-[17px] hover:text-[#9fbfed] [&::-webkit-details-marker]:hidden">
                        {faq.question}
                        <ChevronDownIcon className="w-5 h-5 shrink-0 text-blue transition-transform duration-300 group-open:rotate-180" />
                      </summary>
                      <p className="px-5 md:px-6 pb-5 md:pb-6 text-white/70 leading-relaxed">
                        {faq.answer}
                      </p>
                    </details>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/*Contacto*/}
        <div className="mx-auto mt-16 max-w-3xl rounded-2xl border border-white/10 bg-navy px-6 py-10 text-center">
          <h2 className="font-poppins font-bold text-2xl md:text-3xl text-white text-glow">
            ¿No encontraste tu respuesta?
          </h2>
          <p className="font-poppins mt-3 text-white/70">
            Escríbenos por cualquiera de nuestras redes y te ayudamos.
          </p>
          <a
            href="#contacto"
            className="mt-6 inline-block font-poppins font-semibold text-lavender hover:underline"
          >
            Ver contacto
          </a>
        </div>
      </Section>
    </>
  );
}
