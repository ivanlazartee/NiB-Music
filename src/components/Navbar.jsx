import { Link, useLocation, useNavigate } from "react-router-dom";
import { House, Search } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const Navbar = ({ search, setSearch, searchInputRef }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuarioActual } = useAuth();

  const esInvitado = !usuarioActual;

  const handleSearchChange = (event) => {
    const valor = event.target.value;

    setSearch(valor);

    if (valor.trim() !== "" && location.pathname !== "/catalogo") {
      navigate("/catalogo");
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (location.pathname !== "/catalogo") {
      navigate("/catalogo");
    }
  };

  return (
    <header className="navbar">
      <div className="navbar__left">
        <Link
          to="/"
          className="navbar__home"
          aria-label="Ir al inicio"
        >
          <House size={20} />
        </Link>

        <form
          className="navbar__search"
          onSubmit={handleSubmit}
        >
          <Search
            className="navbar__search-icon"
            size={19}
          />

          <input
            ref={searchInputRef}
            type="search"
            placeholder="Buscar canciones, artistas, álbumes..."
            className="navbar__input"
            value={search}
            onChange={handleSearchChange}
          />
        </form>
      </div>

      <div className="navbar__actions">
        {esInvitado && (
          <>
            <Link to="/registro" className="navbar__link">
              Premium
            </Link>

            <a
              href="#ayuda"
              className="navbar__link"
              onClick={(event) => event.preventDefault()}
            >
              Ayuda
            </a>

            <a
              href="#descargar"
              className="navbar__link"
              onClick={(event) => event.preventDefault()}
            >
              Descargar
            </a>

            <span className="navbar__divider" aria-hidden="true" />

            <Link to="/registro" className="navbar__link navbar__link--register">
              Regístrate
            </Link>
          </>
        )}

        {esInvitado ? (
          <Link to="/login" className="navbar__button">
            Iniciar sesión
          </Link>
        ) : (
          <Link
            to={usuarioActual.rol === "admin" ? "/admin" : "/perfil"}
            className="navbar__button"
          >
            {usuarioActual.nombre}
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
