import "./Error404.css";
import { Link } from "react-router-dom";

function Error404() {
  return (
    <main className="error404-container">
      <section className="error404-content">
        <div className="error404-image"></div>

        <div className="error404-info">
          <h1>404</h1>

          <h2>Esta canción ya no está en la playlist</h2>

          <p>
            Puede que la página haya sido eliminada, movida o que el enlace sea
            incorrecto.
          </p>

          <div className="error404-buttons">
            <Link to="/">Volver al inicio</Link>

            <Link to="/">Explorar música</Link>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Error404;