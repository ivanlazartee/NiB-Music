import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { initItem, KEYS } from './utils/localStorage.js'
import { cancionesIniciales, usuariosIniciales } from './utils/seedData.js'

initItem (KEYS.canciones, cancionesIniciales)
initItem (KEYS.usuarios, usuariosIniciales)
initItem (KEYS.playlists, [])


createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
