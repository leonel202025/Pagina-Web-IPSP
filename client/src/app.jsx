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
import { useContext } from "react"; // <-- ✅ Importá esto
import { CreateUsuario } from "./pages/CreateUsuario";
import { AñadirAlumno } from "./pages/AñadirAlumno";
import { AñadirProfesor } from "./pages/AñadirProfesor";

const AppContent = () => {
  const { manualLoading } = useContext(AuthContext);

  if (manualLoading) return <Loading />;
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
