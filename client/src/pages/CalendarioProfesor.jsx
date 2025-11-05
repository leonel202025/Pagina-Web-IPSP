import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/authContext";
import "../styles/verEventosProfesor.css";

export const CalendarioProfesor = () => {
  const { user } = useContext(AuthContext);
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await fetch(`/api/eventos/profesor/${user.id}`);
        if (!res.ok) throw new Error("Error al obtener eventos");
        const data = await res.json();
        setEventos(data);
      } catch (error) {
        console.error("Error cargando eventos del profesor:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchEventos();
  }, [user]);

  if (loading) return <p>Cargando eventos...</p>;

  return (
    <div className="container__eventos">
      <h1 className="ver_title">Mi Agenda</h1>
      <div className="container__table-eventos">
        <table className="tabla__eventos-profesor">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Acto</th>
              <th>Tarea</th>
            </tr>
          </thead>
          <tbody>
            {eventos.length > 0 ? (
              eventos.map((evento) => (
                <tr key={evento.id}>
                  <td>{new Date(evento.fecha).toLocaleDateString()}</td>
                  <td className="evento__titulo">
                    {evento.titulo}{" "}
                  </td>
                  <td>
                    {evento.tareas && evento.tareas.length > 0 && (
                      <>{evento.tareas.join(", ")}</>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="2">No tenés eventos asignados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
