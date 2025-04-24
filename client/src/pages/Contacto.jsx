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
  const [archivo, setArchivo] = useState(null);
  const [status, setStatus] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [modalTipo, setModalTipo] = useState(""); // "exito" o "error"

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus("Enviando...");

    const formData = new FormData();
    formData.append("nombre", nombre);
    formData.append("correo", correo);
    formData.append("asunto", asunto);
    formData.append("mensaje", mensaje);
    if (archivo) {
      formData.append("archivo", archivo);
    }

    fetch("http://localhost:5000/api/contacto", {
      method: "POST",
      body: formData,
    })
      .then(async (res) => {
        if (!res.ok) {
          const errorText = await res.text();
          throw new Error(errorText);
        }
        return res.json();
      })
      .then((data) => {
        setModalMensaje("Mensaje Enviado Correctamente");
        setModalTipo("exito");
        setModalVisible(true);
        setNombre("");
        setCorreo("");
        setAsunto("");
        setMensaje("");
        setArchivo(null);
        setStatus("");
      })
      .catch((err) => {
        setModalMensaje("Error al Enviar el Mensaje");
        setModalTipo("error");
        setModalVisible(true);
        console.error("Error:", err);
        setStatus("");
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
              <option value="Inscripciones">Inscripciones</option>
              <option value="Consulta sobre valor de Cuotas / Matricula">
                Consulta sobre valor de Cuotas / Matricula
              </option>
              <option value="Solicitar Reunión con Dirección / Docente">
                Solicitar Reunión con Dirección / Docente
              </option>
              <option value="Pases / Certificados">Pases / Certificados</option>
              <option value="Vacantes Disponible">Vacantes Disponibles</option>
              <option value="Presentar Curriculum">Presentar Curriculum</option>
              <option value="Otro">Otro</option>
            </select>
          </div>

          {asunto === "Presentar Curriculum" && (
            <div>
              <label htmlFor="archivo">Adjuntar Curriculum</label>
              <input
                type="file"
                id="archivo"
                name="archivo"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setArchivo(e.target.files[0])}
                required={asunto === "Presentar Curriculum"}
              />
            </div>
          )}

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
      {modalVisible && (
        <div className={`modal-overlay`}>
          <div className={`modal-box ${modalTipo}`}>
            <div className="modal-icon">
              {modalTipo === "exito" ? (
                <svg
                  className="icon success"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className="circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path className="check" fill="none" d="M14 27l7 7 17-17" />
                </svg>
              ) : (
                <svg
                  className="icon error"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 52 52"
                >
                  <circle
                    className="circle"
                    cx="26"
                    cy="26"
                    r="25"
                    fill="none"
                  />
                  <path
                    className="cross"
                    fill="none"
                    d="M16 16 36 36 M36 16 16 36"
                  />
                </svg>
              )}
            </div>

            <p className="modal-text">{modalMensaje}</p>
            <button
              className="modal-btn"
              onClick={() => setModalVisible(false)}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
};
