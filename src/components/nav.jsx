import React, { useState } from 'react';
import "../styles/navBar.css";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

export const Nav = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <header className="header">
      <nav className="nav__container">
        <ul className="nav__list">
          <li className="nav__item"><Link to={"/"}>Inicio</Link></li>
          <div 
            className="nav__dropdown-container"
            onMouseEnter={() => setIsDropdownOpen(true)}
            onMouseLeave={() => setIsDropdownOpen(false)}
          >
            <li className="nav__item nav__dropdown">
              <span href=''>Sobre Nosotros</span>
              <ul className={`dropdown__menu ${isDropdownOpen ? "show" : ""}`}>
                <li><Link to={"/historia"}>Historia</Link></li>
                <li><Link to={"/plantel"}>Plantel Docente</Link></li>
                <li><Link to={"/clases"}>Horarios de Clase</Link></li>
                <li><Link to={"/consulta"}>Horarios de Consulta</Link></li>
              </ul>
            </li>
          </div>
          <div className="nav__logo">
            <img src={logo} alt="Logo" />
          </div>
          <li className="nav__item"><Link to={"/oferta"}>Oferta Educativa</Link></li>
          <li className="nav__item"><Link to={"/contacto"}>Contacto</Link></li>
        </ul>
      </nav>
    </header>
  );
};