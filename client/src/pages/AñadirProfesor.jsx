import React, { useState, useEffect } from "react";
import "../styles/añadirProfesor.css";
import ModalMensaje from "../components/ModalMensaje";

export const AñadirProfesor = () => {
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    email: "",
    password: "",
    rol: "profesor",
  });

  const [grados, setGrados] = useState([]);
  const [asignaturas, setAsignaturas] = useState([]);
  const [asignaciones, setAsignaciones] = useState([
    { id_grado: "", id_asignatura: "" },
  ]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [modalTipo, setModalTipo] = useState(""); // 'exito', 'error', 'advertencia'

  useEffect(() => {
    fetch("http://localhost:5000/api/grados")
      .then((res) => res.json())
      .then((data) => setGrados(Array.isArray(data) ? data : []))
      .catch(() => setGrados([]));

    fetch("http://localhost:5000/api/asignaturas")
      .then((res) => res.json())
      .then((data) => setAsignaturas(Array.isArray(data) ? data : []))
      .catch(() => setAsignaturas([]));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAsignacionChange = (index, campo, valor) => {
    const nuevas = [...asignaciones];
    nuevas[index][campo] = valor;
    setAsignaciones(nuevas);
  };

  const agregarFila = () => {
    setAsignaciones([...asignaciones, { id_grado: "", id_asignatura: "" }]);
  };

  const eliminarFila = (index) => {
    const nuevas = asignaciones.filter((_, i) => i !== index);
    setAsignaciones(nuevas);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validaciones
    if (asignaciones.length === 0) {
      setModalMensaje("Debes asignar al menos un grado con materia");
      setModalTipo("advertencia");
      setModalVisible(true);
      return;
    }

    for (const asign of asignaciones) {
      if (!asign.id_grado || !asign.id_asignatura) {
        setModalMensaje("Todos los campos son obligatorios");
        setModalTipo("advertencia");
        setModalVisible(true);
        return;
      }
    }

    let asignacionesFinal = [];
    for (const asign of asignaciones) {
      if (asign.id_grado === "todos") {
        grados.forEach((g) => {
          asignacionesFinal.push({
            id_grado: g.id,
            id_asignatura: Number(asign.id_asignatura),
          });
        });
      } else {
        asignacionesFinal.push({
          id_grado: Number(asign.id_grado),
          id_asignatura: Number(asign.id_asignatura),
        });
      }
    }

    const payload = {
      ...formData,
      asignaciones: asignacionesFinal,
    };

    try {
      const res = await fetch("http://localhost:5000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (res.ok) {
        setModalMensaje("Profesor agregado correctamente");
        setModalTipo("exito");
        setFormData({
          dni: "",
          nombre: "",
          email: "",
          password: "",
          rol: "profesor",
        });
        setAsignaciones([{ id_grado: "", id_asignatura: "" }]);
      } else if(data?.error?.includes("ya está registrado")){
        setModalMensaje("El Profesor ya está registrado");
        setModalTipo("error");
      }
      setModalVisible(true);
    } catch (error) {
      setModalMensaje("Error de red");
      setModalTipo("error");
      setModalVisible(true);
    }
  };

  return (
    <div className="container__general-formulario">
      <h1 className="title__profesor">Añadir Profesor</h1>
      <form onSubmit={handleSubmit} className="form__container-profesor">
        <div className="form-datos-personales">
          <label className="label__datos">
            <strong>Datos Personales</strong>
          </label>
          <div className="row">
            <input
              name="dni"
              value={formData.dni}
              onChange={handleChange}
              placeholder="DNI"
            />
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
            />
          </div>
          <div className="row">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
            />
          </div>
        </div>

        <div className="form-asignaciones">
          <label className="label__datos">
            <strong>Asignaciones (Grado → Materia)</strong>
          </label>
          {asignaciones.map((asig, index) => (
            <div key={index} className="asignacion-fila">
              <select
                value={asig.id_grado}
                onChange={(e) =>
                  handleAsignacionChange(index, "id_grado", e.target.value)
                }
              >
                <option value="">Seleccionar grado</option>
                {grados.map((g) => (
                  <option key={g.id} value={String(g.id)}>
                    {g.grado}
                  </option>
                ))}
                <option value="todos">Todos los grados</option>
              </select>

              <select
                value={asig.id_asignatura}
                onChange={(e) =>
                  handleAsignacionChange(index, "id_asignatura", e.target.value)
                }
              >
                <option value="">Seleccionar materia</option>
                {asignaturas.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.asignatura}
                  </option>
                ))}
              </select>

              <div className="botones">
                {/* Botón agregar */}
                <button
                  className="agregar_asignacion"
                  type="button"
                  onClick={agregarFila}
                  title="Agregar Asignacion"
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

                {/* Botón eliminar: solo si hay más de uno */}
                {asignaciones.length > 1 && (
                  <button
                    className="borrar_asignacion"
                    type="button"
                    onClick={() => eliminarFila(index)}
                    title="Borrar Asignacion"
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

        <div className="form-footer">
          <button className="añadir_profesor" type="submit">
            Añadir Profesor
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
};
