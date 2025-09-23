import React from "react";
import { Link } from "react-router-dom";
import  alumnosListar  from "../images/alumnosListar.png";
import  profesoresListar  from "../images/profesoresListar.png";
import  crearEvento  from "../images/Evento.png";
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
          <Link to={"/crear-evento"} className="listar__item">
          <img
              src={crearEvento}
              alt="Crear Evento"
              className="icono__listar"
            />
            CREAR EVENTO
          </Link>
        </div>
      </div>
    </div>
  );
};
