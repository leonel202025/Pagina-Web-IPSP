import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import ModalMensaje from "../components/ModalMensaje";
import "../styles/MisCursos.css";

export function MisCursos() {
  const { user } = useContext(AuthContext);
  const [grados, setGrados] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState(""); // 🔍 Estado para búsqueda

  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);

  const [modalNotaVisible, setModalNotaVisible] = useState(false);
  const [alumnoSeleccionado, setAlumnoSeleccionado] = useState(null);
  const [nota, setNota] = useState("");

  const [modalConfirmVisible, setModalConfirmVisible] = useState(false);
  const [notaAEliminar, setNotaAEliminar] = useState(null);

  const [modalMensaje, setModalMensaje] = useState({
    visible: false,
    mensaje: "",
    tipo: "exito",
  });

  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://localhost:5000/api/usuarios/profesor/${user.id}/grados`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        const alumnosConId = (data.alumnos || []).map((a) => ({
          ...a,
          id: a.id_alumno ?? a.id,
        }));

        setGrados(data.grados || []);
        setAlumnos(alumnosConId);
      })
      .catch((error) => console.error("Error al obtener cursos:", error))
      .finally(() => setLoading(false));
  }, [user]);

  const guardarNota = async () => {
    if (!alumnoSeleccionado?.id) return;

    try {
      const res = await fetch(
        "http://localhost:5000/api/usuarios/calificaciones",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_alumno: alumnoSeleccionado.id,
            id_grado: alumnoSeleccionado.id_grado,
            id_asignatura: alumnoSeleccionado.id_asignatura,
            id_profesor: user.id,
            nota: Number(nota),
          }),
        }
      );
      const data = await res.json();

      setAlumnos((prev) => {
        const index = prev.findIndex(
          (a) =>
            a.id === data.id_alumno &&
            a.id_grado === data.id_grado &&
            a.id_asignatura === data.id_asignatura
        );

        if (index !== -1) {
          const updated = [...prev];
          updated[index] = { ...updated[index], nota: data.nota };
          return updated;
        } else {
          return [...prev, data];
        }
      });

      setModalNotaVisible(false);
      setNota("");

      setModalMensaje({
        visible: true,
        mensaje: "Nota cargada correctamente",
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
    if (!notaAEliminar) return;

    try {
      const res = await fetch(
        "http://localhost:5000/api/usuarios/calificaciones/eliminar",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id_alumno: notaAEliminar.id,
            id_grado: notaAEliminar.id_grado,
            id_asignatura: notaAEliminar.id_asignatura,
          }),
        }
      );

      if (!res.ok) throw new Error("Error al eliminar calificación");
      const data = await res.json();

      setAlumnos((prev) =>
        prev.map((a) =>
          a.id === data.id_alumno &&
          a.id_grado === data.id_grado &&
          a.id_asignatura === data.id_asignatura
            ? { ...a, nota: null }
            : a
        )
      );

      setModalConfirmVisible(false);
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
                  <th className="grado" colSpan="3">
                    {cursoSeleccionado.grado} - {cursoSeleccionado.materia}
                  </th>
                </tr>
                <tr>
                  <th>Nombre del Alumno</th>
                  <th>Calificación</th>
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
                    const calificacion =
                      alumno.nota !== null && alumno.nota !== undefined
                        ? alumno.nota
                        : "Sin calificación";
                    return (
                      <tr
                        key={`${alumno.id}-${cursoSeleccionado.id_asignatura}`}
                      >
                        <td>{alumno.nombre}</td>
                        <td>{calificacion}</td>
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
                            {/* Ícono ➕ */}
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
                            className="mis-cursos__btn-eliminar"
                            title="Eliminar Calificación"
                            onClick={() => {
                              setNotaAEliminar(alumno);
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
    </div>
  );
}
