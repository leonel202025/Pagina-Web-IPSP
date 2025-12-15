import React, { useContext } from "react";
import "../styles/inicio.css";
import { Link } from "react-router-dom";
import { AuthContext } from '../context/authContext';
import { useNavigate } from 'react-router-dom';

export const Inicio = () => {
  const { setManualLoading, setLoadingTexto } = useContext(AuthContext);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  const handleLogout = () => {
    setManualLoading(true);
  
    logout();

    setTimeout(() => {
      navigate("/");
      setLoadingTexto("Cargando");
      setManualLoading(false); 
    }, 4000);
  };
  
  return (
    <div className="container__titulo">
      <h1 className="titulo">
        <span>Bienvenidos a la Página Web Oficial del</span>
        <span>Instituto Privado San Pablo</span>
      </h1>
      {!user && (
        <>
          <Link to={"/login"} className="button">
            Iniciar Sesión
          </Link>
        </>
      )}
      {user && (
        <>
          <Link to={"/"} className="button" onClick={handleLogout}>Cerrar Sesión</Link>
        </>
      )}
    </div>
  );
};
