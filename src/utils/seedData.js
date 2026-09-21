import { v4 as uuidv4 } from 'uuid'
import { cancionesNuevas } from './cancionesNuevas.js'
import { getItem, setItem, KEYS } from './localStorage.js'

export const cancionesIniciales = [
  { id: uuidv4(), nombre: 'Bohemian Rhapsody', artista: 'Queen', album: 'A Night at the Opera', genero: 'Rock', anio: 1975, imagen: 'https://upload.wikimedia.org/wikipedia/en/4/4d/Queen_A_Night_At_The_Opera.png', archivo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3', activo: true },
  { id: uuidv4(), nombre: 'Blinding Lights', artista: 'The Weeknd', album: 'After Hours', genero: 'Pop', anio: 2019, imagen: 'https://upload.wikimedia.org/wikipedia/en/c/c1/The_Weeknd_-_After_Hours.png', archivo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3', activo: true },
  { id: uuidv4(), nombre: 'Lose Yourself', artista: 'Eminem', album: '8 Mile', genero: 'Hip-Hop', anio: 2002, imagen: '/covers/8-mile.jpg', archivo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3', activo: true },
  { id: uuidv4(), nombre: 'Shape of You', artista: 'Ed Sheeran', album: 'Divide', genero: 'Pop', anio: 2017, imagen: '/covers/divide.jpg', archivo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', activo: true },
  { id: uuidv4(), nombre: 'Smells Like Teen Spirit', artista: 'Nirvana', album: 'Nevermind', genero: 'Rock', anio: 1991, imagen: 'https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg', archivo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3', activo: true },
  { id: uuidv4(), nombre: 'Rolling in the Deep', artista: 'Adele', album: '21', genero: 'Pop', anio: 2010, imagen: 'https://upload.wikimedia.org/wikipedia/en/1/1b/Adele_-_21.png', archivo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3', activo: true },
  { id: uuidv4(), nombre: 'Billie Jean', artista: 'Michael Jackson', album: 'Thriller', genero: 'Pop', anio: 1982, imagen: 'https://upload.wikimedia.org/wikipedia/en/5/55/Michael_Jackson_-_Thriller.png', archivo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-7.mp3', activo: true },
  { id: uuidv4(), nombre: 'Hotel California', artista: 'Eagles', album: 'Hotel California', genero: 'Rock', anio: 1977, imagen: 'https://upload.wikimedia.org/wikipedia/en/4/49/Hotelcalifornia.jpg', archivo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', activo: true },
  { id: uuidv4(), nombre: 'Despacito', artista: 'Luis Fonsi', album: 'Vida', genero: 'Reggaeton', anio: 2017, imagen: 'https://cdn-images.dzcdn.net/images/cover/7985ef4ccd9e66af2fc3c18d629689aa/1000x1000-000000-80-0-0.jpg', archivo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', activo: true },
  { id: uuidv4(), nombre: 'Stayin Alive', artista: 'Bee Gees', album: 'Saturday Night Fever', genero: 'Disco', anio: 1977, imagen: 'https://cdn-images.dzcdn.net/images/cover/062e4071ebfc701e5f1ca935e69a0b5b/1000x1000-000000-80-0-0.jpg', archivo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-10.mp3', activo: true },
  { id: uuidv4(), nombre: 'Bad Guy', artista: 'Billie Eilish', album: 'When We All Fall Asleep', genero: 'Pop', anio: 2019, imagen: 'https://upload.wikimedia.org/wikipedia/en/3/38/When_We_All_Fall_Asleep%2C_Where_Do_We_Go%3F.png', archivo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-11.mp3', activo: true },
  { id: uuidv4(), nombre: 'Vivir Mi Vida', artista: 'Marc Anthony', album: 'Vivir Mi Vida', genero: 'Salsa', anio: 2013, imagen: 'https://cdn-images.dzcdn.net/images/cover/704472d2cb6d5e71fc79f424f83d1956/1000x1000-000000-80-0-0.jpg', archivo: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-12.mp3', activo: true },
  ...cancionesNuevas,
]

/** Agrega/actualiza las 100 canciones nuevas en localStorage sin borrar las viejas. */
export function mergeCancionesNuevas() {
  const existentes = getItem(KEYS.canciones) || []
  const porId = new Map(existentes.map((c) => [String(c.id), c]))

  for (const nueva of cancionesNuevas) {
    const actual = porId.get(nueva.id)
    porId.set(nueva.id, actual ? { ...actual, ...nueva } : { ...nueva })
  }

  const portadasClasicas = {
    'despacito|luis fonsi':
      'https://cdn-images.dzcdn.net/images/cover/7985ef4ccd9e66af2fc3c18d629689aa/1000x1000-000000-80-0-0.jpg',
    'stayin alive|bee gees':
      'https://cdn-images.dzcdn.net/images/cover/062e4071ebfc701e5f1ca935e69a0b5b/1000x1000-000000-80-0-0.jpg',
    "stayin' alive|bee gees":
      'https://cdn-images.dzcdn.net/images/cover/062e4071ebfc701e5f1ca935e69a0b5b/1000x1000-000000-80-0-0.jpg',
    'vivir mi vida|marc anthony':
      'https://cdn-images.dzcdn.net/images/cover/704472d2cb6d5e71fc79f424f83d1956/1000x1000-000000-80-0-0.jpg',
  }

  const fusionadas = [...porId.values()].map((cancion) => {
    const clave = `${(cancion.nombre || '').toLowerCase()}|${(cancion.artista || '').toLowerCase()}`
    const imagenNueva = portadasClasicas[clave]
    return imagenNueva ? { ...cancion, imagen: imagenNueva } : cancion
  })

  setItem(KEYS.canciones, fusionadas)
  return fusionadas
}

export const usuariosIniciales = [
  {
    id: uuidv4(),
    nombre: 'Administrador',
    email: 'admin@nibmusic.com',
    password: 'admin123',
    rol: 'admin',
    avatar: 'https://ui-avatars.com/api/?name=Admin&background=6d28d9&color=fff',
    fechaRegistro: new Date().toISOString(),
    activo: true,
    fechaDesactivacion: null,
  },
  {
    id: uuidv4(),
    nombre: 'Usuario Premium',
    email: 'premium@nibmusic.com',
    password: 'premium123',
    rol: 'premium',
    avatar: 'https://ui-avatars.com/api/?name=Premium&background=059669&color=fff',
    fechaRegistro: new Date().toISOString(),
    activo: true,
    fechaDesactivacion: null,
  },
]