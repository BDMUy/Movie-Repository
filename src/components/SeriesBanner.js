import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "./ContentBanner.css";
import { fetchFromTMDb } from "../utils/tmdb";

const SeriesBanner = () => {
  const [series, setSeries] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoPlayDelay = 30000;
  const intervalRef = useRef(null);
  const [progress, setProgress] = useState(0); // de 0 a 100
  const isPausedRef = useRef(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFromTMDb("/trending/tv/day", {
          language: "es-MX",
        });
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

  const startAutoPlay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setProgress(0); // Reinicia progreso visual
  }, []);

  useEffect(() => {
    let interval = intervalRef.current;
    startAutoPlay();
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [series, startAutoPlay]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === series.length - 1 ? 0 : prevIndex + 1
    );
    startAutoPlay();
  }, [series.length, startAutoPlay]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? series.length - 1 : prevIndex - 1
    );
    startAutoPlay();
  }, [series.length, startAutoPlay]);

  const handleMouseEnter = () => {
    isPausedRef.current = true;
  };

  const handleMouseLeave = () => {
    isPausedRef.current = false;
  };

  useEffect(() => {
    let counter = 0;
    const step = 100 / (autoPlayDelay / 100); // avance cada 100ms

    const interval = setInterval(() => {
      if (isPausedRef.current) return;
      counter += step;
      if (counter >= 100) {
        handleNext();
        counter = 0;
      }
      setProgress(counter);
    }, 100);

    return () => clearInterval(interval);
  }, [series, currentIndex, handleNext]);

  const bannerVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: "absolute",
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "absolute",
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      position: "absolute",
    }),
  };

  const serie = series[currentIndex];

  return (
  <header
    className="contentsBanner"
    onMouseEnter={handleMouseEnter}
    onMouseLeave={handleMouseLeave}
  >
    <AnimatePresence initial={false} custom={direction}>
      {/* Fondo animado */}
      <motion.div
        key={serie?.id + "-bg"}
        className="contentsBanner__background"
        initial={{ filter: "blur(10px)", scale: 1.1 }}
        animate={{ filter: "blur(0px)", scale: 1 }}
        exit={{ filter: "blur(10px)", scale: 1.1 }}
        transition={{ duration: 0.5 }}
        style={{
          backgroundImage: serie?.backdrop_path
            ? `url("https://image.tmdb.org/t/p/original${serie.backdrop_path}")`
            : "#000",
        }}
      />
    </AnimatePresence>

    <AnimatePresence initial={false} custom={direction}>
      <motion.div
        key={serie?.id}
        className="contentsBanner__wrapper"
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragStart={(e) => e.stopPropagation()}
        onDragEnd={(event, info) => {
          if (info.offset.x < -100) handleNext();
          else if (info.offset.x > 100) handlePrev();
        }}
        variants={bannerVariants}
      >
        <div className="contentsBanner__dragContent">
          <div className="contentsBanner__arrow left" onClick={handlePrev}>
            &#10094;
          </div>
          <div className="contentsBanner__arrow right" onClick={handleNext}>
            &#10095;
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          >
            <div className="contentsBanner__info">
              <h1>{serie?.name || serie?.title}</h1>
              <p>{serie?.overview || "No hay descripción disponible"}</p>
              <div className="contentsBanner__buttons">
                <Link to={`/serie/${serie?.id}`}>
                  <motion.button
                    className="contentsBanner__button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Más información
                  </motion.button>
                </Link>
              </div>
            </div>
          </motion.div>
          <div className="contentsBanner__indicators">
            {series.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentIndex ? "active" : ""}`}
                onClick={() => {
                  setCurrentIndex(index);
                  startAutoPlay();
                }}
              />
            ))}
          </div>
          <div
            className="contentsBanner__progressBar"
            style={{ width: `${progress}%` }}
          />
          <div className="contentsBanner--fadeBottom" />
        </div>
      </motion.div>
    </AnimatePresence>
  </header>
  );
};

export default SeriesBanner;
