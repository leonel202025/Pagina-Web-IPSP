import { useState, useEffect } from "react";
import ModalMensaje from "../components/ModalMensaje";
import "../styles/crearEvento.css";

export function CrearEvento() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [tareas, setTareas] = useState([]);
  const [asignaciones, setAsignaciones] = useState([
    { idProfesor: "", idTarea: "" },
  ]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [modalTipo, setModalTipo] = useState("");

  // 🔹 Cargar profesores y tareas al montar
  useEffect(() => {
    const fetchProfesores = async () => {
      try {
        const res = await fetch("/api/usuarios/profesores");
        const data = await res.json();
        setProfesores(data);
      } catch (error) {
        console.error("Error cargando profesores:", error);
      }
    };

    const fetchTareas = async () => {
      try {
        const res = await fetch("/api/eventos/tareas");
        const data = await res.json();
        setTareas(data);
      } catch (error) {
        console.error("Error cargando tareas:", error);
      }
    };

    fetchProfesores();
    fetchTareas();
  }, []);

  // 🔹 Manejo de cambios en selects
  const handleChange = (index, field, value) => {
    const nuevas = [...asignaciones];
    nuevas[index][field] = value;
    if (value === "todos" && field === "idProfesor") {
      setAsignaciones([{ idProfesor: "todos", idTarea: "" }]);
    } else {
      setAsignaciones(nuevas);
    }
  };

  // 🔹 Agregar o eliminar selects
  const agregarAsignacion = () => {
    setAsignaciones([...asignaciones, { idProfesor: "", idTarea: "" }]);
  };

  const eliminarAsignacion = (index) => {
    setAsignaciones(asignaciones.filter((_, i) => i !== index));
  };

  // 🔹 Enviar evento
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validar campos principales
    if (!titulo.trim() || !descripcion.trim() || !fecha) {
      setModalMensaje("Todos los campos del evento son obligatorios");
      setModalTipo("advertencia");
      setModalVisible(true);
      return;
    }

    // Validar asignaciones (si no es "todos los profesores")
    if (!asignaciones.some((a) => a.idProfesor === "todos")) {
      const asignacionesIncompletas = asignaciones.some(
        (a) => !a.idProfesor || !a.idTarea
      );

      if (asignacionesIncompletas) {
        setModalMensaje("Debe seleccionar profesor y tarea en cada asignación");
        setModalTipo("advertencia");
        setModalVisible(true);
        return;
      }
    }

    // Crear el objeto del nuevo evento
    const nuevoEvento = {
      titulo: titulo.trim(),
      descripcion: descripcion.trim(),
      fecha,
      todosProfesores: asignaciones.some((a) => a.idProfesor === "todos"),
      profesoresAsignados: asignaciones.filter(
        (a) => a.idProfesor && a.idProfesor !== "todos"
      ), // { idProfesor, idTarea } por cada asignación
    };

    try {
      const res = await fetch("/api/eventos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoEvento),
      });

      if (res.ok) {
        setModalMensaje("Evento creado con éxito");
        setModalTipo("exito");
        setTitulo("");
        setDescripcion("");
        setFecha("");
        setAsignaciones([{ idProfesor: "", idTarea: "" }]);
      } else {
        setModalMensaje("Error al crear evento");
        setModalTipo("error");
      }
    } catch (error) {
      console.error(error);
      setModalMensaje("Error de red");
      setModalTipo("error");
    } finally {
      setModalVisible(true);
    }
  };

  return (
    <div className="crear__evento-container">
      <h1 className="crear__evento-title">Crear Evento</h1>
      <form onSubmit={handleSubmit} className="crear-evento__form">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
        />
        <input
          type="datetime-local"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />

        {/* 🔹 Sección de asignaciones */}
        <div className="form-asignaciones">
          {asignaciones.map((item, index) => (
            <div key={index} className="asignacion-fila">
              <div className="asignacion-contenedor">
                <select
                  value={item.idProfesor}
                  onChange={(e) =>
                    handleChange(index, "idProfesor", e.target.value)
                  }
                >
                  <option value="">Seleccionar profesor</option>
                  {profesores.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nombre}
                    </option>
                  ))}
                </select>

                <select
                  value={item.idTarea}
                  onChange={(e) =>
                    handleChange(index, "idTarea", e.target.value)
                  }
                  disabled={item.idProfesor === "todos"}
                >
                  <option value="">Seleccionar tarea</option>
                  {tareas.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.nombre}
                    </option>
                  ))}
                </select>

                <div className="add__evento-botones">
                  <button
                    className="agregar_asignacion"
                    type="button"
                    onClick={agregarAsignacion}
                    title="Agregar Asignación"
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

                  {asignaciones.length > 1 && (
                    <button
                      className="borrar_asignacion"
                      type="button"
                      onClick={() => eliminarAsignacion(index)}
                      title="Borrar Asignación"
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
        </div>

        <div className="form__evento-footer">
          <button type="submit" className="btn__guardar-evento">
            Guardar Evento
          </button>
        </div>
      </form>

      <ModalMensaje
        visible={modalVisible}
        mensaje={modalMensaje}
        tipo={modalTipo}
        onClose={() => setModalVisible(false)}
      />
    </div>
  );
}
