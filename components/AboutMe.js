"use client";
import "./AboutMe.css";
// 1. Importación nativa de Next.js
import Link from "next/link"; 
import { motion } from "framer-motion";
import { FaArrowLeft, FaUniversity, FaHospital, FaIdCard, FaCheckCircle } from "react-icons/fa";

const AboutMe = () => {
  return (
    <motion.section 
      id="about-me" 
      className="aboutme-section"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="aboutme-container">
        <div className="aboutme-header">
          <h2>Trayectoria Profesional</h2>
          <p className="subtitle">Compromiso, Ciencia y Empatía</p>
        </div>

        <div className="aboutme-content">
          <motion.div 
            className="aboutme-image-wrapper"
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <img
              src="JorgeValdez.webp"
              alt="Lic. Jorge Valdez Rivera"
              className="aboutme-image"
            />
            <div className="experience-badge">
              <span className="years">+10 Años</span>
              <span className="text">Experiencia Clínica</span>
            </div>
          </motion.div>

          <motion.div 
            className="aboutme-text-box"
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <div className="name-header">
              <h3>Jorge Valdez Rivera N.C.</h3>
              <span className="specialty-tag">Nutrición Clínica & Tanatología</span>
            </div>

            <p className="bio-intro">
              Nuestra filosofía es cuidar de ti <strong>metabólicamente</strong>, 
              <strong> psicológicamente</strong> y <strong>emocionalmente</strong>. 
              Mi enfoque busca llevar al máximo tu metabolismo en armonía con tus emociones, 
              sin afectaciones clínicas.
            </p>

            <div className="bio-details">
              <div className="bio-item">
                <FaUniversity className="bio-icon" />
                <p>Egresado de la <strong>Universidad Autónoma del Estado de México</strong>, Facultad de Medicina (UAEM-Toluca).</p>
              </div>
              <div className="bio-item">
                <FaHospital className="bio-icon" />
                <p>Formación clínica de 5 años en Unidad de Terapia Intensiva, <strong>Hospital Angeles Lomas</strong>.</p>
              </div>
              <div className="bio-item">
                <FaCheckCircle className="bio-icon" />
                <p>El 90% de mis pacientes son referidos por especialistas médicos, garantizando un manejo interdisciplinario de alto nivel.</p>
              </div>
            </div>

            <div className="credentials-box">
              <h4>Certificaciones y Cédulas</h4>
              <ul className="credentials-list">
                <li>
                  <FaIdCard className="list-icon" />
                  <span>Certificación NC 11/0590 (Colegio Mexicano de Nutriólogos)</span>
                </li>
                <li>
                  <FaIdCard className="list-icon" />
                  <span>Tanatología Reg. DTL2019-287</span>
                </li>
                <li>
                  <FaIdCard className="list-icon" />
                  <span>Cédula Profesional: 6587086</span>
                </li>
              </ul>
            </div>

            <div className="button-wrapper">
              {/* 2. Se cambió "to" por "href" */}
              <Link href="/" className="btn-back">
                <FaArrowLeft className="btn-icon-left" />
                Volver al Inicio
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutMe;