import Hero from "./components/Hero.tsx";
import Gallery from "./components/Gallery.tsx";
import Sponsors from "./components/Sponsors.tsx";
import CTA from "./components/CTA.tsx";
import Footer from "./components/Footer.tsx";

export default function App() {
  return (
    <>
      <Hero />
      <Sponsors />
      <CTA />
      <Gallery />
      <Footer />
    </>
  );
}
