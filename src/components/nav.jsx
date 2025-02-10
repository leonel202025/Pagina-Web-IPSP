import React from 'react'
import "../styles/navBar.css"
import logo from "../images/logo.png";

export const Nav = () => {
  return (
    <nav className="nav__container">
    <ul className="nav__list">
      <li className="nav__item"><a href="">INICIO</a></li>
      <li className="nav__item"><a href="">SOBRE NOSOTROS</a></li>
  
      {/* Imagen en el centro */}
      <li className="nav__item nav__logo">
      <img src={logo} alt="Logo" />
      </li>
  
      <li className="nav__item"><a href="">OFERTA EDUCATIVA</a></li>
      <li className="nav__item"><a href="">CONTACTO</a></li>
    </ul>
  </nav>
  )
}
