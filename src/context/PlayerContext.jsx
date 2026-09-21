import { createContext, useContext, useState, useRef, useEffect } from 'react'
import { getItem, setItem, KEYS } from '../utils/localStorage'
import { ordenarPlaylistsPorUsuario } from '../utils/playlists'
import { useAuth } from './AuthContext'

export const PlayerContext = createContext(null)

export function usePlayer() {
  return useContext(PlayerContext)
}

function resolverIdsCola(usuarioId) {
  const porUsuario = getItem(KEYS.colaPorUsuario)

  if (usuarioId && porUsuario && Array.isArray(porUsuario[usuarioId])) {
    return porUsuario[usuarioId]
  }

  // Migración de la cola global anterior
  const legacy = getItem(KEYS.cola)
  return Array.isArray(legacy) ? legacy : []
}

function leerColaGuardada(usuarioId) {
  const ids = resolverIdsCola(usuarioId)

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

function guardarCola(canciones, usuarioId) {
  const ids = (canciones || []).map((cancion) => cancion.id)

  if (!usuarioId) {
    setItem(KEYS.cola, ids)
    return
  }

  const porUsuario = getItem(KEYS.colaPorUsuario) || {}
  setItem(KEYS.colaPorUsuario, {
    ...porUsuario,
    [usuarioId]: ids,
  })
}

function ordenarColaParaContexto(canciones, { usuarioId, playlistId } = {}) {
  if (!canciones?.length) return []

  if (usuarioId && playlistId) {
    return ordenarPlaylistsPorUsuario(
      canciones,
      usuarioId,
      `cola:${playlistId}`
    )
  }

  if (usuarioId) {
    return ordenarPlaylistsPorUsuario(canciones, usuarioId, 'cola')
  }

  return [...canciones]
}

function conCancionAlFrente(canciones, cancionInicialId) {
  if (!cancionInicialId) return canciones

  const principal = canciones.filter(
    (cancion) => String(cancion.id) === String(cancionInicialId)
  )
  const resto = canciones.filter(
    (cancion) => String(cancion.id) !== String(cancionInicialId)
  )

  return [...principal, ...resto]
}

export function PlayerProvider({ children }) {
  const { usuarioActual } = useAuth()
  const usuarioId = usuarioActual?.id
  const [cancionActual, setCancionActual] = useState(null)
  const [reproduciendo, setReproduciendo] = useState(false)
  const [cola, setCola] = useState(() => leerColaGuardada(usuarioId))
  const audioRef = useRef(new Audio())

  useEffect(() => {
    setCola(leerColaGuardada(usuarioId))
  }, [usuarioId])

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

  function cargarCola(canciones, opciones = {}) {
    const {
      usuarioId: uid = usuarioId,
      playlistId,
      cancionInicialId,
      ordenar = true,
    } = opciones

    let siguienteCola = canciones || []

    if (ordenar) {
      siguienteCola = ordenarColaParaContexto(siguienteCola, {
        usuarioId: uid,
        playlistId,
      })
    }

    siguienteCola = conCancionAlFrente(siguienteCola, cancionInicialId)

    setCola(siguienteCola)
    guardarCola(siguienteCola, uid)
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
      guardarCola(siguienteCola, usuarioId)
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
