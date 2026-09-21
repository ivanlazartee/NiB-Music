import { getItem, KEYS } from "./localStorage";
import portadaDefault from "../assets/img/portada-default.png";

export function getPlaylistsDeUsuario(usuarioId) {
  if (!usuarioId) return [];

  const playlists = getItem(KEYS.playlists) || [];

  return playlists.filter(
    (playlist) => playlist.usuarioId === usuarioId
  );
}

export function getPortadaPlaylist(playlist) {
  const canciones = getItem(KEYS.canciones) || [];
  const primerId = playlist?.cancionesIds?.[0];

  if (!primerId) return portadaDefault;

  const cancion = canciones.find(
    (item) => String(item.id) === String(primerId)
  );

  return cancion?.imagen || portadaDefault;
}
