import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Disc3, Play, X } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

import { getItem, KEYS } from "../utils/localStorage";
import portadaDefault from "../assets/img/portada-default.png";

function DetalleCancion() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { usuarioActual } = useAuth();
  const { reproducir, cargarCola } = usePlayer();

  const [mostrarAviso, setMostrarAviso] = useState(false);

  const canciones = getItem(KEYS.canciones) || [];

  const cancionesActivas = canciones.filter(
    (cancion) => cancion.activo
  );

  const cancion = cancionesActivas.find(
    (cancion) => String(cancion.id) === id
  );

  const esPremium = usuarioActual?.rol === "premium";

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = portadaDefault;
  };

  const handlePlayClick = () => {
    if (!usuarioActual) {
      setMostrarAviso(true);
      return;
    }

    if (!esPremium) {
      navigate("/registro");
      return;
    }

    cargarCola(cancionesActivas);
    reproducir(cancion);
  };

  const irARegistro = () => {
    setMostrarAviso(false);
    navigate("/registro");
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
    <>
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
              onClick={handlePlayClick}
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

      {mostrarAviso && (
        <div
          className="song-card-modal__overlay"
          onClick={() => setMostrarAviso(false)}
        >
          <div
            className="song-card-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="detalle-cancion-modal-title"
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

            <h2 id="detalle-cancion-modal-title">
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
}

export default DetalleCancion;