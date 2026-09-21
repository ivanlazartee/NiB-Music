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

  const buscador = (
    <form className="navbar__search" onSubmit={handleSubmit}>
      <Search className="navbar__search-icon" size={19} />

      <input
        ref={searchInputRef}
        type="search"
        placeholder="Buscar canciones, artistas, álbumes..."
        className="navbar__input"
        value={search}
        onChange={handleSearchChange}
      />
    </form>
  );

  return (
    <header className={`navbar ${esInvitado ? "navbar--guest" : ""}`}>
      <div className="navbar__left">
        <Link to="/" className="navbar__home" aria-label="Ir al inicio">
          <House size={20} />
        </Link>

        {esInvitado ? (
          buscador
        ) : (
          <Link to="/catalogo" className="navbar__explore">
            Explorar
          </Link>
        )}
      </div>

      {!esInvitado && buscador}

      <div className="navbar__actions">
        {esInvitado && (
          <>
            <Link to="/registro" className="navbar__link">
              Premium
            </Link>

            <Link to="/ayuda" className="navbar__link">
              Ayuda
            </Link>

            <Link to="/descargar" className="navbar__link">
              Descargar
            </Link>

            <span className="navbar__divider" aria-hidden="true" />

            <Link to="/registro" className="navbar__link navbar__link--register">
              Regístrate
            </Link>
          </>
        )}

        {esInvitado ? (
          <Link to="/login" className="navbar__button navbar__button--compact">
            Iniciar sesión
          </Link>
        ) : (
          <Link
            to={usuarioActual.rol === "admin" ? "/admin" : "/perfil"}
            className="navbar__avatar-link"
            aria-label={`Perfil de ${usuarioActual.nombre}`}
            title={usuarioActual.nombre}
          >
            <img
              src={
                usuarioActual.avatar ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  usuarioActual.nombre || "U"
                )}&background=ffdf2d&color=111`
              }
              alt=""
              className="navbar__avatar"
            />
          </Link>
        )}
      </div>
    </header>
  );
};

export default Navbar;
