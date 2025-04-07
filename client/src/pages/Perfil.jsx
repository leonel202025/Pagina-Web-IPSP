import React, { useEffect, useState } from 'react';

const Perfil = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchPerfil = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        alert("No estás autenticado");
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/auth/perfil', {
          method: 'GET',
          headers: {
            'Authorization': token
          }
        });

        const data = await response.json();

        if (response.ok) {
          setUserData(data.user);
        } else {
          alert(data.error || 'Error al cargar perfil');
        }
      } catch (error) {
        console.error('Error al traer perfil:', error);
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

export default Perfil;