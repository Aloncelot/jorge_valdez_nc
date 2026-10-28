// components/ContactForm.js
// Envía con la API REST de EmailJS vía fetch: se elimina la dependencia
// emailjs-com (obsoleta) y sus llaves ya no están escritas en el código.
"use client";
import { useRef, useState } from "react";
import { LuSend } from "react-icons/lu";

const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const COOLDOWN_MS = 30_000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default function ContactForm() {
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });
  const lastSent = useRef(0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    // Campo trampa: los bots lo llenan, las personas no lo ven.
    if (data.get("company")) {
      form.reset();
      setFeedback({ type: "success", msg: "¡Mensaje enviado! Nos pondremos en contacto pronto." });
      return;
    }

    const user_name = String(data.get("user_name") || "").trim();
    const user_email = String(data.get("user_email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!user_name || !EMAIL_RE.test(user_email) || message.length < 5) {
      setFeedback({ type: "error", msg: "Revisa tu nombre, correo y mensaje antes de enviar." });
      return;
    }

    if (Date.now() - lastSent.current < COOLDOWN_MS) {
      setFeedback({ type: "error", msg: "Ya recibimos tu mensaje. Espera unos segundos para enviar otro." });
      return;
    }

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error("Faltan variables NEXT_PUBLIC_EMAILJS_* en .env");
      setFeedback({ type: "error", msg: "Hubo un error. Por favor intenta contactarnos por WhatsApp." });
      return;
    }

    setSending(true);
    setFeedback({ type: "", msg: "" });

    try {
      const res = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: SERVICE_ID,
          template_id: TEMPLATE_ID,
          user_id: PUBLIC_KEY,
          template_params: { user_name, user_email, message },
        }),
      });
      if (!res.ok) throw new Error(`EmailJS ${res.status}`);
      lastSent.current = Date.now();
      setFeedback({ type: "success", msg: "¡Mensaje enviado! Nos pondremos en contacto pronto." });
      form.reset();
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", msg: "Hubo un error. Por favor intenta contactarnos por WhatsApp." });
    } finally {
      setSending(false);
    }
  };

  return (
    <form className="ct-form" onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="ct-name">Nombre Completo</label>
        <input
          id="ct-name"
          type="text"
          name="user_name"
          autoComplete="name"
          maxLength={80}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="ct-email">Correo Electrónico</label>
        <input
          id="ct-email"
          type="email"
          name="user_email"
          autoComplete="email"
          inputMode="email"
          maxLength={120}
          required
        />
      </div>

      <div className="field">
        <label htmlFor="ct-msg">¿En qué podemos ayudarte?</label>
        <textarea id="ct-msg" name="message" rows={5} minLength={5} maxLength={2000} required />
      </div>

      <div className="hp-field" aria-hidden="true">
        <label htmlFor="ct-company">Empresa</label>
        <input id="ct-company" type="text" name="company" tabIndex={-1} autoComplete="off" />
      </div>

      <button type="submit" className="btn btn-primary ct-submit" disabled={sending}>
        {sending ? (
          <>
            <span className="spinner spinner-sm" aria-hidden="true" />
            Enviando...
          </>
        ) : (
          <>
            Enviar Mensaje <LuSend aria-hidden="true" />
          </>
        )}
      </button>

      <div aria-live="polite">
        {feedback.msg && (
          <p className={`notice ${feedback.type === "success" ? "notice-ok" : "notice-error"}`}>
            {feedback.msg}
          </p>
        )}
      </div>
    </form>
  );
}
