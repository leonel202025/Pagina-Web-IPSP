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
        <table key={grado.id} className="mis-cursos__table">
          <thead>
            <tr>
              <th className="grado" colSpan="3">
                {grado.grado}
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
              .filter((a) => a.id_grado === grado.id)
              .map((alumno) => (
                <tr key={alumno.id}>
                  <td>{alumno.nombre}</td>
                  <td>{alumno.nota !== null ? alumno.nota : "Sin calificación"}</td>
                  <td className="mis-cursos__acciones">
                    <button className="mis-cursos__btn-editar" title="Editar Calificacion">
                      ✏️
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      ))}
    </div>
  );
}
