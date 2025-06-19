// src/MoviesPage.js
import React from 'react';
import ContentBanner from './components/ContentBanner';
import Row from './components/Row';
import './MoviesPage.css';

const MoviesPage = () => {
  return (
    <div className="moviesPage">
      <ContentBanner fetchUrl="/trending/movie/day" detailPathPrefix="/movie/" />
      <Row title="Películas Populares" fetchUrl="/movie/popular" mediaType="movie"/>
      <Row title="Mejor Valoradas" fetchUrl="/movie/top_rated" mediaType="movie"/>
      <Row title="Próximos Estrenos" fetchUrl="/movie/upcoming" mediaType="movie"/>
    </div>
  );
};

export default MoviesPage;
