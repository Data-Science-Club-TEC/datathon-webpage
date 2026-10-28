import ButtonLink from "./ButtonLink.tsx";
import logo from "../assets/logo-text-bbg.svg";
import heroLoop from "../assets/herovid.mp4";
import { registrationHref } from "../data/datathon.ts";

export default function Hero() {
  return (
    <section className="relative w-full h-svh min-h-120 overflow-hidden">
      <video
        src={heroLoop}
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolute inset-0 bg-black/15" />
      <div className="absolute inset-x-0 bottom-0 h-20 md:h-30 bg-linear-to-b from-transparent to-navy-dark pointer-events-none" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <h1 className="w-full max-w-184.5">
          <img src={logo} alt="datathon" className="w-full drop-shadow-lg/50" />
        </h1>

        <div className="mt-8 md:mt-12 flex flex-col sm:flex-row items-center gap-4">
          <ButtonLink to={registrationHref}>Inscríbete</ButtonLink>
          <ButtonLink to="/datathon" variant="secondary">
            Conoce el evento
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
