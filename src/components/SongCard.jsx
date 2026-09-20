import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, X } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

const SongCard = ({ cancion, onPlay }) => {
  const navigate = useNavigate();

  const { usuarioActual } = useAuth();
  const { reproducir } = usePlayer();

  const [mostrarAviso, setMostrarAviso] = useState(false);

  const handlePlayClick = () => {
    // Los visitantes deben registrarse o iniciar sesión.
    if (!usuarioActual) {
      setMostrarAviso(true);
      return;
    }

    // Conectamos la tarjeta con el reproductor de Iván.
    reproducir(cancion);

    // Conservamos el callback por compatibilidad con otros componentes.
    onPlay?.(cancion);

    // Mantenemos la navegación que ya tenía la tarjeta.
    navigate(`/detalle/${cancion.id}`);
  };

  const irARegistro = () => {
    setMostrarAviso(false);
    navigate("/registro");
  };

  return (
    <>
      <article className="song-card">
        <Link
          to={`/detalle/${cancion.id}`}
          className="song-card__image-container"
        >
          <img
            src={cancion.imagen}
            alt={`Portada de ${cancion.nombre}`}
            className="song-card__image"
          />
        </Link>

        <button
          type="button"
          className="song-card__play"
          onClick={handlePlayClick}
          aria-label={`Reproducir ${cancion.nombre}`}
        >
          <Play size={20} fill="currentColor" />
        </button>

        <div className="song-card__info">
          <Link
            to={`/detalle/${cancion.id}`}
            className="song-card__title"
          >
            {cancion.nombre}
          </Link>

          <p className="song-card__artist">{cancion.artista}</p>
        </div>
      </article>

      {mostrarAviso && (
        <div
          className="song-card-modal__overlay"
          onClick={() => setMostrarAviso(false)}
        >
          <div
            className="song-card-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="song-card-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="song-card-modal__close"
              onClick={() => setMostrarAviso(false)}
              aria-label="Cerrar aviso"
            >
              <X size={20} />
            </button>

            <h2 id="song-card-modal-title">
              ¡La música te está esperando!
            </h2>

            <p>
              Para escuchar canciones en NiB Music, necesitás crear una
              cuenta o iniciar sesión.
            </p>

            <div className="song-card-modal__actions">
              <button
                type="button"
                className="song-card-modal__primary"
                onClick={irARegistro}
              >
                Registrarme
              </button>

              <button
                type="button"
                className="song-card-modal__secondary"
                onClick={() => setMostrarAviso(false)}
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SongCard;