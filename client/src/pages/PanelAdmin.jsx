import React from "react";
import { Link } from "react-router-dom";
import  alumnosListar  from "../images/alumnosListar.png";
import  profesoresListar  from "../images/profesoresListar.png";
import  calendario  from "../images/calendario.png";
import "../styles/panelAdmin.css"

export const PanelAdmin = () => {
  return (
    <div className="crear__wrapper">
      <div className="container__general">
        <h1 className="title__Panel">Panel de Aministracion</h1>
        <div className="container__listar">
          <Link to={"/ver-alumnos"} className="listar__item">
          <img
              src={alumnosListar}
              alt="Alumno"
              className="icono__listar"
            />
            VER ALUMNOS
          </Link>
          <Link to={"/ver-profesores"} className="listar__item">
          <img
              src={profesoresListar}
              alt="Profesor"
              className="icono__listar"
            />
            VER PROFESORES
          </Link>
          <Link to={"/ver-evento"} className="listar__item">
          <img
              src={calendario}
              alt="Ver Eventos"
              className="icono__listar"
            />
            VER EVENTOS
          </Link>
        </div>
      </div>
    </div>
  );
};
