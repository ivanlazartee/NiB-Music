import { useMemo, useState } from "react"
import {
  SkipBack,
  Play,
  Pause,
  SkipForward,
  Shuffle,
  Repeat,
  Mic2,
  ListMusic,
  MonitorSpeaker,
  Volume2,
  VolumeX,
  Volume1,
  PictureInPicture2,
  Maximize2,
} from "lucide-react"
import { usePlayer } from "../context/PlayerContext"
import LikeSongButton from "./LikeSongButton"
import NowPlayingSheet from "./NowPlayingSheet"
import portadaDefault from "../assets/img/portada-default.png"
import "../styles/playerBar.css"

function formatearTiempo(segundos) {
  if (!Number.isFinite(segundos) || segundos < 0) return "0:00"
  const total = Math.floor(segundos)
  const min = Math.floor(total / 60)
  const seg = total % 60
  return `${min}:${String(seg).padStart(2, "0")}`
}

function PlayerBar() {
  const {
    cancionActual,
    reproduciendo,
    progreso,
    duracion,
    volumen,
    aleatorio,
    repetir,
    togglePlay,
    siguiente,
    anterior,
    buscarEnCancion,
    cambiarVolumen,
    toggleAleatorio,
    toggleRepetir,
  } = usePlayer()

  const [expandido, setExpandido] = useState(false)

  const progresoPct = useMemo(() => {
    if (!duracion) return 0
    return Math.min(100, Math.max(0, (progreso / duracion) * 100))
  }, [progreso, duracion])

  const volumenPct = Math.round(volumen * 100)

  const VolumeIcon =
    volumen === 0 ? VolumeX : volumen < 0.5 ? Volume1 : Volume2

  function handleSeek(event) {
    if (!duracion) return
    buscarEnCancion(Number(event.target.value))
  }

  function toggleFullscreen() {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.()
    } else {
      document.exitFullscreen?.()
    }
  }

  function abrirNowPlaying() {
    if (!cancionActual) return
    setExpandido(true)
  }

  return (
    <>
      <footer className="player-bar">
        <div className="player-bar__track">
          {cancionActual ? (
            <>
              <button
                type="button"
                className="player-bar__track-hit"
                onClick={abrirNowPlaying}
                aria-label={`Abrir reproductor de ${cancionActual.nombre}`}
              >
                <img
                  className="player-bar__cover"
                  src={cancionActual.imagen || portadaDefault}
                  alt=""
                  onError={(event) => {
                    event.currentTarget.onerror = null
                    event.currentTarget.src = portadaDefault
                  }}
                />
                <div className="player-bar__info">
                  <p className="player-bar__title">{cancionActual.nombre}</p>
                  <p className="player-bar__artist">{cancionActual.artista}</p>
                </div>
              </button>
              <LikeSongButton cancion={cancionActual} />
            </>
          ) : (
            <p className="player-bar__empty">No hay canción en reproducción</p>
          )}
        </div>

        <div className="player-bar__center">
          <div className="player-bar__controls">
            <button
              type="button"
              className={`player-bar__btn ${
                aleatorio ? "player-bar__btn--active" : ""
              }`}
              aria-label="Aleatorio"
              aria-pressed={aleatorio}
              onClick={toggleAleatorio}
              disabled={!cancionActual}
            >
              <Shuffle size={16} />
            </button>

            <button
              type="button"
              className="player-bar__btn"
              aria-label="Anterior"
              onClick={anterior}
              disabled={!cancionActual}
            >
              <SkipBack size={18} fill="currentColor" />
            </button>

            <button
              type="button"
              className="player-bar__btn player-bar__btn--main"
              aria-label="Play o pause"
              onClick={togglePlay}
              disabled={!cancionActual}
            >
              {reproduciendo ? (
                <Pause size={18} fill="currentColor" />
              ) : (
                <Play size={18} fill="currentColor" />
              )}
            </button>

            <button
              type="button"
              className="player-bar__btn"
              aria-label="Siguiente"
              onClick={siguiente}
              disabled={!cancionActual}
            >
              <SkipForward size={18} fill="currentColor" />
            </button>

            <button
              type="button"
              className={`player-bar__btn ${
                repetir ? "player-bar__btn--active" : ""
              }`}
              aria-label="Repetir"
              aria-pressed={repetir}
              onClick={toggleRepetir}
              disabled={!cancionActual}
            >
              <Repeat size={16} />
            </button>
          </div>

          <div className="player-bar__progress">
            <span className="player-bar__time">
              {formatearTiempo(progreso)}
            </span>
            <input
              type="range"
              className="player-bar__range"
              min={0}
              max={duracion || 0}
              step={0.1}
              value={progreso}
              onChange={handleSeek}
              disabled={!cancionActual || !duracion}
              style={{ "--progress": `${progresoPct}%` }}
              aria-label="Progreso de la canción"
            />
            <span className="player-bar__time">
              {formatearTiempo(duracion)}
            </span>
          </div>
        </div>

        <div className="player-bar__extra">
          <button
            type="button"
            className="player-bar__btn player-bar__btn--extra player-bar__btn--muted"
            aria-label="Letra"
            title="No disponible"
            disabled
          >
            <Mic2 size={16} />
          </button>

          <button
            type="button"
            className="player-bar__btn player-bar__btn--extra player-bar__btn--muted"
            aria-label="Cola"
            title="No disponible"
            disabled
          >
            <ListMusic size={16} />
          </button>

          <button
            type="button"
            className="player-bar__btn player-bar__btn--extra player-bar__btn--muted"
            aria-label="Conectar a un dispositivo"
            title="No disponible"
            disabled
          >
            <MonitorSpeaker size={16} />
          </button>

          <div className="player-bar__volume">
            <button
              type="button"
              className="player-bar__btn player-bar__btn--extra"
              aria-label={volumen === 0 ? "Activar sonido" : "Silenciar"}
              onClick={() => cambiarVolumen(volumen === 0 ? 0.8 : 0)}
            >
              <VolumeIcon size={16} />
            </button>
            <input
              type="range"
              className="player-bar__range player-bar__range--volume"
              min={0}
              max={1}
              step={0.01}
              value={volumen}
              onChange={(event) => cambiarVolumen(event.target.value)}
              style={{ "--progress": `${volumenPct}%` }}
              aria-label="Volumen"
            />
          </div>

          <button
            type="button"
            className="player-bar__btn player-bar__btn--extra player-bar__btn--muted"
            aria-label="Mini reproductor"
            title="No disponible"
            disabled
          >
            <PictureInPicture2 size={16} />
          </button>

          <button
            type="button"
            className="player-bar__btn player-bar__btn--extra"
            aria-label="Abrir reproductor"
            title="Abrir reproductor"
            onClick={abrirNowPlaying}
            disabled={!cancionActual}
          >
            <Maximize2 size={16} />
          </button>
        </div>
      </footer>

      <NowPlayingSheet
        abierto={expandido}
        onClose={() => setExpandido(false)}
      />
    </>
  )
}

export default PlayerBar
