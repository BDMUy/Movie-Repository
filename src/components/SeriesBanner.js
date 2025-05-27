import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./SeriesBanner.css";

const SeriesBanner = () => {
  const [series, setSeries] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/trending/tv/week?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=es-MX`
        );
        const data = await response.json();
        const results = data.results;
        setSeries(results[Math.floor(Math.random() * results.length)]);
      } catch (error) {
        console.error("Error fetching trending series:", error);
      }
    }
    fetchData();
  }, []);

  return (
    <header
      className="seriesBanner"
      style={{
        backgroundImage: series?.backdrop_path
          ? `url("https://image.tmdb.org/t/p/original${series.backdrop_path}")`
          : "#000",
      }}
    >
      <motion.div
        className="seriesBanner__contents"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3 }}
      >
        <h1 className="seriesBanner__title">{series?.name}</h1>
        <p className="seriesBanner__description">{series?.overview}</p>
        <div className="seriesBanner__buttons">
          <Link to={`/serie/${series?.id}`}>
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
      <div className="seriesBanner--fadeBottom" />
    </header>
  );
};

export default SeriesBanner;
