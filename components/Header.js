"use client";
import React, { useState, useEffect } from "react";
// 1. Importaciones nativas de Next.js
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import "./Header.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes } from "react-icons/fa";

const Header = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHeaderVisible, setIsHeaderVisible] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  
  // 2. Hooks de enrutamiento de Next.js
  const router = useRouter();
  const pathname = usePathname();

  const navLinks = [
    { href: "#hero", text: "Inicio" },
    { href: "#about", text: "Acerca de Mí" },
    { href: "#services", text: "Servicios" },
    { href: "#reviewform", text: "Testimonios" }, 
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setIsHeaderVisible(false);
      } else {
        setIsHeaderVisible(true);
      }

      setIsScrolled(currentScrollY > 20);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false); 
    
    const targetId = href.substring(1);

    // 3. Lógica de navegación simplificada
    if (pathname !== "/") {
      // Si estamos en /about o /reviews, navegamos al inicio con el hash
      router.push(`/#${targetId}`);
    } else {
      // Si ya estamos en el inicio, hacemos el scroll suave
      const element = document.getElementById(targetId);
      if (element) {
        const headerOffset = 80; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.scrollY - headerOffset;
        window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      } else if (href === "#hero") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    }
  };

  return (
    <header 
      className={`header ${!isHeaderVisible ? "header-hidden" : ""} ${isScrolled ? "header-scrolled" : ""}`}
    >
      <nav className="navbar">
        <div className="logo">
          <a href="#hero" onClick={(e) => handleLinkClick(e, "#hero")}>
            Jorge Valdez Rivera <span className="logo-suffix">N.C.</span>
          </a>
        </div>

        <ul className="nav-links">
          {navLinks.map((link, index) => (
            <li key={index}>
              <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)}>
                {link.text}
              </a>
            </li>
          ))}         
        </ul>

        <div className="hamburger" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </div>
      </nav>

      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              className="mobile-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div
              className="mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "tween", duration: 0.3 }}
            >
              <div className="mobile-header">
                <span>Menú</span>
                <button onClick={() => setIsMobileMenuOpen(false)}><FaTimes /></button>
              </div>
              
              <ul className="mobile-links">
                {navLinks.map((link, index) => (
                  <li key={index}>
                    <a href={link.href} onClick={(e) => handleLinkClick(e, link.href)}>
                      {link.text}
                    </a>
                  </li>
                ))}
                <li className="mobile-divider"></li>
                {/* 4. Uso de Link de Next.js para rutas internas */}
                <li><Link href="/admin-login" className="mobile-admin" onClick={() => setIsMobileMenuOpen(false)}>Acceso Admin</Link></li>
              </ul>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;