import { useEffect, useState } from "react";
import "../styles/verAlumnos.css";
import ModalMensaje from "../components/ModalMensaje";

export function VerAlumnos() {
  const [alumnos, setAlumnos] = useState([]);
  const [grados, setGrados] = useState([]);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [alumnoAEditar, setAlumnoAEditar] = useState(null);
  const [modalMensaje, setModalMensaje] = useState("");
  const [modalTipo, setModalTipo] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [alumnoAEliminar, setAlumnoAEliminar] = useState(null);

  useEffect(() => {
    fetch("http://localhost:5000/api/usuarios/alumnos")
      .then((res) => res.json())
      .then((data) => setAlumnos(data))
      .catch((err) => console.error("Error al obtener alumnos:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/grados") // Ajusta la URL según tu backend
      .then((res) => res.json())
      .then((data) => setGrados(data))
      .catch((err) => console.error("Error al obtener grados:", err));
  }, []);

  // Extraemos los grados únicos que hay en alumnos
  const gradosUnicos = [...new Set(alumnos.map((a) => a.id_grado))].sort(
    (a, b) => a - b
  );

  const handleAbrirEditar = (alumno) => {
    setAlumnoAEditar(alumno);
    setModalEditarVisible(true);
  };

  const handleEditarChange = (e) => {
    setAlumnoAEditar({
      ...alumnoAEditar,
      [e.target.name]: e.target.value,
    });
  };

  const handleEditarSubmit = async (e) => {
    console.log("handleEditarSubmit ejecutado, datos:", alumnoAEditar);
    e.preventDefault();

    if (!alumnoAEditar) {
      console.error("No hay alumno seleccionado para editar");
      return;
    }

    try {
      const dataToSend = { ...alumnoAEditar };

      console.log("Enviando datos:", dataToSend);
      const res = await fetch(
        `http://localhost:5000/api/usuarios/${alumnoAEditar.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(dataToSend),
        }
      );

      const data = await res.json();

      if (res.ok) {
        setModalMensaje("Alumno Modificado Correctamente");
        setModalTipo("exito");
        setModalEditarVisible(false);
        setModalVisible(true);
        // Recargar alumnos:
        fetch("http://localhost:5000/api/usuarios/alumnos")
          .then((res) => res.json())
          .then((data) => setAlumnos(data));
      } else {
        throw new Error(data.error || "Error al modificar");
      }
    } catch (error) {
      setModalMensaje(error.message);
      setModalTipo("error");
      setModalVisible(true);
    }
  };

  const confirmarEliminarAlumno = async () => {
    if (!alumnoAEliminar) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/usuarios/${alumnoAEliminar.id}`,
        {
          method: "DELETE",
        }
      );

      const data = await res.json();

      if (res.ok) {
        setModalMensaje("Alumno eliminado correctamente");
        setModalTipo("exito");

        // Recargar alumnos con await
        const resAlumnos = await fetch(
          "http://localhost:5000/api/usuarios/alumnos"
        );
        const dataAlumnos = await resAlumnos.json();
        setAlumnos(dataAlumnos);
      } else {
        throw new Error(data.error || "Error al eliminar el alumno");
      }
    } catch (error) {
      setModalMensaje(error.message);
      setModalTipo("error");
    } finally {
      setModalConfirmVisible(false);
      setModalVisible(true);
    }
  };

  return (
    <div className="container__alumnos">
      <h1 className="ver__alumnos-title">Alumnos</h1>
      {gradosUnicos.map((grado) => {
        // Filtrar alumnos de este grado
        const alumnosDelGrado = alumnos.filter((a) => a.id_grado === grado);

        return (
          <div key={grado}>
            <table className="tabla-alumnos">
              <thead>
                <tr>
                  <th className="grado" colSpan="4">
                    {grado}° Grado
                  </th>
                </tr>
                <tr>
                  <th>DNI</th>
                  <th>Nombre</th>
                  <th>Email</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnosDelGrado.map((alumno) => (
                  <tr key={alumno.id}>
                    <td title={alumno.dni}>{alumno.dni}</td>
                    <td title={alumno.nombre}>{alumno.nombre}</td>
                    <td title={alumno.email}>{alumno.email}</td>
                    <td className="acciones">
                      <button
                        className="btn-editar"
                        title="Modificar Datos"
                        onClick={() => handleAbrirEditar(alumno)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="#3498db"
                          viewBox="0 0 24 24"
                        >
                          <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04a1.003 1.003 0 0 0 0-1.42l-2.34-2.34a1.003 1.003 0 0 0-1.42 0l-1.83 1.83 3.75 3.75 1.84-1.82z" />
                        </svg>
                      </button>
                      <button
                        className="btn-eliminar"
                        title="Eliminar Alumno"
                        onClick={() => {
                          setAlumnoAEliminar(alumno);
                          setModalConfirmVisible(true);
                        }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="#e74c3c"
                          viewBox="0 0 24 24"
                        >
                          <path d="M6 19c0 1.104.896 2 2 2h8c1.104 0 2-.896 2-2V7H6v12zm3.46-9.88L12 10.59l2.54-2.47a1 1 0 1 1 1.42 1.42L13.41 12l2.47 2.54a1 1 0 1 1-1.42 1.42L12 13.41l-2.54 2.47a1 1 0 1 1-1.42-1.42L10.59 12 8.12 9.46a1 1 0 0 1 1.34-1.34z" />
                          <path d="M19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
      })}
      {modalEditarVisible && (
        <div className="modal-editar-overlay">
          <div className="modal-editar-container">
            <h1 className="modal-editar-titulo">Modificar Alumno</h1>
            <form className="modal-editar-form" onSubmit={handleEditarSubmit}>
              <input
                name="dni"
                value={alumnoAEditar?.dni || ""}
                onChange={handleEditarChange}
                placeholder="DNI"
              />
              <input
                name="nombre"
                value={alumnoAEditar?.nombre || ""}
                onChange={handleEditarChange}
                placeholder="Nombre"
              />
              <input
                name="email"
                value={alumnoAEditar?.email || ""}
                onChange={handleEditarChange}
                placeholder="Email"
              />
              <select
                name="id_grado"
                value={alumnoAEditar?.id_grado || ""}
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
                className="btn__cancelar-alm"
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
          mensaje={modalMensaje}
          tipo={modalTipo}
          onClose={() => setModalVisible(false)}
        />
      )}
      {modalConfirmVisible && (
        <ModalMensaje
          visible={modalConfirmVisible}
          mensaje={`¿Estás seguro de que querés eliminar a ${alumnoAEliminar?.nombre}?`}
          tipo="confirmacion"
          onConfirm={confirmarEliminarAlumno}
          onClose={() => setModalConfirmVisible(false)}
        />
      )}
    </div>
  );
}
