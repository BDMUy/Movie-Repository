// src/HomePage.js
import React from 'react';
import Banner from './components/Banner';
import Row from './components/Row';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="homePage">
      <Banner />
      <Row title="Películas Populares" fetchUrl="/movie/popular" mediaType="movie"/>
      <Row title="Series Populares" fetchUrl="/tv/popular" mediaType="serie"/>
    </div>
  );
};

export default HomePage;
