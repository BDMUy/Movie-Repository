import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "./SeriesBanner.css";
import { fetchFromTMDb } from '../utils/tmdb';

const SeriesBanner = () => {
  const [series, setSeries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFromTMDb("/trending/tv/day", { language: "es-MX" });
        if (!data?.results || data.results.length === 0) {
          console.error("No trending series found");
          return;
        }
        setSeries(data.results);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Error fetching trending series:", error);
      }
    }
    fetchData();
  }, []);

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % series.length);
  }, [series]);

  const handlePrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + series.length) % series.length);
  }, [series]);

  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (!touchStartX) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    if (deltaX > 50) handlePrev();
    else if (deltaX < -50) handleNext();
    setTouchStartX(null);
  };

  const serie = series[currentIndex];

  return (
    <header
      className="seriesBanner"
      style={{
        backgroundImage: serie?.backdrop_path
          ? `url("https://image.tmdb.org/t/p/original${serie.backdrop_path}")`
          : "#000",
      }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div className="seriesBanner__arrow left" onClick={handlePrev}>
        &#10094;
      </div>
      <div className="seriesBanner__arrow right" onClick={handleNext}>
        &#10095;
      </div>

      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={serie?.id}
          className="seriesBanner__contents"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="seriesBanner__title">{serie?.title || serie?.name}</h1>
          <p className="seriesBanner__description">{serie?.overview}</p>
          <div className="seriesBanner__buttons">
            <Link to={`/serie/${serie?.id}`}>
              <motion.button
                className="seriesBanner__button"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Más información
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </AnimatePresence>
      <div className="seriesBanner__indicators">
        {series.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? "active" : ""}`}
            onClick={() => setCurrentIndex(index)}
            style={{ cursor: 'pointer' }}
          />
        ))}
      </div>
      <div className="seriesBanner--fadeBottom" />
    </header>
  );
};

export default SeriesBanner;
