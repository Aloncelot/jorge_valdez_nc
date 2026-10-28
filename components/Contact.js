// components/Contact.js
"use client";
import React, { useState, useRef } from "react";
import Link from "next/link";
import { useCookieConsent } from "./consent";
import "./Contact.css";
import { m } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaClock, FaMapMarkerAlt, FaWhatsapp, FaPaperPlane } from "react-icons/fa";

import { PHONES, WHATSAPP_URL } from "./siteData";

// Configuración EmailJS: ahora se lee de .env (antes estaba escrita en el código).
// Se envía con la API REST de EmailJS; se elimina la librería emailjs-com (obsoleta).
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

const COOLDOWN_MS = 30000;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const MSG_OK = "¡Mensaje enviado! Nos pondremos en contacto pronto.";
const MSG_ERR = "Hubo un error. Por favor intenta contactarnos por WhatsApp.";

// Campo trampa anti-spam: invisible para personas, los bots lo llenan.
const honeypotStyle = { position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" };

// El mapa de Google instala cookies de terceros: solo se carga si el visitante
// aceptó todas las cookies o si pide ver este mapa en particular.
const MapEmbed = ({ title, mapSrc }) => {
  const consent = useCookieConsent();
  const [forced, setForced] = useState(false);

  if (consent === "all" || forced) {
    return (
      <iframe
        title={`Mapa - ${title}`}
        src={mapSrc}
        allowFullScreen
        loading="lazy"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    );
  }

  return (
    <div className="map-placeholder">
      <FaMapMarkerAlt className="map-placeholder-icon" aria-hidden="true" />
      <p>El mapa usa cookies de Google.</p>
      <button type="button" onClick={() => setForced(true)}>
        Mostrar mapa<span className="visually-hidden"> de {title}</span>
      </button>
    </div>
  );
};

const LocationBox = ({ title, mapSrc, logoSrc, address }) => (
  <m.div 
    className="location-card"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
  >
    <div className="map-wrapper">
      <MapEmbed title={title} mapSrc={mapSrc} />
    </div>
    <div className="location-details">
      <div className="logo-container">
        <img src={logoSrc} alt={`${title} Logo`} className="hospital-logo" loading="lazy" decoding="async" />
      </div>
      <h4>{title}</h4>
      <p className="location-address">{address}</p>
      <a 
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(title)}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="btn-directions"
      >
        <FaMapMarkerAlt /> Ver en Mapa
      </a>
    </div>
  </m.div>
);

