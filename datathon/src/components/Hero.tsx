import Header from "./Header.tsx";
import logo from "../assets/logo-text-bbg.svg";
import heroLoop from "../assets/herovid.mp4";

export default function Hero() {
  return (
    <section className="relative w-full h-140 md:h-180 overflow-hidden rounded-b-lg">
      {/*sea of data*/}
      <video
        src={heroLoop}
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      />

      <div className="absolue inset-0 bg-black/10" />

      <Header />

      {/*logo datathon grande svg*/}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-4">
        <img
          src={logo}
          alt="datathon"
          className="w-full max-w-184.5 drop-shadow-lg/50 object-contain"
        />

        {/*botón cta*/}
        <a
          href="#"
          className="mt-6 md:mt-10 inline-flex items-center justify-center backdrop-blur-[37.8px] bg-[rgba(255,255,255,0.1)] border-3 border-[rgba(255,255,255,0.3)] rounded-full px-10 py-5 font-poppins font-semibold text-2xl md:text-[36px] text-white transition delay-100 ease-in-out hover:-translate-y--1 hover:scale-110 hover:text-[#9fbfed]"
        >
          Inscripción
        </a>
      </div>
    </section>
  );
}
