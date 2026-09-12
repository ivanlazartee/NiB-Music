import { NavLink } from "react-router-dom";
import {
  House,
  Search,
  Library,
  Heart,
  ListMusic,
  Crown,
} from "lucide-react";

import logoNib from "../assets/img/Nib-Home.png";

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="sidebar__glow" />

      <NavLink to="/" className="sidebar__brand-link">
        <img
          src={logoNib}
          alt="NiB Music"
          className="sidebar__brand-image"
        />
      </NavLink>

      <nav className="sidebar__nav">
        <NavLink to="/" end className="sidebar__link">
          <House size={19} />
          <span>Inicio</span>
        </NavLink>

        <NavLink to="/catalogo" className="sidebar__link">
          <Search size={19} />
          <span>Explorar</span>
        </NavLink>

        <NavLink to="/playlist" className="sidebar__link">
          <Library size={19} />
          <span>Biblioteca</span>
        </NavLink>
      </nav>

      <div className="sidebar__section">
        <p className="sidebar__section-title">
          PLAYLISTS
        </p>

        <NavLink to="/playlist" className="sidebar__playlist-link">
          <Heart size={17} />
          <span>Tus Me Gusta</span>
        </NavLink>

        <NavLink to="/playlist" className="sidebar__playlist-link">
          <ListMusic size={17} />
          <span>Éxitos 2026</span>
        </NavLink>

        <NavLink to="/playlist" className="sidebar__playlist-link">
          <ListMusic size={17} />
          <span>Lo Fi Chill</span>
        </NavLink>

        <NavLink to="/playlist" className="sidebar__playlist-link">
          <ListMusic size={17} />
          <span>Rock Classics</span>
        </NavLink>

        <NavLink to="/playlist" className="sidebar__playlist-link">
          <ListMusic size={17} />
          <span>Gym Mode</span>
        </NavLink>

        <NavLink to="/playlist" className="sidebar__playlist-link">
          <ListMusic size={17} />
          <span>Para Programar</span>
        </NavLink>
      </div>

      <div className="sidebar__bottom">
        <div className="sidebar__premium-card">
          <div className="sidebar__premium-glow" />

          <div className="sidebar__premium-header">
            <div className="sidebar__premium-icon">
              <Crown size={18} />
            </div>

            <span className="sidebar__premium-title">
              NiB Premium
            </span>
          </div>

          <p className="sidebar__premium-text">
            Música sin límites,
            <br />
            sin anuncios.
          </p>

          <button
            type="button"
            className="sidebar__premium-button"
          >
            Obtener Premium
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;