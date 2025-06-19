import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./SerieDetail.css";
import { fetchFromTMDb } from '../utils/tmdb';

const SerieDetail = () => {
  const { id } = useParams();
  const [serie, setSerie] = useState(null);
  const [actors, setActors] = useState([]);
  const [providers, setProviders] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  // Refs para el scroll horizontal de la lista de actores
  const actorContainerRef = useRef(null);
  const isDown = useRef(false);
  const startX = useRef(0);
  const scrollLeftRef = useRef(0);

  useEffect(() => {
    async function fetchSerie() {
      try {
        const data = await fetchFromTMDb(`/tv/${id}`, { language: "es-MX" });
        if (!data || !data.id) {
          console.error("Serie not found or invalid data:", data);
          return;
        }
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
        const data = await fetchFromTMDb(`/tv/${id}/credits`, { language: "es-MX" });
        if (!data.cast || data.cast.length === 0) {
          console.warn("No actors found for this serie.");
          setActors([]);
          return;
        }
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
        const data = await fetchFromTMDb(`/tv/${id}/watch/providers`);
        if (!data.results || !data.results.UY) {
          console.warn("No streaming providers found for this serie.");
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

    // Llamada para obtener videos y seleccionar el trailer
  useEffect(() => {
    async function fetchTrailer() {
      try {
        const data = await fetchFromTMDb(`/tv/${id}/videos`);
        if (!data.results || data.results.length === 0) return;
        const trailer = data.results.find(
          (v) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer) {
          setTrailerKey(trailer.key);
        }
      } catch (error) {
        console.error("Error fetching serie trailers:", error);
      }
    }
    fetchTrailer();
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
      {trailerKey && (
        <div className="serieDetail__trailer">
          <iframe
            src={`https://www.youtube.com/embed/${trailerKey}`}
            title="Trailer"
            allowFullScreen
          />
        </div>
      )}
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
