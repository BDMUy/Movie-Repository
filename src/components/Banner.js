import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import "./Banner.css";
import { fetchFromTMDb } from '../utils/tmdb';

const Banner = () => {
  const [contents, setContent] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const autoPlayDelay = 60000;

  useEffect(() => {
    async function fetchData() {
      try {

        const data = await fetchFromTMDb("/trending/all/day", { language: "es-MX" });
        if (!data || !data.results || data.results.length === 0) {
          console.error("No trending contents found or invalid data:", data);
          return;
        }
        setContent(data.results);
        setCurrentIndex(0);
      } catch (error) {
        console.error("Error fetching trending contents:", error);
      }
    }
    fetchData();
  }, []);

  useEffect(() => {
    if (contents.length > 0) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % contents.length);
      }, autoPlayDelay);
      return () => clearInterval(interval);
    }
  }, [contents]);

  const content = contents[currentIndex];

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
            backgroundImage: content?.backdrop_path
              ? `url("https://image.tmdb.org/t/p/original${content.backdrop_path}")`
              : "#000",
          }}
        />
      </AnimatePresence>
      <AnimatePresence exitBeforeEnter>
        <motion.div
          key={`contents-${currentIndex}`}
          className="banner__contentss"
          initial={{ x: "100%", opacity: 0 }}
          animate={{ x: "0%", opacity: 1 }}
          exit={{ x: "-100%", opacity: 0 }}
          transition={{ type: "tween", stiffness: 60, damping: 20 }}
        >
            <h1 className="banner__title">{content?.title || content?.name}</h1>
            <p className="banner__description">{content?.overview}</p>
            <div className="banner__buttons">
              <Link to={`/content/${content?.id}`}>
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
        {contents.map((m, index) => (
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
