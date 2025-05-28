import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./MovieDetail.css";
import { fetchFromTMDb } from '../utils/tmdb';

const MovieDetail = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [actors, setActors] = useState([]);
  const [providers, setProviders] = useState(null);

  // Refs para el scroll horizontal de la lista de actores
  const actorContainerRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  // Llamada para obtener detalles de la película
  useEffect(() => {
    async function fetchMovie() {
      try {
        const data = await fetchFromTMDb("/movie/" + id, {language: "es-MX" })
        if (!data || !data.id) {
          console.error("Movie not found or invalid data:", data);
          return;
        }
        setMovie(data);
      } catch (error) {
        console.error("Error fetching movie details:", error);
      }
    }
    fetchMovie();
  }, [id]);

  // Llamada para obtener créditos (actores)
  useEffect(() => {
    async function fetchActors() {
      try {
        // Usamos la función fetchFromTMDb para obtener los actores
        const data = await fetchFromTMDb(`/movie/${id}/credits`, { language: "es-MX" });
        if (!data.cast || data.cast.length === 0) {
          console.warn("No actors found for this movie.");
          setActors([]);
          return;
        }
        setActors(data.cast);
      } catch (error) {
        console.error("Error fetching actors:", error);
      }
    }
    fetchActors();
  }, [id]);

  // Llamada para obtener proveedores de streaming
  useEffect(() => {
    async function fetchProviders() {
      try {
        const data = await fetchFromTMDb(`/movie/${id}/watch/providers`);
        if (!data.results || !data.results.UY) {
          console.warn("No streaming providers found for this movie.");
          setProviders(null);
          return;
        }
        setProviders(data.results);
      } catch (error) {
        console.error("Error fetching streaming providers:", error);
      }
    }
    fetchProviders();
  }, [id]);

  // Eventos para el "drag" horizontal en la lista de actores
  const handleMouseDown = (e) => {
    isDown.current = true;
    startX.current = e.pageX - actorContainerRef.current.offsetLeft;
    scrollLeftRef.current = actorContainerRef.current.scrollLeft;
  };

  const handleMouseLeave = () => {
    isDown.current = false;
  };

  const handleMouseUp = () => {
    isDown.current = false;
  };

  const handleMouseMove = (e) => {
    if (!isDown.current) return;
    e.preventDefault();
    const x = e.pageX - actorContainerRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // Multiplicador para mayor velocidad de scroll
    actorContainerRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  // Funciones para desplazar la lista de actores con las flechas
  const scrollLeft = () => {
    if (actorContainerRef.current) {
      actorContainerRef.current.scrollLeft -= 300;
    }
  };

  const scrollRight = () => {
    if (actorContainerRef.current) {
      actorContainerRef.current.scrollLeft += 300;
    }
  };

  if (!movie) return <div className="loading">Cargando...</div>;

  // Se utiliza la región "UY" para obtener opciones de streaming
  const region = "UY";
  let streamingOptions = [];
  if (providers && providers[region] && providers[region].flatrate) {
    streamingOptions = providers[region].flatrate;
  }

  return (
    <motion.div
      className="movieDetail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div
        className="movieDetail__backdrop"
        style={{
          backgroundImage: `url("https://image.tmdb.org/t/p/original/${movie.backdrop_path}")`,
        }}
      ></div>
      <div className="movieDetail__info">
        <h1>{movie.title}</h1>
        <p>{movie.overview}</p>
        <p>
          <strong>Fecha de lanzamiento:</strong> {movie.release_date}
        </p>
        <p>
          <strong>Calificación:</strong> {movie.vote_average}
        </p>
      </div>
      <div className="movieDetail__actors">
        <h2>Actores Principales</h2>
        <div className="actorsWrapper">
          <button className="scroll-btn scrollButton left" onClick={scrollLeft}>
            &lt;
          </button>
          <div
            className="actorsList"
            ref={actorContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseLeave}
          >
            {actors.length > 0 ? (
              actors.slice(0, 10).map((actor) => (
                <div key={actor.id} className="actor">
                  <img
                    src={
                      actor.profile_path
                        ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
                        : "https://via.placeholder.com/200x300"
                    }
                    alt={actor.name}
                  />
                  <p>{actor.name}</p>
                </div>
              ))
            ) : (
              <p>No se encontraron actores.</p>
            )}
          </div>
          <button className="scroll-btn scrollButton right" onClick={scrollRight}>
            &gt;
          </button>
        </div>
      </div>
      <div className="movieDetail__whereToWatch">
        <h2>Dónde ver</h2>
        <div className="providersWrapper">
          <div className="providersList">
            {streamingOptions.length > 0 ? (
              streamingOptions.map((provider) => (
                <div key={provider.provider_id} className="providerItem">
                  <img
                    src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                    alt={provider.provider_name}
                  />
                  <p>{provider.provider_name}</p>
                </div>
              ))
            ) : (
              <p>No se encontraron opciones de streaming.</p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default MovieDetail;
