import React from 'react'
import emilce from "../images/Emilce.png";
import adriana from "../images/Adriana.png";
import mayra from "../images/Mayra.jpg";
import fernanda from "../images/Fernanda.jpg";
import araceli from "../images/Araceli.jpg";
import nancy from "../images/Nancy.jpg";
import viviana from "../images/Viviana.jpg";
import mariel from "../images/Mariel.jpg";
import rodrigo from "../images/Rodrigo.jpg";
import luciana from "../images/Luciana.jpg";
import "../styles/plantel.css"

export const Plantel = () => {
  return (
    <div className='container__plantel'>
      <h1>PLANTEL DOCENTE</h1>
      <h3 className='especialidad'>Autoridad</h3>
      <div className='container__directora'>
        <div className='docente'>
          <img src={emilce} alt="docente" />
          <h3 className='nombre'>Silvia Fariña</h3>
          <h4 className='sala'>Directora</h4>
        </div>
      </div>
      <h3 className='especialidad'>Docentes de Nivel Inicial</h3>
      <div className='container__jardin'>
        <div className='docente'>
          <img src={emilce} alt="docente" />
          <h3 className='nombre'>Emilce Sosa</h3>
          <h4 className='sala'>Jardin 4 años</h4>
        </div>
        <div className='docente'>
          <img src={adriana} alt="docente" />
          <h3 className='nombre'>Adriana Neme</h3>
          <h4 className='sala'>Jardin 5 años</h4>
        </div>
      </div>
      <h3 className='especialidad'>Docentes de Grado</h3>
      <div className='container__grado'>
        <div className='docente'>
          <img src={mayra} alt="docente" />
          <h3 className='nombre'>Mayra Del Viso</h3>
          <h4 className='sala'>1° Grado</h4>
        </div>
        <div className='docente'>
          <img src={fernanda} alt="docente" />
          <h3 className='nombre'>Fernanda Sanchez</h3>
          <h4 className='sala'>2° Grado</h4>
        </div>
        <div className='docente'>
          <img src={araceli} alt="docente" />
          <h3 className='nombre'>Araceli Chorolqui</h3>
          <h4 className='sala'>3° Grado</h4>
        </div>
        <div className='docente'>
          <img src={nancy} alt="docente" />
          <h3 className='nombre'>Nancy Valdez</h3>
          <h4 className='sala'>4° Grado</h4>
        </div>
        <div className='docente'>
          <img src={viviana} alt="docente" />
          <h3 className='nombre'>Viviana Cruz Videla</h3>
          <h4 className='sala'>5° Grado</h4>
        </div>
        <div className='docente'>
          <img src={mariel} alt="docente" />
          <h3 className='nombre'>Mariel Artaza</h3>
          <h4 className='sala'>6° Grado</h4>
        </div>
      </div>
      <h3 className='especialidad'>Docentes de Materias Especiales</h3>
      <div className='container__especial'>
        <div className='docente'>
          <img src={rodrigo} alt="docente" />
          <h3 className='nombre'>Rodrigo Aragón</h3>
          <h4 className='sala'>Música</h4>
        </div>
        <div className='docente'>
          <img src={luciana} alt="docente" />
          <h3 className='nombre'>Luciana Carrasco</h3>
          <h4 className='sala'>Educación Física</h4>
        </div>
        <div className='docente'>
          <img src={rodrigo} alt="docente" />
          <h3 className='nombre'>Rodrigo Aragón</h3>
          <h4 className='sala'>Plástica</h4>
        </div>
        <div className='docente'>
          <img src={rodrigo} alt="docente" />
          <h3 className='nombre'>Rodrigo Aragón</h3>
          <h4 className='sala'>Tecnología</h4>
        </div>
        <div className='docente'>
          <img src={rodrigo} alt="docente" />
          <h3 className='nombre'>Rodrigo Aragón</h3>
          <h4 className='sala'>Religión</h4>
        </div>
        <div className='docente'>
          <img src={rodrigo} alt="docente" />
          <h3 className='nombre'>Rodrigo Aragón</h3>
          <h4 className='sala'>Inglés</h4>
        </div>
      </div>
    </div>
  )
}
