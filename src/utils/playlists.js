import { getItem, setItem, KEYS } from "./localStorage";
import portadaDefault from "../assets/img/portada-default.png";
import { playlistsCatalogoSeed } from "./playlistsCatalogo";

export const NOMBRE_ME_GUSTA = "Tus me gusta";
export const PLAYLISTS_EVENT = "nib:playlists-updated";
export const CATALOGO_USUARIO_ID = "catalogo";

export function notifyPlaylistsUpdated() {
  window.dispatchEvent(new CustomEvent(PLAYLISTS_EVENT));
}

export function isMeGustaPlaylist(playlist) {
  return Boolean(playlist?.esMeGusta);
}

export function isCatalogoPlaylist(playlist) {
  return Boolean(playlist?.esCatalogo);
}

function coincidePlaylist(cancion, seed) {
  const artista = (cancion.artista || "").toLowerCase();
  const genero = (cancion.genero || "").toLowerCase();
  const tags = (cancion.tags || []).map((t) => String(t).toLowerCase());

  const artistas = seed.artistas || [];
  const generos = seed.generos || [];

  const matchArtista = artistas.some((nombre) => {
    const n = nombre.toLowerCase();
    return artista.includes(n) || tags.some((t) => n.includes(t) || t.includes(n.split(" ")[0]));
  });

  const matchGenero = generos.some((g) => genero === g.toLowerCase());

  return matchArtista || matchGenero;
}

function pickCancionesParaPlaylist(seed, canciones, cantidad = 10) {
  const prioritarias = canciones.filter((cancion) =>
    coincidePlaylist(cancion, seed)
  );

  const resto = canciones.filter(
    (cancion) => !prioritarias.some((p) => p.id === cancion.id)
  );

  const elegidas = [...prioritarias, ...resto].slice(0, cantidad);
  return elegidas.map((cancion) => cancion.id);
}

export function ensureCatalogoPlaylists() {
  const canciones = (getItem(KEYS.canciones) || []).filter(
    (cancion) => cancion.activo
  );
  const existentes = getItem(KEYS.playlists) || [];
  const deUsuario = existentes.filter((playlist) => !isCatalogoPlaylist(playlist));

  const catalogo = playlistsCatalogoSeed.map((seed, index) => ({
    id: seed.id,
    usuarioId: CATALOGO_USUARIO_ID,
    esCatalogo: true,
    esMeGusta: false,
    nombre: seed.nombre,
    descripcion: seed.descripcion,
    seccion: seed.seccion,
    color: seed.color,
    creador: seed.creador,
    cancionesIds: pickCancionesParaPlaylist(
      seed,
      canciones,
      8 + (index % 4)
    ),
  }));

  const actualizadas = [...catalogo, ...deUsuario];
  setItem(KEYS.playlists, actualizadas);
  return actualizadas;
}

export function getPlaylistsCatalogo(seccion, playlistsFuente) {
  const playlists = playlistsFuente || getItem(KEYS.playlists) || [];

  return playlists.filter(
    (playlist) =>
      isCatalogoPlaylist(playlist) &&
      (!seccion || playlist.seccion === seccion)
  );
}

export function getPlaylistById(playlistId, playlistsFuente) {
  if (!playlistId) return null;

  const playlists = playlistsFuente || getItem(KEYS.playlists) || [];
  return (
    playlists.find((playlist) => String(playlist.id) === String(playlistId)) ||
    null
  );
}

export function ensureMeGustaPlaylist(usuarioId) {
  if (!usuarioId) return getItem(KEYS.playlists) || [];

  const playlists = getItem(KEYS.playlists) || [];
  const yaExiste = playlists.some(
    (playlist) =>
      playlist.usuarioId === usuarioId && isMeGustaPlaylist(playlist)
  );

  if (yaExiste) return playlists;

  const meGusta = {
    id: crypto.randomUUID(),
    usuarioId,
    nombre: NOMBRE_ME_GUSTA,
    cancionesIds: [],
    esMeGusta: true,
  };

  const actualizadas = [meGusta, ...playlists];
  setItem(KEYS.playlists, actualizadas);
  notifyPlaylistsUpdated();

  return actualizadas;
}

export function getPlaylistsDeUsuario(usuarioId, playlistsFuente) {
  if (!usuarioId) return [];

  const playlists = playlistsFuente || getItem(KEYS.playlists) || [];

  return playlists
    .filter((playlist) => playlist.usuarioId === usuarioId)
    .sort((a, b) => {
      if (isMeGustaPlaylist(a)) return -1;
      if (isMeGustaPlaylist(b)) return 1;
      return 0;
    });
}

