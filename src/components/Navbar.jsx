import { Link } from "react-router-dom";
import { Search } from "lucide-react";

const Navbar = ({ search, setSearch }) => {
  return (
    <header className="navbar">
      <div className="navbar__search">
        <Search className="navbar__search-icon" size={19} />

        <input
          type="text"
          placeholder="Buscar canciones, artistas, álbumes..."
          className="navbar__input"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className="navbar__actions">
        <Link to="/login" className="navbar__button">
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
};

export default Navbar;