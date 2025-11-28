import React from "react";
import "../styles/documentos.css";

export const Documentos = () => {

  const documentos = [
    {
      nombre: "Ficha Médica",
      archivo: "FICHA-MEDICA-DE-ALUMNOS.pdf",
    },
    {
      nombre: "Autorización de Retiro a la Salida",
      archivo: "AUTORIZACION-DE-RETIRO-A-LA-SALIDA.pdf",
    },
    {
      nombre: "Autorización Policial",
      archivo: "AUTORIZACION-POLICIAL.pdf",
    },
  ];

  const API_URL = "http://localhost:5000/api/documentos/";

  return (
    <div className="documentos_container">
      <h1 className="documentos_title">Documentos</h1>

      <div className="documentos_lista">
        {documentos.map((doc, i) => (
          <div key={i} className="documento_item">
            <span className="documento_nombre">{doc.nombre}</span>

            <a
              href={API_URL + encodeURIComponent(doc.archivo)}
              className="documento_btn_icon"
              title="Descargar PDF"
            >
              {/* Ícono SVG */}
              <svg 
                title="Descargar PDF"
                xmlns="http://www.w3.org/2000/svg" 
                height="24" 
                width="24" 
                viewBox="0 0 24 24" 
                fill="white"
              >
                <path d="M12 16q-.2 0-.375-.062t-.325-.188L6.7 11.15q-.3-.3-.288-.713.013-.412.313-.712.3-.3.712-.3.413 0 .713.3L11 12.325V4q0-.425.288-.712Q11.575 3 12 3t.712.288Q13 3.575 13 4v8.325l2.85-2.85q.3-.3.713-.3.412 0 .712.3.3.3.3.712 0 .413-.3.713l-4.6 4.6q-.15.15-.325.212-.175.063-.35.063ZM6 21q-.825 0-1.412-.587Q4 19.825 4 19v-3q0-.425.288-.712Q4.575 15 5 15t.712.288Q6 15.575 6 16v3h12v-3q0-.425.288-.712Q18.575 15 19 15t.712.288Q20 15.575 20 16v3q0 .825-.587 1.413Q18.825 21 18 21Z"/>
              </svg>
            </a>

          </div>
        ))}
      </div>
    </div>
  );
};
