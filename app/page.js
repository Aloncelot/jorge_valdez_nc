import Hero from "../components/Hero";
import About from "../components/About";
import Services from "../components/Services";
import StudiesAtHome from "../components/StudiesAtHome";
import Contact from "../components/Contact";
import ReviewForm from "../components/ReviewForm";

export default function Home() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <StudiesAtHome />
      <Contact />
      <ReviewForm />
    </>
  );
}