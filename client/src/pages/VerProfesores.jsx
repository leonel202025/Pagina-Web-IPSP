import { useEffect, useState } from "react";
import "../styles/verProfesores.css";
import ModalMensaje from "../components/ModalMensaje";

export function VerProfesores() {
  const [profesores, setProfesores] = useState([]);
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [profesorAEditar, setProfesorAEditar] = useState(null);
  const [gradosMateriasSeleccionados, setGradosMateriasSeleccionados] =
    useState([]);
  const [grados, setGrados] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [modalMensajeVisible, setModalMensajeVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [modalMensajeTipo, setModalMensajeTipo] = useState("");
  const [profesorAEliminar, setProfesorAEliminar] = useState(null);
  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);

  // Obtener profesores con sus combinaciones de grado-materia
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

  // Abrir modal de edición
  const handleAbrirEditar = (profesor) => {
    // gradosMaterias: [{id_grado, id_asignatura}]
    const combinaciones = profesor.gradosMaterias || [];
    setProfesorAEditar({ ...profesor });
    setGradosMateriasSeleccionados(combinaciones);
    setModalEditarVisible(true);
  };

  const toggleGradoMateria = (id_grado, id_asignatura) => {
    const exists = gradosMateriasSeleccionados.some(
      (gm) => gm.id_grado === id_grado && gm.id_asignatura === id_asignatura
    );
    if (exists) {
      setGradosMateriasSeleccionados((prev) =>
        prev.filter(
          (gm) => gm.id_grado !== id_grado || gm.id_asignatura !== id_asignatura
        )
      );
    } else {
      setGradosMateriasSeleccionados((prev) => [
        ...prev,
        { id_grado, id_asignatura },
      ]);
    }
  };

  const handleGuardarCambios = async () => {
    if (!profesorAEditar) return;
    try {
      const actualizado = {
        ...profesorAEditar,
        gradosMaterias: gradosMateriasSeleccionados,
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
        // refrescar lista
        const resProfes = await fetch(
          "http://localhost:5000/api/usuarios/profesores"
        );
        const dataProfes = await resProfes.json();
        setProfesores(dataProfes);
        setModalEditarVisible(false);
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

  const handleEliminarClick = (profesor) => {
    setProfesorAEliminar(profesor);
    setModalConfirmVisible(true);
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
        setModalMensaje("Profesor eliminado correctamente");
        setModalMensajeTipo("exito");
        setModalMensajeVisible(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="container__profesores">
      <h1 className="ver_title">Profesores</h1>
      <table className="table__profesor">
        <thead>
          <tr>
            <th>DNI</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Grado - Materia</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {profesores.map((profesor) => (
            <tr key={profesor.id}>
              <td>{profesor.dni}</td>
              <td>{profesor.nombre}</td>
              <td>{profesor.email}</td>
              <td
                title={profesor.gradosMaterias
                  ?.map((gm) => {
                    const grado = grados.find(
                      (g) => g.id === gm.id_grado
                    )?.grado;
                    const materia = asignaturas.find(
                      (a) => a.id === gm.id_asignatura
                    )?.asignatura;
                    return `${materia} - ${grado}`;
                  })
                  .join(", ")}
              >
                {profesor.gradosMaterias
                  ?.map((gm) => {
                    const grado = grados.find(
                      (g) => g.id === gm.id_grado
                    )?.grado;
                    const materia = asignaturas.find(
                      (a) => a.id === gm.id_asignatura
                    )?.asignatura;
                    return `${materia} - ${grado}`;
                  })
                  .join(", ")}
              </td>
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

      {/* Modal de edición */}
      {modalEditarVisible && profesorAEditar && (
        <div className="modal-profesor__overlay">
          <div className="modal-profesor__container">
            <h1 className="title__profesor">Editar Profesor</h1>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleGuardarCambios();
              }}
              className="form__container-profesor"
            >
              <div className="form-datos-personales">
                <label className="label__datos">
                  <strong>Datos Personales</strong>
                </label>
                <div className="row">
                  <input
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
                <div className="row">
                  <input
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

              <div className="form-asignaciones">
                <label className="label__datos">
                  <strong>Asignaciones (Grado → Materia)</strong>
                </label>

                {gradosMateriasSeleccionados.map((asig, index) => (
                  <div key={index} className="asignacion-fila">
                    <select
                      value={asig.id_grado}
                      onChange={(e) => {
                        const nuevas = [...gradosMateriasSeleccionados];
                        nuevas[index].id_grado = Number(e.target.value);
                        setGradosMateriasSeleccionados(nuevas);
                      }}
                      required
                    >
                      <option value="">Seleccionar grado</option>
                      {grados.map((g) => (
                        <option key={g.id} value={g.id}>
                          {g.grado}
                        </option>
                      ))}
                    </select>

                    <select
                      value={asig.id_asignatura}
                      onChange={(e) => {
                        const nuevas = [...gradosMateriasSeleccionados];
                        nuevas[index].id_asignatura = Number(e.target.value);
                        setGradosMateriasSeleccionados(nuevas);
                      }}
                      required
                    >
                      <option value="">Seleccionar materia</option>
                      {asignaturas.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.asignatura}
                        </option>
                      ))}
                    </select>

                    {/* Div único que contiene ambos botones */}
                    <div className="profesores__botones">
                      <button
                        className="agregar_asignacion"
                        title="Agregar Asignacion"
                        type="button"
                        onClick={() =>
                          setGradosMateriasSeleccionados((prev) => [
                            ...prev,
                            {
                              id_grado: grados[0]?.id || "",
                              id_asignatura: asignaturas[0]?.id || "",
                            },
                          ])
                        }
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="#1E55E3"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 5v14M5 12h14"
                            stroke="#1E55E3"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        className="borrar_asignacion"
                        title="Borrar Asignacion"
                        type="button"
                        onClick={() =>
                          setGradosMateriasSeleccionados((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
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

                    </div>
                  </div>
                ))}
              </div>

              <div className="form-footer">
                <button className="guardar" type="submit">
                  Guardar Cambios
                </button>
                <button
                  className="cancelar"
                  type="button"
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
        mensaje={`¿Seguro que deseas eliminar al profesor ${profesorAEliminar?.nombre}?`}
        tipo="confirmacion"
        onClose={() => setModalConfirmVisible(false)}
        onConfirm={confirmarEliminarProfesor}
      />
    </div>
  );
}
