import { SkipBack, Play, Pause, SkipForward } from "lucide-react"
import { usePlayer } from "../context/PlayerContext"
import LikeSongButton from "./LikeSongButton"
import "../styles/playerBar.css"

function PlayerBar() {
  const {
    cancionActual,
    reproduciendo,
    togglePlay,
    siguiente,
    anterior,
  } = usePlayer()

  return (
    <footer className="player-bar">
      <div className="player-bar__track">
        {cancionActual ? (
          <>
            <img
              className="player-bar__cover"
              src={cancionActual.imagen}
              alt={cancionActual.nombre}
            />
            <div className="player-bar__info">
              <p className="player-bar__title">{cancionActual.nombre}</p>
              <p className="player-bar__artist">{cancionActual.artista}</p>
            </div>
            <LikeSongButton cancion={cancionActual} />
          </>
        ) : (
          <p className="player-bar__empty">No hay canción en reproducción</p>
        )}
      </div>

      <div className="player-bar__controls">
        <button
          type="button"
          className="player-bar__btn"
          aria-label="Anterior"
          onClick={anterior}
          disabled={!cancionActual}
        >
          <SkipBack size={20} />
        </button>

        <button
          type="button"
          className="player-bar__btn player-bar__btn--main"
          aria-label="Play o pause"
          onClick={togglePlay}
          disabled={!cancionActual}
        >
          {reproduciendo ? <Pause size={22} /> : <Play size={22} />}
        </button>

        <button
          type="button"
          className="player-bar__btn"
          aria-label="Siguiente"
          onClick={siguiente}
          disabled={!cancionActual}
        >
          <SkipForward size={20} />
        </button>
      </div>
    </footer>
  )
}

export default PlayerBar
