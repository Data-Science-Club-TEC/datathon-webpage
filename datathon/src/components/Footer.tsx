import Instagram from "../assets/social/Instagram.svg";
import LinkedIn from "../assets/social/LinkedIn.svg";
import WhatsApp from "../assets/social/WhatsApp.svg";
import Github from "../assets/social/Github.svg";

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
    href: "https://l.instagram.com/?u=https%3A%2F%2Fchat.whatsapp.com%2FIuy4RWeJYWV2S3PGvvyWZf%3Futm_source%3Dig%26utm_medium%3Dsocial%26utm_content%3Dlink_in_bio%26fbclid%3DPAcGRvZgJleHRuA2FlbQIxMQBzcnRjBmFwcF9pZA85MzY2MTk3NDMzOTI0NTkAAaeQJ82b3nGqBnZljRwJTaRjrNOfcI1MguZ1fdjKUSjeTB0oebBlu4w-JlSrag_aem_bSoQS8Au7lgCekGXAJd5QQ&e=AUBVL1uFsbcvvrw55c7LhazFclAgqpOLGWNhioxOI4yLPCnSWVr9hVSszEcxX_MTKcTObLLvqT03COzmLzSJiTiFvCMZ8hVPBN3CDWg1FMC1awSfnT0h1QVUIlyNIUfsLa2OV99vNMINGmG17qxJky8",
  },
  {
    name: "Github",
    icon: Github,
    href: "https://github.com/Data-Science-Club-TEC",
  },
];

export default function Footer() {
  return (
    <footer className="section-dark px-6 md:px-[80px] py-5">
      <div className="flex ml-auto md:items-start md:justify-between gap-8">
        <p className="text-[16px] text-white/75">
          Data Science Club Datathon © 2026
        </p>

        <div className="grid grid-cols-3 md:flex-row gap-10 md:gap-16 text-[16px] font-medium">
          <div className="grid grid-cols-1 row-span-full gap-6 content-start md:items-end">
            <span className="text-white/75">Datathon</span>
            <a href="#" className="text-lavender/75 hover:underline">
              Lugar y fecha
            </a>
            <a href="#" className="text-lavender/75 hover:underline">
              Agenda
            </a>
            <a href="#" className="text-lavender/75 hover:underline">
              Retos
            </a>
          </div>
          <div className="grid grid-cols-1 row-span-full gap-6 content-start md:items-end">
            <span className="text-white/75">Contacto</span>
            <a href="#" className="text-lavender/75 hover:underline">
              Equipo organizador
            </a>
          </div>
          <div className="grid grid-cols-1 row-span-full gap-6 content-start md:items-end">
            <span className="text-white/75">Inscripción</span>
            <a href="#" className="text-lavender/75 hover:underline">
              Registro
            </a>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {socialIcons.map(({ name, icon, href }) => (
          <a
            key={name}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={name}
            className="w-10 h-10 flex items-center justify-center rounded"
          >
            <img src={`${icon}`} alt={name} className="w-6 h-6" />
          </a>
        ))}
      </div>
    </footer>
  );
}
