import { createContext, useContext, useState, useRef } from 'react'

export const PlayerContext = createContext(null)

export function usePlayer() {
  return useContext(PlayerContext)
}

export function PlayerProvider({ children }) {
  const [cancionActual, setCancionActual] = useState(null)
  const [reproduciendo, setReproduciendo] = useState(false)
  const [cola, setCola] = useState([])
  const audioRef = useRef(new Audio())

  function reproducir(cancion) {
    audioRef.current.src = cancion.archivo
    audioRef.current.play()
    setCancionActual(cancion)
    setReproduciendo(true)
  }

  function togglePlay() {
    if (reproduciendo) {
      audioRef.current.pause()
      setReproduciendo(false)
    } else {
      audioRef.current.play()
      setReproduciendo(true)
    }
  }

  return (
    <PlayerContext.Provider
      value={{
        cancionActual,
        reproduciendo,
        cola,
        reproducir,
        togglePlay,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}