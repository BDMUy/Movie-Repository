require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const app = express();
const PORT = process.env.PORT || 5000;
const API_KEY = process.env.TMDB_API_KEY;

// Endpoint para obtener películas populares 
app.get('/api/movie/popular', async (req, res) => {
  try {
    // Construimos la URL de TMDB. Aquí usamos language=es-MX y region=AR, por ejemplo.
    const tmdbUrl = `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=es-MX&region=AR`;
    const response = await fetch(tmdbUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching popular movies:", error);
    res.status(500).json({ error: "Error fetching popular movies" });
  }
});

// Endpoint para obtener películas trending 
app.get('/api/movie/trending', async (req, res) => {
    try {
      // Construimos la URL de TMDB. Aquí usamos language=es-MX y region=AR, por ejemplo.
      const tmdbUrl = `https://api.themoviedb.org/3/trending/movie/week?api_key=${API_KEY}&language=es-MX`;
      const response = await fetch(tmdbUrl);
      if (!response.ok) {
        return res.status(response.status).json({ error: response.statusText });
      }
      const data = await response.json();
      res.json(data);
    } catch (error) {
      console.error("Error fetching trending movies:", error);
      res.status(500).json({ error: "Error fetching trending movies" });
    }
  });

// Endpoint para obtener series populares
app.get('/api/tv/popular', async (req, res) => {
  try {
    const tmdbUrl = `https://api.themoviedb.org/3/tv/popular?api_key=${API_KEY}&language=es-MX`;
    const response = await fetch(tmdbUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }
    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error("Error fetching popular series:", error);
    res.status(500).json({ error: "Error fetching popular series" });
  }
});


// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
