import { Link, useParams } from "react-router-dom";
import { ArrowLeft, Disc3, Play } from "lucide-react";

import { getItem, KEYS } from "../utils/localStorage";
import portadaDefault from "../assets/img/portada-default.png";

function DetalleCancion() {
  const { id } = useParams();

  const canciones = getItem(KEYS.canciones) || [];

  const cancion = canciones.find(
    (cancion) => cancion.id === id && cancion.activo
  );

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = portadaDefault;
  };

  if (!cancion) {
    return (
      <section className="detalle-cancion detalle-cancion--empty">
        <Disc3 size={48} />

        <h1>Canción no encontrada</h1>

        <p>
          La canción que estás buscando no existe o ya no está disponible.
        </p>

        <Link to="/catalogo" className="detalle-cancion__back">
          <ArrowLeft size={18} />
          Volver al catálogo
        </Link>
      </section>
    );
  }

  return (
    <section className="detalle-cancion">
      <Link to="/catalogo" className="detalle-cancion__back">
        <ArrowLeft size={18} />
        Volver al catálogo
      </Link>

      <div className="detalle-cancion__hero">
        <div className="detalle-cancion__cover">
          <img
            src={cancion.imagen}
            alt={`Portada de ${cancion.nombre}`}
            onError={handleImageError}
          />
        </div>

        <div className="detalle-cancion__info">
          <span className="detalle-cancion__eyebrow">
            Canción
          </span>

          <h1 className="detalle-cancion__title">
            {cancion.nombre}
          </h1>

          <p className="detalle-cancion__artist">
            {cancion.artista}
          </p>

          <p className="detalle-cancion__summary">
            {cancion.album} · {cancion.anio} · {cancion.genero}
          </p>

          <button
            type="button"
            className="detalle-cancion__play"
          >
            <Play size={20} fill="currentColor" />
            Reproducir
          </button>

          <div className="detalle-cancion__metadata">
            <div className="detalle-cancion__metadata-item">
              <span>Álbum</span>
              <strong>{cancion.album}</strong>
            </div>

            <div className="detalle-cancion__metadata-item">
              <span>Género</span>
              <strong>{cancion.genero}</strong>
            </div>

            <div className="detalle-cancion__metadata-item">
              <span>Año</span>
              <strong>{cancion.anio}</strong>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DetalleCancion;