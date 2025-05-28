// src/MoviesPage.js
import React from 'react';
import Banner from './components/MoviesBanner';
import Row from './components/Row';
import './MoviesPage.css';

const MoviesPage = () => {
  return (
    <div className="moviesPage">
      <Banner />
      <Row title="Películas Populares" fetchUrl="/movie/popular" mediaType="movie"/>
      <Row title="Mejor Valoradas" fetchUrl="/movie/top_rated" mediaType="movie"/>
      <Row title="Próximos Estrenos" fetchUrl="/movie/upcoming" mediaType="movie"/>
    </div>
  );
};

export default MoviesPage;
