import logo from "../assets/logo-notext.svg";

export default function Header() {
  return (
    <nav className="absolute top-0 inset-x-0 z-20 w-full h-17 md:h-23.75 backdrop-blur-sm bg-[rgba(196,196,196,0.05)] flex items-center justify-between px-6 md:px-33.25">
      {/*logo*/}
      <div className="flex items-center gap-3">
        <img
          src={logo}
          alt="Datathon logo"
          className="h-8 md:h-12 w-auto drop-shadow-lg/25"
        />
        <div className="font-poppins font-semibold text-3xl md:text-[48px] tracking-tighter leading-none">
          <span className="text-blue">data</span>
          <span className="text-lavender">thon</span>
        </div>
      </div>

      <div className="hidden md:flex items-center gap-10 font-poppins font-regular text-[20px] text-white">
        <a
          href="#"
          className="hover:text-[#9fbfed] transition delay-100 ease-in-out hover:-translate-y--1 hover:scale-110"
        >
          Inicio
        </a>
        <a
          href="#"
          className="hover:text-[#9fbfed] transition delay-100 ease-in-out hover:-translate-y--1 hover:scale-110"
        >
          Datathon
        </a>
        <a
          href="#"
          className="hover:text-[#9fbfed] transition delay-100 ease-in-out hover:-translate-y--1 hover:scale-110"
        >
          Contacto
        </a>
        <a
          href="#"
          className="hover:text-[#9fbfed] transition delay-100 ease-in-out hover:-translate-y--1 hover:scale-110"
        >
          FAQ
        </a>
      </div>

      <a
        href="#"
        className="btn-glow hidden md:flex items-center justify-center bg-[rgba(255,255,255,0.2)] border-2 border-[rgba(255,255,255,0.41)] rounded-4xl px-6 py-3 font-poppins font-semibold text-[20px] text-white transition delay-100 ease-in-out hover:-translate-y--1 hover:scale-110 hover:text-[#9fbfed]"
      >
        Inscripción
      </a>

      <button className="md:hidden text-navy" aria-label="Abrir menú">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="w-7 h-7"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M4 6h16M4 12h16M4 18h16"
          ></path>
        </svg>
      </button>
    </nav>
  );
}
