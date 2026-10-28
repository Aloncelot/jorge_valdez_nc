// components/Maratones.js
// Mismo diseño y animación que antes. Cambios de rendimiento:
// - El desplazamiento infinito ahora es una animación CSS (corre en la GPU)
//   en lugar de framer-motion recalculando 27 tarjetas en JavaScript.
// - Escritorio/móvil se decide con media queries: se eliminan los dos
//   listeners de resize duplicados y el desajuste de hidratación en móvil.
// - Imágenes optimizadas con next/image (algunas pesaban hasta 2500 px).
"use client";
import React from "react";
import Image from "next/image";
import "./Maratones.css";
import { m } from "framer-motion";
import img2019 from "../public/2019.webp";
import imgGlobal from "../public/abbott-world-marathon-majors-launches-global-run-club.webp";
import imgChicago from "../public/CH Marathon.jpg";
import img2021 from "../public/2021.jpg";
import img2022 from "../public/2022.png";
import img2023 from "../public/2023.png";
import imgTokyo from "../public/Tokyo Marathon.jpg";
import img2024 from "../public/2024.png";
import imgBerlin from "../public/berlin_logo.svg";
import imgWMM from "../public/World-Marathon-Majors.jpg";

const marathonsData = [
  {
    title: "Edición XXXVII del Maratón de la Ciudad de México",
    date: "Agosto 2019",
    image: img2019,
  },
  {
    title: "Abbott WMM Global Run Club Plataforma virtual",
    date: "Noviembre 2020",
    image: imgGlobal,
    extraImage: imgWMM,
  },
  {
    title: "Abbot World Marathon Majors Maratón de Chicago",
    date: "Octubre 2021",
    image: imgChicago,
    extraImage: imgWMM,
  },
  {
    title: "Edición XXXVIII MARATÓN DE LA CIUDAD DE MÉXICO",
    date: "Noviembre 2021",
    image: img2021,
  },
  {
    title: "Edición XXXIX MARATÓN DE LA CIUDAD DE MÉXICO",
    date: "Agosto 2022",
    image: img2022,
  },
  {
    title: "Edición XL MARATÓN DE LA CIUDAD DE MÉXICO",
    date: "Agosto 2023",
    image: img2023,
  },
  {
    title: "Abbott World Marathon Majors Maratón de Tokio",
    date: "Marzo 2024",
    image: imgTokyo,
    extraImage: imgWMM,
  },
  {
    title: "Edición XLI MARATÓN DE LA CIUDAD DE MÉXICO",
    date: "Agosto 2024",
    image: img2024,
  },
  {
    title: "Berlín Marathon 2025",
    date: "Septiembre 2025",
    image: imgBerlin,
    extraImage: imgWMM,
  },
];

// 3 copias para el bucle infinito en escritorio; en móvil el CSS oculta las copias.
const loopedMarathons = [0, 1, 2].flatMap((copy) =>
  marathonsData.map((item, i) => ({ ...item, copy, key: `${copy}-${i}` }))
);

const Maratones = () => {
  return (
    <m.section
      id="maratones"
      className="maratones-section"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8 }}
    >
      <h2>Maratones</h2>
      <p>Maratones en los que he participado</p>

      <div className="carousel-container fade-mask">
        <div className="maratones-carousel swipe-enabled">
          <div className="maratones-inner infinite-scroll">
            {loopedMarathons.map((marathon) => (
              <div
                className={`maraton-card${marathon.copy > 0 ? " maraton-dup" : ""}`}
                key={marathon.key}
                aria-hidden={marathon.copy > 0 ? "true" : undefined}
              >
                <Image src={marathon.image} alt={marathon.title} sizes="300px" />
                {marathon.extraImage && (
                  <Image
                    src={marathon.extraImage}
                    alt="Abbott World Marathon Majors"
                    className="extra-image"
                    sizes="80px"
                  />
                )}
                <h3>{marathon.title}</h3>
                <p className="date">{marathon.date}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </m.section>
  );
};

export default Maratones;
