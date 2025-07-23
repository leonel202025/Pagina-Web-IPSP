import React from "react";
import "../styles/modalMensaje.css";

const ModalMensaje = ({
  visible,
  mensaje,
  tipo,
  onClose,
  onConfirm,
  onCancelar,
  onVolverAlPanel
}) => {
  if (!visible) return null;

  return (
    <div className="modal-overlay">
      <div className={`modal-box ${tipo}`}>
        <div className="modal-icon">
          {tipo === "exito" && (
            <svg
              className="icon success"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
              width="60"
              height="60"
            >
              <circle
                cx={26}
                cy={26}
                r={23.5}
                fill="none"
                stroke="#4caf50"
                strokeWidth={3}
              />
              <path
                fill="none"
                d="M14 27l7 7 17-17"
                stroke="#4caf50"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {tipo === "error" && (
            <svg
              className="icon error"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
              width="60"
              height="60"
            >
              <circle
                cx={26}
                cy={26}
                r={23.5}
                fill="none"
                stroke="#f44336"
                strokeWidth={3}
              />
              <path
                fill="none"
                d="M16 16 L36 36 M36 16 L16 36"
                stroke="#f44336"
                strokeWidth={3}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}

          {tipo === "advertencia" && (
            <svg
              className="icon warning"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
              width="60"
              height="60"
            >
              <circle
                cx={26}
                cy={26}
                r={23.5}
                fill="none"
                stroke="orange"
                strokeWidth={3}
              />
              <path
                d="M26 15v14"
                fill="none"
                stroke="orange"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle cx={26} cy={36} r={2.5} fill="orange" />
            </svg>
          )}

          {tipo === "confirmacion" && (
            <svg
              className="icon confirm"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 52 52"
              width="60"
              height="60"
            >
              <circle
                cx={26}
                cy={26}
                r={23.5}
                fill="none"
                stroke="orange"
                strokeWidth={3}
              />
              <path
                fill="none"
                d="M26 16v12"
                stroke="orange"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle cx={26} cy={36} r={2.5} fill="orange" />
            </svg>
          )}
        </div>

        <div className="modal-text">{typeof mensaje === "string" ? <p>{mensaje}</p> : mensaje}</div>

        {tipo === "confirmacion" ? (
          <div className="modal-buttons">
            <button className="modal-btn confirmar" onClick={onConfirm}>
              Confirmar
            </button>
            <button
              className="modal-btn cancelar"
              onClick={onCancelar || onClose}
            >
              Cancelar
            </button>
          </div>
        ) : mensaje === "Usuario eliminado correctamente" ? (
          <div className="modal-buttons">
            <button
              className="modal-btn confirmar"
              onClick={onVolverAlPanel} // ✅ usás la prop
            >
              Volver al Panel del Administrador
            </button>
            <button
              className="modal-btn cancelar"
              onClick={() => {
                onClose();
                if (typeof window.abrirModalBuscarOtroUsuario === "function") {
                  window.abrirModalBuscarOtroUsuario();
                }
              }}
            >
              Buscar otro Usuario
            </button>
          </div>
        ) : (
          <button className="modal-btn" onClick={onClose}>
            Cerrar
          </button>
        )}
      </div>
    </div>
  );
};

export default ModalMensaje;
