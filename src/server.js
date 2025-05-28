require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT_BACK;
const API_KEY = process.env.TMDB_API_KEY;

app.use(cors());

app.get('/api/tmdb', async (req, res) => {
  try {
    const { path, ...query } = req.query;

    if (!path) {
      return res.status(400).json({ error: 'Falta el parámetro "path"' });
    }

    // Construcción segura de la URL a consultar
    const searchParams = new URLSearchParams({ ...query, api_key: API_KEY });
    const tmdbUrl = `https://api.themoviedb.org/3${path}?${searchParams.toString()}`;

    // Fetch a TMDb
    const response = await fetch(tmdbUrl);
    if (!response.ok) {
      return res.status(response.status).json({ error: response.statusText });
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    console.error('Error en proxy a TMDb:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Inicia el servidor
app.listen(PORT, () => {
  console.log(`Server V2 running on port http://localhost:${PORT}`);
});
