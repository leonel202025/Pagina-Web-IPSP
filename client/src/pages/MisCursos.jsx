import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/authContext";
import "../styles/MisCursos.css";

export function MisCursos() {
  const { user } = useContext(AuthContext);
  const [grados, setGrados] = useState([]);
  const [alumnos, setAlumnos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    fetch(`http://localhost:5000/api/usuarios/profesor/${user.id}/grados`)
      .then((res) => {
        if (!res.ok) throw new Error(`Error HTTP: ${res.status}`);
        return res.json();
      })
      .then((data) => {
        setGrados(data.grados || []);
        setAlumnos(data.alumnos || []);
      })
      .catch((error) => {
        console.error("Error al obtener cursos:", error);
      })
      .finally(() => setLoading(false));
  }, [user]);

  if (loading) return <p>Cargando cursos...</p>;

  return (
    <div className="mis-cursos__container">
      <h1 className="mis-cursos__title">Mis Cursos</h1>
      {grados.map((grado) => (
        <table
          key={`${grado.id_grado}-${grado.id_asignatura}`}
          className="mis-cursos__table"
        >
          <thead>
            <tr>
              <th className="grado" colSpan="3">
                {grado.grado} - {grado.materia}
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
              .filter((a) => a.id_grado === grado.id_grado) // solo por grado
              .map((alumno) => {
                const calificacion =
                  alumno.nota && alumno.id_asignatura === grado.id_asignatura
                    ? alumno.nota
                    : "Sin calificación";
                return (
                  <tr key={alumno.id}>
                    <td>{alumno.nombre}</td>
                    <td>{calificacion}</td>
                    <td className="mis-cursos__acciones">
                      <button className="mis-cursos__btn-cargar" title="Cargar-Calificación">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="20"
                          height="20"
                          fill="#bbb"
                          viewBox="0 0 24 24"
                        >
                          <path
                            d="M12 5v14M5 12h14"
                            stroke="#bbb"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                      <button
                        className="mis-cursos__btn-editar"
                        title="Editar Calificación"
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
                        className="mis-cursos__btn-eliminar"
                        title="Eliminar Calificacion"
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
                );
              })}
          </tbody>
        </table>
      ))}
    </div>
  );
}
