import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './index.css'

import App from './App.jsx'

import { AuthProvider } from './context/AuthContext.jsx'
import { PlayerProvider } from './context/PlayerContext.jsx'

import { initItem, getItem, setItem, KEYS } from './utils/localStorage.js'

import {
  cancionesIniciales,
  usuariosIniciales,
  mergeCancionesNuevas,
} from './utils/seedData.js'

import {
  ensureCatalogoPlaylists,
  ensurePlaylistsAleatoriasParaTodos,
} from './utils/playlists.js'

import { limpiarUsuariosDesactivados } from './utils/limpiarUsuariosDesactivados.js'

initItem(KEYS.canciones, cancionesIniciales)
initItem(KEYS.usuarios, usuariosIniciales)
initItem(KEYS.playlists, [])

const correosAdministradores = [
  'adminivan@nibmusic.com',
  'adminnico@nibmusic.com',
  'adminfede@nibmusic.com',
]

const administradoresEquipo = usuariosIniciales.filter((usuario) =>
  correosAdministradores.includes(usuario.email.toLowerCase())
)

const usuariosExistentes = getItem(KEYS.usuarios) || []

const usuariosFaltantes = administradoresEquipo.filter(
  (administrador) =>
    !usuariosExistentes.some(
      (usuario) =>
        usuario.email.toLowerCase() ===
        administrador.email.toLowerCase()
    )
)

if (usuariosFaltantes.length > 0) {
  setItem(KEYS.usuarios, [
    ...usuariosExistentes,
    ...usuariosFaltantes,
  ])
}

mergeCancionesNuevas()
ensureCatalogoPlaylists()

const usuariosGuardados = getItem(KEYS.usuarios) || []

const usuariosActualizados = usuariosGuardados.map((usuario) => ({
  ...usuario,
  activo: usuario.activo ?? true,
  fechaDesactivacion: usuario.fechaDesactivacion ?? null,
}))

setItem(KEYS.usuarios, usuariosActualizados)

limpiarUsuariosDesactivados()
ensurePlaylistsAleatoriasParaTodos()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <PlayerProvider>
        <App />
      </PlayerProvider>
    </AuthProvider>
  </StrictMode>,
)