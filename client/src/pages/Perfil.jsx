import React, { useEffect, useState } from "react";

export const Perfil = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = sessionStorage.getItem("token");

      if (!token) {
        alert("No estás autenticado");
        return;
      }

      try {
        const token = sessionStorage.getItem("token");
        
        const response = await fetch("/api/auth/perfil", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const contentType = response.headers.get("content-type");

        if (response.ok && contentType.includes("application/json")) {
          const data = await response.json();
          setUserData(data);
        } else {
          const text = await response.text(); // leé como texto para evitar romper con .json()
          console.error("Respuesta inesperada:", text);
          alert("Error al cargar perfil");
        }
      } catch (error) {
        console.error("Error al traer perfil:", error);
      }
    };

    fetchPerfil();
  }, []);

  if (!userData) return <p>Cargando perfil...</p>;

  return (
    <div>
      <h2>Perfil del Usuario</h2>
      <p>ID: {userData.id}</p>
      <p>Email: {userData.email}</p>
    </div>
  );
};
