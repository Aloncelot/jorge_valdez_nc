// components/CookieBanner.js
// Aviso inicial de cookies. Aparece en la primera visita y cuando el
// visitante elige "Preferencias de cookies" en el footer.
"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useCookieConsent, setCookieConsent, CONSENT_OPEN_EVENT } from "./consent";
import "./CookieBanner.css";

const CookieBanner = () => {
  const consent = useCookieConsent();
  const [reopened, setReopened] = useState(false);

  useEffect(() => {
    const open = () => setReopened(true);
    window.addEventListener(CONSENT_OPEN_EVENT, open);
    return () => window.removeEventListener(CONSENT_OPEN_EVENT, open);
  }, []);

  // undefined = aún no hidrata (evita parpadeo); null = sin decidir
  const visible = consent === null || (reopened && consent !== undefined);
  if (!visible) return null;

  const choose = (value) => {
    setCookieConsent(value);
    setReopened(false);
  };

  return (
    <div className="cookie-banner" role="region" aria-label="Aviso de cookies">
      <div className="cookie-banner-content">
        <p className="cookie-banner-title">Uso de cookies</p>
        <p className="cookie-banner-text">
          No usamos cookies de publicidad ni de analítica; solo guardamos lo indispensable para
          que el sitio funcione. Los mapas de Google Maps usan cookies de Google y se cargan solo
          si los aceptas. Más información en nuestro{" "}
          <Link href="/aviso-de-privacidad#cookies">Aviso de Privacidad</Link>.
        </p>
      </div>
      <div className="cookie-banner-actions">
        <button type="button" className="cookie-btn cookie-btn-secondary" onClick={() => choose("necessary")}>
          Solo necesarias
        </button>
        <button type="button" className="cookie-btn cookie-btn-primary" onClick={() => choose("all")}>
          Aceptar todas
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
