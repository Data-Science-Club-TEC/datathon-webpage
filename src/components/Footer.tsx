import { Link } from "react-router";
import Instagram from "../assets/social/Instagram.svg";
import LinkedIn from "../assets/social/LinkedIn.svg";
import WhatsApp from "../assets/social/WhatsApp.svg";
import Github from "../assets/social/Github.svg";
import { registrationHref } from "../data/datathon.ts";

const socialIcons = [
  {
    name: "Instagram",
    icon: Instagram,
    href: "https://www.instagram.com/datascience.mty/",
  },
  {
    name: "LinkedIn",
    icon: LinkedIn,
    href: "https://www.linkedin.com/company/datasciencemty/",
  },
  {
    name: "WhatsApp",
    icon: WhatsApp,
    href: "https://chat.whatsapp.com/Iuy4RWeJYWV2S3PGvvyWZf",
  },
  {
    name: "Github",
    icon: Github,
    href: "https://github.com/Data-Science-Club-TEC",
  },
];

// Pendiente: "Equipo organizador" apuntara a /equipo cuando exista la pagina
const columns = [
  {
    title: "Datathon",
    links: [
      { label: "Lugar y fecha", to: "/datathon#sede" },
      { label: "Agenda", to: "/agenda" },
      { label: "Retos", to: "/datathon#retos" },
    ],
  },
  {
    title: "Contacto",
    links: [
      { label: "Equipo organizador", to: "#" },
      { label: "Preguntas frecuentes", to: "/faq" },
    ],
  },
  {
    title: "Inscripción",
    links: [{ label: "Registro", to: registrationHref }],
  },
];

export default function Footer() {
  return (
    <footer
      id="contacto"
      className="bg-navy-dark scroll-mt-20 border-t border-white/10 px-6 md:px-10 lg:px-20 py-12"
    >
      <div className="max-w-6xl mx-auto grid gap-10 md:grid-cols-[1fr_auto]">
        <div className="flex flex-col gap-4">
          <span className="font-brand font-semibold text-2xl tracking-tighter">
            <span className="text-blue">data</span>
            <span className="text-lavender">thon</span>
          </span>
          <ul className="flex gap-2 -ml-2">
            {socialIcons.map(({ name, icon, href }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  className="w-10 h-10 flex items-center justify-center rounded-full transition hover:bg-white/10"
                >
                  <img src={icon} alt="" className="w-6 h-6" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <nav className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:gap-16">
          {columns.map(({ title, links }) => (
            <div key={title} className="flex flex-col gap-3">
              <span className="font-mono text-xs uppercase tracking-widest text-white/50">
                {title}
              </span>
              {links.map(({ label, to }) => (
                <Link
                  key={label}
                  to={to}
                  className="text-lavender/75 transition-colors hover:text-sky"
                >
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </nav>
      </div>

      <p className="max-w-6xl mx-auto mt-10 pt-6 border-t border-white/5 text-sm text-white/50">
        Data Science Club Datathon © 2026
      </p>
    </footer>
  );
}
