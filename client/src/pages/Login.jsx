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

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password); // Verificación temporal
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