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

  function siguiente() {
    const indice = cola.findIndex(c => c.id === cancionActual?.id)
    const sig = cola[indice + 1]
    if (sig) reproducir(sig)
  }

  function anterior() {
    const indice = cola.findIndex(c => c.id === cancionActual?.id)
    const ant = cola[indice - 1]
    if (ant) reproducir(ant)
  }

  function cargarCola(canciones) {
    setCola(canciones)
  }

  return (
    <PlayerContext.Provider
      value={{
        cancionActual,
        reproduciendo,
        cola,
        reproducir,
        togglePlay,
        siguiente,
        anterior,
        cargarCola,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}