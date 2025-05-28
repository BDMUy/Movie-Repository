import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./StreamingModal.css";
import { fetchFromTMDb } from '../utils/tmdb';

const StreamingModal = ({ movieId, onClose }) => {
  const [providers, setProviders] = useState(null);

  useEffect(() => {
    async function fetchProviders() {
      try {
        const data = await fetchFromTMDb(`/movie/${movieId}/watch/providers`);
        if (!data || !data.results || !data.results.UY) {
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
  }, [movieId]);

  // Utilizamos la región "UY"
  const region = "UY";
  const providerData =
    providers && providers[region] ? providers[region] : null;
  const streamingOptions =
    providerData && providerData.flatrate ? providerData.flatrate : [];

  return (
    <AnimatePresence>
      <motion.div
        className="streamingModal__overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="streamingModal"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0.8 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h2>Opciones de Streaming</h2>
          {streamingOptions.length > 0 ? (
            <div className="streamingModal__providers">
              {streamingOptions.map((provider) => (
                <div key={provider.provider_id} className="provider">
                  <img
                    src={`https://image.tmdb.org/t/p/w92${provider.logo_path}`}
                    alt={provider.provider_name}
                  />
                  <p>{provider.provider_name}</p>
                </div>
              ))}
            </div>
          ) : (
            <p>No se encontraron opciones de streaming.</p>
          )}
          <button className="streamingModal__close" onClick={onClose}>
            Cerrar
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StreamingModal;
