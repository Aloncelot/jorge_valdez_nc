// components/MapFacade.js
// Cada iframe de Google Maps descarga ~1 MB de JavaScript. Con 3 mapas la
// sección de contacto era lo más pesado del sitio. Ahora el mapa solo se
// carga cuando la persona lo pide.
"use client";
import { useState } from "react";
import { LuMap } from "react-icons/lu";

export default function MapFacade({ title, src }) {
  const [active, setActive] = useState(false);

  // Solo se aceptan URLs de inserción de Google Maps
  const safe = typeof src === "string" && src.startsWith("https://www.google.com/maps/embed?");

  return (
    <div className="map">
      {active && safe ? (
        <iframe
          title={`Mapa - ${title}`}
          src={src}
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <button type="button" className="map-trigger" onClick={() => setActive(true)}>
          <LuMap aria-hidden="true" />
          <span>Mostrar mapa</span>
          <span className="visually-hidden"> de {title}</span>
        </button>
      )}
    </div>
  );
}
