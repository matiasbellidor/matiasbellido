"use client";

import { Fragment, type CSSProperties } from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

/* Curva de easing premium (la misma de toda la página):
   ease-out suave, sensación "spring refinado" sin el rebote físico
   de un spring real, que en texto se ve ruidoso. */
const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ═════════════════════════════════════════════════════════════
   DROP-IN TEXT — letra por letra, con blur, bidireccional

   Cada CARÁCTER cae desde y:-15px con opacity:0 y blur(4px) hasta
   su posición final en opacity:1 y blur(0). El trigger es
   `whileInView` (Intersection Observer por debajo de Framer
   Motion) con `once: false`: al entrar al viewport las letras
   caen en cascada; al SALIR del viewport —en cualquier
   dirección, scrolleando para arriba o para abajo— vuelven a su
   estado oculto en orden inverso (la última letra se esconde
   primero), listas para caer de nuevo si el bloque vuelve a
   entrar en pantalla.

   PERFORMANCE:
   - Solo se animan transform (y), opacity y filter — las tres
     propiedades que el navegador compone en GPU sin layout
     thrashing. Nada de width/height/margin.
   - `will-change: transform, opacity, filter` está aplicado a
     cada letra para que el navegador la promueva a su propia capa
     ANTES de que arranque la animación.
   - El split es por carácter (Array.from, seguro con tildes/ñ),
     pero la estructura agrupa las letras de cada palabra dentro
     de un <span> simple (no animado) y deja un espacio de texto
     real entre palabras. Esto preserva line-height, wrapping y
     centrado: el párrafo quiebra línea exactamente igual que un
     <p> normal, en cualquier ancho de pantalla.
   - Un único IntersectionObserver (el de `whileInView` en el
     contenedor) gobierna las ~230 letras vía propagación de
     variants — no hay 230 observers ni 230 listeners de scroll.
   - Accesibilidad: el <p> lleva `aria-label` con el texto
     completo y los spans visuales están `aria-hidden`, así un
     lector de pantalla escucha la frase normal, no letra por
     letra. Con "reducir movimiento" activo, se renderiza texto
     plano sin animación.

   Uso (sin cambios respecto a la versión anterior):
   <DropInText text={t.bio.manifesto} className="..." />
   ═════════════════════════════════════════════════════════════ */

const letterStyle: CSSProperties = {
  display: "inline-block",
  willChange: "transform, opacity, filter",
};

const letterVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -15,
    filter: "blur(4px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.45, ease: EASE },
  },
};

export default function DropInText({
  text,
  className = "",
  stagger = 0.015,
}: {
  text: string;
  className?: string;
  /* Delay entre cada LETRA, en segundos. 0.015 = secuencia rápida y fluida */
  stagger?: number;
}) {
  const reduced = !!useReducedMotion();

  /* Blindaje: clave inexistente en LanguageContext → no explota */
  if (typeof text !== "string" || text.length === 0) {
    console.warn(
      "DropInText: la prop `text` llegó vacía o indefinida. " +
        "Revisá que la clave usada exista en LanguageContext.tsx."
    );
    return null;
  }

  /* Accesibilidad: con "reducir movimiento" activo, texto plano sin split */
  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  const words = text.split(" ");

  /* Container: orquesta el stagger de TODAS las letras, en cualquier
     profundidad de anidamiento (las palabras son <span> simples, no
     motion, así que no rompen la propagación de variants).

     - "show": las letras caen en orden, una tras otra.
     - "hidden": al salir del viewport, `staggerDirection: -1` hace
       que se escondan en orden INVERSO — la última letra primero —
       para que el "guardado" se sienta como un rebobinado, no como
       un apagón simultáneo. */
  const container: Variants = {
    hidden: {
      transition: { staggerChildren: stagger, staggerDirection: -1 },
    },
    show: {
      transition: { staggerChildren: stagger, delayChildren: 0.05 },
    },
  };

  return (
    <motion.p
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.3 }}
      aria-label={text}
      className={className}
    >
      <span aria-hidden="true">
        {words.map((word, wi) => (
          <Fragment key={`${word}-${wi}`}>
            <span style={{ display: "inline-block" }}>
              {Array.from(word).map((char, ci) => (
                <motion.span
                  key={`${char}-${ci}`}
                  variants={letterVariants}
                  style={letterStyle}
                >
                  {char}
                </motion.span>
              ))}
            </span>
            {wi < words.length - 1 ? " " : ""}
          </Fragment>
        ))}
      </span>
    </motion.p>
  );
}