# NiB Music

App de streaming musical estilo Spotify, hecha en React + Vite para el módulo de Rolling Code.

## Equipo

| Integrante | Rol |
| --- | --- |
| Iván Lazarte | Tech Lead · Usuario Premium · Reproductor · Deploy |
| Eduardo Nicolas Brizuela | Autenticación · Administración de usuarios |
| Benjamín / Fede | (completar según el equipo) |

## Roles de usuario

- **Invitado:** navega el catálogo, ve biblioteca limitada y CTAs a registro/login.
- **Premium:** reproduce música, playlists, me gusta, cola y reproductor.
- **Admin:** panel de canciones y usuarios (`/admin`).

## Tecnologías

- React 19 + Vite 8
- React Router
- Tailwind CSS
- Lucide React
- SweetAlert2
- LocalStorage (persistencia local)

## Cómo correr el proyecto

```bash
pnpm install
pnpm run dev
```

Build de producción:

```bash
pnpm run build
pnpm run preview
```

## Deploy

- **Netlify:** se subió el build de producción (`dist`) arrastrando la carpeta.
- Sitio: _(pegar acá la URL de Netlify)_

## Credenciales de prueba

Usá los usuarios seed del proyecto (admins / premium según `seedData`).

## Estructura principal

```text
src/
  components/   # UI compartida (Navbar, Sidebar, PlayerBar, etc.)
  context/      # AuthContext y PlayerContext
  layouts/      # MainLayout
  pages/        # Inicio, Playlist, Perfil, Admin, Login, etc.
  styles/       # CSS por sección
  utils/        # localStorage, playlists, seed
```

## Scripts

| Comando | Descripción |
| --- | --- |
| `pnpm run dev` | Servidor de desarrollo |
| `pnpm run build` | Build para producción |
| `pnpm run preview` | Previsualiza el build |
| `pnpm run lint` | Linter (Oxlint) |
