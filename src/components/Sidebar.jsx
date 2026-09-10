import { NavLink } from "react-router-dom";
import {
  House,
  Search,
  Library,
  Heart,
  ListMusic,
  User,
} from "lucide-react";

import logoNib from "../assets/img/Nib-Home.png";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <NavLink to="/" className="sidebar__brand-link">
        <img
          src={logoNib}
          alt="NiB Music"
          className="sidebar__brand-image"
        />
      </NavLink>

      <nav className="sidebar__nav">
        <NavLink to="/" end className="sidebar__link">
          <House size={20} />
          <span>Inicio</span>
        </NavLink>

        <NavLink to="/catalogo" className="sidebar__link">
          <Search size={20} />
          <span>Explorar</span>
        </NavLink>

        <NavLink to="/playlist" className="sidebar__link">
          <Library size={20} />
          <span>Biblioteca</span>
        </NavLink>
      </nav>

      <div className="sidebar__section">
        <p className="sidebar__section-title">PLAYLISTS</p>

        <NavLink to="/playlist" className="sidebar__playlist-link">
          <Heart size={18} />
          <span>Tus Me Gusta</span>
        </NavLink>

        <NavLink to="/playlist" className="sidebar__playlist-link">
          <ListMusic size={18} />
          <span>Éxitos 2024</span>
        </NavLink>

        <NavLink to="/playlist" className="sidebar__playlist-link">
          <ListMusic size={18} />
          <span>Lo Fi Chill</span>
        </NavLink>

        <NavLink to="/playlist" className="sidebar__playlist-link">
          <ListMusic size={18} />
          <span>Rock Classics</span>
        </NavLink>

        <NavLink to="/playlist" className="sidebar__playlist-link">
          <ListMusic size={18} />
          <span>Gym Mode</span>
        </NavLink>

        <NavLink to="/playlist" className="sidebar__playlist-link">
          <ListMusic size={18} />
          <span>Para Programar</span>
        </NavLink>
      </div>

      <div className="sidebar__profile">
        <NavLink to="/perfil" className="sidebar__link">
          <User size={20} />
          <span>Perfil</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;