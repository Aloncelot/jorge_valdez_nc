// ReviewsPage.js
"use client";
import React, { useState, useEffect } from "react";
import { Rating } from 'react-simple-star-rating';
import Link from "next/link";
import { loadFirestore } from "../Firebase";
import "./ReviewsPage.css";
import { m } from "framer-motion";
import { FaUserCircle, FaQuoteLeft, FaArrowLeft, FaGoogle } from "react-icons/fa";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const reviewsPerPage = 8; // Mostramos 8 por página para equilibrar el grid (4 filas de 2)

  // Lectura única (getDocs) en lugar de una escucha en tiempo real
  useEffect(() => {
    window.scrollTo(0, 0); // Asegurar que empiece arriba al cargar
    let cancelled = false;

    (async () => {
      try {
        const { db, fs } = await loadFirestore();
        const q = fs.query(
          fs.collection(db, "reviews"),
          fs.where("approved", "==", true),
          fs.orderBy("createdAt", "desc")
        );
        const querySnapshot = await fs.getDocs(q);
        if (cancelled) return;
        setReviews(querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error fetching reviews: ", err);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  // Lógica de Paginación
  const indexOfLastReview = currentPage * reviewsPerPage;
  const indexOfFirstReview = indexOfLastReview - reviewsPerPage;
  const currentReviews = reviews.slice(indexOfFirstReview, indexOfLastReview);
  const totalPages = Math.ceil(reviews.length / reviewsPerPage);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Animación de entrada
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="reviews-page-wrapper">
      <div className="reviews-container-full">
        <div className="page-header">
          <h2>Testimonios de Pacientes</h2>
          <p>Lo que dicen quienes han confiado en nosotros</p>
        </div>

        {isLoading ? (
          <div className="loader-container">
            <div className="simple-spinner"></div>
          </div>
        ) : (
          <>
            <m.div 
              className="reviews-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {currentReviews.map((review, index) => (
                <m.div 
                  key={review.id} 
                  className="review-card-full"
                  variants={cardVariants}
                >
                  <div className="review-header">
                    <div className="avatar-wrapper">
                      {review.photoURL ? (
                        <img src={review.photoURL} alt={review.name} referrerPolicy="no-referrer" loading="lazy" />
                      ) : (
                        <FaUserCircle className="default-avatar-icon" />
                      )}
                    </div>
                    <div className="reviewer-details">
                      <h4>{review.name}</h4>
                      <div className="stars-row">
                        <Rating
                          initialValue={review.rating}
                          size={18}
                          readonly={true}
                          allowFraction={true}
                          fillColor="#ffd700"
                          emptyColor="#e5e7eb"
                        />
                        {review.provider === "google" && (
                          <span className="google-badge">
                            <FaGoogle /> Verificado
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="review-body">
                    <FaQuoteLeft className="quote-mark" />
                    <p>{review.comment}</p>
                  </div>
                </m.div>
              ))}
            </m.div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`page-btn ${index + 1 === currentPage ? "active" : ""}`}
                    onClick={() => paginate(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Back to Home */}
        <div className="back-home-wrapper">
          <Link href="/" className="btn-back-home">
            <FaArrowLeft /> Volver al Inicio
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ReviewsPage;