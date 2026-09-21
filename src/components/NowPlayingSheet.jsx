import { useEffect } from "react";
import {
  ChevronDown,
  MoreHorizontal,
  Shuffle,
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Repeat,
  MonitorSpeaker,
  Share2,
  ListMusic,
} from "lucide-react";

import { usePlayer } from "../context/PlayerContext";
import LikeSongButton from "./LikeSongButton";
import portadaDefault from "../assets/img/portada-default.png";

import "../styles/nowPlaying.css";

function formatearTiempo(segundos) {
  if (!Number.isFinite(segundos) || segundos < 0) return "0:00";
  const total = Math.floor(segundos);
  const min = Math.floor(total / 60);
  const seg = total % 60;
  return `${min}:${String(seg).padStart(2, "0")}`;
}

function NowPlayingSheet({ abierto, onClose }) {
  const {
    cancionActual,
    reproduciendo,
    progreso,
    duracion,
    aleatorio,
    repetir,
    togglePlay,
    siguiente,
    anterior,
    buscarEnCancion,
    toggleAleatorio,
    toggleRepetir,
  } = usePlayer();

  const progresoPct =
    duracion > 0
      ? Math.min(100, Math.max(0, (progreso / duracion) * 100))
      : 0;

  const restante = Math.max(0, (duracion || 0) - (progreso || 0));
  const portada = cancionActual?.imagen || portadaDefault;

  useEffect(() => {
    if (!abierto) return undefined;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKey = (event) => {
      if (event.key === "Escape") onClose?.();
    };

    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [abierto, onClose]);

  if (!cancionActual) return null;

  function handleSeek(event) {
    if (!duracion) return;
    buscarEnCancion(Number(event.target.value));
  }

  return (
    <div
      className={`now-playing${abierto ? " now-playing--open" : ""}`}
      role="dialog"
      aria-modal="true"
      aria-label="Reproductor ampliado"
      aria-hidden={!abierto}
    >
      <div
        className="now-playing__backdrop"
        style={{ backgroundImage: `url(${portada})` }}
        aria-hidden="true"
      />
      <div className="now-playing__scrim" aria-hidden="true" />

      <div className="now-playing__sheet">
        <header className="now-playing__top">
          <button
            type="button"
            className="now-playing__icon-btn"
            aria-label="Cerrar reproductor"
            onClick={onClose}
          >
            <ChevronDown size={28} />
          </button>

          <div className="now-playing__source">
            <span>Reproduciendo</span>
          </div>

          <button
            type="button"
            className="now-playing__icon-btn now-playing__icon-btn--muted"
            aria-label="Más opciones"
            title="No disponible"
            disabled
          >
            <MoreHorizontal size={22} />
          </button>
        </header>

        <div className="now-playing__art-wrap">
          <img
            className="now-playing__art"
            src={portada}
            alt=""
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = portadaDefault;
            }}
          />
        </div>

        <div className="now-playing__meta">
          <div className="now-playing__meta-text">
            <h2 className="now-playing__title">{cancionActual.nombre}</h2>
            <p className="now-playing__artist">{cancionActual.artista}</p>
          </div>

          <LikeSongButton
            cancion={cancionActual}
            className="now-playing__like"
          />
        </div>

        <div className="now-playing__progress">
          <input
            type="range"
            className="now-playing__range"
            min={0}
            max={duracion || 0}
            step={0.1}
            value={progreso}
            onChange={handleSeek}
            disabled={!duracion}
            style={{ "--progress": `${progresoPct}%` }}
            aria-label="Progreso de la canción"
          />
          <div className="now-playing__times">
            <span>{formatearTiempo(progreso)}</span>
            <span>-{formatearTiempo(restante)}</span>
          </div>
        </div>

        <div className="now-playing__controls">
          <button
            type="button"
            className={`now-playing__ctrl${
              aleatorio ? " now-playing__ctrl--active" : ""
            }`}
            aria-label="Aleatorio"
            aria-pressed={aleatorio}
            onClick={toggleAleatorio}
          >
            <Shuffle size={22} />
          </button>

          <button
            type="button"
            className="now-playing__ctrl"
            aria-label="Anterior"
            onClick={anterior}
          >
            <SkipBack size={28} fill="currentColor" />
          </button>

          <button
            type="button"
            className="now-playing__ctrl now-playing__ctrl--play"
            aria-label="Play o pause"
            onClick={togglePlay}
          >
            {reproduciendo ? (
              <Pause size={28} fill="currentColor" />
            ) : (
              <Play size={28} fill="currentColor" />
            )}
          </button>

          <button
            type="button"
            className="now-playing__ctrl"
            aria-label="Siguiente"
            onClick={siguiente}
          >
            <SkipForward size={28} fill="currentColor" />
          </button>

          <button
            type="button"
            className={`now-playing__ctrl${
              repetir ? " now-playing__ctrl--active" : ""
            }`}
            aria-label="Repetir"
            aria-pressed={repetir}
            onClick={toggleRepetir}
          >
            <Repeat size={22} />
          </button>
        </div>

        <footer className="now-playing__bottom">
          <button
            type="button"
            className="now-playing__icon-btn now-playing__icon-btn--muted"
            aria-label="Conectar a un dispositivo"
            title="No disponible"
            disabled
          >
            <MonitorSpeaker size={20} />
          </button>

          <button
            type="button"
            className="now-playing__icon-btn now-playing__icon-btn--muted"
            aria-label="Compartir"
            title="No disponible"
            disabled
          >
            <Share2 size={20} />
          </button>

          <button
            type="button"
            className="now-playing__icon-btn now-playing__icon-btn--muted"
            aria-label="Cola"
            title="No disponible"
            disabled
          >
            <ListMusic size={20} />
          </button>
        </footer>
      </div>
    </div>
  );
}

export default NowPlayingSheet;
