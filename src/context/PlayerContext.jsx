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
  const [progreso, setProgreso] = useState(0)
  const [duracion, setDuracion] = useState(0)
  const [volumen, setVolumen] = useState(0.8)
  const [aleatorio, setAleatorio] = useState(false)
  const [repetir, setRepetir] = useState(false)
  const audioRef = useRef(new Audio())
  const aleatorioRef = useRef(aleatorio)
  const repetirRef = useRef(repetir)
  const colaRef = useRef(cola)
  const cancionRef = useRef(cancionActual)

  aleatorioRef.current = aleatorio
  repetirRef.current = repetir
  colaRef.current = cola
  cancionRef.current = cancionActual

  useEffect(() => {
    setCola(leerColaGuardada(usuarioId))
  }, [usuarioId])

  useEffect(() => {
    const audio = audioRef.current
    audio.volume = volumen

    const onTimeUpdate = () => setProgreso(audio.currentTime || 0)
    const onLoaded = () => setDuracion(audio.duration || 0)
    const onEnded = () => {
      if (repetirRef.current) {
        audio.currentTime = 0
        audio.play()
        setReproduciendo(true)
        return
      }

      const actual = cancionRef.current
      const lista = colaRef.current || []
      const indice = lista.findIndex((c) => c.id === actual?.id)

      if (aleatorioRef.current && lista.length > 1) {
        let nextIndex = Math.floor(Math.random() * lista.length)
        if (nextIndex === indice) {
          nextIndex = (nextIndex + 1) % lista.length
        }
        const sig = lista[nextIndex]
        if (sig) {
          audio.src = sig.archivo
          audio.play()
          setCancionActual(sig)
          setReproduciendo(true)
          setProgreso(0)
        }
        return
      }

      const sig = lista[indice + 1]
      if (sig) {
        audio.src = sig.archivo
        audio.play()
        setCancionActual(sig)
        setReproduciendo(true)
        setProgreso(0)
      } else {
        setReproduciendo(false)
      }
    }

    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('durationchange', onLoaded)
    audio.addEventListener('ended', onEnded)

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('durationchange', onLoaded)
      audio.removeEventListener('ended', onEnded)
    }
  }, [])

  function reproducir(cancion) {
    audioRef.current.src = cancion.archivo
    audioRef.current.play()
    setCancionActual(cancion)
    setReproduciendo(true)
    setProgreso(0)
  }

  function togglePlay() {
    if (!cancionActual) return

    if (reproduciendo) {
      audioRef.current.pause()
      setReproduciendo(false)
    } else {
      audioRef.current.play()
      setReproduciendo(true)
    }
  }

  function siguiente() {
    const lista = cola
    if (!lista.length) return

    const indice = lista.findIndex((c) => c.id === cancionActual?.id)

    if (aleatorio && lista.length > 1) {
      let nextIndex = Math.floor(Math.random() * lista.length)
      if (nextIndex === indice) nextIndex = (nextIndex + 1) % lista.length
      reproducir(lista[nextIndex])
      return
    }

    const sig = lista[indice + 1]
    if (sig) reproducir(sig)
  }

  function anterior() {
    if (progreso > 3) {
      audioRef.current.currentTime = 0
      setProgreso(0)
      return
    }

    const indice = cola.findIndex((c) => c.id === cancionActual?.id)
    const ant = cola[indice - 1]
    if (ant) reproducir(ant)
  }

  function buscarEnCancion(segundos) {
    if (!Number.isFinite(segundos)) return
    audioRef.current.currentTime = segundos
    setProgreso(segundos)
  }

  function cambiarVolumen(valor) {
    const siguienteVolumen = Math.min(1, Math.max(0, Number(valor)))
    audioRef.current.volume = siguienteVolumen
    setVolumen(siguienteVolumen)
  }

  function toggleAleatorio() {
    setAleatorio((prev) => !prev)
  }

  function toggleRepetir() {
    setRepetir((prev) => !prev)
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
        progreso,
        duracion,
        volumen,
        aleatorio,
        repetir,
        reproducir,
        togglePlay,
        siguiente,
        anterior,
        buscarEnCancion,
        cambiarVolumen,
        toggleAleatorio,
        toggleRepetir,
        cargarCola,
        reordenarCola,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}
