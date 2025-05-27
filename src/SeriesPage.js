// src/SeriesPage.js
import React from 'react';
import SeriesBanner from './components/SeriesBanner';
import Row from './components/Row';
import './SeriesPage.css';

const SeriesPage = () => {
  return (
    <div className="seriesPage">
      <SeriesBanner />
      <Row title="Series Populares" fetchUrl="/tv/popular" mediaType="serie" />
      <Row title="Series Mejor Valoradas" fetchUrl="/tv/top_rated" mediaType="serie" />
      <Row title="En emisión" fetchUrl="/tv/on_the_air" mediaType="serie" />
    </div>
  );
};

export default SeriesPage;
