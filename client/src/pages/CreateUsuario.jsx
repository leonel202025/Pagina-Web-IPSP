import React from "react";
import { Link } from "react-router-dom";
import "../styles/CrearUsuario.css";

export const CreateUsuario = () => {
  return (
    <div className="crear__wrapper">
      <div className="container__general">
        <h1 className="title__create">Crear Usuario</h1>
        <div className="container__create">
          <Link to={"/crear-alumno"} className="crear__item">
            ALUMNO
          </Link>
          <Link to={"/crear-profesor"} className="crear__item">
            PROFESOR
          </Link>
        </div>
      </div>
    </div>
  );
};
