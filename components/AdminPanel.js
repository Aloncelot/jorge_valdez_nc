// components/AdminPanel.js
"use client";
import React, { useState, useEffect } from "react";
import { db, auth } from "../Firebase";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";
import { signOut, onAuthStateChanged } from "firebase/auth";
import AdminLogin from "./AdminLogin";
import ReactStars from "react-stars"; // Importante para ver las estrellas
import "./AdminPanel.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes, FaSignOutAlt, FaClipboardList, FaUserCircle } from "react-icons/fa";

const AdminPanel = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Verificar autenticación y permisos
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (
        user &&
        (user.email === "aloncelot@gmail.com" ||
          user.email === "aloncelot@hotmail.com" ||
          user.email === "jorgevaldezrivera@gmail.com")
      ) {
        setIsAdmin(true);
      } else {
        setIsAdmin(false);
      }
      setCheckingAuth(false);
    });
    return unsubscribeAuth;
  }, []);

  // Cargar reseñas pendientes
  useEffect(() => {
    const fetchPendingReviews = async () => {
      if (!isAdmin) return;
      setLoading(true);
      try {
        const reviewsRef = collection(db, "reviews");
        const q = query(
          reviewsRef,
          where("approved", "==", false),
          where("rejected", "==", false)
        );
        const snapshot = await getDocs(q);
        const reviewsData = snapshot.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }));
        setPendingReviews(reviewsData);
      } catch (err) {
        console.error("Error fetching pending reviews:", err);
        setError("Error al cargar reseñas pendientes.");
      }
      setLoading(false);
    };

    if (isAdmin) {
      fetchPendingReviews();
    }
  }, [isAdmin]);

  // Aprobar
  const approveReview = async (reviewId) => {
    try {
      const ref = doc(db, "reviews", reviewId);
      await updateDoc(ref, { approved: true, rejected: false });
      // Eliminamos de la lista localmente para feedback inmediato
      setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Error approving review:", err);
      alert("Error al aprobar. Intenta de nuevo.");
    }
  };

  // Rechazar
  const rejectReview = async (reviewId) => {
    if(!window.confirm("¿Seguro que deseas rechazar esta reseña?")) return;
    try {
      const ref = doc(db, "reviews", reviewId);
      await updateDoc(ref, { approved: false, rejected: true });
      setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Error rejecting review:", err);
      alert("Error al rechazar.");
    }
  };

  const handleLogout = () => {
    signOut(auth);
  };

  // Mientras verificamos auth, mostramos loader
  if (checkingAuth) {
    return (
      <div className="admin-loading-screen">
        <div className="spinner"></div>
      </div>
    );
  }

  // Si no es admin, mostramos Login
  if (!isAdmin) {
    return <AdminLogin />;
  }

  return (
    <div className="admin-dashboard">
      {/* Header del Dashboard */}
      <header className="dashboard-header">
        <div className="header-content">
          <h2>
            <FaClipboardList className="header-icon" />
            Panel de Moderación
          </h2>
          <div className="user-controls">
            <span className="admin-badge">Administrador</span>
            <button className="btn-logout" onClick={handleLogout}>
              <FaSignOutAlt /> Salir
            </button>
          </div>
        </div>
      </header>

      <main className="dashboard-content">
        <div className="content-container">
          <h3>Reseñas Pendientes de Aprobación</h3>
          
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Cargando reseñas...</p>
            </div>
          ) : error ? (
            <div className="error-banner">{error}</div>
          ) : pendingReviews.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">✓</div>
              <h4>¡Todo al día!</h4>
              <p>No hay reseñas pendientes de moderación.</p>
            </div>
          ) : (
            <div className="reviews-grid">
              <AnimatePresence>
                {pendingReviews.map((review) => (
                  <motion.div 
                    key={review.id} 
                    className="admin-review-card"
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  >
                    <div className="card-top">
                      <div className="user-info">
                        {review.photoURL ? (
                          <img src={review.photoURL} alt="Avatar" />
                        ) : (
                          <FaUserCircle className="default-avatar" />
                        )}
                        <div>
                          <h4>{review.name}</h4>
                          <span className="review-date">
                            {/* Si tienes timestamp de firebase, conviértelo aquí */}
                            {review.createdAt?.toDate().toLocaleDateString() || "Reciente"}
                          </span>
                        </div>
                      </div>
                      <div className="rating-display">
                        <ReactStars
                          count={5}
                          value={review.rating}
                          size={18}
                          edit={false}
                          color2={"#ffd700"}
                        />
                      </div>
                    </div>

                    <div className="card-body">
                      <p>&quot;{review.comment}&quot;</p>
                    </div>

                    <div className="card-actions">
                      <button 
                        className="btn-action btn-reject" 
                        onClick={() => rejectReview(review.id)}
                        title="Rechazar"
                      >
                        <FaTimes /> Rechazar
                      </button>
                      <button 
                        className="btn-action btn-approve" 
                        onClick={() => approveReview(review.id)}
                        title="Aprobar"
                      >
                        <FaCheck /> Aprobar
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminPanel;