import { createContext, useContext, useState, useRef } from 'react'
import { getItem, setItem, KEYS } from '../utils/localStorage'

export const PlayerContext = createContext(null)

export function usePlayer() {
  return useContext(PlayerContext)
}

function leerColaGuardada() {
  const ids = getItem(KEYS.cola)

  if (!Array.isArray(ids) || ids.length === 0) {
    return []
  }

  const canciones = getItem(KEYS.canciones) || []

  return ids
    .map((id) =>
      canciones.find(
        (cancion) => String(cancion.id) === String(id) && cancion.activo
      )
    )
    .filter(Boolean)
}

function guardarCola(canciones) {
  setItem(
    KEYS.cola,
    (canciones || []).map((cancion) => cancion.id)
  )
}

export function PlayerProvider({ children }) {
  const [cancionActual, setCancionActual] = useState(null)
  const [reproduciendo, setReproduciendo] = useState(false)
  const [cola, setCola] = useState(() => leerColaGuardada())
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
    const siguienteCola = canciones || []
    setCola(siguienteCola)
    guardarCola(siguienteCola)
  }

  function reordenarCola(desdeIndex, hastaIndex) {
    if (
      desdeIndex === hastaIndex ||
      desdeIndex < 0 ||
      hastaIndex < 0
    ) {
      return
    }

    setCola((prev) => {
      if (desdeIndex >= prev.length || hastaIndex >= prev.length) {
        return prev
      }

      const siguienteCola = [...prev]
      const [movida] = siguienteCola.splice(desdeIndex, 1)
      siguienteCola.splice(hastaIndex, 0, movida)
      guardarCola(siguienteCola)
      return siguienteCola
    })
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
        reordenarCola,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
