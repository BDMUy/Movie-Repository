import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./SerieDetail.css";

const SerieDetail = () => {
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [actors, setActors] = useState([]);
  const [providers, setProviders] = useState(null);

  // Refs para el scroll horizontal de la lista de actores
  const actorContainerRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    async function fetchSerie() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=es-MX`
        );
        const data = await response.json();
        setSerie(data);
      } catch (error) {
        console.error("Error fetching serie details:", error);
      }
    }
    fetchSerie();
  }, [id]);

  useEffect(() => {
    async function fetchActors() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/credits?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=es-MX`
        );
        const data = await response.json();
        setActors(data.cast);
      } catch (error) {
        console.error("Error fetching serie actors:", error);
      }
    }
    fetchActors();
  }, [id]);

  // Llamada para obtener proveedores de streaming
  useEffect(() => {
    async function fetchProviders() {
      try {
        const response = await fetch(
          `https://api.themoviedb.org/3/tv/${id}/watch/providers?api_key=${process.env.REACT_APP_TMDB_API_KEY}`
        );
        const data = await response.json();
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
  if (!serie) return <div className="loading">Cargando...</div>;

  // Se utiliza la región "UY" para obtener opciones de streaming
  const region = "UY";
  let streamingOptions = [];
  if (providers && providers[region] && providers[region].flatrate) {
    streamingOptions = providers[region].flatrate;
  }

  return (
    <motion.div
      className="serieDetail"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <div
        className="serieDetail__backdrop"
        style={{
          backgroundImage: `url("https://image.tmdb.org/t/p/original/${serie.backdrop_path}")`,
        }}
      ></div>
      <div className="serieDetail__info">
        <h1>{serie.name}</h1>
        <p>{serie.overview}</p>
        <p>
          <strong>Fecha de lanzamiento:</strong> {serie.first_air_date}
        </p>
        <p>
          <strong>Calificación:</strong> {serie.vote_average}
        </p>
      </div>
      <div className="serieDetail__actors">
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
      <div className="serieDetail__whereToWatch">
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

export default SerieDetail;
