"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link"; 
import { Rating } from 'react-simple-star-rating';
import { db, auth } from "../Firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import "./ReviewForm.css";
import { motion, AnimatePresence } from "framer-motion";
import { FaGoogle, FaPaperPlane, FaUserCircle, FaQuoteLeft } from "react-icons/fa";

const ReviewForm = () => {
  const [reviews, setReviews] = useState([]);
  const [user, setUser] = useState(null);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Cargar reviews aprobadas en tiempo real
  useEffect(() => {
    const reviewsRef = collection(db, "reviews");
    const q = query(
      reviewsRef,
      where("approved", "==", true),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      q,
      (snapshot) =>
        setReviews(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))),
      (err) => {
        console.error("Error fetching reviews:", err);
        setError("No se pudieron cargar las reseñas.");
      }
    );
    return unsubscribe;
  }, []);

  // Iniciar sesión con Google
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const { user } = await signInWithPopup(auth, provider);
      setUser(user);
      setName(user.displayName || "");
    } catch (err) {
      console.error("Google sign in error:", err);
      setError("Error al iniciar sesión con Google.");
    }
  };

  // Enviar reseña
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await addDoc(collection(db, "reviews"), {
        name,
        rating,
        comment,
        approved: false,
        rejected: false,
        createdAt: serverTimestamp(),
        photoURL: user?.photoURL || null,
        provider: user ? "google" : "email",
      });
      setSubmitted(true);
      setRating(0);
      setComment("");
      setError("");
    } catch (err) {
      console.error("Error submitting review:", err);
      setError("Error al enviar la reseña. Inténtalo de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = (user || name.trim()) && rating > 0 && comment.trim();

  return (
    <section id="reviewform" className="reviews-section">
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
                    <button onClick={handleGoogleSignIn} className="btn-google">
                      <FaGoogle className="google-icon" />
                      Continuar con Google
                    </button>
                  )}

                  {user && (
                    <div className="user-badge">
                      <img src={user.photoURL} alt={user.displayName} />
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
                        required
                      />
                      <label>Escribe tu comentario...</label>
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
                <motion.div 
                  className="success-message"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <div className="check-icon">✓</div>
                  <h3>¡Gracias por tu opinión!</h3>
                  <p>Tu reseña ha sido enviada y está pendiente de moderación para ser publicada.</p>
                  <button onClick={() => setSubmitted(false)} className="btn-secondary">
                    Escribir otra
                  </button>
                </motion.div>
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
                  <motion.div 
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
                          <img src={r.photoURL} alt={r.name} />
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
                  </motion.div>
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