import { useState } from "react";
import logo from "../assets/logo-notext.svg";

const navLinks = [
  { label: "Inicio", href: "#" },
  { label: "Datathon", href: "#" },
  { label: "Contacto", href: "#" },
  { label: "FAQ", href: "#" },
];

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 inset-x-0 z-20 w-full h-22 lg:[1024px]">
      <div className="h-[100px] lg:h-[96px] flex items-center justify-between px-6 lg:px-[60px]">
        {/*Logo*/}
        <div className="flex items-center gap-2 shrink-0">
          <img
            src={logo}
            alt="Datathon logo"
            className="h-6 lg:h-8 w-auto drop-shadow-lg/45 shrink-0"
          />
          <div className="font-poppins font-semibold text-xl lg:text-[28px] tracking-tighter leading-none whitespace-nowrap drop-shadow-lg/100">
            <span className="text-blue">data</span>
            <span className="text-lavender">thon</span>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8 font-poppins font-regular text-[16px] text-white backdrop-blur-sm bg-[rgba(196,196,196,0.09)] rounded-full px-8 py-3 shadow-lg/25">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-[#9fbfed] transition delay-100 ease-in-out hover:-translate-y--1 hover:scale-110 whitespace-nowrap"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/*CTA desktop*/}
        <a
          href="#"
          className="btn-glow hidden lg:flex items-center justify-center shrink-0 bg-[rgba(255,255,255,0.2)] backdrop-blur-sm border-2 border-[rgba(255,255,255,0.41)] rounded-4xl px-6 py-3 font-poppins font-semibold text-[16px] text-white transition delay-100 ease-in-out hover:-translate-y--1 hover:scale-110 hover:text-[#9fbfed]"
        >
          Inscripción
        </a>

        {/*Mobile nav button*/}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
          aria-expanded={isOpen}
          className="cursor-pointer lg:hidden relative w-8 h-8 shrink-0 flex items-center justify-center"
        >
          <span
            className={`absolute h-0.5 2-6 bg-lavender rounded-full transition-all duration-300 ${
              isOpen ? "rotate-45" : "translate-y-2"
            }`}
          />
          <span
            className={`absolute h-0.5 w-6 bg-lavender rounded-full transition-opacity duration-200 ${
              isOpen ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolue h-0.5 w-6 bg-lavender rounded-full transition-all duration-300 ${
              isOpen ? "-rotate-45" : "translate-y-2"
            }`}
          />
        </button>
      </div>

      {/*Mobile nav menu*/}
      <div
        className={`lg:hidden absolute right-4 top-[68px] z-20 w-52 origin-top-right rounded-[28px] bg-navy/85 border-2 border-white/10 shadow-2xl transition-all duration-300 ease-in-out ${
          isOpen
            ? "scale-100 opacity-100 translate-y-0"
            : "scale-95 opacity-0 -translate-y-2 pointer-events-none"
        }`}
      >
        <div className="flex flex-col items-center gap-7 px-6 py-9 font-poppins font-regular text-[17px] text-white">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="hover:text-[#9fbfed] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#"
            onClick={() => setIsOpen(false)}
            className="hover:text-[#9fbfed] transition-colors"
          >
            Inscripción
          </a>
        </div>
      </div>
    </nav>
  );
}
