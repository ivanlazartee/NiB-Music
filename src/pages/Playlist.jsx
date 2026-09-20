import { useState } from "react";
import { Link } from "react-router-dom";
import { ListMusic, Plus, Play, Trash2, X } from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import { getItem, setItem, KEYS } from "../utils/localStorage";

import portadaDefault from "../assets/img/portada-default.png";
import "../styles/Playlist.css";

function Playlist() {
  const { usuarioActual } = useAuth();
  const { reproducir, cargarCola } = usePlayer();

  const [playlists, setPlaylists] = useState(
    () => getItem(KEYS.playlists) || []
  );
  const [nombreNueva, setNombreNueva] = useState("");
  const [playlistSeleccionadaId, setPlaylistSeleccionadaId] =
    useState(null);
  const [cancionParaAgregarId, setCancionParaAgregarId] =
    useState("");

  const canciones = getItem(KEYS.canciones) || [];
  const cancionesActivas = canciones.filter(
    (cancion) => cancion.activo
  );

  const usuarioId = usuarioActual?.id;

  const playlistsDelUsuario = playlists.filter(
    (playlist) => playlist.usuarioId === usuarioId
  );

  const playlistSeleccionada = playlistsDelUsuario.find(
    (playlist) => playlist.id === playlistSeleccionadaId
  );

  const cancionesDePlaylist = playlistSeleccionada
    ? playlistSeleccionada.cancionesIds
        .map((id) =>
          cancionesActivas.find(
            (cancion) => String(cancion.id) === String(id)
          )
        )
        .filter(Boolean)
    : [];

  const cancionesDisponibles = playlistSeleccionada
    ? cancionesActivas.filter(
        (cancion) =>
          !playlistSeleccionada.cancionesIds.some(
            (id) => String(id) === String(cancion.id)
          )
      )
    : [];

  function guardarPlaylists(nuevasPlaylists) {
    setPlaylists(nuevasPlaylists);
    setItem(KEYS.playlists, nuevasPlaylists);
  }

  function crearPlaylist(event) {
    event.preventDefault();

    const nombre = nombreNueva.trim();

    if (!nombre || !usuarioId) return;

    const nuevaPlaylist = {
      id: crypto.randomUUID(),
      usuarioId,
      nombre,
      cancionesIds: [],
    };

    guardarPlaylists([...playlists, nuevaPlaylist]);

    setNombreNueva("");
    setPlaylistSeleccionadaId(nuevaPlaylist.id);
  }

  function eliminarPlaylist(id) {
    const nuevasPlaylists = playlists.filter(
      (playlist) =>
        !(playlist.id === id && playlist.usuarioId === usuarioId)
    );

    guardarPlaylists(nuevasPlaylists);

    if (playlistSeleccionadaId === id) {
      setPlaylistSeleccionadaId(null);
    }
  }

  function agregarCancion() {
    if (!playlistSeleccionada || !cancionParaAgregarId) return;

    const cancion = cancionesDisponibles.find(
      (item) => String(item.id) === cancionParaAgregarId
    );

    if (!cancion) return;

    const nuevasPlaylists = playlists.map((playlist) => {
      if (
        playlist.id !== playlistSeleccionada.id ||
        playlist.usuarioId !== usuarioId
      ) {
        return playlist;
      }

      return {
        ...playlist,
        cancionesIds: [...playlist.cancionesIds, cancion.id],
      };
    });

    guardarPlaylists(nuevasPlaylists);
    setCancionParaAgregarId("");
  }

  function quitarCancion(cancionId) {
    if (!playlistSeleccionada) return;

    const nuevasPlaylists = playlists.map((playlist) => {
      if (
        playlist.id !== playlistSeleccionada.id ||
        playlist.usuarioId !== usuarioId
      ) {
        return playlist;
      }

      return {
        ...playlist,
        cancionesIds: playlist.cancionesIds.filter(
          (id) => String(id) !== String(cancionId)
        ),
      };
    });

    guardarPlaylists(nuevasPlaylists);
  }

  function reproducirPlaylist() {
    if (
      usuarioActual?.rol !== "premium" ||
      cancionesDePlaylist.length === 0
    ) {
      return;
    }

    cargarCola(cancionesDePlaylist);
    reproducir(cancionesDePlaylist[0]);
  }

  if (!usuarioActual) {
    return (
      <section className="playlists-page">
        <div className="playlists-empty">
          <ListMusic size={42} />
          <h1>Tus playlists</h1>
          <p>Iniciá sesión para crear y guardar tus listas de música.</p>
          <Link to="/login" className="playlists-button">
            Iniciar sesión
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="playlists-page">
      <header className="playlists-header">
        <span className="playlists-eyebrow">Tu biblioteca</span>
        <h1>Mis playlists</h1>
        <p>Organizá tus canciones favoritas en listas personalizadas.</p>
      </header>

      <form className="playlists-create" onSubmit={crearPlaylist}>
        <input
          type="text"
          value={nombreNueva}
          onChange={(event) => setNombreNueva(event.target.value)}
          placeholder="Nombre de tu nueva playlist"
          maxLength={60}
          aria-label="Nombre de la nueva playlist"
        />

        <button
          type="submit"
          className="playlists-button"
          disabled={!nombreNueva.trim()}
        >
          <Plus size={18} />
          Crear playlist
        </button>
      </form>

      {playlistsDelUsuario.length === 0 ? (
        <div className="playlists-empty">
          <ListMusic size={42} />
          <h2>Todavía no tenés playlists</h2>
          <p>Creá una lista para empezar a organizar tu música.</p>
        </div>
      ) : (
        <div className="playlists-layout">
          <div className="playlists-list">
            {playlistsDelUsuario.map((playlist) => (
              <article
                key={playlist.id}
                className={`playlists-card ${
                  playlistSeleccionadaId === playlist.id
                    ? "playlists-card--active"
                    : ""
                }`}
              >
                <button
                  type="button"
                  className="playlists-card__select"
                  onClick={() => {
                    setPlaylistSeleccionadaId(playlist.id);
                    setCancionParaAgregarId("");
                  }}
                >
                  <ListMusic size={26} />

                  <span>
                    <strong>{playlist.nombre}</strong>
                    <small>
                      {playlist.cancionesIds.length} canciones
                    </small>
                  </span>
                </button>

                <button
                  type="button"
                  className="playlists-icon-button"
                  onClick={() => eliminarPlaylist(playlist.id)}
                  aria-label={`Eliminar playlist ${playlist.nombre}`}
                  title="Eliminar playlist"
                >
                  <Trash2 size={18} />
                </button>
              </article>
            ))}
          </div>

          {playlistSeleccionada && (
            <div className="playlists-detail">
              <div className="playlists-detail__header">
                <div>
                  <span className="playlists-eyebrow">Playlist</span>
                  <h2>{playlistSeleccionada.nombre}</h2>
                  <p>{cancionesDePlaylist.length} canciones disponibles</p>
                </div>

                <button
                  type="button"
                  className="playlists-button"
                  onClick={reproducirPlaylist}
                  disabled={
                    cancionesDePlaylist.length === 0 ||
                    usuarioActual.rol !== "premium"
                  }
                  title={
                    usuarioActual.rol !== "premium"
                      ? "La reproducción requiere una cuenta premium"
                      : "Reproducir playlist"
                  }
                >
                  <Play size={18} fill="currentColor" />
                  Reproducir
                </button>
              </div>

              <div className="playlists-add">
                <select
                  value={cancionParaAgregarId}
                  onChange={(event) =>
                    setCancionParaAgregarId(event.target.value)
                  }
                  aria-label="Elegir canción para agregar"
                >
                  <option value="">Elegí una canción del catálogo</option>

                  {cancionesDisponibles.map((cancion) => (
                    <option
                      key={cancion.id}
                      value={String(cancion.id)}
                    >
                      {cancion.nombre} — {cancion.artista}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="playlists-button"
                  onClick={agregarCancion}
                  disabled={!cancionParaAgregarId}
                >
                  <Plus size={18} />
                  Agregar
                </button>
              </div>

              {cancionesDePlaylist.length === 0 ? (
                <p className="playlists-detail__empty">
                  Esta playlist todavía no tiene canciones.
                </p>
              ) : (
                <div className="playlists-songs">
                  {cancionesDePlaylist.map((cancion, index) => (
                    <div className="playlists-song" key={cancion.id}>
                      <span className="playlists-song__number">
                        {index + 1}
                      </span>

                      <img
                        src={cancion.imagen || portadaDefault}
                        alt=""
                        onError={(event) => {
                          event.currentTarget.onerror = null;
                          event.currentTarget.src = portadaDefault;
                        }}
                      />

                      <div className="playlists-song__info">
                        <strong>{cancion.nombre}</strong>
                        <span>{cancion.artista}</span>
                      </div>

                      <button
                        type="button"
                        className="playlists-icon-button"
                        onClick={() => quitarCancion(cancion.id)}
                        aria-label={`Quitar ${cancion.nombre}`}
                        title="Quitar canción"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {usuarioActual.rol !== "premium" && (
                <p className="playlists-premium-note">
                  Podés organizar tus playlists. Para reproducirlas,
                  necesitás una cuenta premium.
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default Playlist;