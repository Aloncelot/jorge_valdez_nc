// components/Hero.js
"use client";
import React from "react";
import "./Hero.css";
import { m } from "framer-motion";
import { FaCalendarAlt } from "react-icons/fa";

const Hero = () => {
  return (
    <section id="hero" className="hero-section">
      {/* Ya no hay overlay que tape la imagen */}

      <m.div 
        className="hero-content"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <m.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          <h1>Jorge Valdez Rivera <span className="highlight">N.C.</span></h1>
        </m.div>

        <m.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Nutrición Clínica / Tanatología / Ciencias del Comportamiento Humano
        </m.p>

        <m.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <a href="#contact" className="btn-hero">
            <FaCalendarAlt className="btn-icon" />
            Agenda tu cita
          </a>
        </m.div>
      </m.div>
    </section>
  );
};

export default Hero;