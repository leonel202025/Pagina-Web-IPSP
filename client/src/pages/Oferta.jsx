import React from "react";
import { Link } from "react-router-dom";
import "../styles/oferta.css";
import ubicacion from "../images/ubicacion.png";

export const Oferta = () => {
  return (
    <div>
      <h1>🎓 Nuestra Oferta Educativa</h1>
      <h2 className="subtitulo">
        En el Instituto Privado San Pablo ofrecemos una educación integral con
        un enfoque tradicional, formando estudiantes con valores y conocimientos
        sólidos.
      </h2>
      <div className="container__niveles">
        <div className="niveles">
          <h2 className="title__nivel">Nivel Inicial</h2>
          <ul>
            <li>Para Niños de 4 y 5 años</li>
            <li>Enfoque en desarrollo cognitivo, social y emocional</li>
            <li>Actividades ludicas y pedagógicas</li>
          </ul>
        </div>
        <div className="niveles">
          <h2 className="title__nivel">Nivel Primario</h2>
          <ul>
            <li>Para Niños de 4 y 5 años</li>
            <li>Enfoque en desarrollo cognitivo, social y emocional</li>
            <li>Actividades ludicas y pedagógicas</li>
          </ul>
        </div>
        <div className="niveles">
          <h2 className="title__nivel">Nivel Secundario</h2>
          <ul>
            <li>Para Niños de 4 y 5 años</li>
            <li>Enfoque en desarrollo cognitivo, social y emocional</li>
            <li>Actividades ludicas y pedagógicas</li>
          </ul>
        </div>
      </div>
      <h2 className="subtitulo2">📝 Inscripciones Abiertas</h2>
      <p className="inscripciones">
        Las inscripciones se realizan de manera presencial
      </p>
      <p className="informacion">Para mas Informacion</p>
      <div className="direccion__container">
        <img src={ubicacion} alt="Logo" className="ubicacion__img"/>
        <p className="direccion">Lavalle 1765</p>
      </div>
      <p className="O">O</p>
      <div className="button__container">
      <Link to={"/contacto"} className="button__contact">
        Contactanos
      </Link>
      </div>
    </div>
  );
};
