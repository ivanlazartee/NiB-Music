import { getItem, setItem, KEYS } from "./localStorage";
import portadaDefault from "../assets/img/portada-default.png";

export const NOMBRE_ME_GUSTA = "Tus me gusta";

export function isMeGustaPlaylist(playlist) {
  return Boolean(playlist?.esMeGusta);
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
