import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "./Banner.css";

const Banner = () => {
  //const [movie, setMovie] = useState(null);
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayDelay = 110000;

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(`http://localhost:5000/api/movie/trending`);
        const data = await response.json();
        //const movies = data.results;
        //setMovie(movies[Math.floor(Math.random() * movies.length)]);
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
        setCurrentIndex((prev) => (prev + 1) % movies.length);
      }, autoPlayDelay);
      return () => clearInterval(interval);
    }
  }, [movies]);

  const movie = movies[currentIndex];

  return (
    <header className="banner">
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={`bg-${currentIndex}`}
          className="banner__bg"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ type: "tween", stiffness: 50, damping: 25 }}
          style={{
            backgroundImage: movie?.backdrop_path
              ? `url("https://image.tmdb.org/t/p/original${movie.backdrop_path}")`
              : "#000",
          }}
        />
      </AnimatePresence>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={`content-${currentIndex}`}
          className="banner__contents"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ type: "tween", stiffness: 60, damping: 20 }}
        >
            <h1 className="banner__title">{movie?.title || movie?.name}</h1>
            <p className="banner__description">{movie?.overview}</p>
            <div className="banner__buttons">
              <Link to={`/movie/${movie?.id}`}>
                <motion.button
                  className="banner__button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Más información
                </motion.button>
              </Link>
            </div>
        </motion.div>
      </AnimatePresence>
      <div className="banner__nav">
        {movies.map((m, index) => (
          <span
            key={m.id}
            className={`banner__nav-dot ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          ></span>
        ))}
      </div>
      <div className="banner--fadeBottom" />
    </header>
  );
};

export default Banner;
