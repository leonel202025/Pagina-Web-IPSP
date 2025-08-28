import React, { useContext, useEffect, useState } from "react";
import "../styles/perfil.css";

import ModalMensaje from "../components/ModalMensaje";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export const BuscarUsuario = () => {
  const {
    manualLoading,
    setManualLoading,
    loadingTexto,
    setLoadingTexto,
    usuarioBuscado,
    setUsuarioBuscado,
    modalVisibleUsuario,
    setModalVisibleUsuario,
  } = useContext(AuthContext);

  const [modalTipo, setModalTipo] = useState("confirmacion");
  const [modalMensaje, setModalMensaje] = useState(
    "Ingresá el DNI del ALUMNO que deseas buscar:"
  );
  const [dni, setDni] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [usuarioAEliminar, setUsuarioAEliminar] = useState(null);
  const [usuarioEliminado, setUsuarioEliminado] = useState(false);

  const [grados, setGrados] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !usuarioBuscado &&
      !manualLoading &&
      !modalVisibleUsuario &&
      !modalVisible &&
      !modalEditarVisible &&
      !modalConfirmVisible
    ) {
      setModalVisibleUsuario(true);
      setModalTipo("confirmacion");
      setModalMensaje("Ingresá el DNI del ALUMNO que deseas buscar:");
    }
  }, [
    usuarioBuscado,
    manualLoading,
    modalVisibleUsuario,
    modalVisible,
    modalEditarVisible,
    modalConfirmVisible,
  ]);

  useEffect(() => {
    fetch("http://localhost:5000/api/grados")
      .then((res) => res.json())
      .then((data) => setGrados(data))
      .catch((err) => console.error("Error al obtener grados:", err));
  }, []);

  useEffect(() => {
    window.abrirModalBuscarOtroUsuario = () => {
      setModalVisibleUsuario(true);
      setUsuarioBuscado(null);
      setDni("");
      setModalTipo("confirmacion");
      setModalMensaje("Ingresá el DNI del ALUMNO que deseas buscar:");
    };

    return () => {
      delete window.abrirModalBuscarOtroUsuario;
    };
  }, []);

  const volverAlPanel = () => {
    setModalVisible(false);
    setUsuarioBuscado(null);
    setDni("");
    navigate("/panel-admin");
  };

  const buscarUsuario = async () => {
    if (dni.trim() === "") return;

    setManualLoading(true);
    setLoadingTexto("Buscando...");
    setUsuarioBuscado(null);

    try {
      const res = await fetch(
        `http://localhost:5000/api/usuarios/buscar/${dni}?rol=alumno`
      );

      const data = await res.json();

      if (res.ok && data) {
        setTimeout(() => {
          setLoadingTexto("Alumno encontrado");
          setTimeout(() => {
            setUsuarioBuscado(data);
            setManualLoading(false);
            setModalVisibleUsuario(false);
          }, 2000);
        }, 2000);
      } else {
        setManualLoading(false);
        setUsuarioBuscado(null);

        if (!modalVisibleUsuario) {
          setTimeout(() => setModalVisibleUsuario(true), 100);
        }
      }
    } catch (err) {
      console.error("Error al buscar usuario:", err);
      setManualLoading(false);
      setUsuarioBuscado(null);

      if (!modalVisibleUsuario) {
        setTimeout(() => setModalVisibleUsuario(true), 100);
      }
    }
  };

  const handleCancelar = () => {
    setModalVisibleUsuario(false);
    setModalTipo("confirmacion");
    setModalMensaje("Ingresá el DNI del ALUMNO que deseas buscar:");
    navigate("/panel-admin");
  };

  const handleAbrirEditar = () => {
    setUsuarioAEditar(usuarioBuscado);
    setModalEditarVisible(true);
  };

  const handleEditarChange = (e) => {
    setUsuarioAEditar({
      ...usuarioAEditar,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditarSubmit = async (e) => {
    e.preventDefault();
    if (!usuarioAEditar) return;

    try {
      const dataToSend = { ...usuarioAEditar };
      const res = await fetch(
        `http://localhost:5000/api/usuarios/${
          usuarioAEditar.id || usuarioAEditar.dni
        }`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setModalMensaje("Usuario modificado correctamente");
        setModalTipo("exito");
        setModalEditarVisible(false);
        setModalVisible(true);
        setUsuarioBuscado(dataToSend);
      } else {
        throw new Error(data.error || "Error al modificar usuario");
      }
    } catch (error) {
      setModalMensaje(error.message);
      setModalTipo("error");
      setModalEditarVisible(false);
      setModalVisible(true);
    }
  };

  const confirmarEliminarUsuario = async () => {
    if (!usuarioAEliminar) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/usuarios/${
          usuarioAEliminar.id || usuarioAEliminar.dni
        }`,
        { method: "DELETE" }
      );
      const data = await res.json();

      if (res.ok) {
        setModalMensaje("Usuario eliminado correctamente");
        setModalTipo("exito");
        setUsuarioBuscado(null);
        setUsuarioEliminado(true);
      } else {
        throw new Error(data.error || "Error al eliminar el usuario");
      }
    } catch (error) {
      setModalMensaje(error.message);
      setModalTipo("error");
    } finally {
      setModalConfirmVisible(false);
      setModalVisible(true);
      setTimeout(() => setUsuarioEliminado(false), 500);
    }
  };

  return (
    <>
      <ModalMensaje
        visible={modalVisibleUsuario && !usuarioBuscado && !manualLoading}
        tipo={modalTipo}
        mensaje={
          <div>
            <p>{modalMensaje}</p>
            {modalTipo === "confirmacion" && (
              <input
                type="text"
                placeholder="DNI"
                value={dni}
                onChange={(e) => setDni(e.target.value)}
                className="input-dni"
              />
            )}
          </div>
        }
        onClose={() => {
          setModalVisibleUsuario(false);
          setModalMensaje("Ingresá el DNI del ALUMNO que deseas buscar:");
          setModalTipo("confirmacion");
        }}
        onCancelar={handleCancelar}
        onConfirm={(e) => {
          e.preventDefault();
          buscarUsuario();
        }}
      />

      {!manualLoading && usuarioBuscado && (
        <div className="perfil-container">
          <div className="avatar-wrapper">
            {usuarioBuscado.foto_perfil ? (
              <img
                src={`http://localhost:5000${usuarioBuscado.foto_perfil}`}
                alt="Foto de perfil"
                className="perfil-avatar-img"
              />
            ) : (
              <div className="perfil-avatar">
                {usuarioBuscado.nombre?.[0] || "U"}
              </div>
            )}
          </div>

          <h2 className="perfil-nombre">{usuarioBuscado.nombre}</h2>
          <p className="perfil-email">{usuarioBuscado.email}</p>

          <div className="perfil-info">
            <p>
              <span>DNI:</span> {usuarioBuscado.dni}
            </p>
            <p>
              <span>Grado:</span> {usuarioBuscado.id_grado}° Grado
            </p>
            <button className="boton-editar" onClick={handleAbrirEditar}>
              Editar Información
            </button>
            <button
              className="boton-eliminar"
              onClick={() => {
                setUsuarioAEliminar(usuarioBuscado);
                setModalConfirmVisible(true);
              }}
            >
              Eliminar Usuario
            </button>
            <button
              className="btn__buscar-otro"
              onClick={() => {
                setModalVisibleUsuario(true);
                setModalTipo("confirmacion");
                setModalMensaje("Ingresá el DNI del ALUMNO que deseas buscar:");
                setUsuarioBuscado(null);
                setDni("");
              }}
            >
              Buscar otro Usuario
            </button>
            <button className="boton-volver" onClick={volverAlPanel}>
              Volver al Panel del Administrador
            </button>
          </div>
        </div>
      )}

      {modalEditarVisible && usuarioAEditar && (
        <div className="modal-editar-overlay">
          <div className="modal-editar-container">
            <h1 className="modal-editar-titulo">Modificar Usuario</h1>
            <form className="modal-editar-form" onSubmit={handleEditarSubmit}>
              <input
                name="dni"
                value={usuarioAEditar.dni || ""}
                onChange={handleEditarChange}
                placeholder="DNI"
              />
              <input
                name="nombre"
                value={usuarioAEditar.nombre || ""}
                onChange={handleEditarChange}
                placeholder="Nombre"
              />
              <input
                name="email"
                value={usuarioAEditar.email || ""}
                onChange={handleEditarChange}
                placeholder="Email"
              />
              <select
                name="id_grado"
                value={usuarioAEditar.id_grado || ""}
                onChange={handleEditarChange}
              >
                <option value="">Seleccionar grado</option>
                {grados.map((grado) => (
                  <option key={grado.id} value={grado.id}>
                    {grado.grado}
                  </option>
                ))}
              </select>
              <button type="submit">Guardar Cambios</button>
              <button
                type="button"
                className="cancelar"
                onClick={() => setModalEditarVisible(false)}
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}

      {modalVisible && (
        <ModalMensaje
          visible={modalVisible}
          tipo={modalTipo}
          mensaje={modalMensaje}
          onClose={() => {
            setModalVisible(false);
            if (modalMensaje === "Usuario eliminado correctamente") return;
            setModalVisibleUsuario(true);
            setModalTipo("confirmacion");
            setModalMensaje("Ingresá el DNI del ALUMNO que deseas buscar:");
          }}
          onVolverAlPanel={volverAlPanel}
        />
      )}

      {modalConfirmVisible && (
        <ModalMensaje
          visible={modalConfirmVisible}
          tipo="confirmacion"
          mensaje={`¿Estás seguro de que querés eliminar a ${usuarioAEliminar?.nombre}?`}
          onConfirm={confirmarEliminarUsuario}
          onClose={() => setModalConfirmVisible(false)}
        />
      )}
    </>
  );
};
