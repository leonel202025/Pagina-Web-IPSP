import React, { useContext, useState, useEffect } from "react";
import "../styles/navBar.css";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export const Nav = () => {
  const { user, logout } = useContext(AuthContext);
  const [menuAbierto, setMenuAbierto] = useState(false);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const cerrarMenu = () => setMenuAbierto(false);

  // Cierra el menú al tocar fuera del mismo
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuAbierto &&
        !e.target.closest(".nav__list") &&
        !e.target.closest(".nav__toggle")
      ) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [menuAbierto]);

  return (
    <header className="header">
          <button className={`nav__toggle ${menuAbierto ? "menu-open" : ""}`} onClick={toggleMenu}>
            ☰
          </button>
      <nav className="nav__container">
        <div className="nav__top">
          <div className="nav__logo-mobile">
            <img src={logo} alt="Logo" />
          </div>
        </div>

        {menuAbierto && <div className="nav__overlay"></div>}

        <ul className={`nav__list ${menuAbierto ? "active" : ""}`}>
          <li className="nav__item">
            <Link to={"/"} onClick={cerrarMenu}>Inicio</Link>
          </li>

          {!user && (
            <>
              <li className="nav__item">
                <Link to={"/nosotros"} onClick={cerrarMenu}>Sobre Nosotros</Link>
              </li>
              <div className="nav__logo">
                <img src={logo} alt="Logo" />
              </div>
              <li className="nav__item">
                <Link to={"/oferta"} onClick={cerrarMenu}>Oferta Educativa</Link>
              </li>
              <li className="nav__item">
                <Link to={"/contacto"} onClick={cerrarMenu}>Contacto</Link>
              </li>
            </>
          )}

          {user && (
            <>
              {user.rol === "admin" && (
                <>
                  <li className="nav__item">
                    <Link to={"/panel-admin"} onClick={cerrarMenu}>Panel Admin</Link>
                  </li>
                  <div className="nav__logo">
                    <img src={logo} alt="Logo" />
                  </div>
                  <li className="nav__item">
                    <Link to={"/crear-usuario"} onClick={cerrarMenu}>Crear Usuario</Link>
                  </li>
                </>
              )}

              {user.rol === "profesor" && (
                <>
                  <li className="nav__item">
                    <Link to={"/mis-cursos"} onClick={cerrarMenu}>Mis Cursos</Link>
                  </li>
                  <div className="nav__logo-profe">
                    <img src={logo} alt="Logo" />
                  </div>
                  <li className="nav__item">
                    <Link to={"/mis-cursos"} onClick={cerrarMenu}>Mis Cursos</Link>
                  </li>
                </>
              )}

              {user.rol === "alumno" && (
                <>
                  <li className="nav__item">
                    <Link to={"/mis-materia"} onClick={cerrarMenu}>Mis Materias</Link>
                  </li>
                  <div className="nav__logo-alumn">
                    <img src={logo} alt="Logo" />
                  </div>
                  <li className="nav__item">
                    <Link to={"/mis-materia"} onClick={cerrarMenu}>Mis Materias</Link>
                  </li>
                </>
              )}

              <li className="nav__item">
                <Link to={"/perfil"} onClick={cerrarMenu}>Perfil</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};
