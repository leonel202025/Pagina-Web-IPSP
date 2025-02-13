import React from 'react'
import "../styles/navBar.css"
import logo from "../images/logo.png";

export const Nav = () => {
  return (
    <header className="header">
  <nav className="nav__container">
    <ul className="nav__list">
      <li className="nav__item"><a href="#">Inicio</a></li>
      <li className="nav__item"><a href="#">Sobre Nosotros</a></li>
      <div className="nav__logo">
      <img src={logo} alt="Logo" />
      </div>
      <li className="nav__item"><a href="#">Oferta Educativa</a></li>
      <li className="nav__item"><a href="#">Contacto</a></li>
    </ul>
  </nav>
</header>
  )
}
