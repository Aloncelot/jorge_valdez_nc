// components/consent.js
// Preferencia de cookies del visitante, guardada en localStorage.
//   "all"       → acepta también cookies de terceros (mapas de Google Maps)
//   "necessary" → solo lo indispensable para que el sitio funcione
//   null        → aún no decide (se muestra el aviso de cookies)
"use client";
import { useSyncExternalStore } from "react";

const KEY = "jvnc-cookie-consent";
const VERSION = 1; // súbelo si cambian las categorías: vuelve a pedir el consentimiento
const CHANGE_EVENT = "jvnc-consent-change";
const OPEN_EVENT = "jvnc-consent-open";

// Respaldo si localStorage no está disponible (navegación privada estricta)
let memoryValue = null;

function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (data?.v !== VERSION) return null;
    return data.value === "all" || data.value === "necessary" ? data.value : null;
  } catch {
    return null;
  }
}

export function setCookieConsent(value) {
  try {
    window.localStorage.setItem(
      KEY,
      JSON.stringify({ v: VERSION, value, date: new Date().toISOString() })
    );
  } catch {
    // Navegación privada o almacenamiento bloqueado: vale solo para esta visita
    memoryValue = value;
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

function subscribe(callback) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

const getSnapshot = () => read() ?? memoryValue;
// En el servidor se asume "sin decidir": nada de terceros se renderiza
const getServerSnapshot = () => undefined;

/** Devuelve "all" | "necessary" | null (sin decidir) | undefined (aún no hidrata). */
export function useCookieConsent() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

/** Abre de nuevo el aviso de cookies (enlace "Preferencias de cookies" del footer). */
export function openCookiePreferences() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export const CONSENT_OPEN_EVENT = OPEN_EVENT;
