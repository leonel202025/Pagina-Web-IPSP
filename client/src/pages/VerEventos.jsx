import { useEffect, useState } from "react";
import "../styles/verEventos.css";

export function VerEventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const response = await fetch("/api/eventos/listar");
        if (!response.ok) throw new Error("Error al obtener los eventos");
        const data = await response.json();
        setEventos(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchEventos();
  }, []);

  if (loading) {
    return <p>Cargando eventos...</p>;
  }

  return (
    <div className="container__eventos">
      <h1 className="ver_title-eventos">Lista de Eventos</h1>
      <div className="container__table-eventos">
        <table className="tabla__eventos">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Acto</th>
              <th>Descripcion</th>
              <th>Reponsables</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {eventos.length > 0 ? (
              eventos.map((evento) => (
                <tr key={evento.id}>
                  <td>{new Date(evento.fecha).toLocaleDateString()}</td>
                  <td className="evento__titulo">{evento.titulo}</td>
                  <td title={evento.descripcion}>{evento.descripcion}</td>
                  <td
                    title={
                      Array.isArray(evento.profesores)
                        ? evento.profesores.join(", ")
                        : evento.profesores
                    }
                  >
                    {Array.isArray(evento.profesores)
                      ? evento.profesores.join(", ")
                      : evento.profesores}
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
              ))
            ) : (
              <tr>
                <td colSpan="4">No hay eventos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
