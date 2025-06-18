import React from "react";
import { Link } from "react-router-dom";
import "../styles/CrearUsuario.css";
import Alumno from "../images/Alumno.png"
import Profesor from "../images/Profesor.png"
import { Outlet } from "react-router-dom";

export const CreateUsuario = () => {
  return (
    <div className="crear__wrapper">
      <div className="container__general">
        <h1 className="title__create">Crear Usuario</h1>
        <div className="container__create">
          <Link to={"/crear-alumno"} className="crear__item">
            <img
              src={Alumno}
              alt="Alumno"
              className="icono__crear"
            />
            ALUMNO
          </Link>
          <Link to={"/crear-profesor"} className="crear__item">
            <img
              src= {Profesor}
              alt="Profesor"
              className="icono__crear"
            />
            PROFESOR
          </Link>
          <Outlet />
        </div>
      </div>
    </div>
  );
};
