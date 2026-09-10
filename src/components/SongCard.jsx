import { Link } from "react-router-dom";
import { Play } from "lucide-react";

import portadaDefault from "../assets/img/portada-default.png";

const SongCard = ({ cancion, onPlay }) => {
  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = portadaDefault;
  };

  return (
    <article className="song-card">
      <Link
        to={`/detalle/${cancion.id}`}
        className="song-card__image-container"
      >
        <img
          src={cancion.imagen}
          alt={`Portada de ${cancion.nombre}`}
          className="song-card__image"
          onError={handleImageError}
        />
      </Link>

      <button
        type="button"
        className="song-card__play"
        onClick={() => onPlay?.(cancion)}
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
  );
};

export default SongCard;