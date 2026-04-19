// components/Contact.js
"use client";
import React, { useState, useRef, useEffect } from "react";
import emailjs from "emailjs-com";
import "./Contact.css";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaEnvelope, FaClock, FaMapMarkerAlt, FaWhatsapp, FaPaperPlane } from "react-icons/fa";

// Configuración EmailJS
const SERVICE_ID = "jorgevr25";
const TEMPLATE_ID = "template_ynxuuxb";
const PUBLIC_KEY = "ztv3Mk6UFi_dszI7M";

const LocationBox = ({ title, mapSrc, logoSrc, address }) => (
  <motion.div 
    className="location-card"
    whileHover={{ y: -5 }}
    transition={{ duration: 0.3 }}
  >
    <div className="map-wrapper">
      <iframe
        title={`Mapa - ${title}`}
        src={mapSrc}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
    <div className="location-details">
      <div className="logo-container">
        <img src={logoSrc} alt={`${title} Logo`} className="hospital-logo" />
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
  </motion.div>
);

const Contact = () => {
  const form = useRef();
  const [sending, setSending] = useState(false);
  const [feedback, setFeedback] = useState({ type: "", msg: "" });

  useEffect(() => {
    emailjs.init(PUBLIC_KEY);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setFeedback({ type: "", msg: "" });

    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current)
      .then(() => {
        setFeedback({ type: "success", msg: "¡Mensaje enviado! Nos pondremos en contacto pronto." });
        e.target.reset();
      })
      .catch(() => {
        setFeedback({ type: "error", msg: "Hubo un error. Por favor intenta contactarnos por WhatsApp." });
      })
      .finally(() => setSending(false));
  };

  const locations = [
    {
      title: "Hospital Star Médica Luna Parc",
      mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3757.2877094961746!2d-99.21322532405416!3d19.657727133451438!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d21e3669cad269%3A0xdb9ee0f3be58b530!2sHospital%20Star%20M%C3%A9dica%20Luna%20Parc!5e0!3m2!1ses-419!2smx!4v1772164989723!5m2!1ses-419!2smx", 
      logoSrc: "LogoStarMedica2.png", // Asegúrate que esta ruta sea correcta en tu carpeta public
      address: "Av. Primero de Mayo s/n. Col. Centro Urbano, Cuautitlán Izcalli. Consultorio 1418 Piso 14"
    },
    {
      title: "Hospital Star Médica Tlalnepantla",
      mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d60161.6169979666!2d-99.28155630826953!3d19.537274256247787!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d21dae2a60a465%3A0xd8d0e8a8fa4a5162!2sHospital%20Star%20M%C3%A9dica%20Tlalnepantla!5e0!3m2!1ses-419!2smx!4v1772164602588!5m2!1ses-419!2smx",
      logoSrc: "LogoStarMedica2.png",
      address: "Av Sor Juana Inés de La Cruz 280, Fracc. Industrial, San Lorenzo, 54033 Tlalnepantla, Méx. Consultorio 903"
    },
    {
      title: "Hospital Angeles Mocel",
      mapSrc: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3763.0339371638706!2d-99.1847803!3d19.410939600000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x85d1ff5e9cb14657%3A0xed4a8855e9a5502f!2sHospital%20Angeles%20Mocel!5e0!3m2!1ses-419!2smx!4v1772165041457!5m2!1ses-419!2smx",
      logoSrc: "HAM.png",
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
                  <input type="text" name="user_name" placeholder=" " required />
                  <label>Nombre Completo</label>
                </div>
                
                <div className="input-group">
                  <input type="email" name="user_email" placeholder=" " required />
                  <label>Correo Electrónico</label>
                </div>

                <div className="input-group">
                  <textarea name="message" rows="4" placeholder=" " required></textarea>
                  <label>¿En qué podemos ayudarte?</label>
                </div>

                <button type="submit" className="btn-submit" disabled={sending}>
                  {sending ? <span className="loader"></span> : <>Enviar Mensaje <FaPaperPlane /></>}
                </button>
                
                {feedback.msg && (
                  <div className={`feedback-msg ${feedback.type}`}>
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
                  <p><a href="tel:+55554373485">55 5437 3485</a></p>
                  <p><a href="tel:+555538530090">55 3853 0090</a></p>
                </div>
              </div>

              <div className="contact-item">
                <div className="icon-circle"><FaWhatsapp /></div>
                <div>
                  <h4>WhatsApp</h4>
                  <p><a href="https://wa.me/525554373485" target="_blank" rel="noopener noreferrer">Enviar mensaje directo</a></p>
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