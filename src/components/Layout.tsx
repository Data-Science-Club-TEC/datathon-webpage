import { useEffect } from "react";
import { Outlet, useLocation } from "react-router";
import Header from "./Header.tsx";
import Footer from "./Footer.tsx";

export default function Layout() {
  const { pathname, hash } = useLocation();

  // Al navegar: baja a la seccion del hash (/datathon#retos) o vuelve arriba
  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView();
      return;
    }
    window.scrollTo({ top: 0, behavior: "instant" });
  }, [pathname, hash]);

  return (
    <>
      <Header />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
