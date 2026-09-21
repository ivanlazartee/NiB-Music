import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useNavigate } from "react-router-dom";
import {
  Check,
  CirclePlus,
  Heart,
  Plus,
  Search,
} from "lucide-react";

import { useAuth } from "../context/AuthContext";
import {
  PLAYLISTS_EVENT,
  agregarAMeGusta,
  crearPlaylistUsuario,
  estaEnMeGusta,
  estaEnPlaylist,
  getPlaylistsDeUsuario,
  getPortadaPlaylist,
  isMeGustaPlaylist,
  sincronizarCancionEnPlaylists,
} from "../utils/playlists";

import "../styles/likeSong.css";

function LikedToast({ onCambiar, onCerrar }) {
  useEffect(() => {
    const timer = window.setTimeout(onCerrar, 4500);
    return () => window.clearTimeout(timer);
  }, [onCerrar]);

  return createPortal(
    <div className="liked-toast" role="status">
      <span className="liked-toast__icon" aria-hidden="true">
        <Heart size={16} fill="currentColor" />
      </span>
      <p>Se agregó a Tus me gusta.</p>
      <button type="button" className="liked-toast__change" onClick={onCambiar}>
        Cambiar
      </button>
    </div>,
    document.body
  );
}

function AddToPlaylistMenu({ cancion, onCerrar, onGuardado }) {
  const { usuarioActual } = useAuth();
  const [busqueda, setBusqueda] = useState("");
  const [creando, setCreando] = useState(false);
  const [nombreNueva, setNombreNueva] = useState("");
  const [playlists, setPlaylists] = useState(() =>
    getPlaylistsDeUsuario(usuarioActual?.id)
  );
  const [seleccionadas, setSeleccionadas] = useState(() => {
    const iniciales = getPlaylistsDeUsuario(usuarioActual?.id)
      .filter((playlist) => estaEnPlaylist(playlist, cancion.id))
      .map((playlist) => playlist.id);

    const meGusta = getPlaylistsDeUsuario(usuarioActual?.id).find(
      isMeGustaPlaylist
    );

    if (meGusta && !iniciales.includes(meGusta.id)) {
      iniciales.push(meGusta.id);
    }

    return new Set(iniciales.map(String));
  });

  useEffect(() => {
    const refresh = () => {
      setPlaylists(getPlaylistsDeUsuario(usuarioActual?.id));
    };

    window.addEventListener(PLAYLISTS_EVENT, refresh);
    return () => window.removeEventListener(PLAYLISTS_EVENT, refresh);
  }, [usuarioActual?.id]);

  const filtradas = useMemo(() => {
    const texto = busqueda.trim().toLowerCase();
    if (!texto) return playlists;
    return playlists.filter((playlist) =>
      playlist.nombre.toLowerCase().includes(texto)
    );
  }, [busqueda, playlists]);

  const guardadas = filtradas.filter((playlist) =>
    seleccionadas.has(String(playlist.id))
  );
  const recientes = filtradas.filter(
    (playlist) => !seleccionadas.has(String(playlist.id))
  );

  function togglePlaylist(playlist) {
    setSeleccionadas((prev) => {
      const next = new Set(prev);
      const key = String(playlist.id);

      if (isMeGustaPlaylist(playlist) && next.has(key)) {
        return next;
      }

      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }

  function handleCrearPlaylist(event) {
    event.preventDefault();
    const nombre = nombreNueva.trim();
    if (!nombre || !usuarioActual?.id) return;

    crearPlaylistUsuario(usuarioActual.id, nombre);
    const actualizadas = getPlaylistsDeUsuario(usuarioActual.id);
    setPlaylists(actualizadas);

    const creada = actualizadas.find(
      (playlist) =>
        playlist.nombre === nombre && !isMeGustaPlaylist(playlist)
    );

    if (creada) {
      setSeleccionadas((prev) => new Set([...prev, String(creada.id)]));
    }

    setNombreNueva("");
    setCreando(false);
  }

  function handleDone() {
    if (!usuarioActual?.id) return;

    sincronizarCancionEnPlaylists(
      usuarioActual.id,
      cancion.id,
      [...seleccionadas]
    );
    onGuardado?.();
    onCerrar();
  }

  function renderItem(playlist) {
    const marcada = seleccionadas.has(String(playlist.id));
    const esMeGusta = isMeGustaPlaylist(playlist);
    const portada = getPortadaPlaylist(playlist);

    return (
      <button
        key={playlist.id}
        type="button"
        className="add-playlist-menu__item"
        onClick={() => togglePlaylist(playlist)}
      >
        {esMeGusta ? (
          <span className="add-playlist-menu__liked" aria-hidden="true">
            <Heart size={18} fill="currentColor" />
          </span>
        ) : (
          <img
            src={portada}
            alt=""
            className="add-playlist-menu__cover"
          />
        )}

        <span className="add-playlist-menu__info">
          <strong>{playlist.nombre}</strong>
          <small>
            {playlist.cancionesIds?.length || 0} canciones
          </small>
        </span>

        <span
          className={`add-playlist-menu__check ${
            marcada ? "add-playlist-menu__check--on" : ""
          }`}
          aria-hidden="true"
        >
          {marcada ? <Check size={14} strokeWidth={3} /> : null}
        </span>
      </button>
    );
  }

  return createPortal(
    <div className="add-playlist-menu__overlay" onClick={onCerrar}>
      <div
        className="add-playlist-menu"
        role="dialog"
        aria-modal="true"
        aria-labelledby="add-playlist-menu-title"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 id="add-playlist-menu-title">Agregar a playlist</h2>

        <label className="add-playlist-menu__search">
          <Search size={16} />
          <input
            type="search"
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
            placeholder="Busca una playlist"
          />
        </label>

        {creando ? (
          <form
            className="add-playlist-menu__create-form"
            onSubmit={handleCrearPlaylist}
          >
            <input
              type="text"
              value={nombreNueva}
              onChange={(event) => setNombreNueva(event.target.value)}
              placeholder="Nombre de la playlist"
              maxLength={60}
              autoFocus
            />
            <button type="submit" disabled={!nombreNueva.trim()}>
              Crear
            </button>
          </form>
        ) : (
          <button
            type="button"
            className="add-playlist-menu__new"
            onClick={() => setCreando(true)}
          >
            <Plus size={20} />
            Nueva playlist
          </button>
        )}

        <div className="add-playlist-menu__list">
          {guardadas.length > 0 && (
            <>
              <p className="add-playlist-menu__section">Se guardó en</p>
              {guardadas.map(renderItem)}
            </>
          )}

          {recientes.length > 0 && (
            <>
              <p className="add-playlist-menu__section">
                Actualizado recientemente
              </p>
              {recientes.map(renderItem)}
            </>
          )}
        </div>

        <div className="add-playlist-menu__footer">
          <button
            type="button"
            className="add-playlist-menu__cancel"
            onClick={onCerrar}
          >
            Cancelar
          </button>
          <button
            type="button"
            className="add-playlist-menu__done"
            onClick={handleDone}
          >
            Listo
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function LikeSongButton({ cancion, className = "" }) {
  const navigate = useNavigate();
  const { usuarioActual } = useAuth();
  const [enMeGusta, setEnMeGusta] = useState(false);
  const [mostrarToast, setMostrarToast] = useState(false);
  const [mostrarMenu, setMostrarMenu] = useState(false);

  useEffect(() => {
    if (!usuarioActual?.id) {
      setEnMeGusta(false);
      return;
    }

    setEnMeGusta(estaEnMeGusta(usuarioActual.id, cancion.id));

    const sync = () => {
      setEnMeGusta(estaEnMeGusta(usuarioActual.id, cancion.id));
    };

    window.addEventListener(PLAYLISTS_EVENT, sync);
    return () => window.removeEventListener(PLAYLISTS_EVENT, sync);
  }, [usuarioActual?.id, cancion.id]);

  function abrirMenu() {
    setMostrarToast(false);
    setMostrarMenu(true);
  }

  function handleClick(event) {
    event.preventDefault();
    event.stopPropagation();

    if (!usuarioActual) {
      navigate("/login");
      return;
    }

    if (enMeGusta) {
      abrirMenu();
      return;
    }

    agregarAMeGusta(usuarioActual.id, cancion.id);
    setEnMeGusta(true);
    setMostrarToast(true);
  }

  return (
    <>
      <button
        type="button"
        className={`like-song-button ${
          enMeGusta ? "like-song-button--liked" : ""
        } ${className}`.trim()}
        onClick={handleClick}
        aria-label={
          enMeGusta
            ? "Administrar playlists de esta canción"
            : "Agregar a Tus me gusta"
        }
        title={
          enMeGusta
            ? "Ya está en Tus me gusta"
            : "Agregar a Tus me gusta"
        }
      >
        {enMeGusta ? (
          <Check size={18} strokeWidth={3} />
        ) : (
          <CirclePlus size={18} />
        )}
      </button>

      {mostrarToast && (
        <LikedToast
          onCambiar={abrirMenu}
          onCerrar={() => setMostrarToast(false)}
        />
      )}

      {mostrarMenu && (
        <AddToPlaylistMenu
          cancion={cancion}
          onCerrar={() => setMostrarMenu(false)}
          onGuardado={() => {
            if (usuarioActual?.id) {
              setEnMeGusta(estaEnMeGusta(usuarioActual.id, cancion.id));
            }
          }}
        />
      )}
    </>
  );
}

export default LikeSongButton;
