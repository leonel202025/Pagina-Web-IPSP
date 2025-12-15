import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [manualLoading, setManualLoading] = useState(false);
  const [loadingTexto, setLoadingTexto] = useState("Cargando"); 
  const [usuarioBuscado, setUsuarioBuscado] = useState(null);
  const [modalVisibleUsuario, setModalVisibleUsuario] = useState(true);

  useEffect(() => {
    const verificarUsuario = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        return;
      }

      try {
        const res = await fetch("/api/auth/perfil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (res.ok) {
          setUser(data);
        } else {
          sessionStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Error al verificar el token:", err);
      }
    };

    verificarUsuario();
  }, []);

  const login = (userData, token) => {
    setUser(userData);
    sessionStorage.setItem("token", token);
  };

  const logout = () => {
    sessionStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, logout, login, manualLoading, setManualLoading, loadingTexto, setLoadingTexto, usuarioBuscado, setUsuarioBuscado, modalVisibleUsuario, setModalVisibleUsuario,}}
    >
      {children}
    </AuthContext.Provider>
  );
};
