import { createContext, useEffect, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [manualLoading, setManualLoading] = useState(false);

  useEffect(() => {
    const verificarUsuario = async () => {
      const token = sessionStorage.getItem('token');
      if (!token) {
        return;
      }

      try {
        const res = await fetch('http://localhost:5000/api/auth/perfil', {
          headers: {
            'Authorization': `Bearer ${token}` // 👈 CORRECTO
          }
        });

        const data = await res.json();

        if (res.ok) {
          setUser(data.user);
        } else {
          sessionStorage.removeItem('token');
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
    sessionStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout, login, manualLoading, setManualLoading}}>
      {children}
    </AuthContext.Provider>
  );
};
