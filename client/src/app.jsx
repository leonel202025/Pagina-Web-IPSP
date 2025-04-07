import "./styles/app.css";
import  {Nav}  from "./components/nav";
import {Footer} from "./components/footer";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Inicio } from "./pages/Inicio";
import { Nosotros } from "./pages/Nosotros";
import { Oferta } from "./pages/Oferta";
import { Contacto } from "./pages/Contacto";
import { Login } from "./pages/Login";

export const App = () => {
  return (
    <Router>

      <Nav/>

      <main className="main-content">
      <Routes>
        <Route path="/" element={<Inicio/>}/>
        <Route path="/nosotros" element={<Nosotros/>}/>
        <Route path="/oferta" element={<Oferta/>}/>
        <Route path="/contacto" element={<Contacto/>}/>
        <Route path="/login" element={<Login/>}/>
      </Routes>
      </main>

      <Footer/>

    </Router>
  )
}