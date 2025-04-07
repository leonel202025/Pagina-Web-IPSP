import React from 'react'
import "../styles/nosotros.css"
import logo from "../images/logo.png";

export const Nosotros = () => {
  return (
    <>
        <div>
          <h1>Nuestra Historia</h1>
        </div>
        <div className='container__historia'>
          <div className='historia'>
            <p>
            El Colegio San Pablo nació como Instituto de Capacitación en Mecánica Dental en 1980, funcionando con horarios matutinos y vespertinos. Su propietario y representante legal era el Sr. Pablo Otaiza.
            Por pedido de las madres que asistían como alumnas a la institución y que necesitaban un lugar para albergar a sus niños, surgió en marzo de 1983 el jardín de infantes, por resolución ministerial 842/14. Al año siguiente, se dio la apertura al nivel primario, llegando al séptimo grado por promoción de los alumnos.</p>
            <p>
            En diciembre de 1991, por gestión de su titular ante la Superintendencia Nacional de la Educación Primaria y la actuación n° 11227/90, el Departamento de Supervisión Pedagógica autorizó la matriculación a 1° año del Ciclo Básico Unificado (CBU). Por crecimiento vegetativo, se autorizó la creación del 2° año por disposición n° 1761.
            </p>
            <p>
            A fines de 1992, el instituto recibió aires renovados y nuevos impulsos. Cambió su titularidad a manos de los actuales propietarios: el Sr. Ángel Eusebio Molina y su esposa, la profesora Mercedes Gaudioso de Molina, quien asumió ante la SNEP.
            </p>
            <p>
            En 1993, se dio apertura a 3° año de CBU. Su primera promoción de nivel secundario se llevó a cabo en 1995.
            </p>
            <p>
            En el año 2000, se comenzó a implementar en la institución la nueva Ley Federal de Educación n° 24195, transformando el 7° año de EGB III y, así progresivamente, se fue complementando la EGB III y el polimodal con orientación en "Comunicación, Arte y Diseño", siendo la primera promoción de polimodal en el ciclo lectivo 2005.
            </p>
          </div>
          <div className='container__logo'>
            <img src={logo} alt="logo ipsp" className='logo'/>
          </div>
        </div>
        </>
  )
}
