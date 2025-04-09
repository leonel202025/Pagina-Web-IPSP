import "../styles/loading.css";
import logo from "../images/logo.png"; // sin llaves

export const Loading = () => {
  return (
    <div className="loading-container">
      <img src={logo} alt="Logo" className="loading-logo" />
      <div className="loading-bar">
        <div className="loading-progress"></div>
      </div>
      <p className="text">Cargando...</p>
    </div>
  );
};
