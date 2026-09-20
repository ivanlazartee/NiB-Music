import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Navbar = ({ search, setSearch }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (event) => {
    const valor = event.target.value;

    setSearch(valor);

    // Si el usuario empieza a buscar desde otra página,
    // lo llevamos al catálogo para mostrar los resultados.
    if (valor.trim() !== "" && location.pathname !== "/catalogo") {
      navigate("/catalogo");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Enter también lleva al catálogo, sin desplazar la página.
    if (location.pathname !== "/catalogo") {
      navigate("/catalogo");
    }
  };

  return (
    <header className="navbar">
      <form
        className="navbar__search"
        onSubmit={handleSubmit}
      >
        <Search
          className="navbar__search-icon"
          size={19}
        />

        <input
          type="search"
          placeholder="Buscar canciones, artistas, álbumes..."
          className="navbar__input"
          value={search}
          onChange={handleSearchChange}
        />
      </form>

      <div className="navbar__actions">
        <Link
          to="/login"
          className="navbar__button"
        >
          Iniciar sesión
        </Link>
      </div>
    </header>
  );
};

export default Navbar;