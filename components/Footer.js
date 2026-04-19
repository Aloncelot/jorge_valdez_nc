import React from "react";
import "./Footer.css";
import { FaFacebookF, FaWhatsapp, FaPhoneAlt, FaEnvelope, FaLock, FaTerminal } from "react-icons/fa";
import Link from "next/link"; // <-- Importación correcta de Next.js

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-content">
        <div className="footer-column brand-column">
          <h3 className="footer-logo">Jorge Valdez Rivera N.C.</h3>
          <p className="footer-mission">
            Comprometido con tu salud a través de planes nutricionales 
            personalizados y basados en ciencia.
          </p>
          <div className="social-icons">
            <a href="https://facebook.com/Nutricionjorge" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <FaFacebookF />
            </a>
            <a href="https://wa.me/5554373485" target="_blank" rel="noopener noreferrer" aria-label="WhatsApp">
              <FaWhatsapp />
            </a>
          </div>
        </div>

        <div className="footer-column links-column">
          <h4>Explorar</h4>
          <ul>
            {/* Cambiamos 'to' por 'href' */}
            <li><Link href="/">Inicio</Link></li>
            <li><Link href="/about">Acerca de mi</Link></li>
          </ul>
        </div>

        <div className="footer-column contact-column">
          <h4>Contacto</h4>
          <ul className="contact-list">
            <li>
              <FaPhoneAlt className="icon" />
              <span>(55) 5437-3485</span>
            </li>
            <li>
              <FaEnvelope className="icon" />
              <span>jorgevaldezrivera@gmail.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>
            &copy; {currentYear} Jorge Valdez Rivera N.C. Todos los derechos reservados.
          </p>

          <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
            <a 
              href="https://quasar-devs.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="admin-link-discrete"
              style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
            >
              <FaTerminal style={{ fontSize: "0.9em" }} />
              Built by QUASAR DEVS
            </a>

            <Link href="/admin-login" className="admin-link-discrete">
              <FaLock style={{ marginRight: "5px", fontSize: "0.8em" }} /> 
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;