import { useState } from "react";
import { useOutletContext } from "react-router-dom";

import QueuePanel from "../components/QueuePanel";
import SongCard from "../components/SongCard";

import { getItem, KEYS } from "../utils/localStorage";

import "../styles/InicioSections.css";

function Catalogo() {
  const { search = "" } = useOutletContext();

  const [generoSeleccionado, setGeneroSeleccionado] = useState("");
  const [artistaSeleccionado, setArtistaSeleccionado] = useState("");

  const canciones = getItem(KEYS.canciones) || [];

  const cancionesActivas = canciones.filter(
    (cancion) => cancion.activo
  );

  const cancionesCola = cancionesActivas.slice(0, 6);

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

  return (
    <section className="catalogo-layout">
      <div className="catalogo-layout__main">
        <section className="catalogo">
          <div className="catalogo__header">
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
                <option key={genero} value={genero}>
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
                <option key={artista} value={artista}>
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
                />
              ))}
            </div>
          ) : (
            <div className="catalogo__empty">
              <h2>No encontramos canciones</h2>

              <p>
                Probá con otra búsqueda o cambiá los filtros.
              </p>
            </div>
          )}
        </section>
      </div>

      <QueuePanel canciones={cancionesCola} />
    </section>
  );
}

export default Catalogo;