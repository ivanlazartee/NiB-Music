import { NavLink } from "react-router-dom";
import logoNib from "../assets/img/Nib-Home.png";

const Sidebar = () => {
  return (
    <aside className="sidebar">

      {/* Logo NiB Music */}
      <NavLink to="/" className="sidebar__brand-link">
        <img
          src={logoNib}
          alt="NiB Music"
          className="sidebar__brand-image"
        />
      </NavLink>

      {/* Navegación */}
      <nav className="sidebar__nav">
        <NavLink to="/" end className="sidebar__link">
          Inicio
        </NavLink>

        <NavLink to="/catalogo" className="sidebar__link">
          Explorar
        </NavLink>

        <NavLink to="/playlist" className="sidebar__link">
          Playlists
        </NavLink>

        <NavLink to="/perfil" className="sidebar__link">
          Perfil
        </NavLink>
      </nav>

    </aside>
  );
};

export default Sidebar;