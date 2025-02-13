import "./styles/app.css";
import  {Nav}  from "./components/nav";
import {Footer} from "./components/footer";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Inicio } from "./pages/Inicio";
import { Nosotros } from "./pages/Nosotros";
import { Oferta } from "./pages/Oferta";
import { Contacto } from "./pages/Contacto";
import { Historia } from "./pages/Historia";
import { Plantel } from "./pages/Plantel";
import { Clases } from "./pages/Clases";
import { Consulta } from "./pages/Consulta";

export const App = () => {
  return (
    <Router>

      <Nav/>

      <Routes>
        <Route path="/" element={<Inicio/>}/>
        <Route path="/nosotros" element={<Nosotros/>}/>
        <Route path="/oferta" element={<Oferta/>}/>
        <Route path="/contacto" element={<Contacto/>}/>
        <Route path="/historia" element={<Historia/>}/>
        <Route path="/plantel" element={<Plantel/>}/>
        <Route path="/clases" element={<Clases/>}/>
        <Route path="/consulta" element={<Consulta/>}/>
      </Routes>

      <Footer/>

    </Router>
  )
}