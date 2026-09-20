import { useEffect, useRef, useState } from "react";

const images = [1, 2, 3, 4, 5].map(
  (n) => `https://picsum.photos/seed/datathon${n}/800/600`,
);

export default function GalleryCarousel() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const scrollByOne = (direction: 1 | -1) => {
    const track = trackRef.current;
    if (!track) return;
    const firstSlide = track.children[0] as HTMLElement | undefined;
    if (!firstSlide) return;
    const slideWidth = firstSlide.clientWidth + 24; // gap-6 = 24px
    track.scrollBy({ left: direction * slideWidth, behavior: "smooth" });
  };

  const scrollToIndex = (index: number) => {
    const track = trackRef.current;
    if (!track) return;
    const slide = track.children[index] as HTMLElement | undefined;
    slide?.scrollIntoView({ behavior: "smooth", inline: "start" });
  };

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const updateActive = () => {
      const trackCenter = track.scrollLeft + track.clientWidth / 2;
      let closest = 0;
      let minDist = Infinity;
      Array.from(track.children).forEach((child, i) => {
        const el = child as HTMLElement;
        const dist = Math.abs(el.offsetLeft + el.clientWidth / 2 - trackCenter);
        if (dist < minDist) {
          minDist = dist;
          closest = i;
        }
      });
      setActiveIndex(closest);
    };

    track.addEventListener("scroll", updateActive);
    updateActive();
    return () => track.removeEventListener("scroll", updateActive);
  }, []);

  return (
    <section className="section-dark px-6 md:px-20 py-16 md:py-20">
      <h2 className="font-poppins font-bold text-4xl md:text-[48px] tracking-tight text-white text-glow mb-8">
        Galería
      </h2>

      <div className="relative">
        <div
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scroll-smooth"
          id="carousel-track"
        >
          {images.map((src, i) => (
            <div
              key={src}
              className="carousel-slide shrink-0 w-[85%] sm:w-[45%] md:w-[31%] h-65 md:h-80 rounded-lg overflow-hidden"
            >
              <img
                src={src}
                alt={`Foto del datathon ${i + 1}`}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>

        <button
          onClick={() => scrollByOne(-1)}
          aria-label="Anterior"
          className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-navy"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>

        <button
          onClick={() => scrollByOne(1)}
          aria-label="Siguiente"
          className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-11 h-11 rounded-full bg-white/90 hover:bg-white flex items-center justify-center shadow-lg"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 text-navy"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>

      <div className="flex justify-center gap-2 mt-6">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToIndex(i)}
            aria-label={`Ir a la imagen ${i + 1}`}
            className={`w-2.5 h-2.5 rounded-full transition-colors ${
              i === activeIndex ? "bg-white" : "bg-white/30"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
