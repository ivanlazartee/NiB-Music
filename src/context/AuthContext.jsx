import { createContext, useContext} from 'react'

export const AuthContext = createContext(null)

export function useAuth(){
    return useContext(AuthContext)
}

export function AuthProvider({children}) {
    return (
        <AuthContext.Provider value={{}}>
            {children}
        </AuthContext.Provider>
    )
}