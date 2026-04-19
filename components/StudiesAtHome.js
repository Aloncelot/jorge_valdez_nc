// components/StudiesAtHome.js
"use client";
import React from "react";
import "./StudiesAtHome.css";
import { motion } from "framer-motion";
import { 
  FaTint, 
  FaFlask, 
  FaDna, 
  FaMicroscope, 
  FaNotesMedical, 
  FaFileMedicalAlt,
  FaPhoneAlt
} from "react-icons/fa";

const studiesData = [
  {
    title: "Biometría Hemática",
    icon: <FaTint />,
  },
  {
    title: "Química Sanguínea",
    icon: <FaFlask />,
  },
  {
    title: "Hemoglobina Glucosilada",
    icon: <FaDna />,
  },
  {
    title: "Uroanálisis",
    icon: <FaMicroscope />,
  },
  {
    title: "Antígenos Tumorales",
    icon: <FaNotesMedical />,
  },
  {
    title: "Perfiles Hormonales",
    icon: <FaFileMedicalAlt />,
  },
];

// Variantes para la animación en cascada
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

const StudiesAtHome = () => {
  return (
    <section id="studiesathome" className="studies-section">
      <div className="studies-container">
        <h2>Estudios Clínicos a Domicilio</h2>
        <p className="section-subtitle">
          Comodidad y precisión diagnóstica sin salir de casa
        </p>

        {/* Grid de Estudios */}
        <motion.div 
          className="studies-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          {studiesData.map((study, index) => (
            <motion.div 
              key={index} 
              className="study-card"
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <div className="icon-wrapper">
                {study.icon}
              </div>
              <h3>{study.title}</h3>
            </motion.div>
          ))}
        </motion.div>

        {/* Tarjeta de "Más Estudios" convertida en Call to Action */}
        <motion.div 
          className="more-studies-cta"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <div className="cta-icon">
            <FaPhoneAlt />
          </div>
          <div className="cta-text">
            <h4>¿Necesitas otro estudio?</h4>
            <p>Contamos con un catálogo amplio. Pregunte por el que requiera.</p>
          </div>
        </motion.div>

        {/* Partners Section */}
        <div className="partners-section">
          <h3>En alianza con Laboratorios Certificados</h3>
          <div className="partner-logo-wrapper">
            <img src="/BAGC.jpg" alt="Laboratorio BAGC" className="partners-image" loading="lazy" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudiesAtHome;