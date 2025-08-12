import "./styles/app.css";
import { Nav } from "./components/nav";
import { Footer } from "./components/footer";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Inicio } from "./pages/Inicio";
import { Nosotros } from "./pages/Nosotros";
import { Oferta } from "./pages/Oferta";
import { Contacto } from "./pages/Contacto";
import { Login } from "./pages/Login";
import { Perfil } from "./pages/Perfil";
import { AuthProvider, AuthContext } from "./context/authContext";
import { Loading } from "./components/loading";
import { useContext } from "react";
import { CreateUsuario } from "./pages/CreateUsuario";
import { AñadirAlumno } from "./pages/AñadirAlumno";
import { AñadirProfesor } from "./pages/AñadirProfesor";
import { PanelAdmin } from "./pages/PanelAdmin";
import { VerAlumnos } from "./pages/VerAlumnos";
import { VerProfesores } from "./pages/VerProfesores";
import { BuscarUsuario } from "./pages/BuscarUsuarios";
import { PanelProfesor } from "./pages/PanelProfesor";
import { MisCursos } from "./pages/MisCursos";

const AppContent = () => {
  const { manualLoading, loadingTexto } = useContext(AuthContext);

  if (manualLoading) return <Loading texto={loadingTexto} />;
  return (
    <>
      <Nav />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/nosotros" element={<Nosotros />} />
          <Route path="/oferta" element={<Oferta />} />
          <Route path="/contacto" element={<Contacto />} />
          <Route path="/login" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/crear-usuario" element={<CreateUsuario />}/>
          <Route path="/crear-alumno" element={<AñadirAlumno />} />
          <Route path="/crear-profesor" element={<AñadirProfesor />} />
          <Route path="/panel-admin" element={<PanelAdmin />} />
          <Route path="/ver-alumnos" element={<VerAlumnos />} />
          <Route path="/ver-profesores" element={<VerProfesores />} />
          <Route path="/buscar-usuario" element={<BuscarUsuario />} />
          <Route path="/panel-profesor" element={<PanelProfesor />} />
          <Route path="/mis-cursos" element={<MisCursos />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
};

export const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);
