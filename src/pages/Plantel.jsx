import React from 'react'
import emilce from "../images/Emilce.jpg";
import adriana from "../images/Adriana.jpg";
import mayra from "../images/Mayra.jpg";
import fernanda from "../images/Fernanda.jpg";
import "../styles/plantel.css"

export const Plantel = () => {
  return (
    <div className='container__plantel'>
      <h1>PLANTEL DOCENTE</h1>
      <h3 className='especialidad'>Docentes de Nivel Inicial</h3>
      <div className='container__jardin'>
        <div className='docente'>
          <img src={emilce} alt="docente" />
          <h3 className='nombre'>Emilce Sosa</h3>
          <h4 className='sala'>Jardin 4 años</h4>
        </div>
        <div className='docente'>
          <img src={adriana} alt="docente" />
          <h3 className='nombre'>Adriana Jardin</h3>
          <h4 className='sala'>Jardin 5 años</h4>
        </div>
      </div>
      <h3 className='especialidad'>Docentes de Grado</h3>
      <div className='container__grado'>
        <div className='docente'>
          <img src={mayra} alt="docente" />
          <h3 className='nombre'>Mayra Docente</h3>
          <h4 className='sala'>1° Grado</h4>
        </div>
        <div className='docente'>
          <img src={fernanda} alt="docente" />
          <h3 className='nombre'>Fernanda Docente</h3>
          <h4 className='sala'>2° Grado</h4>
        </div>
        <div className='docente'>
          <img src={mayra} alt="docente" />
          <h3 className='nombre'>Mayra Docente</h3>
          <h4 className='sala'>1° Grado</h4>
        </div>
        <div className='docente'>
          <img src={mayra} alt="docente" />
          <h3 className='nombre'>Mayra Docente</h3>
          <h4 className='sala'>1° Grado</h4>
        </div>
        <div className='docente'>
          <img src={mayra} alt="docente" />
          <h3 className='nombre'>Mayra Docente</h3>
          <h4 className='sala'>1° Grado</h4>
        </div>
        <div className='docente'>
          <img src={mayra} alt="docente" />
          <h3 className='nombre'>Mayra Docente</h3>
          <h4 className='sala'>1° Grado</h4>
        </div>
      </div>
    </div>
  )
}
