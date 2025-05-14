import React, { useContext } from "react";
import "../styles/navBar.css";
import logo from "../images/logo.png";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/authContext";

export const Nav = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <header className="header">
      <nav className="nav__container">
        <ul className="nav__list">
          <li className="nav__item">
            <Link to={"/"}>Inicio</Link>
          </li>

          {!user && (
            <>
              <li className="nav__item">
                <Link to={"/nosotros"}>Sobre Nosotros</Link>
              </li>
              <div className="nav__logo">
                <img src={logo} alt="Logo" />
              </div>
              <li className="nav__item">
                <Link to={"/oferta"}>Oferta Educativa</Link>
              </li>
              <li className="nav__item">
                <Link to={"/contacto"}>Contacto</Link>
              </li>
            </>
          )}

          {user && (
            <>
              {user.rol === "admin" && (
                <>
                  <li className="nav__item">
                    <Link to={"/"}>Panel Admin</Link>
                  </li>
                  <div className="nav__logo">
                    <img src={logo} alt="Logo" />
                  </div>
                  <li className="nav__item">
                    <Link to={"/crear-usuario"}>Crear Usuario</Link>
                  </li>
                </>
              )}

              {user.rol === "profesor" && (
                <>
                  <li className="nav__item">
                    <Link to={"/mis-cursos"}>Mis Cursos</Link>
                  </li>
                  <div className="nav__logo-profe">
                    <img src={logo} alt="Logo" />
                  </div>
                  <li className="nav__item">
                    <Link to={"/mis-cursos"}>Mis Cursos</Link>
                  </li>
                </>
              )}

              {user.rol === "alumno" && (
                <>
                  <li className="nav__item">
                    <Link to={"/mis-materia"}>Mis Materias</Link>
                  </li>
                  <div className="nav__logo-alumn">
                    <img src={logo} alt="Logo" />
                  </div>
                  <li className="nav__item">
                    <Link to={"/mis-materia"}>Mis Materias</Link>
                  </li>
                </>
              )}

              <li className="nav__item">
                <Link to={"/perfil"}>Perfil</Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};
