import { Link, NavLink } from "react-router-dom";
import { House, Search, Library, Plus } from "lucide-react";

import "../styles/mobileBottomNav.css";

function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav" aria-label="Navegación principal">
      <NavLink to="/" end className="mobile-bottom-nav__item">
        <House size={22} />
        <span>Inicio</span>
      </NavLink>

      <NavLink to="/catalogo" className="mobile-bottom-nav__item">
        <Search size={22} />
        <span>Buscar</span>
      </NavLink>

      <NavLink to="/playlist" className="mobile-bottom-nav__item">
        <Library size={22} />
        <span>Tu biblioteca</span>
      </NavLink>

      <Link to="/playlist" className="mobile-bottom-nav__item">
        <Plus size={22} />
        <span>Crear</span>
      </Link>
    </nav>
  );
}

export default MobileBottomNav;
