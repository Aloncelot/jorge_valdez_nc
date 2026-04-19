"use client";

import Link from "next/link"; // Importación correcta de Next.js
import "./About.css";
import { motion } from "framer-motion";
import { FaArrowRight } from "react-icons/fa";

const About = () => {
  return (
    <section id="about" className="about-section">
      <div className="about-container">
        {/* Título animado */}
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Acerca de Mí
        </motion.h2>

        <div className="about-content">
          {/* Imagen: Entra desde la izquierda */}
          <motion.div 
            className="about-image-wrapper"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <img
              src="JorgeValdez.webp"
              alt="Nutricionista Jorge Valdez"
              className="about-image"
              loading="lazy"
            />
            {/* Elemento decorativo detrás de la foto */}
            <div className="image-backdrop"></div>
          </motion.div>

          {/* Texto: Entra desde la derecha */}
          <motion.div 
            className="about-text-box"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="subtitle-badge">Nutricionista Certificado</span>
            <h3>Jorge Valdez Rivera N.C.</h3>
            
            <div className="divider-line"></div>
            
            <p>
              Nuestra filosofía es cuidar de ti <strong>metabólicamente</strong>, 
              <strong> psicológicamente</strong> y <strong>emocionalmente</strong>.
            </p>
            <p>
              Mi objetivo es llevar al máximo tu metabolismo, trabajando siempre en 
              armonía con tus emociones para lograr resultados sostenibles sin 
              afectaciones clínicas.
            </p>

            <div className="aboutme-button-wrapper">
              {/* Se cambió "to" por "href" */}
              <Link href="/about" className="btn-primary">
                Conocer mi trayectoria
                <FaArrowRight className="btn-icon" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;