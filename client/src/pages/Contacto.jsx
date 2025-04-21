import React, { useState } from "react";
import "../styles/contacto.css";
import whatsapp from "../images/wp.png";
import facebook from "../images/face.png";
import instagram from "../images/ig.png";

export const Contacto = () => {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [asunto, setAsunto] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [status, setStatus] = useState(""); // Añadido para manejar el estado de envío

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Enviando..."); // Cambia el estado para mostrar que se está enviando

    fetch("http://localhost:5000/api/contacto", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nombre, correo, asunto, mensaje }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        return res.json();
      })
      .then((data) => {
        alert("Mensaje enviado correctamente");
        setNombre("");
        setCorreo("");
        setAsunto("");
        setMensaje("");
        setStatus(""); // Resetea el estado de envío
      })
      .catch((err) => {
        alert("Error al enviar el mensaje");
        console.error("Error:", err);
        setStatus(""); // Resetea el estado de envío si ocurre un error
      });
  };

  return (
    <>
      <div className="form__container">
        <h1 className="titulo">Contacto</h1>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre">Nombre y Apellido</label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              placeholder="Ricardo Rodriguez"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="email">Correo electrónico</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Example@gmail.com"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="asunto">Asunto</label>
            <select
              id="asunto"
              name="asunto"
              value={asunto}
              onChange={(e) => setAsunto(e.target.value)}
              required
            >
              <option value="">-- Seleccioná un Asunto --</option>
              <option value="inscripciones">Inscripciones / Admisiones</option>
              <option value="aranceles">
                Consulta sobre Aranceles / Pagos
              </option>
              <option value="requisitos">Requisitos de Ingreso</option>
              <option value="reunion">
                Solicitar Reunión con Dirección / Docente
              </option>
              <option value="pases">Pases / Certificados</option>
              <option value="eventos">Eventos Escolares</option>
              <option value="sugerencias">Vacantes Disponibles</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          <div>
            <label htmlFor="mensaje">Mensaje</label>
            <textarea
              id="mensaje"
              name="mensaje"
              rows="5"
              value={mensaje}
              onChange={(e) => setMensaje(e.target.value)}
              required
            ></textarea>
          </div>

          <button type="submit" disabled={status === "Enviando..."}>
            {status || "Enviar"}
          </button>
        </form>
      </div>

      <div className="container__info">
        <p className="canales">Canales de Comunicación</p>
        <div className="container__logos">
          <a
            href="https://wa.me/5493816043403"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={whatsapp} alt="WhatsApp" className="logo__item" />
          </a>
          <a
            href="https://www.facebook.com/p/Instituto-Privado-San-Pablo-100063518532303/?locale=es_LA"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={facebook} alt="Facebook" className="logo__item" />
          </a>
          <a
            href="https://www.instagram.com/institutoprivadosanpablo"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src={instagram} alt="Instagram" className="logo__item" />
          </a>
        </div>
      </div>
    </>
  );
};
