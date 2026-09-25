import Hey_Banco from "../assets/sponsors/Hey_Banco.svg";
import Credifiel from "../assets/sponsors/Credifiel.svg";
import gtim from "../assets/sponsors/gtim.svg";
import Kio from "../assets/sponsors/Kio.svg";
import Neoris from "../assets/sponsors/Neoris.svg";
import OXXO from "../assets/sponsors/OXXO.svg";
import Viva_Aerobus from "../assets/sponsors/Viva_Aerobus.svg";

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
    <section className="section-dark px-6 md:px-[80px] py-20">
      <div className="text-center max-w-2xl mx-auto mb-12">
        <h2 className="font-poppins font-bold text-3xl md:text-[42px] text-white text-glow leading-tight">
          Sponsors
        </h2>
        <p className="font-poppins mt-4 text-white/75 text-[20px]">
          Las empresas que confían en tu talento
        </p>
      </div>

      {/*Sponsor marquee*/}
      <div className="relative overflow-hidden max-w-6xl mx-auto mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] [-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
        <div className="flex w-max animate-marquee gap-20">
          {[...sponsors, ...sponsors].map(({ name, logo }) => (
            <img
              src={logo}
              alt={name}
              className="opacity-70 grayscale h-8 md:h-12 w-auto shrink-0"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
