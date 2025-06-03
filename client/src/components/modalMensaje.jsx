import React from "react";
import "../styles/modalMensaje.css"; // Podés mover el CSS también si querés

const ModalMensaje = ({ visible, mensaje, tipo, onClose }) => {
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
              preserveAspectRatio="xMidYMid meet"
              width="60"
              height="60"
            >
              <circle
                className="circle"
                cx={26}
                cy={26}
                r={23.5}
                fill="none"
                stroke="#4caf50"
                strokeWidth={3}
              />
              <path
                className="check"
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
              preserveAspectRatio="xMidYMid meet"
              width="60"
              height="60"
            >
              <circle
                className="circle"
                cx={26}
                cy={26}
                r={23.5}
                fill="none"
                stroke="#f44336"
                strokeWidth={3}
              />
              <path
                className="cross"
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
              preserveAspectRatio="xMidYMid meet"
              width="60"
              height="60"
            >
              <circle
                className="circle"
                cx={26}
                cy={26}
                r={23.5}
                fill="none"
                stroke="orange"
                strokeWidth={3}
              />
              <path
                className="exclamation-line"
                d="M26 15v14"
                fill="none"
                stroke="orange"
                strokeWidth={3}
                strokeLinecap="round"
              />
              <circle
                className="exclamation-dot"
                cx={26}
                cy={36}
                r={2.5}
                fill="orange"
              />
            </svg>
          )}
        </div>

        <p className="modal-text">{mensaje}</p>
        <button className="modal-btn" onClick={onClose}>
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default ModalMensaje;
