import Hey_Banco from "../assets/sponsors/Hey_Banco.svg";
import Credifiel from "../assets/sponsors/Credifiel.svg";
import gtim from "../assets/sponsors/gtim.svg";
import Kio from "../assets/sponsors/Kio.svg";
import Neoris from "../assets/sponsors/Neoris.svg";
import OXXO from "../assets/sponsors/OXXO.svg";
import Viva_Aerobus from "../assets/sponsors/Viva_Aerobus.svg";
import { Section, SectionHeading } from "./Section.tsx";

const sponsors = [
  { name: "Hey Banco", logo: Hey_Banco },
  { name: "Credifiel", logo: Credifiel },
  { name: "gtim", logo: gtim },
  { name: "Kio", logo: Kio },
  { name: "Neoris", logo: Neoris },
  { name: "OXXO", logo: OXXO },
  { name: "Viva Aerobus", logo: Viva_Aerobus },
];

export default function Sponsors() {
  return (
    <Section>
      <SectionHeading
        title="Sponsors"
        description="Las empresas que confían en tu talento"
        align="center"
      />

      {/*Marquee: la lista se duplica para el loop; la copia se oculta a lectores de pantalla*/}
      <div className="overflow-hidden mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
          {[0, 1].map((copy) => (
            <ul
              key={copy}
              aria-hidden={copy === 1}
              className="flex shrink-0 items-center gap-12 md:gap-20 pr-12 md:pr-20"
            >
              {sponsors.map(({ name, logo }) => (
                <li key={name}>
                  <img
                    src={logo}
                    alt={copy === 1 ? "" : name}
                    className="h-8 md:h-12 w-auto opacity-70 grayscale transition hover:opacity-100 hover:grayscale-0"
                  />
                </li>
              ))}
            </ul>
          ))}
        </div>
      </div>
    </Section>
  );
}
