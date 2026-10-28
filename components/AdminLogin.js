"use client";
import React, { useState } from "react";
// 1. Corregida la importación: Solo sacamos useRouter de aquí
import { useRouter } from "next/navigation"; 
import { loadAuth, isAdminUser } from "../Firebase";
import "./AdminLogin.css";
import { m } from "framer-motion";
import { FaGoogle, FaUserShield, FaLock, FaEnvelope, FaArrowLeft } from "react-icons/fa";
// 2. Aquí se queda la importación correcta de Link
import Link from "next/link"; 

const NOT_ALLOWED = "Esta cuenta no tiene acceso al panel.";

const AdminLogin = ({ initialError = "" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(initialError);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Solo cuentas autorizadas y con correo verificado entran al panel
  const afterLogin = async (user, auth, fa) => {
    if (!isAdminUser(user)) {
      await fa.signOut(auth);
      setError(NOT_ALLOWED);
      return;
    }
    router.push("/admin");
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const { auth, fa } = await loadAuth();
      const { user } = await fa.signInWithEmailAndPassword(auth, email.trim(), password);
      await afterLogin(user, auth, fa);
    } catch (err) {
      console.error("Firebase login error:", err?.code || err);
      setError("Credenciales incorrectas o acceso no autorizado.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const { auth, fa } = await loadAuth();
      const { user } = await fa.signInWithPopup(auth, new fa.GoogleAuthProvider());
      await afterLogin(user, auth, fa);
    } catch (err) {
      if (err?.code !== "auth/popup-closed-by-user") {
        console.error("Firebase Google login error:", err?.code || err);
        setError("Error al autenticar con Google.");
      }
    } finally {
      setLoading(false);
    }
  };

  // Precarga Firebase Auth para que el popup de Google no sea bloqueado
  const warmAuth = () => {
    loadAuth().catch(() => {});
  };

  return (
    <div className="admin-login-page">
      <div className="background-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>

      <div className="admin-container">
        <m.div
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

          <form onSubmit={handleEmailLogin} className="admin-form" onFocus={warmAuth}>
            <div className="input-group">
              <FaEnvelope className="input-icon" />
              <input
                type="email"
                autoComplete="username"
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
                autoComplete="current-password"
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

          <button type="button" onClick={handleGoogleLogin} onPointerEnter={warmAuth} className="btn-google" disabled={loading}>
            <FaGoogle className="google-icon" />
            Google Admin
          </button>

          <div className="back-link">
            {/* 3. Cambiamos "to" por "href" para Next.js */}
            <Link href="/">
              <FaArrowLeft /> Volver al Sitio Principal
            </Link>
          </div>
        </m.div>
      </div>
    </div>
  );
};

export default AdminLogin;