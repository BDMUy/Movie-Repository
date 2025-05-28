import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "./MoviesBanner.css";
import { fetchFromTMDb } from '../utils/tmdb';

const MoviesBanner = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const autoPlayDelay = 60000;

  useEffect(() => {
    async function fetchData() {
      try {
        const data = await fetchFromTMDb("/trending/movie/day", { language: "es-MX" });
        if (!data?.results || data.results.length === 0) {
          console.error("No trending movies found");
          return;
        }
        setMovies(data.results);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (movies.length > 0) {
      const interval = setInterval(() => {
        setDirection(1);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % movies.length);
      }, autoPlayDelay);
      return () => clearInterval(interval);
    }
  }, [movies]);

  const handleNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prevIndex) =>
      prevIndex === movies.length - 1 ? 0 : prevIndex + 1
    );
  }, [movies]);

  const handlePrev = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? movies.length - 1 : prevIndex - 1
    );
  }, [movies]);

  const bannerVariants = {
    enter: (direction) => ({
      x: direction > 0 ? 300 : -300,
      opacity: 0,
      position: "absolute"
    }),
    center: {
      x: 0,
      opacity: 1,
      position: "absolute"
    },
    exit: (direction) => ({
      x: direction < 0 ? 300 : -300,
      opacity: 0,
      position: "absolute"
    })
  };

  const movie = movies[currentIndex];

  return (
    <header className="moviesBanner">
      <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={movie?.id}
            className="moviesBanner__wrapper"
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragStart={(e) => e.stopPropagation()}
            onDragEnd={(event, info) => {
              if (info.offset.x < -100) handleNext();
              else if (info.offset.x > 100) handlePrev();
            }}
            style={{
              backgroundImage: movie?.backdrop_path
                ? `url("https://image.tmdb.org/t/p/original${movie.backdrop_path}")`
                : "#000",
            }}
            variants={bannerVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.5 }}
          >
            <div className="moviesBanner__dragContent">
              <div className="moviesBanner__arrow left" onClick={handlePrev}>
                &#10094;
              </div>
              <div className="moviesBanner__arrow right" onClick={handleNext}>
                &#10095;
              </div>

              <div className="moviesBanner__info">
                <h1>{movie?.title}</h1>
                <p>{movie?.overview}</p>
                <div className="seriesBanner__buttons">
                  <Link to={`/movie/${movie?.id}`}>
                    <motion.button
                      className="seriesBanner__button"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Más información
                    </motion.button>
                  </Link>
          </div>
              </div>

              <div className="moviesBanner__indicators">
                {movies.map((_, index) => (
                  <span
                    key={index}
                    className={`dot ${index === currentIndex ? "active" : ""}`}
                    onClick={() => setCurrentIndex(index)}
                  />
                ))}
              </div>

              <div className="moviesBanner--fadeBottom" />
            </div>
          </motion.div>
        </AnimatePresence>
    </header>
  );
};

export default MoviesBanner;
