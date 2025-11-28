import React, { useState, useRef, useEffect } from "react";
import "../styles/login.css";
import logo from "../images/logo.png";
import { useContext } from "react";
import { AuthContext } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const emailInputRef = useRef(null);
  const { login, setManualLoading, setLoadingTexto } = useContext(AuthContext);

  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Limpiamos errores previos

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        const { token, user } = data;
        sessionStorage.setItem("token", token);
        localStorage.setItem("idAlumno", user.id); // <-- Aquí guardamos el ID real del alumno
        login(user, token);
        navigate("/");
        setManualLoading(true);
        setLoadingTexto("Cargando...");

        setTimeout(() => {
          setManualLoading(false);
        }, 4000);
      } else {
        // ❌ Error: no activamos el loading
        setErrorMessage("El Mail y/o Contraseña son Incorrectos.");
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
      setErrorMessage(`Error en la conexión: ${error.message}`);
    }
  };

  return (
    <div className="container__login">
      <h1 className="titulo-login">Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            ref={emailInputRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Example@gmail.com"
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        <div className={`error-wrapper ${errorMessage ? "visible" : ""}`}>
          <div className="error-message">
            <svg
              className="error-icon"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01M4.93 4.93l14.14 14.14M1 12c0 6.075 4.925 11 11 11s11-4.925 11-11S18.075 1 12 1 1 5.925 1 12z"
              />
            </svg>
            <span>{errorMessage}</span>
          </div>
        </div>
        <button className="btn-login" type="submit">
          Iniciar Sesión
        </button>
      </form>
      <img src={logo} alt="logo ipsp" className="logo" />
    </div>
  );
};
