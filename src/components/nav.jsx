import React, { useState } from 'react';
import "../styles/navBar.css";
import logo from "../images/logo.png";

export const Nav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="header">
      <nav className="nav__container">
        <ul className="nav__list">
          <li className="nav__item"><a href="#">Inicio</a></li>
          <div 
            className="nav__dropdown-container"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <li className="nav__item nav__dropdown">
              <a href="#">Sobre Nosotros</a>
              <ul className={`dropdown__menu ${isDropdownOpen ? "show" : ""}`}>
                <li><a href="#">Historia</a></li>
                <li><a href="#">Plantel Docente</a></li>
                <li><a href="#">Horarios de Clase</a></li>
                <li><a href="#">Horarios de Consulta</a></li>
              </ul>
            </li>
          </div>
          <div className="nav__logo">
            <img src={logo} alt="Logo" />
          </div>
          <li className="nav__item"><a href="#">Oferta Educativa</a></li>
          <li className="nav__item"><a href="#">Contacto</a></li>
        </ul>
      </nav>
    </header>
  );
};