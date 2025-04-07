import React from 'react';
import "../styles/navBar.css";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";

export const Nav = () => {

  return (
    <header className="header">
      <nav className="nav__container">
        <ul className="nav__list">
          <li className="nav__item"><Link to={"/"}>Inicio</Link></li>
          <li className="nav__item"><Link to={"/nosotros"}>Sobre Nosotros</Link></li>
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