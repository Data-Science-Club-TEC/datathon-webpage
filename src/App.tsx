import { Route, Routes } from "react-router";
import Layout from "./components/Layout.tsx";
import Home from "./pages/Home.tsx";
import Datathon from "./pages/Datathon.tsx";
import Agenda from "./pages/Agenda.tsx";
import Faq from "./pages/Faq.tsx";
import NotFound from "./pages/NotFound.tsx";

// Paginas pendientes de flujoNorma: /equipo e /inscripcion
export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="datathon" element={<Datathon />} />
        <Route path="agenda" element={<Agenda />} />
        <Route path="faq" element={<Faq />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
