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

  return (
    <PlayerContext.Provider
      value={{
        cancionActual,
        reproduciendo,
        cola,git
        setCancionActual,
        setReproduciendo,
        setCola,
        audioRef,
      }}
    >
      {children}
    </PlayerContext.Provider>
  )
}