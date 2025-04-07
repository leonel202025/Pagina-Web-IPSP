import React from 'react'
import "../styles/inicio.css";
import { Link } from 'react-router-dom';

export const Inicio = () => {
  return (
    <div className="container__titulo">
    <h1 className="titulo">
    <span>Bienvenidos a la Página Web Oficial del</span>
    <span>Instituto Privado San Pablo</span>
    </h1>
    <Link to={"/login"} className="button">Iniciar Sesión</Link>
    </div>
  )
}
