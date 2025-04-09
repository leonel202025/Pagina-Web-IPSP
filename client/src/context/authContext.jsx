import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [manualLoading, setManualLoading] = useState(false);

  useEffect(() => {
    const verificarUsuario = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/perfil', {
          headers: {
            'Authorization': token
          }
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (err) {
        console.error('Error al verificar el token:', err);
      } 
    };

    verificarUsuario();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, login, manualLoading, setManualLoading}}>
      {children}
    </AuthContext.Provider>
  );
};
