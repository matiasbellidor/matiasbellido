"use client";

import { motion, useReducedMotion, type Variants } from "framer-motion";

/* Easing pedido: cubic-bezier(0.25, 1, 0.5, 1) — ease-out premium */
const EASE: [number, number, number, number] = [0.25, 1, 0.5, 1];

/* ═════════════════════════════════════════════════════════════
   REVEAL TEXT — cortina de izquierda a derecha (clip-path)

   El texto NO viaja por la pantalla: se DESCUBRE desde el borde
   izquierdo, como si saliera de detrás de una pared invisible.
   El efecto combina tres propiedades en un solo gesto:

   - clip-path: inset(0 100% 0 0) → inset(0 0% 0 0)
       Recorta el 100% del lado derecho y lo va liberando hasta 0%.
       Este es el "reveal" real: descubre el texto in situ.
   - x: -30px → 0
       Un empujón sutil que acompaña la apertura (no la reemplaza).
   - opacity: 0 → 1
       Fade suave que redondea la entrada.

   Mobile / overflow:
   - El clip-path recorta SIN sacar el elemento de su caja, así que
     —a diferencia de un translateX grande— nunca genera scroll
     horizontal. El desplazamiento es de apenas 30px (no % de
     viewport), inocuo en pantallas chicas.
   - El wrapper lleva overflow-x: hidden como segundo cinturón.

   Trigger: whileInView + once:true (Intersection Observer por
   debajo de Framer Motion) — dispara solo al bajar y entrar en
   viewport, una vez.

   Accesibilidad: con "reducir movimiento" activo, texto plano.

   Uso:
   <RevealText text={t.projects.sectionDesc} className="..." />
   ═════════════════════════════════════════════════════════════ */

export default function RevealText({
  text,
  className = "",
}: {
  text: string;
  className?: string;
}) {
  const reduced = !!useReducedMotion();

  if (typeof text !== "string" || text.length === 0) {
    console.warn(
      "RevealText: la prop `text` llegó vacía o indefinida. " +
        "Revisá que la clave usada exista en LanguageContext.tsx."
    );
    return null;
  }

  if (reduced) {
    return <p className={className}>{text}</p>;
  }

  const variants: Variants = {
    hidden: {
      opacity: 0,
      x: -30,
      clipPath: "inset(0 100% 0 0)",
    },
    show: {
      opacity: 1,
      x: 0,
      clipPath: "inset(0 0% 0 0)",
      transition: { duration: 1, ease: EASE },
    },
  };

  return (
    /* Wrapper con overflow-x oculto: cinturón anti-scroll-horizontal.
       No usa overflow-hidden a secas para no recortar nada vertical. */
    <span style={{ display: "block", overflowX: "hidden" }}>
      <motion.p
        variants={variants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.4 }}
        style={{ willChange: "transform, opacity, clip-path" }}
        className={className}
      >
        {text}
      </motion.p>
    </span>
  );
}