export function getMeGustaPlaylist(usuarioId) {
  if (!usuarioId) return null;

  const playlists = ensureMeGustaPlaylist(usuarioId);
  return (
    playlists.find(
      (playlist) =>
        playlist.usuarioId === usuarioId && isMeGustaPlaylist(playlist)
    ) || null
  );
}

export function estaEnPlaylist(playlist, cancionId) {
  return Boolean(
    playlist?.cancionesIds?.some(
      (id) => String(id) === String(cancionId)
    )
  );
}

export function estaEnMeGusta(usuarioId, cancionId) {
  return estaEnPlaylist(getMeGustaPlaylist(usuarioId), cancionId);
}

export function getPortadaPlaylist(playlist) {
  if (isMeGustaPlaylist(playlist)) return null;

  const canciones = getItem(KEYS.canciones) || [];
  const primerId = playlist?.cancionesIds?.[0];

  if (!primerId) return portadaDefault;

  const cancion = canciones.find(
    (item) => String(item.id) === String(primerId)
  );

  return cancion?.imagen || portadaDefault;
}

function actualizarPlaylists(usuarioId, updater) {
  const playlists = ensureMeGustaPlaylist(usuarioId);
  const actualizadas = updater(playlists);
  setItem(KEYS.playlists, actualizadas);
  notifyPlaylistsUpdated();
  return actualizadas;
}

export function agregarCancionAPlaylist(usuarioId, playlistId, cancionId) {
  return actualizarPlaylists(usuarioId, (playlists) =>
    playlists.map((playlist) => {
      if (
        playlist.id !== playlistId ||
        playlist.usuarioId !== usuarioId ||
        estaEnPlaylist(playlist, cancionId)
      ) {
        return playlist;
      }

      return {
        ...playlist,
        cancionesIds: [...playlist.cancionesIds, cancionId],
      };
    })
  );
}

export function quitarCancionDePlaylist(usuarioId, playlistId, cancionId) {
  return actualizarPlaylists(usuarioId, (playlists) =>
    playlists.map((playlist) => {
      if (
        playlist.id !== playlistId ||
        playlist.usuarioId !== usuarioId
      ) {
        return playlist;
      }

      return {
        ...playlist,
        cancionesIds: playlist.cancionesIds.filter(
          (id) => String(id) !== String(cancionId)
        ),
      };
    })
  );
}

export function agregarAMeGusta(usuarioId, cancionId) {
  const meGusta = getMeGustaPlaylist(usuarioId);
  if (!meGusta) return getItem(KEYS.playlists) || [];
  return agregarCancionAPlaylist(usuarioId, meGusta.id, cancionId);
}

export function sincronizarCancionEnPlaylists(
  usuarioId,
  cancionId,
  playlistIdsSeleccionados
) {
  const seleccionadas = new Set(
    playlistIdsSeleccionados.map((id) => String(id))
  );

  return actualizarPlaylists(usuarioId, (playlists) =>
    playlists.map((playlist) => {
      if (playlist.usuarioId !== usuarioId) return playlist;

      const debeEstar = seleccionadas.has(String(playlist.id));
      const esta = estaEnPlaylist(playlist, cancionId);

      if (debeEstar && !esta) {
        return {
          ...playlist,
          cancionesIds: [...playlist.cancionesIds, cancionId],
        };
      }

      if (!debeEstar && esta) {
        return {
          ...playlist,
          cancionesIds: playlist.cancionesIds.filter(
            (id) => String(id) !== String(cancionId)
          ),
        };
      }

      return playlist;
    })
  );
}

export function crearPlaylistUsuario(usuarioId, nombre) {
  const nombreLimpio = nombre.trim();
  if (!usuarioId || !nombreLimpio) {
    return getItem(KEYS.playlists) || [];
  }

  const nueva = {
    id: crypto.randomUUID(),
    usuarioId,
    nombre: nombreLimpio,
    cancionesIds: [],
    esMeGusta: false,
  };

  return actualizarPlaylists(usuarioId, (playlists) => [...playlists, nueva]);
}

export function seedCancionAleatoriaSiVacia(usuarioId) {
  if (!usuarioId) return getItem(KEYS.playlists) || [];

  const playlists = ensureMeGustaPlaylist(usuarioId);
  const meGusta = playlists.find(
    (playlist) =>
      playlist.usuarioId === usuarioId && isMeGustaPlaylist(playlist)
  );

  if (!meGusta || meGusta.cancionesIds.length > 0) {
    return playlists;
  }

  const canciones = (getItem(KEYS.canciones) || []).filter(
    (cancion) => cancion.activo
  );

  if (canciones.length === 0) return playlists;

  const aleatoria =
    canciones[Math.floor(Math.random() * canciones.length)];

  return agregarCancionAPlaylist(usuarioId, meGusta.id, aleatoria.id);
}
