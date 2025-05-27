// src/components/Navbar.js
import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
import logo from "../assets/movieRepositoryLogo.png";

const Navbar = () => {
  return (
    <div className="navbar">
      <Link to="/">
        <img
          className="navbar__logo"
          src={logo}
          alt="MR:HoI&W Logo"
        />
      </Link>
      <ul className="navbar__links">
        <li>
          <Link to="/movies">Películas</Link>
        </li>
        <li>
          <Link to="/series">Series</Link>
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
