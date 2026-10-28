import { Route, Routes } from "react-router";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import Datathon from "./pages/Datathon.tsx";
import Agenda from "./pages/Agenda.tsx";
import Faq from "./pages/Faq.tsx";
import Inscripcion from "./pages/Inscripcion.tsx";
import NotFound from "./pages/NotFound.tsx";

// Pagina pendiente de flujoNorma: /equipo
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="datathon" element={<Datathon />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="faq" element={<Faq />} />
        <Route path="inscripcion" element={<Inscripcion />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
