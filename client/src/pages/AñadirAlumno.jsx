import React from "react";
import { useState, useEffect } from "react";
import "../styles/añadirAlumno.css";
import ModalMensaje from "../components/modalMensaje";

export const AñadirAlumno = () => {
  const [formData, setFormData] = useState({
    dni: "",
    nombre: "",
    email: "",
    password: "",
    rol: "alumno",
    id_grado: "",
  });

  const [grados, setGrados] = useState([]);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMensaje, setModalMensaje] = useState("");
  const [modalTipo, setModalTipo] = useState(""); // 'exito' o 'error'

  useEffect(() => {
    fetch("http://localhost:5000/api/grados")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setGrados(data);
        } else {
          console.error("❌ No se recibió un array de grados:", data);
          setGrados([]);
        }
      })
      .catch((err) => {
        console.error("❌ Error en el fetch de grados:", err);
        setGrados([]);
      });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const idGradoNumber = formData.id_grado ? Number(formData.id_grado) : null;

    if (!idGradoNumber) {
      setModalMensaje("Debes seleccionar un grado válido");
      setModalTipo("advertencia");
      setModalVisible(true);
      return;
    }

    const payload = {
      ...formData,
      id_grado: Number(formData.id_grado),
    };

    try {
      const res = await fetch("http://localhost:5000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok) {
        setModalMensaje("Alumno Agregado Correctamente");
        setModalTipo("exito");
        setFormData({
          dni: "",
          nombre: "",
          email: "",
          password: "",
          rol: "alumno",
          id_grado: "",
        });
      } else {
        if (
          data &&
          typeof data.error === "string" &&
          data.error.includes("ya está registrado")
        ) {
          setModalMensaje("El Alumno ya está Registrado");
          setModalTipo("advertencia");
        } else {
          setModalMensaje("Ocurrió un Error al Agregar el Alumno");
          setModalTipo("error");
        }
      }
      setModalVisible(true);
    } catch (err) {
      console.error(err);
      setModalMensaje("Error de red");
      setModalTipo("error");
      setModalVisible(true);
    }
  };

  return (
    <div className="container">
      <>
        <h1 className="tittle__alumno"> Añadir Alumno </h1>
        <form onSubmit={handleSubmit}>
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
          <select
            name="id_grado"
            value={formData.id_grado}
            onChange={handleChange}
            required
          >
            <option value="">Seleccionar grado</option>
            {grados.map((grado) => (
              <option key={grado.id} value={grado.id}>
                {grado.grado}
              </option>
            ))}
          </select>
          <button type="submit">Añadir Alumno</button>
        </form>
        <ModalMensaje
          visible={modalVisible}
          mensaje={modalMensaje}
          tipo={modalTipo}
          onClose={() => setModalVisible(false)}
        />
      </>
    </div>
  );
};
