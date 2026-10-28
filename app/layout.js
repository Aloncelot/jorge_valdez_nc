import { Open_Sans } from "next/font/google";
import Link from "next/link";
import "../components/globals.css";
import Header from "../components/Header";
import Footer from "../components/Footer";
import MotionProvider from "../components/MotionProvider";
import CookieBanner from "../components/CookieBanner";
import { FaCalendarCheck } from "react-icons/fa";

// Misma tipografía (Open Sans), pero autoalojada por next/font.
// Antes se pedía a Google con 14 @import en los CSS, que bloqueaban el render.
const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  display: "swap",
  variable: "--font-open-sans",
});

export const metadata = {
  title: "Jorge Valdez Rivera N.C. | Nutrición Clínica y Tanatología",
  description: "Cuidado metabólico, psicológico y emocional en la Ciudad de México.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`scroll-smooth ${openSans.variable}`}>
      <body className="font-sans text-[#333] bg-[#f9f9f9]">
        <MotionProvider>
          <Header />

          {/* Este children representa la página que se esté visitando */}
          <main>{children}</main>

          <Footer />
        </MotionProvider>

        {/* Botón Flotante de Agenda: Link para que funcione también desde /about y /reviews */}
        <Link
          href="/#contact"
          className="floating-cta-button"
          title="Agendar Cita"
          aria-label="Agendar Cita"
        >
          <FaCalendarCheck className="floating-icon" />
        </Link>

        {/* Aviso inicial de cookies */}
        <CookieBanner />
      </body>
    </html>
  );
}
