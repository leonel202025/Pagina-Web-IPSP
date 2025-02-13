import "./styles/app.css";
import  {Nav}  from "./components/nav";
import {Footer} from "./components/footer";

export const App = () => {
  return (
    <>
    <Nav/>
    <div className="container__titulo">
    <h1 className="titulo">
    <span>Bienvenidos a la Página Web Oficial del</span>
    <span>Instituto Privado San Pablo</span>
    </h1>
    <a href="#" className="button">Conócenos</a>
    </div>
    <Footer/>
    </>
  )
}