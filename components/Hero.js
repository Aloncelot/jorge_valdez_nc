// components/Hero.js
"use client";
import React from "react";
import "./Hero.css";
import { motion } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";

const Hero = () => {
  return (
    <section id="hero" className="hero-section">
      {/* Ya no hay overlay que tape la imagen */}

      <motion.div 
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1>Jorge Valdez Rivera <span className="highlight">N.C.</span></h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Nutrición Clínica / Tanatología / Ciencias del Comportamiento Humano
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a href="#contact" className="btn-hero">
            <FaCalendarAlt className="btn-icon" />
            Agenda tu cita
          </a>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;