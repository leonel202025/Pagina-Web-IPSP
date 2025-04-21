import React from "react";
import { Link } from "react-router-dom";
import "../styles/oferta.css";
import ubicacion from "../images/ubicacion.png";

export const Oferta = () => {
  return (
    <div>
      <h1 className="titulo__oferta">🎓 Nuestra Oferta Educativa</h1>
      <h2 className="subtitulo">
        En el Instituto Privado San Pablo ofrecemos una educación integral con
        un enfoque tradicional, formando estudiantes con valores y conocimientos
        sólidos.
      </h2>
      <div className="container__niveles">
        <div className="niveles">
          <h2 className="title__nivel">Nivel Inicial</h2>
          <ul>
            <li>Salas para Niños de 4 y 5 años</li>
            <li>Aprender jugando: promovemos el desarrollo a través del juego y la exploración.</li>
            <li>Un entorno cálido y seguro: espacios pensados para que cada niño se sienta contenido, cuidado y feliz.</li>
          </ul>
        </div>
        <div className="niveles">
          <h2 className="title__nivel">Nivel Primario</h2>
          <ul>
            <li>Para Estudiantes de 1° a 6° Grado</li>
            <li>Acompañamos el crecimiento académico y personal de cada alumno.</li>
            <li>Realizacion de proyectos que despiertan la curiosidad y el deseo de aprender.</li>
          </ul>
        </div>
        <div className="niveles">
          <h2 className="title__nivel">Nivel Secundario</h2>
          <ul>
            <li>Titulo en Comunicación, Arte y Diseño</li>
            <li>Experiencias enriquecedoras: talleres, orientación vocacional, proyectos interdisciplinarios y salidas educativas.</li>
            <li>Preparación para el futuro: formación sólida para el ingreso a estudios superiores o el mundo laboral.</li>
          </ul>
        </div>
      </div>
      <h2 className="subtitulo2">📅 Inscripciones Abiertas para el Ciclo Lectivo 2025</h2>
      <p className="inscripciones">
      Te Invitamos a Conocer Nuestras Instalaciones, Equipo Docente y Propuestas
      </p>
      <p className="inscripciones"> ¡Sumate a Nuestra Comunidad Educativa!</p>
      <p className="informacion">Para más Información</p>
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
