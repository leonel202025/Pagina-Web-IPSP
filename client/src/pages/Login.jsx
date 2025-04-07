import React, { useState, useRef, useEffect } from 'react';
import "../styles/login.css"
import logo from "../images/logo.png";

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailInputRef = useRef(null);

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        // Guardamos el token
        localStorage.setItem('token', data.token);
        alert('Inicio de sesión exitoso');

        // Redirigir o hacer algo con el usuario
        console.log("Usuario:", data.user);

        // Ejemplo: navegar a dashboard (si usás React Router)
        // navigate('/dashboard');
      } else {
        alert(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      alert('Error en la conexión');
    }
  };

  return (
    <div className='container'>
    <h1 className='titulo-login'>Iniciar Sesión</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            ref={emailInputRef}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='Example@gmail.com'
            required
          />
        </div>
        <div>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='Password'
            required
          />
        </div>
        <button type="submit">Iniciar Sesión</button>
      </form>
      <img src={logo} alt="logo ipsp" className='logo'/>
    </div>
  );
};