import React, { useState, useEffect } from "react";
import "../styles/añadirAlumno.css";
import ModalMensaje from "../components/ModalMensaje";

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
  const [modalTipo, setModalTipo] = useState(""); 

  useEffect(() => {
    fetch("http://localhost:5000/api/grados")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setGrados(data);
        else setGrados([]);
      })
      .catch(() => setGrados([]));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.dni ||
      !formData.nombre ||
      !formData.email ||
      !formData.password ||
      !formData.id_grado
    ) {
      setModalMensaje("Todos los campos son obligatorios");
      setModalTipo("advertencia");
      setModalVisible(true);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/usuarios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          id_grado: Number(formData.id_grado),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setModalMensaje("Alumno agregado correctamente");
        setModalTipo("exito");
        setFormData({
          dni: "",
          nombre: "",
          email: "",
          password: "",
          rol: "alumno",
          id_grado: "",
        });
      } else if (data?.error && data.error.includes("ya está registrado")) {
        setModalMensaje("El Alumno ya está registrado");
        setModalTipo("error");
      } else {
        setModalMensaje("Ocurrió un error al agregar el Alumno");
        setModalTipo("error");
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
      <h1 className="tittle__alumno">Añadir Alumno</h1>
      <form onSubmit={handleSubmit}>
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
        <select
          name="id_grado"
          value={formData.id_grado}
          onChange={handleChange}
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
    </div>
  );
};
