import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { PlayerProvider } from './context/PlayerContext.jsx'
import { initItem, getItem, setItem, KEYS } from './utils/localStorage.js'
import { cancionesIniciales, usuariosIniciales } from './utils/seedData.js'

initItem (KEYS.canciones, cancionesIniciales)
initItem (KEYS.usuarios, usuariosIniciales)
initItem (KEYS.playlists, [])

const usuariosGuardados = getItem(KEYS.usuarios) || []

const usuariosActualizados = usuariosGuardados.map((usuario) => ({
  ...usuario,
  activo: usuario.activo ?? true,
  fechaDesactivacion: usuario.fechaDesactivacion ?? null,
}))

setItem(KEYS.usuarios, usuariosActualizados)


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </AuthProvider>
  </StrictMode>,
)
