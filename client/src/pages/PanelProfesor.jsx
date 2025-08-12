import React from "react";
import { Link } from "react-router-dom";
import "../styles/PanelProfesor.css"; // archivo CSS separado para este panel
import calificaciones from "../images/calificaciones.png";
import misAlumnos from "../images/misAlumnos.png";
import misMaterias from "../images/misMaterias.png";

export const PanelProfesor = () => {
  return (
    <div className="crear__wrapper">
      <div className="container__general">
        <h1 className="profesor__title">Panel del Profesor</h1>
        <div className="profesor__list">
          <Link to={"/mis-cursos"} className="profesor__item">
            <img
              src={misAlumnos}
              alt="Alumno"
              className="profesor__iconAlumnos"
            />
            MIS ALUMNOS
          </Link>
          <Link to={"/mis-materias"} className="profesor__item">
            <img
              src={misMaterias}
              alt="Materia"
              className="profesor__iconMaterias"
            />
            MIS MATERIAS
          </Link>
          <Link to={"/cargar-notas"} className="profesor__item">
            <img
              src={calificaciones}
              alt="Calificaciones"
              className="profesor__iconCalif"
            />
            CARGAR NOTAS
          </Link>
        </div>
      </div>
    </div>
  );
};
