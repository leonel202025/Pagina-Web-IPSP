import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import ModalMensaje from "../components/ModalMensaje";
import "../styles/MisCursos.css";

export function MisCursos() {
  const { user } = useContext(AuthContext);
  const [grados, setGrados] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState(""); 

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  const [modalNotaVisible, setModalNotaVisible] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [nota, setNota] = useState("");
  const [trimestre, setTrimestre] = useState("primer_trimestre");
  const [observaciones, setObservaciones] = useState("");
  const [modalObservacionVisible, setModalObservacionVisible] = useState(false);
  const [observacionActual, setObservacionActual] = useState("");

  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [notaAEliminar, setNotaAEliminar] = useState(null);
  const [trimestreAEliminar, setTrimestreAEliminar] = useState("");
  const [modalElegirTrimestreVisible, setModalElegirTrimestreVisible] =
    useState(false);

  const [modalMensaje, setModalMensaje] = useState({
    visible: false,
    mensaje: "",
    tipo: "exito",
  });

  useEffect(() => {
    if (!user?.id) return;

    const cargarInicial = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/usuarios/profesor/${user.id}/grados`
        );

        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);

        const data = await res.json();

        const alumnosConId = (data.alumnos || []).map((a) => ({
          ...a,
          id: a.id_alumno ?? a.id,
          id_grado: a.id_grado, 
          id_asignatura: a.id_asignatura,
        }));

        setGrados(data.grados || []);

        const alumnosConObs = await Promise.all(
          alumnosConId.map(async (a) => ({
            ...a,
            observaciones: await cargarObservacion(a),
          }))
        );

        setAlumnos(alumnosConObs);
      } catch (error) {
        console.error("Error al obtener cursos:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarInicial();
  }, [user]);

  const guardarNota = async () => {
    if (!alumnoSeleccionado?.id || !nota) return;

    try {
      const body = {
        id_alumno: alumnoSeleccionado.id,
        id_grado: alumnoSeleccionado.id_grado,
        id_asignatura: alumnoSeleccionado.id_asignatura,
        id_profesor: user.id,
        observaciones,
      };

      body[trimestre] = Number(nota);

      const res = await fetch(
        "http://localhost:5000/api/usuarios/calificaciones",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      setAlumnos((prev) =>
        prev.map((a) =>
          a.id === data.id_alumno &&
          a.id_grado === data.id_grado &&
          a.id_asignatura === data.id_asignatura
            ? {
                ...a,
                primer_trimestre:
                  data.primer_trimestre !== null
                    ? Number(data.primer_trimestre)
                    : null,
                segundo_trimestre:
                  data.segundo_trimestre !== null
                    ? Number(data.segundo_trimestre)
                    : null,
                tercer_trimestre:
                  data.tercer_trimestre !== null
                    ? Number(data.tercer_trimestre)
                    : null,
                promedio_final:
                  data.promedio_final !== null
                    ? Number(data.promedio_final).toFixed(2)
                    : null,
                observaciones: data.observaciones ?? "",
              }
            : a
        )
      );

      setNota("");
      setTrimestre("primer_trimestre");
      setObservaciones("");
      setModalNotaVisible(false);

      setModalMensaje({
        visible: true,
        mensaje: "Nota guardada correctamente",
        tipo: "exito",
      });
    } catch (error) {
      console.error("Error al guardar nota:", error);
      setModalMensaje({
        visible: true,
        mensaje: "Error al cargar la nota",
        tipo: "error",
      });
    }
  };

  const eliminarNota = async () => {
    if (!notaAEliminar || !trimestreAEliminar) return;

    try {
      const body = {
        id_alumno: notaAEliminar.id,
        id_grado: notaAEliminar.id_grado,
        id_asignatura: notaAEliminar.id_asignatura,
        trimestre: trimestreAEliminar, 
      };

      const res = await fetch(
        "http://localhost:5000/api/usuarios/calificaciones/eliminar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      setAlumnos((prev) =>
        prev.map((a) => {
          if (
            a.id === data.id_alumno &&
            a.id_grado === data.id_grado &&
            a.id_asignatura === data.id_asignatura
          ) {
            const actualizado = { ...a };

            if (trimestreAEliminar !== "todos") {
              actualizado[trimestreAEliminar] = null;
            } else {
              actualizado.primer_trimestre = null;
              actualizado.segundo_trimestre = null;
              actualizado.tercer_trimestre = null;
              actualizado.observaciones = null;
            }

            const notas = [
              actualizado.primer_trimestre,
              actualizado.segundo_trimestre,
              actualizado.tercer_trimestre,
            ]
              .filter((n) => n !== null && n !== undefined)
              .map((n) => Number(n)); 

            if (notas.length > 0) {
              const promedio =
                notas.reduce((acc, n) => acc + n, 0) / notas.length;
              actualizado.promedio_final = promedio.toFixed(2);
            } else {
              actualizado.promedio_final = null;
            }

            return actualizado;
          }

          return a;
        })
      );

      setModalConfirmVisible(false);
      setTrimestreAEliminar("");
      setNotaAEliminar(null);

      setModalMensaje({
        visible: true,
        mensaje: "Calificación eliminada correctamente",
        tipo: "exito",
      });
    } catch (err) {
      console.error("Error al eliminar calificación:", err);
      setModalMensaje({
        visible: true,
        mensaje: "No se pudo eliminar la calificación",
        tipo: "error",
      });
      setModalConfirmVisible(false);
    }
  };

  const guardarObservacion = async () => {
    if (!alumnoSeleccionado?.id) return;

    try {
      const body = {
        id_alumno: alumnoSeleccionado.id,
        id_grado: alumnoSeleccionado.id_grado,
        id_asignatura: alumnoSeleccionado.id_asignatura,
        id_profesor: user.id,
        observaciones: observacionActual,
      };

      const res = await fetch(
        "http://localhost:5000/api/usuarios/calificaciones/observacion",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      setAlumnos((prev) =>
        prev.map((a) =>
          a.id === data.id_alumno &&
          a.id_grado === data.id_grado &&
          a.id_asignatura === data.id_asignatura
            ? {
                ...a,
                observaciones: data.observaciones ?? "",
              }
            : a
        )
      );

      setModalObservacionVisible(false);

      setModalMensaje({
        visible: true,
        mensaje: "Observación guardada correctamente",
        tipo: "exito",
      });
    } catch (error) {
      console.error("Error al guardar observación:", error);

      setModalMensaje({
        visible: true,
        mensaje: "Error al guardar la observación",
        tipo: "error",
      });
    }
  };

  const cargarObservacion = async (alumno) => {
    try {
      const res = await fetch(
        "http://localhost:5000/api/usuarios/calificaciones/observacion/obtener",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_alumno: alumno.id,
            id_grado: alumno.id_grado,
            id_asignatura: alumno.id_asignatura,
          }),
        }
      );

      const data = await res.json();
      return data.observaciones ?? "";
    } catch (error) {
      console.error("Error obteniendo observación:", error);
      return "";
    }
  };

  if (loading) return <p>Cargando cursos...</p>;

  return (
    <div className="mis-cursos__container">
      {/* Vista 1: Selección de curso */}
      {!cursoSeleccionado && (
        <div className="mis-cursos__seleccion">
          <h3 className="mis__cursos-title">Seleccione un Curso/Materia:</h3>
          <div className="mis__cursos-botones">
            {grados.map((grado) => (
              <button
                key={`${grado.id_grado}-${grado.id_asignatura}`}
                className="mis__cursos-btn-curso"
                onClick={() => setCursoSeleccionado(grado)}
              >
                {grado.grado} - {grado.materia}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Vista 2: Tabla de alumnos */}
      {cursoSeleccionado && (
        <>
          {/* 🔍 Barra de búsqueda */}
          <div className="busqueda__contenedor-alumno">
            <button className="busqueda__boton">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="35"
                height="35"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M10 2a8 8 0 0 1 6.32 12.906l5.387 5.387a1 1 0 0 1-1.414 1.414l-5.387-5.387A8 8 0 1 1 10 2zm0 2a6 6 0 1 0 0 12A6 6 0 0 0 10 4z" />
              </svg>
            </button>
            <input
              type="text"
              placeholder="Buscar alumno..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="busqueda__input"
            />
          </div>
          <div className="container__curso">
            <table
              className="mis-cursos__table"
              key={`${cursoSeleccionado.id_grado}-${cursoSeleccionado.id_asignatura}`}
            >
              <thead>
                <tr>
                  <th className="grado" colSpan="7">
                    {cursoSeleccionado.grado} - {cursoSeleccionado.materia}
                  </th>
                </tr>
                <tr>
                  <th>Nombre del Alumno</th>
                  <th>1° Trimestre</th>
                  <th>2° Trimestre</th>
                  <th>3° Trimestre</th>
                  <th>Promedio</th>
                  <th>Observación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {alumnos
                  .filter(
                    (a) =>
                      a.id_grado === cursoSeleccionado.id_grado &&
                      a.id_asignatura === cursoSeleccionado.id_asignatura
                  )
                  .filter((a) =>
                    a.nombre.toLowerCase().includes(busqueda.toLowerCase())
                  )
                  .map((alumno) => {
                    const notasCargadas = [
                      alumno.primer_trimestre,
                      alumno.segundo_trimestre,
                      alumno.tercer_trimestre,
                    ].filter((n) => n != null); 

                    const puedeEliminar = notasCargadas.length > 0;
                    return (
                      <tr
                        key={`${alumno.id}-${cursoSeleccionado.id_asignatura}`}
                      >
                        <td>{alumno.nombre}</td>
                        <td>{alumno.primer_trimestre ?? "—"}</td>
                        <td>{alumno.segundo_trimestre ?? "—"}</td>
                        <td>{alumno.tercer_trimestre ?? "—"}</td>
                        <td>{alumno.promedio_final ?? "—"}</td>
                        <td>{alumno.observaciones ?? "—"}</td>
                        <td className="mis-cursos__acciones">
                          <button
                            className="mis-cursos__btn-cargar"
                            title="Cargar Calificación"
                            onClick={() => {
                              setAlumnoSeleccionado({
                                ...alumno,
                                id_asignatura: cursoSeleccionado.id_asignatura,
                              });
                              setModalNotaVisible(true);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20"
                              height="20"
                              fill="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                d="M12 5v14m-7-7h14"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                              />
                            </svg>
                          </button>
                          <button
                            className="mis-cursos__btn-observacion"
                            title="Agregar observación"
                            disabled={
                              alumno.primer_trimestre == null ||
                              alumno.segundo_trimestre == null ||
                              alumno.tercer_trimestre == null
                            }
                            onClick={() => {
                              setAlumnoSeleccionado({
                                ...alumno,
                                id_asignatura: cursoSeleccionado.id_asignatura,
                              });
                              setObservacionActual(alumno.observaciones || "");
                              setModalObservacionVisible(true);
                            }}
                            style={{
                              cursor:
                                alumno.primer_trimestre == null ||
                                alumno.segundo_trimestre == null ||
                                alumno.tercer_trimestre == null
                                  ? "not-allowed"
                                  : "pointer",
                              opacity:
                                alumno.primer_trimestre == null ||
                                alumno.segundo_trimestre == null ||
                                alumno.tercer_trimestre == null
                                  ? 0.5
                                  : 1,
                              pointerEvents:
                                alumno.primer_trimestre == null ||
                                alumno.segundo_trimestre == null ||
                                alumno.tercer_trimestre == null
                                  ? "none"
                                  : "auto",
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="22"
                              height="22"
                              viewBox="0 0 24 24"
                            >
                              <path
                                fill="#3498db"
                                d="M21 6.5A2.5 2.5 0 0 0 18.5 4h-13A2.5 2.5 0 0 0 3 6.5v9A2.5 2.5 0 0 0 5.5 18H6v3l4-3h8.5A2.5 2.5 0 0 0 21 15.5v-9z"
                              />
                            </svg>
                          </button>
                          <button
                            className="mis-cursos__btn-eliminar"
                            title="Eliminar Calificación"
                            disabled={!puedeEliminar}
                            onClick={() => {
                              if (notasCargadas.length === 1) {
                                if (alumno.primer_trimestre != null)
                                  setTrimestreAEliminar("primer_trimestre");
                                else if (alumno.segundo_trimestre != null)
                                  setTrimestreAEliminar("segundo_trimestre");
                                else setTrimestreAEliminar("tercer_trimestre");

                                setNotaAEliminar(alumno);
                                setModalConfirmVisible(true);
                              } else {
                                setNotaAEliminar(alumno);
                                setModalElegirTrimestreVisible(true);
                              }
                            }}
                            style={{
                              cursor: !puedeEliminar
                                ? "not-allowed"
                                : "pointer",
                              opacity: !puedeEliminar ? 0.5 : 1,
                              pointerEvents: !puedeEliminar ? "none" : "auto",
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
                    );
                  })}
              </tbody>
            </table>
          </div>
          <button
            className="mis__cursos-boton-volver"
            onClick={() => setCursoSeleccionado(null)}
          >
            ← Volver a cursos
          </button>
        </>
      )}
      {/* Modal para elegir trimestre a eliminar */}
      {modalElegirTrimestreVisible && notaAEliminar && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Seleccione el trimestre a eliminar</h3>

            <select
              value={trimestreAEliminar}
              onChange={(e) => setTrimestreAEliminar(e.target.value)}
            >
              <option value="">Seleccione una opción...</option>
              {notaAEliminar.primer_trimestre != null && (
                <option value="primer_trimestre">1° Trimestre</option>
              )}
              {notaAEliminar.segundo_trimestre != null && (
                <option value="segundo_trimestre">2° Trimestre</option>
              )}
              {notaAEliminar.tercer_trimestre != null && (
                <option value="tercer_trimestre">3° Trimestre</option>
              )}
              <option value="todos">Eliminar TODOS</option>
            </select>

            <div style={{ marginTop: "15px", display: "flex", gap: "10px" }}>
              <button
                onClick={() => {
                  if (!trimestreAEliminar) return;
                  setModalElegirTrimestreVisible(false);
                  setModalConfirmVisible(true);
                }}
              >
                Continuar
              </button>

              <button
                className="nota__btn-cancelar"
                onClick={() => setModalElegirTrimestreVisible(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal para cargar nota */}
      {modalNotaVisible && alumnoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Cargar nota para {alumnoSeleccionado.nombre}</h3>
            <input
              type="number"
              value={nota}
              onChange={(e) => setNota(e.target.value)}
              placeholder="Ingrese nota"
            />
            <select
              value={trimestre}
              onChange={(e) => setTrimestre(e.target.value)}
              style={{ marginTop: "10px" }}
            >
              <option value="primer_trimestre">1° Trimestre</option>
              <option value="segundo_trimestre">2° Trimestre</option>
              <option value="tercer_trimestre">3° Trimestre</option>
            </select>

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button onClick={guardarNota}>Guardar</button>
              <button
                onClick={() => setModalNotaVisible(false)}
                className="nota__btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de confirmación antes de eliminar */}
      <ModalMensaje
        visible={modalConfirmVisible}
        tipo="confirmacion"
        mensaje="¿Estás seguro de eliminar la calificación?"
        onConfirm={eliminarNota}
        onCancelar={() => setModalConfirmVisible(false)}
      />

      {/* Modal de mensaje (éxito/error) */}
      <ModalMensaje
        visible={modalMensaje.visible}
        tipo={modalMensaje.tipo}
        mensaje={modalMensaje.mensaje}
        onClose={() => setModalMensaje({ ...modalMensaje, visible: false })}
      />

      {modalObservacionVisible && alumnoSeleccionado && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Observación para {alumnoSeleccionado.nombre}</h3>

            <textarea
              value={observacionActual}
              onChange={(e) => setObservacionActual(e.target.value)}
              placeholder="Escriba una observación..."
              rows="5"
              style={{ width: "100%", marginTop: "10px" }}
            />

            <div
              style={{
                marginTop: "10px",
                display: "flex",
                gap: "10px",
                justifyContent: "flex-end",
              }}
            >
              <button onClick={guardarObservacion}>Guardar</button>

              <button
                onClick={() => setModalObservacionVisible(false)}
                className="nota__btn-cancelar"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
