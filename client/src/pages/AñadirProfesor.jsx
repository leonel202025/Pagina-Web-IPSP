import React, { useState, useEffect } from "react";
import "../styles/añadirProfesor.css";
import ModalMensaje from "../components/modalMensaje";

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
  const [asignaturasSeleccionadas, setAsignaturasSeleccionadas] = useState([]);
  const [gradosSeleccionados, setGradosSeleccionados] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [modalTipo, setModalTipo] = useState(""); // 'exito', 'error', 'advertencia'

  useEffect(() => {
    fetch("http://localhost:5000/api/grados")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGrados(data);
        else setGrados([]);
      })
      .catch(() => setGrados([]));

    fetch("http://localhost:5000/api/asignaturas")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAsignaturas(data);
        else setAsignaturas([]);
      })
      .catch(() => setAsignaturas([]));
  }, []);

  const handleChange = (e) => {
    const { name, value, options } = e.target;

    if (options) {
      // Si es select múltiple, extraemos valores seleccionados en array
      const selectedValues = [];
      for (let i = 0; i < options.length; i++) {
        if (options[i].selected) selectedValues.push(Number(options[i].value));
      }
      setFormData({ ...formData, [name]: selectedValues });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (gradosSeleccionados.length === 0) {
      setModalMensaje("Debes seleccionar al menos un grado");
      setModalTipo("advertencia");
      setModalVisible(true);
      return;
    }

    if (asignaturasSeleccionadas.length === 0) {
      setModalMensaje("Debes seleccionar al menos una asignatura");
      setModalTipo("advertencia");
      setModalVisible(true);
      return;
    }

    const payload = {
      ...formData,
      grados: gradosSeleccionados,
      asignaturas: asignaturasSeleccionadas,
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
        setGradosSeleccionados([]);
        setAsignaturasSeleccionadas([]);
      } else {
        if (data?.error?.includes("ya está registrado")) {
          setModalMensaje("El Profesor ya está registrado");
          setModalTipo("advertencia");
        } else {
          setModalMensaje("Error al agregar el Profesor");
          setModalTipo("error");
        }
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
      <h1 className="title__profesor"> Añadir Profesor </h1>
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
              required
            />
            <input
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Nombre"
              required
            />
          </div>
          <div className="row">
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Contraseña"
              required
            />
          </div>
        </div>

        <div className="form-checkboxes">
          <div className="checkbox-column">
            <label className="label__checkbox">
              <strong>Grados</strong>
            </label>
            <div className="checkbox-list">
              {grados.map((grado) => (
                <label key={grado.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    value={grado.id}
                    checked={gradosSeleccionados.includes(grado.id)}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      if (e.target.checked) {
                        setGradosSeleccionados([...gradosSeleccionados, id]);
                      } else {
                        setGradosSeleccionados(
                          gradosSeleccionados.filter((i) => i !== id)
                        );
                      }
                    }}
                  />
                  <span>{grado.grado}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="checkbox-column">
            <label className="label__checkbox">
              <strong>Asignaturas</strong>
            </label>
            <div className="checkbox-list">
              {asignaturas.map((asig) => (
                <label key={asig.id} className="checkbox-item">
                  <input
                    type="checkbox"
                    value={asig.id}
                    checked={asignaturasSeleccionadas.includes(asig.id)}
                    onChange={(e) => {
                      const id = Number(e.target.value);
                      if (e.target.checked) {
                        setAsignaturasSeleccionadas([
                          ...asignaturasSeleccionadas,
                          id,
                        ]);
                      } else {
                        setAsignaturasSeleccionadas(
                          asignaturasSeleccionadas.filter((i) => i !== id)
                        );
                      }
                    }}
                  />
                  <span>{asig.asignatura}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        <div className="form-footer">
          <button type="submit">Añadir Profesor</button>
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
