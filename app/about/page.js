// app/about/page.js

import AboutMe from "../../components/AboutMe";
import Maratones from "../../components/Maratones";

export const metadata = {
  title: "Trayectoria Profesional | Jorge Valdez Rivera",
  description: "Conoce los más de 10 años de experiencia clínica y la formación académica de Jorge Valdez Rivera.",
};

export default function AboutPage() {
  return (
    <>
      <AboutMe />
      <Maratones />
    </>
  );
}