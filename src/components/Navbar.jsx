import { Link, useNavigate } from "react-router-dom";
import { Search } from "lucide-react";

const Navbar = ({ search, setSearch }) => {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    navigate("/catalogo");

    setTimeout(() => {
      document
        .getElementById("catalogo")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
    }, 100);
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
          onChange={(event) => setSearch(event.target.value)}
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