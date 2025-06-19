// src/HomePage.js
import React from 'react';
import ContentBanner from './components/ContentBanner';
import Row from './components/Row';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homePage">
      <ContentBanner fetchUrl="/trending/all/day" detailPathPrefix="/content/" />
      <Row title="Películas Populares" fetchUrl="/movie/popular" mediaType="movie"/>
      <Row title="Series Populares" fetchUrl="/tv/popular" mediaType="serie"/>
    </div>
  );
};

export default HomePage;
