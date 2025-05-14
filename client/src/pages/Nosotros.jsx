import React from 'react'
import "../styles/nosotros.css"
import logo from "../images/logo.png";

export const Nosotros = () => {
  return (
    <>
        <div>
          <h1 className='historia__titulo'>Nuestra Historia</h1>
        </div>
        <div className='container__historia'>
          <div className='historia'>
            <p>
            El Colegio San Pablo nació como Instituto de Capacitación en Mecánica Dental en 1980, funcionando con horarios matutinos y vespertinos. Su propietario y representante legal era el Sr. Pablo Otaiza.
            Por pedido de las madres que asistían como alumnas a la Institución y que necesitaban un lugar para albergar a sus niños, surgió en Marzo de 1983 el Jardín de Infantes, por Resolución Ministerial 842/14. Al año siguiente, se dio la apertura al Nivel Primario, llegando al Séptimo Grado por promoción de los alumnos.</p>
            <p>
            En diciembre de 1991, por gestión de su titular ante la Superintendencia Nacional de la Educación Primaria y la actuación N° 11227/90, el Departamento de Supervisión Pedagógica autorizó la matriculación a 1° año del Ciclo Básico Unificado (CBU). Por crecimiento vegetativo, se autorizó la creación del 2° año por disposición N° 1761.
            </p>
            <p>
            A fines de 1992, el Instituto recibió aires renovados y nuevos impulsos. Cambió su titularidad a manos de los actuales propietarios: el Sr. Ángel Eusebio Molina y su esposa, la Profesora Mercedes Gaudioso de Molina, quien asumió ante la SNEP.
            </p>
            <p>
            En 1993, se dio apertura a 3° año de CBU. Su primera promoción de Nivel Secundario se llevó a cabo en 1995.
            </p>
            <p>
            En el año 2000, se comenzó a implementar en la Institución la Nueva Ley Federal de Educación N° 24195, transformando el 7° año de EGB III y, así progresivamente, se fue complementando la EGB III y el Polimodal con orientación en "Comunicación, Arte y Diseño", siendo la primera promoción de Polimodal en el Ciclo Lectivo 2005.
            </p>
          </div>
          <div className='container__logo'>
            <img src={logo} alt="logo ipsp" className='logo'/>
          </div>
        </div>
        </>
  )
}
