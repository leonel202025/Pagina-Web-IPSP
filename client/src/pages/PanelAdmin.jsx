import React from "react";
import { Link } from "react-router-dom";
import  alumnosListar  from "../images/alumnosListar.png";
import  profesoresListar  from "../images/profesoresListar.png";
import  buscarUsuario  from "../images/buscarUsuario.png";
import "../styles/panelAdmin.css"

export const PanelAdmin = () => {
  return (
    <div className="crear__wrapper">
      <div className="container__general">
        <h1 className="title__create">Panel de Aministracion</h1>
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
          <Link to={"/"} className="listar__item">
          <img
              src={buscarUsuario}
              alt="Buscar"
              className="icono__listar"
            />
            BUSCAR USUARIOS
          </Link>
        </div>
      </div>
    </div>
  );
};
