import { useLayoutEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  Clock3,
  Heart,
  ListMusic,
  Play,
  Plus,
  Trash2,
  X,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import { getItem, setItem, KEYS } from "../utils/localStorage";
import {
  ensureMeGustaPlaylist,
  getPlaylistsDeUsuario,
  getPortadaPlaylist,
  isMeGustaPlaylist,
} from "../utils/playlists";

import portadaDefault from "../assets/img/portada-default.png";
import "../styles/Playlist.css";

function Playlist() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { usuarioActual } = useAuth();
  const { reproducir, cargarCola } = usePlayer();

  const [playlists, setPlaylists] = useState(
    () => getItem(KEYS.playlists) || []
  );
  const [nombreNueva, setNombreNueva] = useState("");
  const [cancionParaAgregarId, setCancionParaAgregarId] = useState("");

  const canciones = getItem(KEYS.canciones) || [];
  const cancionesActivas = canciones.filter((cancion) => cancion.activo);

  const usuarioId = usuarioActual?.id;
  const puedeReproducir =
    usuarioActual?.rol === "premium" || usuarioActual?.rol === "admin";

  useLayoutEffect(() => {
    if (!usuarioId) return;

    const actualizadas = ensureMeGustaPlaylist(usuarioId);
    setPlaylists(actualizadas);
  }, [usuarioId]);

  const playlistsDelUsuario = getPlaylistsDeUsuario(usuarioId, playlists);

  const playlistSeleccionada = playlistsDelUsuario.find(
    (playlist) => playlist.id === id
  );

  const cancionesDePlaylist = playlistSeleccionada
    ? playlistSeleccionada.cancionesIds
        .map((cancionId) =>
          cancionesActivas.find(
            (cancion) => String(cancion.id) === String(cancionId)
          )
        )
        .filter(Boolean)
    : [];

  const cancionesDisponibles = playlistSeleccionada
    ? cancionesActivas.filter(
        (cancion) =>
          !playlistSeleccionada.cancionesIds.some(
            (cancionId) => String(cancionId) === String(cancion.id)
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
      esMeGusta: false,
    };

    guardarPlaylists([...playlists, nuevaPlaylist]);
    setNombreNueva("");
    navigate(`/playlist/${nuevaPlaylist.id}`);
  }

  function eliminarPlaylist(playlistId) {
    const playlist = playlistsDelUsuario.find(
      (item) => item.id === playlistId
    );

    if (!playlist || isMeGustaPlaylist(playlist)) return;

    const nuevasPlaylists = playlists.filter(
      (item) => !(item.id === playlistId && item.usuarioId === usuarioId)
    );

    guardarPlaylists(nuevasPlaylists);

    if (id === playlistId) {
      const meGusta = playlistsDelUsuario.find(isMeGustaPlaylist);
      navigate(meGusta ? `/playlist/${meGusta.id}` : "/playlist");
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
          (itemId) => String(itemId) !== String(cancionId)
        ),
      };
    });

    guardarPlaylists(nuevasPlaylists);
  }

  function reproducirPlaylist(desdeIndex = 0) {
    if (!puedeReproducir || cancionesDePlaylist.length === 0) return;

    cargarCola(cancionesDePlaylist);
    reproducir(cancionesDePlaylist[desdeIndex] || cancionesDePlaylist[0]);
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

  if (id && !playlistSeleccionada) {
    return (
      <section className="playlists-page">
        <div className="playlists-empty">
          <ListMusic size={42} />
          <h2>Playlist no encontrada</h2>
          <p>Volvé a tu biblioteca y elegí otra lista.</p>
          <Link to="/playlist" className="playlists-button">
            Ir a playlists
          </Link>
        </div>
      </section>
    );
  }

  if (playlistSeleccionada) {
    const esMeGusta = isMeGustaPlaylist(playlistSeleccionada);
    const portada = getPortadaPlaylist(playlistSeleccionada);

    return (
      <section className="playlists-page playlists-page--detail">
        <header
          className={`playlist-hero ${
            esMeGusta ? "playlist-hero--liked" : ""
          }`}
        >
          {esMeGusta ? (
            <div className="playlist-hero__cover playlist-hero__cover--liked">
              <Heart size={72} fill="currentColor" />
            </div>
          ) : (
            <img
              src={portada || portadaDefault}
              alt={playlistSeleccionada.nombre}
              className="playlist-hero__cover"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = portadaDefault;
              }}
            />
          )}

          <div className="playlist-hero__meta">
            <span className="playlist-hero__type">Playlist</span>
            <h1>{playlistSeleccionada.nombre}</h1>
            <p>
              <strong>{usuarioActual.nombre}</strong>
              <span>·</span>
              {cancionesDePlaylist.length} canciones
            </p>
          </div>
        </header>

        <div className="playlist-toolbar">
          <button
            type="button"
            className="playlist-play-button"
            onClick={() => reproducirPlaylist(0)}
            disabled={cancionesDePlaylist.length === 0 || !puedeReproducir}
            title={
              !puedeReproducir
                ? "La reproducción requiere una cuenta premium"
                : "Reproducir playlist"
            }
            aria-label="Reproducir playlist"
          >
            <Play size={28} fill="currentColor" />
          </button>

          {!esMeGusta && (
            <button
              type="button"
              className="playlists-icon-button"
              onClick={() => eliminarPlaylist(playlistSeleccionada.id)}
              aria-label={`Eliminar playlist ${playlistSeleccionada.nombre}`}
              title="Eliminar playlist"
            >
              <Trash2 size={20} />
            </button>
          )}
        </div>

        <div className="playlists-add">
          <select
            value={cancionParaAgregarId}
            onChange={(event) => setCancionParaAgregarId(event.target.value)}
            aria-label="Elegir canción para agregar"
          >
            <option value="">Elegí una canción del catálogo</option>

            {cancionesDisponibles.map((cancion) => (
              <option key={cancion.id} value={String(cancion.id)}>
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
          <div className="playlist-table">
            <div className="playlist-table__head">
              <span>#</span>
              <span>Título</span>
              <span className="playlist-table__album">Álbum</span>
              <span className="playlist-table__clock" aria-hidden="true">
                <Clock3 size={16} />
              </span>
              <span className="playlist-table__action" />
            </div>

            {cancionesDePlaylist.map((cancion, index) => (
              <div className="playlist-table__row" key={cancion.id}>
                <button
                  type="button"
                  className="playlist-table__index"
                  onClick={() => reproducirPlaylist(index)}
                  disabled={!puedeReproducir}
                  aria-label={`Reproducir ${cancion.nombre}`}
                >
                  <span className="playlist-table__number">{index + 1}</span>
                  <Play
                    size={14}
                    fill="currentColor"
                    className="playlist-table__play-icon"
                  />
                </button>

                <div className="playlist-table__title">
                  <img
                    src={cancion.imagen || portadaDefault}
                    alt=""
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = portadaDefault;
                    }}
                  />
                  <div>
                    <strong>{cancion.nombre}</strong>
                    <small>{cancion.artista}</small>
                  </div>
                </div>

                <span className="playlist-table__album">
                  {cancion.album || "—"}
                </span>

                <span className="playlist-table__duration">—</span>

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

        {!puedeReproducir && (
          <p className="playlists-premium-note">
            Podés organizar tus playlists. Para reproducirlas, necesitás una
            cuenta premium.
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="playlists-page">
      <header className="playlists-header">
        <span className="playlists-eyebrow">Tu biblioteca</span>
        <h1>Mis playlists</h1>
        <p>Creá una lista nueva o abrí una desde la barra lateral.</p>
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

      <div className="playlists-list playlists-list--overview">
        {playlistsDelUsuario.map((playlist) => {
          const esMeGusta = isMeGustaPlaylist(playlist);
          const portada = getPortadaPlaylist(playlist);

          return (
            <article key={playlist.id} className="playlists-card">
              <button
                type="button"
                className="playlists-card__select"
                onClick={() => navigate(`/playlist/${playlist.id}`)}
              >
                {esMeGusta ? (
                  <span className="playlists-card__liked">
                    <Heart size={22} fill="currentColor" />
                  </span>
                ) : (
                  <img
                    src={portada || portadaDefault}
                    alt=""
                    className="playlists-card__cover"
                  />
                )}

                <span>
                  <strong>{playlist.nombre}</strong>
                  <small>Playlist · {usuarioActual.nombre}</small>
                </span>
              </button>

              {!esMeGusta && (
                <button
                  type="button"
                  className="playlists-icon-button"
                  onClick={() => eliminarPlaylist(playlist.id)}
                  aria-label={`Eliminar playlist ${playlist.nombre}`}
                  title="Eliminar playlist"
                >
                  <Trash2 size={18} />
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default Playlist;
