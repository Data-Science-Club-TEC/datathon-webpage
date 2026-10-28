import PageHeader from "../components/PageHeader.tsx";
import ButtonLink from "../components/ButtonLink.tsx";

export default function NotFound() {
  return (
    <div className="min-h-dvh section-dark">
      <PageHeader
        eyebrow="Error 404"
        title="Página no encontrada"
        description="La página que buscas no existe o fue movida."
      >
        <ButtonLink to="/">Volver al inicio</ButtonLink>
      </PageHeader>
    </div>
  );
}
