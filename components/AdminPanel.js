// components/AdminPanel.js
"use client";
import React, { useState, useEffect } from "react";
import { loadAuth, loadFirestore, isAdminUser } from "../Firebase";
import AdminLogin from "./AdminLogin";
import { Rating } from 'react-simple-star-rating';
import "./AdminPanel.css";
import { m, AnimatePresence } from "framer-motion";
import { FaCheck, FaTimes, FaSignOutAlt, FaClipboardList, FaUserCircle } from "react-icons/fa";

const AdminPanel = () => {
  const [pendingReviews, setPendingReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [denied, setDenied] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  // Verificar autenticación y permisos.
  // Ahora exige correo verificado y cierra la sesión de cuentas no autorizadas.
  // OJO: esto solo controla la interfaz; la protección real está en firestore.rules.
  useEffect(() => {
    let unsubscribeAuth = () => {};
    let alive = true;
    loadAuth().then(({ auth, fa }) => {
      if (!alive) return;
      unsubscribeAuth = fa.onAuthStateChanged(auth, async (user) => {
        if (user && !isAdminUser(user)) {
          await fa.signOut(auth);
          setDenied(true);
          setIsAdmin(false);
        } else {
          setIsAdmin(Boolean(user));
        }
        setCheckingAuth(false);
      });
    });
    return () => {
      alive = false;
      unsubscribeAuth();
    };
  }, []);

  // Cargar reseñas pendientes
  useEffect(() => {
    if (!isAdmin) return;
    let cancelled = false;
    (async () => {
      try {
        const { db, fs } = await loadFirestore();
        const q = fs.query(
          fs.collection(db, "reviews"),
          fs.where("approved", "==", false),
          fs.where("rejected", "==", false)
        );
        const snapshot = await fs.getDocs(q);
        if (cancelled) return;
        setPendingReviews(snapshot.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Error fetching pending reviews:", err);
        if (!cancelled) setError("Error al cargar reseñas pendientes.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isAdmin]);

  const updateReview = async (reviewId, data) => {
    const { db, fs } = await loadFirestore();
    await fs.updateDoc(fs.doc(db, "reviews", reviewId), data);
  };

  // Aprobar
  const approveReview = async (reviewId) => {
    try {
      await updateReview(reviewId, { approved: true, rejected: false });
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
      await updateReview(reviewId, { approved: false, rejected: true });
      setPendingReviews((prev) => prev.filter((r) => r.id !== reviewId));
    } catch (err) {
      console.error("Error rejecting review:", err);
      alert("Error al rechazar.");
    }
  };

  const handleLogout = async () => {
    const { auth, fa } = await loadAuth();
    await fa.signOut(auth);
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
    return <AdminLogin initialError={denied ? "Esta cuenta no tiene acceso al panel." : ""} />;
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
                  <m.div 
                    key={review.id} 
                    className="admin-review-card"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                  >
                    <div className="card-top">
                      <div className="user-info">
                        {review.photoURL ? (
                          <img src={review.photoURL} alt="Avatar" referrerPolicy="no-referrer" />
                        ) : (
                          <FaUserCircle className="default-avatar" />
                        )}
                        <div>
                          <h4>{review.name}</h4>
                          <span className="review-date">
                            {/* Si tienes timestamp de firebase, conviértelo aquí */}
                            {review.createdAt?.toDate ? review.createdAt.toDate().toLocaleDateString("es-MX") : "Reciente"}
                          </span>
                        </div>
                      </div>
                      <div className="rating-display">
                        <Rating
                          initialValue={review.rating} 
                          size={20}
                          readonly={true}
                          allowFraction={true}
                          fillColor="#ffd700"
                          emptyColor="#e5e7eb"
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
                  </m.div>
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