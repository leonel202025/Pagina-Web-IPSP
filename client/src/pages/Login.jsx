import React, { useState, useRef, useEffect } from 'react';
import "../styles/login.css"
import logo from "../images/logo.png";
import { useContext } from 'react';
import { AuthContext } from '../context/authContext';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const emailInputRef = useRef(null);
  const { login, setManualLoading } = useContext(AuthContext); // 👈 agregar esto arriba

  useEffect(() => {
    emailInputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setManualLoading(true); // Comienza el loading

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
        localStorage.setItem('token', data.token);
        setManualLoading(true);  // Muestra el Loading
        login(data.user); // ✅ Actualiza el contexto
        setTimeout(() => {
          setManualLoading(false); // Desactiva después de 4s
        }, 4000);
      } else {
        alert(data.error || 'Error al iniciar sesión');
      }
    } catch (error) {
      console.error('Error al conectar con el backend:', error);
      alert(`Error en la conexión: ${error.message}`);
    }
  }    

  return (
    <div className='container'>
        <>
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
        </>
    </div>
  );
};