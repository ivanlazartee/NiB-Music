const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar__search">
        <input
          type="text"
          placeholder="Buscar canciones, artistas..."
          className="navbar__input"
        />
      </div>

      <div className="navbar__actions">
        <button className="navbar__button">
          Iniciar sesión
        </button>
      </div>
    </header>
  );
};

export default Navbar;