import { useNavigate, Link, useOutletContext } from "react-router-dom";

import HeroBanner from "../components/HeroBanner";
import QueuePanel from "../components/QueuePanel";
import GuestSearchPanel from "../components/GuestSearchPanel";

import { getItem, KEYS } from "../utils/localStorage";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";

import "../styles/InicioSections.css";

function Inicio() {
  const navigate = useNavigate();
  const { focusSearch } = useOutletContext() || {};
  const { usuarioActual } = useAuth();
  const { reproducir, cargarCola, cancionActual } = usePlayer();

  const esInvitado = !usuarioActual;
  const puedeReproducir =
    usuarioActual?.rol === "premium" || usuarioActual?.rol === "admin";

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
        `${cancion.album}-${cancion.artista}`,
        {
          nombre: cancion.album,
          artista: cancion.artista,
          imagen: cancion.imagen,
        },
      ])
    ).values(),
  ].slice(0, 8);

  function handlePlayCancion(cancion) {
    if (!puedeReproducir) {
      navigate("/registro");
      return;
    }

    cargarCola(cancionesCola);
    reproducir(cancion);
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

              <Link
                to="/catalogo"
                className="inicio-section__more"
              >
                Ver todo
              </Link>
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
      </div>

      {esInvitado ? (
        <GuestSearchPanel onBuscar={() => focusSearch?.()} />
      ) : (
        <QueuePanel
          canciones={cancionesCola}
          cancionActualId={cancionActual?.id}
          onSelectCancion={handlePlayCancion}
        />
      )}
    </section>
  );
}

export default Inicio;