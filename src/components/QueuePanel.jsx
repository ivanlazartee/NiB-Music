import { useState } from "react";
import { GripVertical, ListMusic, Play } from "lucide-react";

import portadaDefault from "../assets/img/portada-default.png";
import "../styles/queuePanel.css";

const QueuePanel = ({
  canciones = [],
  cancionActualId = null,
  onSelectCancion,
  onReordenar,
}) => {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const handleImageError = (event) => {
    event.currentTarget.onerror = null;
    event.currentTarget.src = portadaDefault;
  };

  function handleDragStart(event, index) {
    setDragIndex(index);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", String(index));
  }

  function handleDragOver(event, index) {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";

    if (overIndex !== index) {
      setOverIndex(index);
    }
  }

  function handleDrop(event, index) {
    event.preventDefault();

    const desde = Number(event.dataTransfer.getData("text/plain"));
    const hasta = index;

    if (!Number.isNaN(desde) && desde !== hasta) {
      onReordenar?.(desde, hasta);
    }

    setDragIndex(null);
    setOverIndex(null);
  }

  function handleDragEnd() {
    setDragIndex(null);
    setOverIndex(null);
  }

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
            const arrastrando = dragIndex === index;
            const sobre = overIndex === index && dragIndex !== index;

            return (
              <div
                key={`${cancion.id}-${index}`}
                className={[
                  "queue-panel__item",
                  esActual ? "queue-panel__item--active" : "",
                  arrastrando ? "queue-panel__item--dragging" : "",
                  sobre ? "queue-panel__item--over" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                draggable
                onDragStart={(event) => handleDragStart(event, index)}
                onDragOver={(event) => handleDragOver(event, index)}
                onDrop={(event) => handleDrop(event, index)}
                onDragEnd={handleDragEnd}
              >
                <span
                  className="queue-panel__drag"
                  aria-hidden="true"
                  title="Arrastrar para reordenar"
                >
                  <GripVertical size={16} />
                </span>

                <span className="queue-panel__position">
                  {index + 1}
                </span>

                <button
                  type="button"
                  className="queue-panel__cover"
                  onClick={() => onSelectCancion?.(cancion)}
                  aria-label={`Reproducir ${cancion.nombre}`}
                >
                  <img
                    src={cancion.imagen}
                    alt=""
                    onError={handleImageError}
                  />

                  <span className="queue-panel__play-icon">
                    <Play size={16} fill="currentColor" />
                  </span>
                </button>

                <button
                  type="button"
                  className="queue-panel__info"
                  onClick={() => onSelectCancion?.(cancion)}
                >
                  <span className="queue-panel__song">
                    {cancion.nombre}
                  </span>
                  <span className="queue-panel__artist">
                    {cancion.artista}
                  </span>
                </button>
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
