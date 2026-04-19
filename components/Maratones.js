// components/Maratones.js
"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import "./Maratones.css";
import { motion } from "framer-motion";

const marathonsData = [
  {
    title: "Edición XXXVII del Maratón de la Ciudad de México",
    date: "Agosto 2019",
    image: "2019.webp",
  },
  {
    title: "Abbott WMM Global Run Club Plataforma virtual",
    date: "Noviembre 2020",
    image: "abbott-world-marathon-majors-launches-global-run-club.webp",
    extraImage: "World-Marathon-Majors.jpg",
  },
  {
    title: "Abbot World Marathon Majors Maratón de Chicago",
    date: "Octubre 2021",
    image: "CH Marathon.jpg",
    extraImage: "World-Marathon-Majors.jpg",
  },
  {
    title: "Edición XXXVIII MARATÓN DE LA CIUDAD DE MÉXICO",
    date: "Noviembre 2021",
    image: "2021.jpg",
  },
  {
    title: "Edición XXXIX MARATÓN DE LA CIUDAD DE MÉXICO",
    date: "Agosto 2022",
    image: "2022.png",
  },
  {
    title: "Edición XL MARATÓN DE LA CIUDAD DE MÉXICO",
    date: "Agosto 2023",
    image: "2023.png",
  },
  {
    title: "Abbott World Marathon Majors Maratón de Tokio",
    date: "Marzo 2024",
    image: "Tokyo Marathon.jpg",
    extraImage: "World-Marathon-Majors.jpg",
  },
  {
    title: "Edición XLI MARATÓN DE LA CIUDAD DE MÉXICO",
    date: "Agosto 2024",
    image: "2024.png",
  },
  {
    title: "Berlín Marathon 2025",
    date: "Septiembre 2025",
    image: "berlin_logo.svg",
    extraImage: "World-Marathon-Majors.jpg",
  },
];

const Maratones = () => {
  const [isMobile, setIsMobile] = useState(false); // Por defecto asumimos escritorio en el servidor

useEffect(() => {
  // Esta función comprueba el tamaño de la pantalla
  const checkMobile = () => {
    setIsMobile(window.innerWidth < 768);
  };

  // 1. La ejecutamos una vez al montar el componente en el navegador
  checkMobile();

  // 2. Escuchamos si el usuario redimensiona la ventana
  window.addEventListener("resize", checkMobile);
  
  // 3. Limpiamos el evento al desmontar
  return () => window.removeEventListener("resize", checkMobile);
}, []);
  const carouselRef = useRef(null);

  const CARD_WIDTH_WITH_GAP = 378; 

  const loopedMarathons = useMemo(() => {
    return [...marathonsData, ...marathonsData, ...marathonsData];
  }, []);

  const singleSetWidth = marathonsData.length * CARD_WIDTH_WITH_GAP;

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <motion.section
      id="maratones"
      className="maratones-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <h2>Maratones</h2>
      <p>Maratones en los que he participado</p>

      <div className="carousel-container fade-mask" ref={carouselRef}>
        <div className={`maratones-carousel ${isMobile ? "swipe-enabled" : ""}`}>
          {isMobile ? (
            <div className="maratones-inner infinite-scroll">
              {marathonsData.map((marathon, index) => (
                <div className="maraton-card" key={index}>
                  <img src={marathon.image} alt={marathon.title} loading="lazy" />
                  {marathon.extraImage && (
                    <img
                      src={marathon.extraImage}
                      alt="extra"
                      className="extra-image"
                      loading="lazy"
                    />
                  )}
                  <h3>{marathon.title}</h3>
                  <p className="date">{marathon.date}</p>
                </div>
              ))}
            </div>
          ) : (
            <motion.div
              className="maratones-inner infinite-scroll"
              animate={{ x: [0, -singleSetWidth] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 35,
              }}
            >
              {loopedMarathons.map((marathon, index) => (
                <div className="maraton-card" key={index}>
                  <img src={marathon.image} alt={marathon.title} loading="lazy" />
                  {marathon.extraImage && (
                    <img
                      src={marathon.extraImage}
                      alt="extra"
                      className="extra-image"
                      loading="lazy"
                    />
                  )}
                  <h3>{marathon.title}</h3>
                  <p className="date">{marathon.date}</p>
                </div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </motion.section>
  );
};

export default Maratones;