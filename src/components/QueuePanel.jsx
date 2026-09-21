import { ListMusic, Play } from "lucide-react";

import LikeSongButton from "./LikeSongButton";
import portadaDefault from "../assets/img/portada-default.png";
import "../styles/QueuePanel.css";

const QueuePanel = ({
  canciones = [],
  cancionActualId = null,
  onSelectCancion,
}) => {
  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = portadaDefault;
  };

  return (
    <aside className="queue-panel">
      <div className="queue-panel__header">
        <div className="queue-panel__heading">
          <ListMusic size={19} />

          <h2 className="queue-panel__title">
            A continuación
          </h2>
        </div>

        <span className="queue-panel__count">
          {canciones.length}
        </span>
      </div>

      <div className="queue-panel__list">
        {canciones.length > 0 ? (
          canciones.map((cancion, index) => {
            const esActual = cancion.id === cancionActualId;

            return (
              <div
                key={cancion.id}
                className={`queue-panel__item ${
                  esActual ? "queue-panel__item--active" : ""
                }`}
              >
                <button
                  type="button"
                  className="queue-panel__select"
                  onClick={() => onSelectCancion?.(cancion)}
                >
                  <span className="queue-panel__position">
                    {index + 1}
                  </span>

                  <div className="queue-panel__cover">
                    <img
                      src={cancion.imagen}
                      alt={`Portada de ${cancion.nombre}`}
                      onError={handleImageError}
                    />

                    <span className="queue-panel__play-icon">
                      <Play
                        size={16}
                        fill="currentColor"
                      />
                    </span>
                  </div>

                  <div className="queue-panel__info">
                    <span className="queue-panel__song">
                      {cancion.nombre}
                    </span>

                    <span className="queue-panel__artist">
                      {cancion.artista}
                    </span>
                  </div>
                </button>

                <LikeSongButton cancion={cancion} />
              </div>
            );
          })
        ) : (
          <div className="queue-panel__empty">
            <ListMusic size={28} />

            <p>No hay canciones en la cola.</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default QueuePanel;
