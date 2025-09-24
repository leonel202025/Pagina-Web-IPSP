import { Link } from "react-router-dom";
import "../styles/CrearUsuario.css";
import Alumno from "../images/Alumno.png"
import Profesor from "../images/Profesor.png"
import Evento from "../images/Evento.png"

export const CreateUsuario = () => {
  return (
    <div className="crear__wrapper">
      <div className="container__general">
        <h1 className="title__create">Elige una Opción</h1>
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
              className="icono__crear-profesor"
            />
            PROFESOR
          </Link>
          <Link to={"/crear-evento"} className="crear__item">
            <img
              src= {Evento}
              alt="Evento"
              className="icono__crear-profesor"
            />
            EVENTO
          </Link>
        </div>
      </div>
    </div>
  );
};
