import { createContext, useContext } from "react";

export const PlayerContext = createContext(null)

export function usePlayer() {
    return useContext(PlayerContext)
}

export function PlayerProvider({ children }){
    return(
        <PlayerContext.Provider value={{}}>
            {children}
        </PlayerContext.Provider>
    )
}