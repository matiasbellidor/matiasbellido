import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Bio from "@/components/Bio";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";

export default function Home() {
  return (
    <main id="top" className="relative min-h-screen overflow-hidden">
      {/* Capa 1 (fondo): color interpolado por scroll */}
      <ScrollBackground />
      {/* Capa 2: grilla decorativa, transparente, sobre el color */}
      <div className="fixed inset-0 z-0 grid-bg pointer-events-none" aria-hidden="true" />
      {/* Capa 3 (arriba de todo): contenido */}
      <Header />
      <div className="relative z-10">
        <Hero />
        <Bio />
        <Projects />
        <Experience />
        <Footer />
      </div>
    </main>
  );
}