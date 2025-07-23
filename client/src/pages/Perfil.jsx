import React, { useEffect, useState, useContext } from "react";
import "../styles/perfil.css";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

import ModalMensaje from "../components/ModalMensaje"; // Importar el modal

export const Perfil = () => {
  const [userData, setUserData] = useState(null);
  const { setManualLoading, setLoadingTexto } = useContext(AuthContext);
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);

  // Estados para el modal
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [modalTipo, setModalTipo] = useState("exito"); // exito, error, advertencia, confirmacion

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const response = await fetch("/api/auth/perfil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get("content-type");

        if (response.ok && contentType.includes("application/json")) {
          const data = await response.json();
          setUserData(data);
        } else {
          const text = await response.text();
          console.error("Respuesta inesperada:", text);

          // Mostrar modal en vez de alert
          setModalMensaje("Error al cargar perfil");
          setModalTipo("error");
          setModalVisible(true);
        }
      } catch (error) {
        console.error("Error al traer perfil:", error);
        setModalMensaje("Error al cargar perfil");
        setModalTipo("error");
        setModalVisible(true);
      }
    };

    fetchPerfil();
  }, []);

  const handleImagenSeleccionada = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const formData = new FormData();
    formData.append("foto", archivo);
    formData.append("userId", userData.id);

    fetch("http://localhost:5000/api/usuarios/perfil/foto", {
      method: "POST",
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        // Mostrar modal en vez de alert
        setModalMensaje("Imagen actualizada");
        setModalTipo("exito");
        setModalVisible(true);

        // Podés recargar el perfil después de cerrar el modal
        // Por eso acá no recargamos inmediatamente, lo hacemos cuando se cierra el modal
      })
      .catch((err) => {
        console.error("Error al subir imagen", err);
        setModalMensaje("Error al subir la imagen");
        setModalTipo("error");
        setModalVisible(true);
      });
  };

  const handleLogout = () => {
    setManualLoading(true);
    logout();
    setTimeout(() => {
      navigate("/");
      setLoadingTexto("Cargando");
      setManualLoading(false);
    }, 4000);
  };

  // Función para cerrar modal
  const cerrarModal = () => {
    setModalVisible(false);
    // Si querés recargar después de cerrar el modal de éxito por imagen actualizada:
    if (modalMensaje === "Imagen actualizada") {
      window.location.reload();
    }
  };

  if (!userData) return <p className="texto-cargando">Cargando perfil...</p>;

  return (
    <>
      <div className="perfil-container">
        <div className="avatar-wrapper">
          {userData.foto_perfil ? (
            <img
              src={`http://localhost:5000${userData.foto_perfil}`}
              alt="Foto de perfil"
              className="perfil-avatar-img"
            />
          ) : (
            <div className="perfil-avatar">{userData.nombre?.[0] || "U"}</div>
          )}

          <label
            htmlFor="foto-input"
            className="boton-editar-avatar"
            title="Cambiar foto"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path
                d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 
                7.04a1.003 1.003 0 000-1.41l-2.34-2.34a1.003 1.003 0 00-1.41 
                0l-1.83 1.83 3.75 3.75 1.83-1.83z"
              />
            </svg>
          </label>

          <input
            type="file"
            id="foto-input"
            accept="image/*"
            onChange={handleImagenSeleccionada}
            style={{ display: "none" }}
          />
        </div>

        <h2 className="perfil-nombre">{userData.nombre}</h2>
        <p className="perfil-email">{userData.email}</p>

        <div className="perfil-info">
          <p>
            <span>DNI:</span> {userData.dni}
          </p>
          <p>
            <span>Rol:</span> {userData.rol}
          </p>
        </div>
        <button onClick={handleLogout} className="boton-logout">
          Cerrar sesión
        </button>
      </div>

      {/* Modal */}
      <ModalMensaje
        visible={modalVisible}
        mensaje={modalMensaje}
        tipo={modalTipo}
        onClose={cerrarModal}
        onConfirm={() => {
          /* si tenés confirmaciones, las manejás acá */
          setModalVisible(false);
        }}
      />
    </>
  );
};
