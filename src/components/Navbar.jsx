import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";

export default function Navbar({ title }) {
  const navigate = useNavigate();
  const location = useLocation();

  const goBack = () => {
    if (location.pathname === "/settings") {
      // Go back to last mode
      const lastView = localStorage.getItem("lastView") || "/";
      navigate(lastView);
    } else if (location.pathname === "/course-materials") {
      navigate("/instructor");
    }
  };

  const goToSettings = () => {
    // Remember where user came from
    if (location.pathname === "/instructor" || location.pathname === "/") {
      localStorage.setItem("lastView", location.pathname);
    }
    navigate("/settings");
  };

  return (
    <div className="navbar">
      {location.pathname !== "/" && location.pathname !== "/instructor" ? (
        <button className="nav-button back" onClick={goBack}>←</button>
      ) : (
        <div className="nav-placeholder"></div>
      )}
      <h1>{title}</h1>
      <button className="nav-button profile" onClick={goToSettings}>👤</button>
    </div>
  );
}
