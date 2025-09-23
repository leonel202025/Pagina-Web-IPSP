import { useState, useEffect } from "react";
import ModalMensaje from "../components/ModalMensaje";
import "../styles/crearEvento.css"; // <- importar tu CSS

export function CrearEvento() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [fecha, setFecha] = useState("");
  const [profesores, setProfesores] = useState([]);
  const [profesoresSeleccionados, setProfesoresSeleccionados] = useState([""]);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [modalTipo, setModalTipo] = useState(""); // 'exito', 'error', 'advertencia'

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
    fetchProfesores();
  }, []);

  const handleSelectChange = (index, value) => {
    const nuevosSeleccionados = [...profesoresSeleccionados];
    nuevosSeleccionados[index] = value;
    if (value === "todos") {
      setProfesoresSeleccionados(["todos"]);
    } else {
      setProfesoresSeleccionados(nuevosSeleccionados);
    }
  };

  const agregarSelect = () => {
    setProfesoresSeleccionados([...profesoresSeleccionados, ""]);
  };

  const eliminarSelect = (index) => {
    setProfesoresSeleccionados(
      profesoresSeleccionados.filter((_, i) => i !== index)
    );
  };

   const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titulo || !descripcion || !fecha) {
      setModalMensaje("Todos los campos son obligatorios");
      setModalTipo("advertencia");
      setModalVisible(true);
      return;
    }

    const nuevoEvento = {
      titulo,
      descripcion,
      fecha,
      todosProfesores: profesoresSeleccionados.includes("todos"),
      profesoresAsignados: profesoresSeleccionados.filter((id) => id !== "" && id !== "todos"),
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
        setProfesoresSeleccionados([""]);
      } else {
        setModalMensaje("Error al crear evento");
        setModalTipo("error");
      }
    } catch (error) {
      setModalMensaje("Error de red");
      setModalTipo("error");
    } finally {
      setModalVisible(true);
    }
  };

  return (
    <div className="crear-evento__container">
      <h1>Crear Evento</h1>
      <form onSubmit={handleSubmit} className="crear-evento__form">
        <input
          type="text"
          placeholder="Título"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          required
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          required
        />
        <input
          type="datetime-local"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
          required
        />

        <div className="crear-evento__profesores">
          {profesoresSeleccionados.map((profId, index) => (
            <div key={index} className="select-item">
              <select
                value={profId}
                onChange={(e) => handleSelectChange(index, e.target.value)}
                required
              >
                <option value="">Seleccione un profesor</option>
                {profesores
                  .filter(
                    (prof) =>
                      !profesoresSeleccionados.includes(prof.id) ||
                      prof.id === profId
                  )
                  .map((prof) => (
                    <option key={prof.id} value={prof.id}>
                      {prof.nombre}
                    </option>
                  ))}
                <option value="todos">Todos los profesores</option>
              </select>

              <div className="botones">

                {/* Botón agregar */}
                {!profesoresSeleccionados.includes("todos") && (
                    <button
                    type="button"
                    onClick={agregarSelect}
                    className="agregar_asignacion"
                    title="Agregar profesor"
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
                )}
                {/* Botón eliminar: solo si hay más de uno y no es el primero */}
                {profesoresSeleccionados.length > 1 &&
                  profId !== "todos" && (
                    <button
                      type="button"
                      onClick={() => eliminarSelect(index)}
                      className="borrar_asignacion"
                      title="Borrar profesor"
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
          ))}
        </div>

        <button type="submit" className="btn__guardar-evento">Guardar Evento</button>
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
