import React, { useEffect, useState } from "react";
import "../styles/calificaciones.css";

export const Calificaciones = () => {
  const [calificaciones, setCalificaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  const idAlumno = localStorage.getItem("idAlumno");

  useEffect(() => {
    if (!idAlumno) {
      setLoading(false);
      return;
    }

    const fetchCalificaciones = async () => {
      try {
        const res = await fetch(
          `http://localhost:5000/api/usuarios/${idAlumno}/calificaciones`
        );
        if (!res.ok) throw new Error(`Error ${res.status}: ${res.statusText}`);

        const data = await res.json();
        setCalificaciones(data);
      } catch (error) {
        console.error("Error al cargar calificaciones:", error);
        setCalificaciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCalificaciones();
  }, [idAlumno]);

  if (!idAlumno) return <div>Alumno no identificado</div>;
  if (loading) return <div>Cargando calificaciones...</div>;
  if (!calificaciones) return <div>Error al cargar calificaciones.</div>;

  return (
    <div className="container__calificaciones">
      <table className="table__calificaciones">
        <thead>
          <tr>
            <th colSpan={6} className="calificaciones">
              Mis Calificaciones
            </th>
          </tr>
          <tr>
            <th>Materia</th>
            <th>1er Trimestre</th>
            <th>2do Trimestre</th>
            <th>3er Trimestre</th>
            <th>Promedio Final</th>
            <th>Observaciones</th>
          </tr>
        </thead>

        <tbody>
          {calificaciones.map((c, i) => (
            <tr key={i}>
              <td data-label="Materia">{c.materia}</td>
              <td data-label="1er Trimestre">{c.primer_trimestre ?? "-"}</td>
              <td data-label="2do Trimestre">{c.segundo_trimestre ?? "-"}</td>
              <td data-label="3er Trimestre">{c.tercer_trimestre ?? "-"}</td>
              <td data-label="Promedio Final">{c.promedio_final ?? "-"}</td>
              <td data-label="Observaciones">{c.observaciones ?? "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
