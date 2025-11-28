import { useEffect, useState } from "react";
import "../styles/verEventos.css";
import ModalMensaje from "../components/ModalMensaje";

export function VerEventos() {
  const [eventos, setEventos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profesores, setProfesores] = useState([]);
  const [tareas, setTareas] = useState([]);

  // Estados para editar
  const [modalEditarVisible, setModalEditarVisible] = useState(false);
  const [eventoSeleccionado, setEventoSeleccionado] = useState(null);

  const [modalMensaje, setModalMensaje] = useState("");
  const [modalTipo, setModalTipo] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  const [eventoAEliminar, setEventoAEliminar] = useState(null);
  const [modalEliminarVisible, setModalEliminarVisible] = useState(false);

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

  useEffect(() => {
    // Traer profesores
    fetch("/api/usuarios/profesores")
      .then((res) => res.json())
      .then((data) => setProfesores(data))
      .catch((err) => console.error(err));

    // Traer tareas
    fetch("/api/eventos/tareas")
      .then((res) => res.json())
      .then((data) => setTareas(data))
      .catch((err) => console.error(err));
  }, []);

  // 🔹 Abrir modal de edición
  const handleEditar = (evento) => {
    setEventoSeleccionado({
      ...evento,
      profesoresAsignados: evento.asignaciones.map((a) => ({
        idProfesor: a.idProfesor || null,
        idTarea: a.idTarea || null,
      })),
    });
    setModalEditarVisible(true);
  };

  const guardarEdicion = async (e) => {
    e.preventDefault();

    if (
      !eventoSeleccionado.titulo ||
      !eventoSeleccionado.descripcion ||
      !eventoSeleccionado.fecha
    ) {
      setModalMensaje("Todos los campos son obligatorios");
      setModalTipo("advertencia");
      setModalVisible(true);
      return;
    }

    const fechaFormateada = new Date(eventoSeleccionado.fecha)
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    try {
      const res = await fetch(`/api/eventos/editar/${eventoSeleccionado.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo: eventoSeleccionado.titulo,
          descripcion: eventoSeleccionado.descripcion,
          fecha: fechaFormateada,
          todosProfesores: eventoSeleccionado.todosProfesores,
          profesoresAsignados: eventoSeleccionado.asignaciones, // 🔹 enviar asignaciones aquí
        }),
      });

      if (!res.ok) throw new Error("Error al actualizar evento");

      const data = await res.json();

      setEventos((prev) =>
        prev.map((evento) => (evento.id === data.id ? data : evento))
      );

      setModalMensaje("Evento actualizado con éxito");
      setModalTipo("exito");
      setModalVisible(true);
      setModalEditarVisible(false);
    } catch (error) {
      console.error(error);
      setModalMensaje("Error al actualizar evento");
      setModalTipo("error");
      setModalVisible(true);
    }
  };

  const confirmarEliminar = (idEvento) => {
    setEventoAEliminar(idEvento);
    setModalEliminarVisible(true);
  };

  const eliminarConfirmado = async () => {
    if (!eventoAEliminar) return;

    try {
      const res = await fetch(`/api/eventos/eliminar/${eventoAEliminar}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Error al eliminar el evento");

      setEventos((prev) => prev.filter((e) => e.id !== eventoAEliminar));

      setModalMensaje("Evento eliminado con éxito");
      setModalTipo("exito");
      setModalVisible(true);
    } catch (error) {
      console.error(error);
      setModalMensaje("Error al eliminar el evento");
      setModalTipo("error");
      setModalVisible(true);
    } finally {
      setEventoAEliminar(null);
      setModalEliminarVisible(false);
    }
  };

  if (loading) {
    return <p>Cargando eventos...</p>;
  }

  return (
    <div className="container__eventos">
      <div className="container__table-eventos">
        <table className="tabla__eventos">
          <thead>
            <th colSpan={5} className="ver_title-eventos">Lista de Eventos</th>
            <tr>
              <th>Fecha</th>
              <th>Acto</th>
              <th>Descripcion</th>
              <th>Reponsable - Tarea</th>
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

                  {/* 🔹 Nueva columna: Responsable - Tarea */}
                  <td
                    title={
                      evento.asignaciones?.length
                        ? evento.asignaciones
                            .map(
                              (a) =>
                                `${a.profesor || "Sin profesor"} - ${
                                  a.tarea || "Sin tarea"
                                }`
                            )
                            .join(", ")
                        : "Sin asignaciones"
                    }
                  >
                    {evento.asignaciones?.length ? (
                      evento.asignaciones.map((a, i) => (
                        <div key={i}>
                          {a.profesor || "Sin profesor"} -{" "}
                          {a.tarea || "Sin tarea"}
                        </div>
                      ))
                    ) : (
                      <span>Sin asignaciones</span>
                    )}
                  </td>

                  <td className="acciones">
                    <button
                      className="btn-editar"
                      title="Modificar Datos"
                      onClick={() => handleEditar(evento)}
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
                      onClick={() => confirmarEliminar(evento.id)}
                      className="btn-eliminar"
                      title="Eliminar Evento"
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
                <td colSpan="5">No hay eventos registrados</td>
              </tr>
            )}
          </tbody>
        </table>
        {/* 🔹 Modal de edición */}
        {modalEditarVisible && eventoSeleccionado && (
          <div className="modal-editar-overlay">
            <div className="modal-editar-container">
              <h1 className="modal-editar-titulo">Editar Evento</h1>
              <form className="modal-editar-form" onSubmit={guardarEdicion}>
                <input
                  type="text"
                  placeholder="Título"
                  value={eventoSeleccionado.titulo}
                  onChange={(e) =>
                    setEventoSeleccionado({
                      ...eventoSeleccionado,
                      titulo: e.target.value,
                    })
                  }
                />
                <textarea
                  placeholder="Descripción"
                  value={eventoSeleccionado.descripcion}
                  onChange={(e) =>
                    setEventoSeleccionado({
                      ...eventoSeleccionado,
                      descripcion: e.target.value,
                    })
                  }
                />
                <input
                  type="datetime-local"
                  value={
                    eventoSeleccionado.fecha.split("T")[0] +
                    "T" +
                    eventoSeleccionado.fecha.split("T")[1]?.slice(0, 5)
                  }
                  onChange={(e) =>
                    setEventoSeleccionado({
                      ...eventoSeleccionado,
                      fecha: e.target.value,
                    })
                  }
                />

                {/* 🔹 Asignaciones de profesores y tareas */}
                {eventoSeleccionado.asignaciones?.map((item, index) => (
                  <div key={index} className="asignacion-fila">
                    <div className="asignacion-contenedor">
                      <select
                        value={item.idProfesor || ""}
                        onChange={(e) => {
                          const nuevas = [...eventoSeleccionado.asignaciones];
                          nuevas[index].idProfesor = e.target.value;
                          setEventoSeleccionado({
                            ...eventoSeleccionado,
                            asignaciones: nuevas,
                          });
                        }}
                      >
                        <option value="">Seleccionar profesor</option>
                        {profesores.map((prof) => (
                          <option key={prof.id} value={prof.id}>
                            {prof.nombre}
                          </option>
                        ))}
                      </select>

                      <select
                        value={item.idTarea || ""}
                        onChange={(e) => {
                          const nuevas = [...eventoSeleccionado.asignaciones];
                          nuevas[index].idTarea = e.target.value;
                          setEventoSeleccionado({
                            ...eventoSeleccionado,
                            asignaciones: nuevas,
                          });
                        }}
                        disabled={item.idProfesor === "todos"}
                      >
                        <option value="">Seleccionar tarea</option>
                        {tareas.map((t) => (
                          <option key={t.id} value={t.id}>
                            {t.nombre}
                          </option>
                        ))}
                      </select>

                      <div className="add__profesor-botones">
                        <button
                          type="button"
                          className="add_asignacion-evento"
                          onClick={() =>
                            setEventoSeleccionado({
                              ...eventoSeleccionado,
                              asignaciones: [
                                ...eventoSeleccionado.asignaciones,
                                { idProfesor: "", idTarea: "" },
                              ],
                            })
                          }
                          title="Agregar asignación"
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

                        {eventoSeleccionado.asignaciones.length > 1 && (
                          <button
                            type="button"
                            className="borrar_asignacion-evento"
                            onClick={() =>
                              setEventoSeleccionado({
                                ...eventoSeleccionado,
                                asignaciones:
                                  eventoSeleccionado.asignaciones.filter(
                                    (_, i) => i !== index
                                  ),
                              })
                            }
                            title="Eliminar asignación"
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
                        )}
                      </div>
                    </div>
                  </div>
                ))}

                <button type="submit">Guardar Cambios</button>
                <button
                  type="button"
                  className="btn__cancelar-evento"
                  onClick={() => setModalEditarVisible(false)}
                >
                  Cancelar
                </button>
              </form>
            </div>
          </div>
        )}

        {/* 🔹 Modal de mensajes */}
        <ModalMensaje
          visible={modalVisible}
          mensaje={modalMensaje}
          tipo={modalTipo}
          onClose={() => setModalVisible(false)}
        />
        <ModalMensaje
          visible={modalEliminarVisible}
          mensaje="¿Estás seguro que quieres eliminar este evento?"
          tipo="confirmacion"
          onConfirm={eliminarConfirmado}
          onCancelar={() => setModalEliminarVisible(false)}
        />
      </div>
    </div>
  );
}
