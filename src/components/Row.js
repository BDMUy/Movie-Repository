import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion, useAnimation } from "framer-motion";
import "./Row.css";

const Row = ({ title, fetchUrl, mediaType }) => {
  const [movies, setMovies] = useState([]);
  const [startIndex, setStartIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(0);
  const itemWidth = 210; // ancho de cada poster (200px + 10px de margen)
  const containerRef = useRef(null);
  const controls = useAnimation();
  const [isAnimating, setIsAnimating] = useState(false);

  // Obtener películas/series de la API
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3${fetchUrl}?region=UY&api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US`
        );
        const data = await response.json();
        setMovies(data.results);
        setStartIndex(0);
      } catch (error) {
        console.error("Error fetching movies for row:", error);
      }
    }
    fetchData();
  }, [fetchUrl]);

  // Calcular cuántos ítems caben en el contenedor
  useEffect(() => {
    function updateVisibleCount() {
      if (containerRef.current) {
        const width = containerRef.current.clientWidth;
        const count = Math.floor(width / itemWidth);
        setVisibleCount(count);
      }
    }
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, [itemWidth]);

  const n = movies.length;
  const visibleMovies = [];
  if (n > 0 && visibleCount > 0) {
    for (let i = 0; i < visibleCount; i++) {
      visibleMovies.push(movies[(startIndex + i) % n]);
    }
  }

  // Funciones para mover a la derecha o izquierda
  const handleNext = async () => {
    if (n === 0 || isAnimating) return;
    setIsAnimating(true);
    await controls.start({ x: -itemWidth, transition: { duration: 0.3 } });
    setStartIndex((prev) => (prev + 1) % n);
    controls.set({ x: 0 });
    setIsAnimating(false);
  };

  const handlePrev = async () => {
    if (n === 0 || isAnimating) return;
    setIsAnimating(true);
    await controls.start({ x: itemWidth, transition: { duration: 0.3 } });
    setStartIndex((prev) => (prev - 1 + n) % n);
    controls.set({ x: 0 });
    setIsAnimating(false);
  };

  const onDragEnd = (event, info) => {
    const threshold = itemWidth / 3; // umbral para cambiar de slide
    if (info.offset.x < -threshold) {
      handleNext();
    } else if (info.offset.x > threshold) {
      handlePrev();
    } else {
      controls.start({ x: 0, transition: { duration: 0.2 } });
    }
  };

  return (
    <div className="row">
      <h2>{title}</h2>
      {/* Agregamos la clase scroll-container al contenedor que engloba el carrusel y los botones */}
      <div
        className="row__carousel-container scroll-container"
        ref={containerRef}
      >
        <button className="scroll-btn row__arrow--left" onClick={handlePrev}>
          &#9664;
        </button>
        <div className="row__carousel">
          <AnimatePresence>
            <motion.div
              className="row__inner"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={onDragEnd}
              animate={controls}
              style={{ width: visibleCount * itemWidth }}
            >
              {visibleMovies.map((movie, index) => (
                <Link
                  key={`${movie.id}-${index}`}
                  to={`/${mediaType}/${movie.id}`}
                >
                  <div className="poster-container">
                    <motion.img
                      whileHover={{
                        scale: 1.1,
                        boxShadow: "0px 4px 10px rgba(0,0,0,0.5)",
                      }}
                      className="row__poster"
                      src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                      alt={movie.title || movie.name}
                    />
                    <div
                      className="poster-rating"
                      style={{
                        backgroundColor:
                          movie.vote_average >= 8
                            ? "#4CAF50"
                            : movie.vote_average >= 6
                            ? "#FFC107"
                            : "#F44336",
                      }}
                    >
                      {movie.vote_average.toFixed(1)}
                    </div>
                    <p className="poster-title">
                      {movie.title || movie.name}
                    </p>
                  </div>
                </Link>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        <button className="scroll-btn row__arrow--right" onClick={handleNext}>
          &#9654;
        </button>
      </div>
    </div>
  );
};

export default Row;
