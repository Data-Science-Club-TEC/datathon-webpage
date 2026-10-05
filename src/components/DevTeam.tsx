const members = [
  {
    name: "Ale & Luis (Frontend)",
    desc: "Creación de la interfaz de usuario, diseño responsive y componentes interactivos",
  },
  {
    name: "Seb & Eddie (Database)",
    desc: "Modelado de datos, optimización de consultas y almacenamiento seguro de inscripciones",
  },
  {
    name: "Andrés (Backend & coordinación)",
    desc: "Desarrollo de APIs, lógica de servidores, autenticación de participantes y gestión de rutas",
  },
  {
    name: "Betsy (Dirección & seguridad)",
    desc: "Dirección general, arquitectura de la plataforma y visión estratégica",
  },
];

export default function DevTeam() {
  return (
    <section className="section-dark px-6 md:px-[80px] pt-16 pb-24">
      <p className="font-poppins font-bold text-sm md:text-[24px] text-center tracking-tight text-white text-glow mb-14">
        Thank you Dev Team!
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
        {members.map((m) => (
          <div key={m.name} className="flex flex-col gap-2">
            <p className="font-poppins font-medium md:text-[18px] text-white">
              {m.name}
            </p>
            <p className="font-poppins text-[16px] text-white/75">{m.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
