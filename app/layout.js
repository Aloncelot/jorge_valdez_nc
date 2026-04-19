import "../components/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { FaCalendarCheck } from "react-icons/fa";

export const metadata = {
  title: "Jorge Valdez Rivera N.C. | Nutrición Clínica y Tanatología",
  description: "Cuidado metabólico, psicológico y emocional en la Ciudad de México.",
  icons: {
    icon: "/favicon.ico", // Coloca tu favicon en la carpeta /public
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="scroll-smooth">
      <body className="font-sans text-[#333] bg-[#f9f9f9]">
        <Header />
        
        {/* Este children representa la página que se esté visitando */}
        <main>{children}</main>
        
        <Footer />

        {/* Botón Flotante de Agenda (Adaptado de tu AppRoutes) */}
        <a 
          href="#contact" 
          className="floating-cta-button" 
          title="Agendar Cita"
          aria-label="Agendar Cita"
        >
          <FaCalendarCheck className="floating-icon" />
        </a>
      </body>
    </html>
  );
}