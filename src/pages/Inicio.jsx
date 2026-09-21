import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Play } from "lucide-react";

import HeroBanner from "../components/HeroBanner";

import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import { getItem, KEYS } from "../utils/localStorage";
import {
  ensureCatalogoPlaylists,
  ensureMeGustaPlaylist,
  getPlaylistsCatalogo,
  getPortadaPlaylist,
  isMeGustaPlaylist,
  llenarMeGustaConTodasCanciones,
} from "../utils/playlists";

import portadaDefault from "../assets/img/portada-default.png";
import "../styles/InicioSections.css";

function PlaylistCard({ playlist, onPlay }) {
  const navigate = useNavigate();
  const esMeGusta = isMeGustaPlaylist(playlist);
  const portada = getPortadaPlaylist(playlist);

  return (
    <article className="inicio-pl-card">
      <div className="inicio-pl-card__cover-wrap">
        <button
          type="button"
          className="inicio-pl-card__cover-btn"
          onClick={() => navigate(`/playlist/${playlist.id}`)}
          aria-label={`Abrir ${playlist.nombre}`}
        >
          {esMeGusta ? (
            <span
              className="inicio-pl-card__cover inicio-pl-card__cover--liked"
              aria-hidden="true"
            >
              <Heart size={42} fill="currentColor" />
            </span>
          ) : (
            <img
              src={portada || portadaDefault}
              alt=""
              className="inicio-pl-card__cover"
            />
          )}
        </button>

        <button
          type="button"
          className="inicio-pl-card__play"
          onClick={() => onPlay?.(playlist)}
          aria-label={`Reproducir ${playlist.nombre}`}
        >
          <Play size={22} fill="currentColor" />
        </button>
      </div>

      <button
        type="button"
        className="inicio-pl-card__meta"
        onClick={() => navigate(`/playlist/${playlist.id}`)}
      >
        <h3>{playlist.nombre}</h3>
        <p>{playlist.descripcion || "Playlist"}</p>
      </button>
    </article>
  );
}

function PlaylistRow({ title, eyebrow, playlists, onPlay }) {
  if (!playlists.length) return null;

  return (
    <section className="inicio-section">
      <div className="inicio-section__header inicio-section__header--stack">
        <div>
          {eyebrow && (
            <span className="inicio-section__eyebrow">{eyebrow}</span>
          )}
          <h2 className="inicio-section__title">{title}</h2>
        </div>

        <Link to="/playlist" className="inicio-section__more">
          Mostrar todo
        </Link>
      </div>

      <div className="inicio-pl-row">
        {playlists.map((playlist) => (
          <PlaylistCard
            key={playlist.id}
            playlist={playlist}
            onPlay={onPlay}
          />
        ))}
      </div>
    </section>
  );
}

function Inicio() {
  const { usuarioActual } = useAuth();
  const { reproducir, cargarCola } = usePlayer();
  const navigate = useNavigate();
  const esLogueado = Boolean(usuarioActual);

  const [playlists, setPlaylists] = useState(() => {
    ensureCatalogoPlaylists();
    return getItem(KEYS.playlists) || [];
  });

  useEffect(() => {
    const catalogo = ensureCatalogoPlaylists();

    if (!usuarioActual?.id) {
      setPlaylists(catalogo);
      return;
    }

    ensureMeGustaPlaylist(usuarioActual.id);
    setPlaylists(llenarMeGustaConTodasCanciones(usuarioActual.id));
  }, [usuarioActual?.id]);

  const canciones = getItem(KEYS.canciones) || [];
  const cancionesActivas = canciones.filter((cancion) => cancion.activo);

  const vuelve = getPlaylistsCatalogo("vuelve", playlists);
  const hecho = getPlaylistsCatalogo("hecho", playlists);
  const recientesCatalogo = getPlaylistsCatalogo("recientes", playlists);
  const similares = getPlaylistsCatalogo("similares", playlists);

  const meGusta = playlists.find(
    (playlist) =>
      playlist.usuarioId === usuarioActual?.id && isMeGustaPlaylist(playlist)
  );

  const recientes = meGusta
    ? [
        {
          ...meGusta,
          descripcion: `Playlist · ${usuarioActual.nombre}`,
        },
        ...recientesCatalogo,
      ]
    : recientesCatalogo;

  const accesoRapido = [
    ...(meGusta ? [meGusta] : []),
    ...recientesCatalogo,
    ...vuelve,
  ].slice(0, 8);

  function reproducirPlaylist(playlist) {
    if (!usuarioActual) {
      navigate("/login");
      return;
    }

    const puede =
      usuarioActual.rol === "premium" || usuarioActual.rol === "admin";

    if (!puede) {
      navigate("/registro");
      return;
    }

    const temas = (playlist.cancionesIds || [])
      .map((id) =>
        cancionesActivas.find(
          (cancion) => String(cancion.id) === String(id)
        )
      )
      .filter(Boolean);

    if (temas.length === 0) return;

    cargarCola(temas);
    reproducir(temas[0]);
  }

  if (!esLogueado) {
    return (
      <section className="catalogo">
        <HeroBanner />
        <PlaylistRow
          title="Vuelve a tu música"
          playlists={vuelve}
          onPlay={reproducirPlaylist}
        />
        <PlaylistRow
          title="Similares a Bad Bunny"
          playlists={similares}
          onPlay={reproducirPlaylist}
        />
      </section>
    );
  }

  return (
    <section className="catalogo inicio-home">
      <div className="inicio-chips">
        <button type="button" className="inicio-chip inicio-chip--active">
          Todo
        </button>
        <button type="button" className="inicio-chip">
          Música
        </button>
        <button type="button" className="inicio-chip">
          Podcasts
        </button>
      </div>

      <div className="inicio-quick-grid">
        {accesoRapido.map((playlist) => {
          const esLiked = isMeGustaPlaylist(playlist);
          const portada = getPortadaPlaylist(playlist);

          return (
            <Link
              key={`quick-${playlist.id}`}
              to={`/playlist/${playlist.id}`}
              className="inicio-quick-card"
            >
              {esLiked ? (
                <span
                  className="inicio-quick-card__cover inicio-quick-card__cover--liked"
                  aria-hidden="true"
                >
                  <Heart size={18} fill="currentColor" />
                </span>
              ) : (
                <img
                  src={portada || portadaDefault}
                  alt=""
                  className="inicio-quick-card__cover"
                />
              )}
              <span>{playlist.nombre}</span>
            </Link>
          );
        })}
      </div>

      <PlaylistRow
        title="Vuelve a tu música"
        playlists={vuelve}
        onPlay={reproducirPlaylist}
      />

      <PlaylistRow
        eyebrow="Hecho para"
        title={usuarioActual.nombre}
        playlists={hecho}
        onPlay={reproducirPlaylist}
      />

      <PlaylistRow
        title="Recientes"
        playlists={recientes}
        onPlay={reproducirPlaylist}
      />

      <PlaylistRow
        title="Similares a Bad Bunny"
        playlists={similares}
        onPlay={reproducirPlaylist}
      />
    </section>
  );
}

export default Inicio;
