import { useRef, useState } from "react";
import { Section, SectionHeading } from "./Section.tsx";
import { ChevronRightIcon } from "./icons.tsx";

const galleryModules = import.meta.glob<string>(
  "../assets/gallery/*.{jpg,jpeg,png,webp}",
  { eager: true, import: "default" },
);

const images = Object.keys(galleryModules)
  .sort()
  .map((path) => galleryModules[path]);

const arrowClass =
  "hidden md:flex absolute top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white items-center justify-center shadow-lg text-navy-dark cursor-pointer";

export default function Gallery() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const slideAt = (i: number) =>
    trackRef.current?.children[i] as HTMLElement | undefined;

  const scrollToIndex = (i: number) => {
    const track = trackRef.current;
    const slide = slideAt(Math.max(0, Math.min(i, images.length - 1)));
    if (track && slide) track.scrollTo({ left: slide.offsetLeft, behavior: "smooth" });
  };

  // Slide activo = el que esta mas cerca del borde izquierdo (snap-start)
  const onScroll = () => {
    const track = trackRef.current;
    const step = slideAt(1)?.offsetLeft ?? 0;
    if (track && step) setActiveIndex(Math.round(track.scrollLeft / step));
  };

  return (
    <Section>
      <SectionHeading title="Galería" align="center" />

      <div className="relative">
        <div
          ref={trackRef}
          onScroll={onScroll}
          className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scroll-smooth [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {images.map((src, i) => (
            <img
              key={src}
              src={src}
              alt={`Foto del datathon ${i + 1}`}
              loading="lazy"
              className="snap-start shrink-0 w-[85%] sm:w-[calc(50%-8px)] md:w-[calc(33.333%-16px)] h-64 md:h-80 rounded-lg object-cover"
            />
          ))}
        </div>

        <button
          onClick={() => scrollToIndex(activeIndex - 1)}
          aria-label="Anterior"
          className={`${arrowClass} left-0 -translate-x-1/2`}
        >
          <ChevronRightIcon className="w-5 h-5 rotate-180" />
        </button>
        <button
          onClick={() => scrollToIndex(activeIndex + 1)}
          aria-label="Siguiente"
          className={`${arrowClass} right-0 translate-x-1/2`}
        >
          <ChevronRightIcon className="w-5 h-5" />
        </button>
      </div>

      <div className="flex justify-center mt-4">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Ir a la imagen ${i + 1}`}
            aria-current={i === activeIndex}
            className="p-1.5 cursor-pointer"
          >
            <span
              className={`block w-2.5 h-2.5 rounded-full transition-colors ${i === activeIndex ? "bg-white" : "bg-white/30"}`}
            />
          </button>
        ))}
      </div>
    </Section>
  );
}
