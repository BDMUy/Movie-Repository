// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './HomePage';
import MoviesPage from './MoviesPage';
import SeriesPage from './SeriesPage';
import MovieDetail from './components/MovieDetail';
import SerieDetail from './components/SerieDetail';
import NotFound from './NotFound';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/movies" element={<MoviesPage />} />
          <Route path="/series" element={<SeriesPage />} />
          <Route path="/movie/:id" element={<MovieDetail />} />
          <Route path="/serie/:id" element={<SerieDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
