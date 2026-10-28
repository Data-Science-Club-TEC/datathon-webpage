import { useState } from "react";
import { Link, NavLink } from "react-router";
import logo from "../assets/logo-notext.svg";
import { registrationHref } from "../data/datathon.ts";

const navLinks = [
  { label: "Inicio", to: "/" },
  { label: "Datathon", to: "/datathon" },
  { label: "Agenda", to: "/agenda" },
  { label: "FAQ", to: "/faq" },
];

const linkClass = "transition-colors hover:text-sky";
const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `${linkClass} ${isActive ? "text-sky" : ""}`;

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed top-0 inset-x-0 z-20 bg-navy-dark/60 backdrop-blur-md border-b border-white/5">
      <nav className="h-16 lg:h-20 max-w-7xl mx-auto flex items-center justify-between gap-6 px-6 lg:px-10">
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="" className="h-6 lg:h-8 w-auto" />
          <span className="font-brand font-semibold text-xl lg:text-[26px] tracking-tighter leading-none">
            <span className="text-blue">data</span>
            <span className="text-lavender">thon</span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8 font-display font-medium text-white">
          {navLinks.map((link) => (
            <NavLink key={link.to} to={link.to} end className={navLinkClass}>
              {link.label}
            </NavLink>
          ))}
          {/*Contacto no es una pagina: baja al footer de la pagina actual*/}
          <a href="#contacto" className={linkClass}>
            Contacto
          </a>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to={registrationHref}
            className="btn btn-primary px-4 py-2 lg:px-5 text-xs! lg:text-sm!"
          >
            Inscripción
          </Link>

          <button
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={isOpen ? "Cerrar menú" : "Abrir menú"}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
            className="cursor-pointer lg:hidden relative w-10 h-10 flex items-center justify-center"
          >
            <span
              className={`absolute h-0.5 w-6 bg-lavender rounded-full transition-transform duration-300 ${isOpen ? "rotate-45" : "-translate-y-2"}`}
            />
            <span
              className={`absolute h-0.5 w-6 bg-lavender rounded-full transition-opacity ${isOpen ? "opacity-0" : ""}`}
            />
            <span
              className={`absolute h-0.5 w-6 bg-lavender rounded-full transition-transform duration-300 ${isOpen ? "-rotate-45" : "translate-y-2"}`}
            />
          </button>
        </div>
      </nav>

      {/*Mobile nav menu: ocupa todo el ancho para targets tactiles grandes*/}
      <div
        id="mobile-menu"
        hidden={!isOpen}
        className="lg:hidden border-t border-white/5 bg-navy-dark/95"
      >
        {/*Cualquier click en un link cierra el menu*/}
        <div
          onClick={() => setIsOpen(false)}
          className="flex flex-col px-6 py-2 font-display font-medium text-lg text-white"
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end
              className={(s) => `py-3 ${navLinkClass(s)}`}
            >
              {link.label}
            </NavLink>
          ))}
          <a href="#contacto" className={`py-3 ${linkClass}`}>
            Contacto
          </a>
        </div>
      </div>
    </header>
  );
}
