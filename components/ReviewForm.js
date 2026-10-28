"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link"; 
import { Rating } from 'react-simple-star-rating';
import { loadFirestore, loadAuth } from "../Firebase";
import "./ReviewForm.css";
import { m, AnimatePresence } from "framer-motion";
import { FaGoogle, FaPaperPlane, FaUserCircle, FaQuoteLeft } from "react-icons/fa";

const NAME_MAX = 60;
const COMMENT_MAX = 1000;
const honeypotStyle = { position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" };

const ReviewForm = () => {
  const sectionRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [website, setWebsite] = useState(""); // campo trampa anti-spam
  const [privacyAccepted, setPrivacyAccepted] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Antes: escucha en tiempo real de TODAS las reseñas aprobadas al abrir la
  // página. Ahora: Firestore se descarga cuando la sección se acerca a la
  // pantalla y se piden solo las 3 que se muestran.
  const fetchLatest = useCallback(async () => {
    try {
      const { db, fs } = await loadFirestore();
      const q = fs.query(
        fs.collection(db, "reviews"),
        fs.where("approved", "==", true),
        fs.orderBy("createdAt", "desc"),
        fs.limit(3)
      );
      const snapshot = await fs.getDocs(q);
      setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    } catch (err) {
      console.error("Error fetching reviews:", err);
      setError("No se pudieron cargar las reseñas.");
    }
  }, []);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      const t = setTimeout(fetchLatest, 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          io.disconnect();
          fetchLatest();
        }
      },
      { rootMargin: "600px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [fetchLatest]);

  // Precarga Auth al acercar el puntero para que el popup de Google
  // se abra dentro del clic y el navegador no lo bloquee.
  const warmAuth = () => {
    loadAuth().catch(() => {});
  };

  // Iniciar sesión con Google
  const handleGoogleSignIn = async () => {
    try {
      const { auth, fa } = await loadAuth();
      const { user } = await fa.signInWithPopup(auth, new fa.GoogleAuthProvider());
      setUser(user);
      setName((user.displayName || "").slice(0, NAME_MAX));
    } catch (err) {
      if (err?.code === "auth/popup-closed-by-user") return;
      console.error("Google sign in error:", err);
      setError("Error al iniciar sesión con Google.");
    }
  };

  const cleanName = name.trim().slice(0, NAME_MAX);
  const cleanComment = comment.trim().slice(0, COMMENT_MAX);

  // Enviar reseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid || isLoading) return;
    if (website) {
      setSubmitted(true);
      return;
    }
    setIsLoading(true);
    try {
      const { db, fs } = await loadFirestore();
      await fs.addDoc(fs.collection(db, "reviews"), {
        name: cleanName,
        rating,
        comment: cleanComment,
        approved: false,
        rejected: false,
        createdAt: fs.serverTimestamp(),
        photoURL: user?.photoURL || null,
        provider: user ? "google" : "email",
        uid: user ? user.uid : null,
      });
      setSubmitted(true);
      setRating(0);
      setComment("");
      setPrivacyAccepted(false);
      setError("");
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Error al enviar la reseña. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid =
    cleanName.length >= 2 &&
    rating > 0 &&
    rating <= 5 &&
    cleanComment.length >= 5 &&
    privacyAccepted;

  return (
    <section id="reviewform" className="reviews-section" ref={sectionRef}>
      <div className="reviews-container">
        
        <div className="section-header">
          <h2>Opiniones de nuestros pacientes</h2>
          <p className="subtitle">Tu salud y satisfacción son nuestra prioridad</p>
        </div>

        <div className="reviews-layout">
          {/* Columna Izquierda: Formulario */}
          <div className="form-column">
            <div className="form-card">
              
              {!submitted ? (
                <>
                  <div className="form-header">
                    <h3>Comparte tu experiencia</h3>
                    <p>Tu opinión nos ayuda a mejorar cada día.</p>
                  </div>

                  {!user && (
                    <button type="button" onClick={handleGoogleSignIn} onPointerEnter={warmAuth} onFocus={warmAuth} className="btn-google">
                      <FaGoogle className="google-icon" />
                      Continuar con Google
                    </button>
                  )}

                  {user && (
                    <div className="user-badge">
                      <img src={user.photoURL} alt={user.displayName} referrerPolicy="no-referrer" />
                      <span>{user.displayName}</span>
                    </div>
                  )}

                  <div className="divider-text">
                    <span>{user ? "Detalles de tu reseña" : "o escribe manualmente"}</span>
                  </div>

                  <form onSubmit={handleSubmit} className="review-form">
                    {!user && (
                      <div className="input-group">
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder=" "
                          maxLength={NAME_MAX}
                          autoComplete="name"
                          required
                        />
                        <label htmlFor="name">Tu Nombre</label>
                      </div>
                    )}

                    <div className="rating-group">
                      <label>Calificación:</label>
                      <Rating
                        onClick={setRating}
                        initialValue={rating}
                        ratingValue={rating}
                        size={36}
                        allowFraction={true} 
                        fillColor="#ffd700" 
                        emptyColor="#e5e7eb" 
                        transition={true} 
                      />
                    </div>

                    <div className="input-group">
                      <textarea
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        placeholder=" "
                        rows="4"
                        maxLength={COMMENT_MAX}
                        required
                      />
                      <label>Escribe tu comentario...</label>
                    </div>

                    <p className="privacy-note">
                      Si se aprueba, tu nombre, calificación y comentario (y tu foto de perfil si
                      usas Google) se publicarán en este sitio. No incluyas datos de salud que no
                      quieras hacer públicos.
                    </p>

                    <label className="privacy-check">
                      <input
                        type="checkbox"
                        checked={privacyAccepted}
                        onChange={(e) => setPrivacyAccepted(e.target.checked)}
                        required
                      />
                      <span>
                        He leído y acepto el{" "}
                        <Link href="/aviso-de-privacidad" target="_blank">Aviso de Privacidad</Link>.
                      </span>
                    </label>

                    <div style={honeypotStyle} aria-hidden="true">
                      <label htmlFor="rv-website">Sitio web</label>
                      <input
                        id="rv-website"
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={website}
                        onChange={(e) => setWebsite(e.target.value)}
                      />
                    </div>

                    {error && <p className="error-msg">{error}</p>}

                    <button
                      type="submit"
                      className="btn-submit"
                      disabled={!isFormValid || isLoading}
                    >
                      {isLoading ? "Enviando..." : <>Publicar Opinión <FaPaperPlane /></>}
                    </button>
                  </form>
                </>
              ) : (
                <m.div 
                  className="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="check-icon">✓</div>
                  <h3>¡Gracias por tu opinión!</h3>
                  <p>Tu reseña ha sido enviada y está pendiente de moderación para ser publicada.</p>
                  <button type="button" onClick={() => setSubmitted(false)} className="btn-secondary">
                    Escribir otra
                  </button>
                </m.div>
              )}
            </div>
          </div>

          {/* Columna Derecha: Lista de Reviews */}
          <div className="list-column">
            <div className="reviews-list-header">
              <h3>Últimas Reseñas</h3>
              {/* 2. Cambio de 'to' por 'href' */}
              <Link href="/reviews" className="link-see-more">Ver todas</Link>
            </div>

            <div className="reviews-feed">
              <AnimatePresence>
                {reviews.slice(0, 3).map((r) => (
                  <m.div 
                    key={r.id} 
                    className="review-card"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.4 }}
                  >
                    <div className="card-header">
                      <div className="avatar">
                        {r.photoURL ? (
                          <img src={r.photoURL} alt={r.name} referrerPolicy="no-referrer" loading="lazy" />
                        ) : (
                          <FaUserCircle className="default-avatar" />
                        )}
                      </div>
                      <div className="user-meta">
                        <h4>{r.name}</h4>
                        <Rating
                          initialValue={r.rating}
                          size={18}
                          readonly={true} 
                          allowFraction={true}
                          fillColor="#ffd700"
                          emptyColor="#e5e7eb"
                        />
                      </div>
                      {r.provider === "google" && <FaGoogle className="verified-icon" title="Verificado por Google" />}
                    </div>
                    
                    <div className="card-body">
                      <FaQuoteLeft className="quote-icon" />
                      <p>{r.comment}</p>
                    </div>
                  </m.div>
                ))}
              </AnimatePresence>

              {reviews.length === 0 && (
                <div className="empty-state">
                  <p>Aún no hay reseñas publicadas. ¡Sé el primero!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReviewForm;