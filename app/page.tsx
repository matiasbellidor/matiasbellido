import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Bio from "@/components/Bio";
import Projects from "@/components/Projects";
import Experience from "@/components/Experience";
import Footer from "@/components/Footer";
import ScrollBackground from "@/components/ScrollBackground";

export default function Home() {
  return (
    <main id="top" className="relative min-h-screen grid-bg overflow-hidden">
      {/* Capa de fondo interpolada por scroll: vive detrás de todo
          el contenido y de la grilla decorativa */}
      <ScrollBackground />
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