const Contact = () => {
  const form = useRef();
  const lastSent = useRef(0);
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formEl = e.currentTarget;
    const data = new FormData(formEl);

    if (data.get("company")) {
      // Bot detectado: se simula éxito y no se envía nada
      formEl.reset();
      setFeedback({ type: "success", msg: MSG_OK });
      return;
    }

    const user_name = String(data.get("user_name") || "").trim();
    const user_email = String(data.get("user_email") || "").trim();
    const message = String(data.get("message") || "").trim();

    if (!data.get("privacy")) {
      setFeedback({ type: "error", msg: "Para enviar tu mensaje, acepta el Aviso de Privacidad." });
      return;
    }

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
      setFeedback({ type: "error", msg: MSG_ERR });
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
      setFeedback({ type: "success", msg: MSG_OK });
      formEl.reset();
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", msg: MSG_ERR });
    } finally {
      setSending(false);
    }
  };

  const locations = [
    {
      title: "Hospital Star Médica Luna Parc",
      mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3757.2877094961746!2d-99.21322532405416!3d19.657727133451438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d21e3669cad269%3A0xdb9ee0f3be58b530!2sHospital%20Star%20M%C3%A9dica%20Luna%20Parc!5e0!3m2!1ses-419!2smx!4v1772164989723!5m2!1ses-419!2smx", 
      logoSrc: "/LogoStarMedica2.png", // Asegúrate que esta ruta sea correcta en tu carpeta public
      address: "Av. Primero de Mayo s/n. Col. Centro Urbano, Cuautitlán Izcalli. Consultorio 1418 Piso 14"
    },
    {
      title: "Hospital Star Médica Tlalnepantla",
      mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60161.6169979666!2d-99.28155630826953!3d19.537274256247787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d21dae2a60a465%3A0xd8d0e8a8fa4a5162!2sHospital%20Star%20M%C3%A9dica%20Tlalnepantla!5e0!3m2!1ses-419!2smx!4v1772164602588!5m2!1ses-419!2smx",
      logoSrc: "/LogoStarMedica2.png",
      address: "Av Sor Juana Inés de La Cruz 280, Fracc. Industrial, San Lorenzo, 54033 Tlalnepantla, Méx. Consultorio 903"
    },
    {
      title: "Hospital Angeles Mocel",
      mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.0339371638706!2d-99.1847803!3d19.410939600000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff5e9cb14657%3A0xed4a8855e9a5502f!2sHospital%20Angeles%20Mocel!5e0!3m2!1ses-419!2smx!4v1772165041457!5m2!1ses-419!2smx",
      logoSrc: "/HAM.png",
      address: "Torre Médica Mocel, Gelati 33, San Miguel Chapultepec. Consultorio 202"
    },
  ];

  return (
    <section id="contact" className="contact-section">
      <div className="contact-container">
        
        {/* Header de Sección */}
        <div className="section-header">
          <h2>Contacto y Citas</h2>
          <p className="subtitle">Agenda tu consulta o envíanos tus dudas</p>
        </div>

        <div className="contact-wrapper">
          {/* Columna Izquierda: Formulario */}
          <div className="form-column">
            <div className="form-card">
              <h3>Envíanos un mensaje</h3>
              <form ref={form} className="contact-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input type="text" name="user_name" placeholder=" " autoComplete="name" maxLength={80} required />
                  <label>Nombre Completo</label>
                </div>
                
                <div className="input-group">
                  <input type="email" name="user_email" placeholder=" " autoComplete="email" maxLength={120} required />
                  <label>Correo Electrónico</label>
                </div>

                <div className="input-group">
                  <textarea name="message" rows="4" placeholder=" " minLength={5} maxLength={2000} required></textarea>
                  <label>¿En qué podemos ayudarte?</label>
                </div>

                <p className="privacy-note">
                  Usaremos tu nombre y correo solo para responder tu mensaje. Por favor no incluyas
                  información de salud: la revisaremos en consulta.
                </p>

                <label className="privacy-check">
                  <input type="checkbox" name="privacy" required />
                  <span>
                    He leído y acepto el{" "}
                    <Link href="/aviso-de-privacidad" target="_blank">Aviso de Privacidad</Link>.
                  </span>
                </label>

                <div style={honeypotStyle} aria-hidden="true">
                  <label htmlFor="ct-company">Empresa</label>
                  <input id="ct-company" type="text" name="company" tabIndex={-1} autoComplete="off" />
                </div>

                <button type="submit" className="btn-submit" disabled={sending}>
                  {sending ? <span className="loader"></span> : <>Enviar Mensaje <FaPaperPlane /></>}
                </button>
                
                {feedback.msg && (
                  <div className={`feedback-msg ${feedback.type}`} role="status">
                    {feedback.msg}
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Columna Derecha: Info Directa */}
          <div className="info-column">
            <div className="info-card">
              <h3>Información Directa</h3>
              
              <div className="contact-item">
                <div className="icon-circle"><FaPhoneAlt /></div>
                <div>
                  <h4>Citas y Urgencias</h4>
                  <p><a href={PHONES[0].href}>55 5437 3485</a></p>
                  <p><a href={PHONES[1].href}>55 3853 0090</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-circle"><FaWhatsapp /></div>
                <div>
                  <h4>WhatsApp</h4>
                  <p><a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer">Enviar mensaje directo</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-circle"><FaEnvelope /></div>
                <div>
                  <h4>Correo Electrónico</h4>
                  <p><a href="mailto:jorgevaldezrivera@gmail.com">jorgevaldezrivera@gmail.com</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-circle"><FaClock /></div>
                <div>
                  <h4>Horario de Atención</h4>
                  <p>Lunes a Sábado (Previa Cita)</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sección de Ubicaciones */}
        <div className="locations-section">
          <h3>Nuestras Ubicaciones</h3>
          <div className="locations-grid">
            {locations.map((loc, index) => (
              <LocationBox key={index} {...loc} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;