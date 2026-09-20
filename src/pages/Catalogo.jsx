import { useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";

import HeroBanner from "../components/HeroBanner";
import QueuePanel from "../components/QueuePanel";
import SongCard from "../components/SongCard";

import { getItem, KEYS } from "../utils/localStorage";

import { useAuth } from "../context/AuthContext"
import { usePlayer } from "../context/PlayerContext"

import "../styles/InicioSections.css";

function Catalogo() {
  const navigate = useNavigate()
  const { search } = useOutletContext();
  const { usuarioActual } = useAuth()
  const { reproducir, cargarCola } = usePlayer()
  
  const esPremium = usuarioActual?.rol === "premium"
  const [generoSeleccionado, setGeneroSeleccionado] = useState("");
  const [artistaSeleccionado, setArtistaSeleccionado] = useState("");

  const canciones = getItem(KEYS.canciones) || [];

  const cancionesActivas = canciones.filter(
    (cancion) => cancion.activo
  );

  const cancionesCola = cancionesActivas.slice(0, 6);

  const cancionesRecomendadas = cancionesActivas.slice(0, 6);

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
        cancion.album,
        {
          nombre: cancion.album,
          artista: cancion.artista,
          imagen: cancion.imagen,
        },
      ])
    ).values(),
  ].slice(0, 8);

  const generos = [
    ...new Set(
      cancionesActivas.map((cancion) => cancion.genero)
    ),
  ];

  const artistas = [
    ...new Set(
      cancionesActivas.map((cancion) => cancion.artista)
    ),
  ];

  const cancionesFiltradas = cancionesActivas.filter((cancion) => {
    const busqueda = search.toLowerCase().trim();

    const coincideBusqueda =
      cancion.nombre.toLowerCase().includes(busqueda) ||
      cancion.artista.toLowerCase().includes(busqueda);

    const coincideGenero =
      generoSeleccionado === "" ||
      cancion.genero === generoSeleccionado;

    const coincideArtista =
      artistaSeleccionado === "" ||
      cancion.artista === artistaSeleccionado;

    return (
      coincideBusqueda &&
      coincideGenero &&
      coincideArtista
    );
  });

  function handlePlayCancion(cancion) {
    if (!esPremium) {
      navigate("/registro")
      return
    }
  
    cargarCola(cancionesFiltradas)
    reproducir(cancion)
  }

  return (
    <section className="catalogo-layout">
      <div className="catalogo-layout__main">
        <section className="catalogo">
          <HeroBanner />

          <section className="inicio-section">
            <div className="inicio-section__header">
              <h2 className="inicio-section__title">
                Hecho para ti
              </h2>

              <a href="#catalogo" className="inicio-section__more">
                Ver todo
              </a>
            </div>

            <div className="inicio-recomendados">
              {cancionesRecomendadas.map((cancion) => (
                <Link
                  key={cancion.id}
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
                <button
                  key={artista.nombre}
                  type="button"
                  className="inicio-artista"
                  onClick={() =>
                    setArtistaSeleccionado(artista.nombre)
                  }
                >
                  <div className="inicio-artista__image-wrapper">
                    <img
                      src={artista.imagen}
                      alt={artista.nombre}
                      className="inicio-artista__image"
                    />
                  </div>

                  <span>{artista.nombre}</span>
                </button>
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

          <div
            className="catalogo__header"
            id="catalogo"
          >
            <div>
              <span className="catalogo__eyebrow">
                Tu música
              </span>

              <h1 className="catalogo__title">
                Catálogo
              </h1>

              <p className="catalogo__subtitle">
                Explorá canciones y descubrí nueva música.
              </p>
            </div>
          </div>

          <div className="catalogo__filters">
            <select
              value={generoSeleccionado}
              onChange={(event) =>
                setGeneroSeleccionado(event.target.value)
              }
              className="catalogo__select"
            >
              <option value="">
                Todos los géneros
              </option>

              {generos.map((genero) => (
                <option
                  key={genero}
                  value={genero}
                >
                  {genero}
                </option>
              ))}
            </select>

            <select
              value={artistaSeleccionado}
              onChange={(event) =>
                setArtistaSeleccionado(event.target.value)
              }
              className="catalogo__select"
            >
              <option value="">
                Todos los artistas
              </option>

              {artistas.map((artista) => (
                <option
                  key={artista}
                  value={artista}
                >
                  {artista}
                </option>
              ))}
            </select>
          </div>

          {cancionesFiltradas.length > 0 ? (
            <div className="catalogo__grid">
              {cancionesFiltradas.map((cancion) => (
                <SongCard
                key={cancion.id}
                cancion={cancion}
                onPlay={handlePlayCancion}
              />
              ))}
            </div>
          ) : (
            <div className="catalogo__empty">
              <h2>
                No encontramos canciones
              </h2>

              <p>
                Probá con otra búsqueda o cambiá los filtros.
              </p>
            </div>
          )}
        </section>
      </div>

      <QueuePanel
        canciones={cancionesCola}
      />
    </section>
  );
}

export default Catalogo;