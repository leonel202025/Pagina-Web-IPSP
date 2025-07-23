import { useEffect, useState } from "react";
import "../styles/verProfesores.css";
import ModalMensaje from "../components/ModalMensaje";

export function VerProfesores() {
  const [profesores, setProfesores] = useState([]);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [profesorAEditar, setProfesorAEditar] = useState(null);
  const [gradosSeleccionados, setGradosSeleccionados] = useState([]);
  const [asignaturasSeleccionadas, setAsignaturasSeleccionadas] = useState([]);
  const [grados, setGrados] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [modalMensajeVisible, setModalMensajeVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [modalMensajeTipo, setModalMensajeTipo] = useState("");
  const [profesorAEliminar, setProfesorAEliminar] = useState(null);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [modalTipo, setModalTipo] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [modalExitoVisible, setModalExitoVisible] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/api/usuarios/profesores")
      .then((res) => res.json())
      .then((data) => setProfesores(data))
      .catch((err) => console.error("Error al obtener profesores:", err));
  }, []);

  useEffect(() => {
    fetch("http://localhost:5000/api/grados")
      .then((res) => res.json())
      .then((data) => setGrados(data));

    fetch("http://localhost:5000/api/asignaturas")
      .then((res) => res.json())
      .then((data) => setAsignaturas(data));
  }, []);

  const handleAbrirEditar = (profesor) => {
    console.log("grados_ids:", profesor.grados_ids);
    console.log("asignaturas_ids:", profesor.asignaturas_ids);
    setProfesorAEditar({ ...profesor });
    setGradosSeleccionados(profesor.grados_ids || []);
    setAsignaturasSeleccionadas(profesor.asignaturas_ids || []);
    setModalEditarVisible(true);
  };

  const handleGuardarCambios = async () => {
    try {
      const actualizado = {
        ...profesorAEditar,
        grados: gradosSeleccionados,
        asignaturas: asignaturasSeleccionadas,
      };

      const res = await fetch(
        `http://localhost:5000/api/usuarios/profesores/${actualizado.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(actualizado),
        }
      );

      const data = await res.json();

      if (res.ok) {
        // Vuelve a cargar todos los profesores actualizados
        const resProfes = await fetch(
          "http://localhost:5000/api/usuarios/profesores"
        );
        const dataProfes = await resProfes.json();
        setProfesores(dataProfes);

        // Cierra el modal de edición
        setModalEditarVisible(false);

        // Muestra el mensaje de éxito
        setModalMensaje("Cambios guardados correctamente");
        setModalMensajeTipo("exito");
        setModalMensajeVisible(true);
      } else {
        console.error("Error al editar:", data.error);
      }
    } catch (err) {
      console.error("Fallo al guardar cambios:", err);
    }
  };

  // Cuando clickeás eliminar, guardás ese profesor (o su id)
  const handleEliminarClick = (profesor) => {
    setProfesorAEliminar(profesor);
    setModalConfirmVisible(true); // si usas modal de confirmación
  };

  const confirmarEliminarProfesor = async () => {
    if (!profesorAEliminar) return;

    try {
      const res = await fetch(
        `http://localhost:5000/api/usuarios/profesores/${profesorAEliminar.id}`,
        {
          method: "DELETE",
        }
      );

      if (res.ok) {
        setProfesores((prev) =>
          prev.filter((p) => p.id !== profesorAEliminar.id)
        );
        setModalConfirmVisible(false);
        setProfesorAEliminar(null);

        // Mostrar modal de éxito:
        setMensajeExito("Profesor eliminado correctamente");
        setModalExitoVisible(true);
      } else {
        const data = await res.json();
        console.error("Error al eliminar:", data.error);
      }
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  return (
    <div className="container__alumnos">
      <h1 className="ver_title">Profesores</h1>
      <table>
        <thead>
          <tr>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Materias</th>
            <th>Grados</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((profesor) => (
            <tr key={profesor.id}>
              <td>{profesor.dni}</td>
              <td>{profesor.nombre}</td>
              <td>{profesor.email}</td>
              <td>{profesor.materias}</td>
              <td>{profesor.grados}</td>
              <td className="acciones">
                <button
                  className="btn-editar"
                  title="Modificar Datos"
                  onClick={() => handleAbrirEditar(profesor)}
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
                  onClick={() => handleEliminarClick(profesor)}
                  className="btn-eliminar"
                  title="Eliminar Profesor"
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
      {modalEditarVisible && profesorAEditar && (
        <div className="modal-profesor__overlay">
          <div className="modal-profesor__container">
            <h1 className="modal-profesor__title">Editar Profesor</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGuardarCambios();
              }}
              className="modal-profesor__form"
            >
              {/* DATOS PERSONALES */}
              <div className="modal-profesor__section">
                <label className="modal-profesor__label">
                  <strong>Datos Personales</strong>
                </label>
                <div className="modal-profesor__row">
                  <input
                    className="modal-profesor__input"
                    name="dni"
                    value={profesorAEditar.dni}
                    onChange={(e) =>
                      setProfesorAEditar({
                        ...profesorAEditar,
                        dni: e.target.value,
                      })
                    }
                    placeholder="DNI"
                    required
                  />
                  <input
                    className="modal-profesor__input"
                    name="nombre"
                    value={profesorAEditar.nombre}
                    onChange={(e) =>
                      setProfesorAEditar({
                        ...profesorAEditar,
                        nombre: e.target.value,
                      })
                    }
                    placeholder="Nombre"
                    required
                  />
                </div>
                <div className="modal-profesor__row">
                  <input
                    className="modal-profesor__input"
                    name="email"
                    type="email"
                    value={profesorAEditar.email}
                    onChange={(e) =>
                      setProfesorAEditar({
                        ...profesorAEditar,
                        email: e.target.value,
                      })
                    }
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              {/* CHECKBOXES */}
              <div className="modal-profesor__checkboxes">
                <div className="modal-profesor__column">
                  <label className="modal-profesor__label">
                    <strong>Grados</strong>
                  </label>
                  <div className="modal-profesor__checkbox-list">
                    {grados.map((grado) => (
                      <label
                        key={grado.id}
                        className="modal-profesor__checkbox-item"
                      >
                        <input
                          type="checkbox"
                          value={grado.id}
                          checked={gradosSeleccionados.includes(grado.id)}
                          onChange={(e) => {
                            const id = Number(e.target.value);
                            setGradosSeleccionados(
                              e.target.checked
                                ? [...gradosSeleccionados, id]
                                : gradosSeleccionados.filter((i) => i !== id)
                            );
                          }}
                        />
                        <span>{grado.grado}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="modal-profesor__column">
                  <label className="modal-profesor__label">
                    <strong>Asignaturas</strong>
                  </label>
                  <div className="modal-profesor__checkbox-list">
                    {asignaturas.map((asig) => (
                      <label
                        key={asig.id}
                        className="modal-profesor__checkbox-item"
                      >
                        <input
                          type="checkbox"
                          value={asig.id}
                          checked={asignaturasSeleccionadas.includes(asig.id)}
                          onChange={(e) => {
                            const id = Number(e.target.value);
                            setAsignaturasSeleccionadas(
                              e.target.checked
                                ? [...asignaturasSeleccionadas, id]
                                : asignaturasSeleccionadas.filter(
                                    (i) => i !== id
                                  )
                            );
                          }}
                        />
                        <span>{asig.asignatura}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              {/* BOTONES */}
              <div className="modal-profesor__footer">
                <button type="submit" className="modal-profesor__btn guardar">
                  Guardar Cambios
                </button>
                <button
                  type="button"
                  className="modal-profesor__btn cancelar"
                  onClick={() => setModalEditarVisible(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <ModalMensaje
        visible={modalMensajeVisible}
        mensaje={modalMensaje}
        tipo={modalMensajeTipo}
        onClose={() => setModalMensajeVisible(false)}
      />
      <ModalMensaje
        visible={modalConfirmVisible}
        mensaje={`¿Estás seguro que deseas eliminar al profesor ${profesorAEliminar?.nombre}?`}
        tipo="confirmacion"
        onClose={() => setModalConfirmVisible(false)}
        onConfirm={confirmarEliminarProfesor}
      />
      <ModalMensaje
        visible={modalVisible}
        mensaje={modalMensaje}
        tipo={modalTipo}
        onClose={() => setModalVisible(false)}
      />
      {modalExitoVisible && (
        <ModalMensaje
          visible={modalExitoVisible}
          tipo="exito"
          mensaje={mensajeExito}
          onClose={() => setModalExitoVisible(false)}
        />
      )}
    </div>
  );
}
