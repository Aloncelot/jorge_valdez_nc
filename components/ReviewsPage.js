// ReviewsPage.js
"use client";
import React, { useState, useEffect } from "react";
import ReactStars from "react-stars";
import Link from "next/link";
import { db } from "../Firebase";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import "./ReviewsPage.css";
import { motion } from "framer-motion";
import { FaUserCircle, FaQuoteLeft, FaArrowLeft, FaGoogle } from "react-icons/fa";

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const reviewsPerPage = 8; // Mostramos 8 por página para equilibrar el grid (4 filas de 2)

  useEffect(() => {
    window.scrollTo(0, 0); // Asegurar que empiece arriba al cargar
    
    const reviewsRef = collection(db, "reviews");
    const q = query(
      reviewsRef,
      where("approved", "==", true),
      orderBy("createdAt", "desc")
    );
    
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const reviewsData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setReviews(reviewsData);
        setIsLoading(false);
      },
      (err) => {
        console.error("Error fetching reviews: ", err);
        setIsLoading(false);
      }
    );
    return () => unsubscribe();
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
            <motion.div 
              className="reviews-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {currentReviews.map((review, index) => (
                <motion.div 
                  key={index} 
                  className="review-card-full"
                  variants={cardVariants}
                >
                  <div className="review-header">
                    <div className="avatar-wrapper">
                      {review.photoURL ? (
                        <img src={review.photoURL} alt={review.name} />
                      ) : (
                        <FaUserCircle className="default-avatar-icon" />
                      )}
                    </div>
                    <div className="reviewer-details">
                      <h4>{review.name}</h4>
                      <div className="stars-row">
                        <ReactStars
                          count={5}
                          value={review.rating}
                          size={18}
                          edit={false}
                          color2={"#ffd700"}
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
                </motion.div>
              ))}
            </motion.div>

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