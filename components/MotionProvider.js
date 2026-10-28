// components/MotionProvider.js
// Carga diferida de framer-motion: los componentes usan `m.*` en lugar de
// `motion.*`, y solo se cargan las funciones de animación que el sitio usa
// (domAnimation). Mismas animaciones, bundle inicial más ligero.
"use client";
import { LazyMotion, domAnimation } from "framer-motion";

export default function MotionProvider({ children }) {
  return <LazyMotion features={domAnimation}>{children}</LazyMotion>;
}
