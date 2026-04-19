"use client";
import React, { useState } from "react";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
// 1. Corregida la importación: Solo sacamos useRouter de aquí
import { useRouter } from "next/navigation"; 
import { auth } from "../Firebase";
import "./AdminLogin.css";
import { motion } from "framer-motion";
import { FaGoogle, FaUserShield, FaLock, FaEnvelope, FaArrowLeft } from "react-icons/fa";
// 2. Aquí se queda la importación correcta de Link
import Link from "next/link"; 

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/admin");
    } catch (err) {
      console.error("Firebase login error:", err);
      setError("Credenciales incorrectas o acceso no autorizado.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    setLoading(true);
    setError("");
    try {
      await signInWithPopup(auth, provider);
      router.push("/admin");
    } catch (err) {
      console.error("Firebase Google login error:", err);
      setError("Error al autenticar con Google.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="admin-container">
        <motion.div
          className="admin-card"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="admin-header">
            <div className="icon-wrapper">
              <FaUserShield />
            </div>
            <h2>Panel de Administración</h2>
            <p>Acceso exclusivo para personal autorizado</p>
          </div>

          <form onSubmit={handleEmailLogin} className="admin-form">
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                placeholder=" "
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <label>Correo Electrónico</label>
            </div>

            <div className="input-group">
              <FaLock className="input-icon" />
              <input
                type="password"
                placeholder=" "
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <label>Contraseña</label>
            </div>

            {error && <div className="error-msg">{error}</div>}

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? "Verificando..." : "Ingresar al Panel"}
            </button>
          </form>
          
          <div className="divider">
            <span>o acceder con</span>
          </div>

          <button onClick={handleGoogleLogin} className="btn-google" disabled={loading}>
            <FaGoogle className="google-icon" />
            Google Admin
          </button>

          <div className="back-link">
            {/* 3. Cambiamos "to" por "href" para Next.js */}
            <Link href="/">
              <FaArrowLeft /> Volver al Sitio Principal
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default AdminLogin;