// components/Loading.jsx
import "../styles/loading.css";
import logo from "../images/logo.png";

export const Loading = ({ texto = "Cargando" }) => {
  return (
    <div className="loading-container">
      <img src={logo} alt="Logo" className="loading-logo" />
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
      <p className="text">{texto}</p>
    </div>
  );
};
