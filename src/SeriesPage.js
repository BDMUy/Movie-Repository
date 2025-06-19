// src/SeriesPage.js
import React from 'react';
import ContentBanner from './components/ContentBanner';
import Row from './components/Row';
import './SeriesPage.css';

const SeriesPage = () => {
  return (
    <div className="seriesPage">
      <ContentBanner fetchUrl="/trending/tv/day" detailPathPrefix="/serie/" />
      <Row title="Series Populares" fetchUrl="/tv/popular" mediaType="serie" />
      <Row title="Series Mejor Valoradas" fetchUrl="/tv/top_rated" mediaType="serie" />
      <Row title="En emisión" fetchUrl="/tv/on_the_air" mediaType="serie" />
    </div>
  );
};

export default SeriesPage;
