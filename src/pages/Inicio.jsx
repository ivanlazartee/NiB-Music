import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

import HeroBanner from "../components/HeroBanner";
import LikeSongButton from "../components/LikeSongButton";

import { useAuth } from "../context/AuthContext";
import { getItem, KEYS } from "../utils/localStorage";
import {
  ensureMeGustaPlaylist,
  getPlaylistsDeUsuario,
  getPortadaPlaylist,
  isMeGustaPlaylist,
} from "../utils/playlists";

import "../styles/InicioSections.css";

function Inicio() {
  const { usuarioActual } = useAuth();
  const esLogueado = Boolean(usuarioActual);
  const [playlists, setPlaylists] = useState(
    () => getItem(KEYS.playlists) || []
  );

  useEffect(() => {
    if (!usuarioActual?.id) return;
    setPlaylists(ensureMeGustaPlaylist(usuarioActual.id));
  }, [usuarioActual?.id]);

  const canciones = getItem(KEYS.canciones) || [];

  const cancionesActivas = canciones.filter(
    (cancion) => cancion.activo
  );

  const cancionesRecomendadas = cancionesActivas.slice(0, 6);

  const playlistsMasEscuchadas = getPlaylistsDeUsuario(
    usuarioActual?.id,
    playlists
  );

  const artistasDestacados = [
    ...new Map(
      cancionesActivas.map((cancion) => [
        cancion.artista,
        {
          nombre: cancion.artista,
          imagen: cancion.imagen,
        },
      ])
    ).values(),
  ].slice(0, 8);

  const albumesPopulares = [
    ...new Map(
      cancionesActivas.map((cancion) => [
        `${cancion.album}-${cancion.artista}`,
        {
          nombre: cancion.album,
          artista: cancion.artista,
          imagen: cancion.imagen,
        },
      ])
    ).values(),
  ].slice(0, 8);

  return (
    <section className="catalogo">
      {esLogueado ? (
        <section className="inicio-section">
          <div className="inicio-section__header">
            <h2 className="inicio-section__title">
              Tus playlists más escuchadas
            </h2>

            <Link to="/playlist" className="inicio-section__more">
              Ver todo
            </Link>
          </div>

          <div className="inicio-playlists-grid">
            {playlistsMasEscuchadas.slice(0, 8).map((playlist) => {
              const esMeGusta = isMeGustaPlaylist(playlist);
              const portada = getPortadaPlaylist(playlist);

              return (
                <Link
                  key={playlist.id}
                  to={`/playlist/${playlist.id}`}
                  className="inicio-playlist-chip"
                >
                  {esMeGusta ? (
                    <span
                      className="inicio-playlist-chip__cover inicio-playlist-chip__cover--liked"
                      aria-hidden="true"
                    >
                      <Heart size={22} fill="currentColor" />
                    </span>
                  ) : (
                    <img
                      src={portada}
                      alt={playlist.nombre}
                      className="inicio-playlist-chip__cover"
                    />
                  )}
                  <span>{playlist.nombre}</span>
                </Link>
              );
            })}
          </div>
        </section>
      ) : (
        <HeroBanner />
      )}

      <section className="inicio-section">
        <div className="inicio-section__header">
          <h2 className="inicio-section__title">
            Hecho para ti
          </h2>

          <Link
            to="/catalogo"
            className="inicio-section__more"
          >
            Ver todo
          </Link>
        </div>

        <div className="inicio-recomendados">
          {cancionesRecomendadas.map((cancion) => (
            <div key={cancion.id} className="inicio-recomendado-wrap">
              <Link
                to={`/detalle/${cancion.id}`}
                className="inicio-recomendado-card"
              >
                <img
                  src={cancion.imagen}
                  alt={cancion.nombre}
                  className="inicio-recomendado-card__image"
                />

                <div className="inicio-recomendado-card__overlay">
                  <h3>{cancion.nombre}</h3>
                  <p>{cancion.artista}</p>
                </div>
              </Link>

              <LikeSongButton
                cancion={cancion}
                className="inicio-recomendado-like"
              />
            </div>
          ))}
        </div>
      </section>

      <section className="inicio-section">
        <div className="inicio-section__header">
          <h2 className="inicio-section__title">
            Artistas destacados
          </h2>

          <span className="inicio-section__more">
            Descubrí artistas
          </span>
        </div>

        <div className="inicio-artistas">
          {artistasDestacados.map((artista) => (
            <div
              key={artista.nombre}
              className="inicio-artista"
            >
              <div className="inicio-artista__image-wrapper">
                <img
                  src={artista.imagen}
                  alt={artista.nombre}
                  className="inicio-artista__image"
                />
              </div>

              <span>{artista.nombre}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="inicio-section">
        <div className="inicio-section__header">
          <h2 className="inicio-section__title">
            Álbumes populares
          </h2>

          <span className="inicio-section__more">
            Ver todo
          </span>
        </div>

        <div className="inicio-albumes">
          {albumesPopulares.map((album) => (
            <article
              key={`${album.nombre}-${album.artista}`}
              className="inicio-album"
            >
              <img
                src={album.imagen}
                alt={album.nombre}
                className="inicio-album__image"
              />

              <h3>{album.nombre}</h3>
              <p>{album.artista}</p>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default Inicio;
