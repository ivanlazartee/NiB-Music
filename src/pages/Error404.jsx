import "./Error404.css";
import vinilo from "../assets/img/vinilo.png";
import error404Bg from "../assets/img/error404-bg.png";
import { Link } from "react-router-dom";
import { House, Music2 } from "lucide-react";


function Error404() {
  return (
    <main
      className="error404-container"
      style={{ backgroundImage: `url(${error404Bg})` }}
    >
      <div className="error404-overlay" />

      <section className="error404-content">
        <div className="error404-image">
          <div className="error404-vinyl-glow">
            <img
              src={vinilo}
              alt="Disco de vinilo"
              className="vinilo"
            />
          </div>
        </div>

        <div className="error404-info">
          <span className="error404-label">
            NiB MUSIC
          </span>

          <h1>404</h1>

          <h2>
            Esta canción ya no está
            <br />
            en la playlist
          </h2>

          <p>
            Puede que la página haya sido eliminada,
            movida o que el enlace sea incorrecto.
          </p>

          <div className="error404-buttons">
            <Link to="/" className="error404-button error404-button-primary">
              <House size={18} />
              <span>Volver al inicio</span>
            </Link>

            <Link
              to="/catalogo"
              className="error404-button error404-button-secondary"
            >
              <Music2 size={18} />
              <span>Explorar música</span>
            </Link>
          </div>

          <div className="error404-footer">
            <span />
            <p>LA MÚSICA SIEMPRE ENCUENTRA SU CAMINO CON NIB MUSIC</p>
            <span />
          </div>
        </div>
      </section>
    </main>
  );
}

export default Error404;