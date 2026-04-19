// components/Services.js
"use client";
import React, { useState, useEffect } from "react";
import "./Services.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa"; // Iconos profesionales

const servicesData = [
  {
    title: "Nutrición Clínica",
    description:
      "Soporte Nutricional Artificial Específico, Nutrición Enteral y Parenteral para pacientes hospitalizados o en casa.",
    image: "Nutricionintra.webp",
  },
  {
    title: "Asesoramiento Deportivo",
    description:
      "Estrategias de suplementación y nutrición basadas en marcadores bioquímicos para maximizar el rendimiento.",
    image: "asesoramientodeportivo.webp",
  },
  {
    title: "Control Metabólico",
    description:
      "Programas clínicos efectivos para la pérdida de peso saludable, sostenible y prevención de enfermedades.",
    image: "controlmetabolico.webp",
  },
  {
    title: "Nutrición en Estado Crítico",
    description:
      "Manejo metabólico especializado para diversas patologías agudas y control de comorbilidades complejas.",
    image: "NEP.webp",
  },
  {
    title: "Tanatología y Comportamiento",
    description:
      "Apoyo psicológico integral para afrontar pérdidas y situaciones difíciles, brindando soporte al paciente y su familia.",
    image: "tntg.webp",
  },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 100 : -100,
    opacity: 0,
  }),
};

const Services = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // 1 para derecha, -1 para izquierda
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
  }, [currentIndex]);

  const handleImageLoad = () => {
    setLoading(false);
  };

  const nextService = () => {
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex + 1) % servicesData.length);
  };

  const prevService = () => {
    setDirection(-1);
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + servicesData.length) % servicesData.length
    );
  };

  return (
    <motion.section
      id="services"
      className="services-section"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <h2>Nuestros Servicios</h2>
      <p className="section-subtitle">Atención integral basada en evidencia</p>
      
      <div className="services-container">
        <button 
          className="nav-button prev-button" 
          onClick={prevService}
          aria-label="Servicio anterior"
        >
          <FaChevronLeft />
        </button>

        <div className="service-wrapper">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: "spring", stiffness: 300, damping: 30 },
                opacity: { duration: 0.2 },
              }}
              className="service-box"
            >
              <div className="service-image-container">
                {loading && (
                  <div className="spinner-container">
                    <div className="simple-spinner"></div>
                  </div>
                )}
                <img
                  src={servicesData[currentIndex].image}
                  alt={servicesData[currentIndex].title}
                  onLoad={handleImageLoad}
                  className={loading ? "hidden" : "loaded"}
                />
              </div>
              
              <div className="service-content">
                <h3>{servicesData[currentIndex].title}</h3>
                <div className="divider"></div>
                <p>{servicesData[currentIndex].description}</p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <button 
          className="nav-button next-button" 
          onClick={nextService}
          aria-label="Siguiente servicio"
        >
          <FaChevronRight />
        </button>
      </div>
      
      <div className="carousel-indicators">
        {servicesData.map((_, index) => (
          <span 
            key={index} 
            className={`indicator ${index === currentIndex ? "active" : ""}`}
            onClick={() => {
              setDirection(index > currentIndex ? 1 : -1);
              setCurrentIndex(index);
            }}
          />
        ))}
      </div>
    </motion.section>
  );
};

export default Services;