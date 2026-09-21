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

function escapeRegExp(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function normalizarTexto(texto) {
  return (texto || "").toLowerCase().trim();
}

/** Match estricto de artista del seed (evita Omar Courtz → Don Omar, Yan → Yandel). */
function cancionEsDeArtista(cancion, nombreArtista) {
  const artista = normalizarTexto(cancion.artista);
  const n = normalizarTexto(nombreArtista);
  if (!artista || !n) return false;
  if (artista === n) return true;
  if (artista.includes(n)) return true;

  const partes = n.split(/\s+/).filter(Boolean);
  if (partes.length >= 2) {
    return partes.every((parte) => artista.includes(parte));
  }

  return new RegExp(
    `(?:^|[\\s&,/]+)${escapeRegExp(n)}(?:$|[\\s&,/]+)`,
    "i"
  ).test(cancion.artista || "");
}

function coincideArtistaPlaylist(cancion, seed) {
  return (seed.artistas || []).some((nombre) =>
    cancionEsDeArtista(cancion, nombre)
  );
}

function coincideGeneroPlaylist(cancion, seed) {
  const genero = normalizarTexto(cancion.genero);
  return (seed.generos || []).some((g) => genero === normalizarTexto(g));
}

function matchArtistaPrincipal(cancion, seed) {
  const principal = (seed.artistas || [])[0];
  if (!principal) return false;
  return cancionEsDeArtista(cancion, principal);
}

function pickCancionesParaPlaylist(seed, canciones, cantidad = 10, imagenesUsadas) {
  const usados = new Set();
  const elegidas = [];

  const pools = (seed.artistas || []).map((nombre) =>
    canciones.filter((cancion) => cancionEsDeArtista(cancion, nombre))
  );

  let agrego = true;
  while (elegidas.length < cantidad && agrego) {
    agrego = false;
    for (const pool of pools) {
      if (elegidas.length >= cantidad) break;
      const next = pool.find((cancion) => !usados.has(cancion.id));
      if (next) {
        elegidas.push(next);
        usados.add(next.id);
        agrego = true;
      }
    }
  }

  for (const cancion of canciones) {
    if (elegidas.length >= cantidad) break;
    if (usados.has(cancion.id)) continue;
    if (coincideArtistaPlaylist(cancion, seed)) {
      elegidas.push(cancion);
      usados.add(cancion.id);
    }
  }

  for (const cancion of canciones) {
    if (elegidas.length >= cantidad) break;
    if (usados.has(cancion.id)) continue;
    if (coincideGeneroPlaylist(cancion, seed)) {
      elegidas.push(cancion);
      usados.add(cancion.id);
    }
  }

  for (const cancion of canciones) {
    if (elegidas.length >= cantidad) break;
    if (usados.has(cancion.id)) continue;
    elegidas.push(cancion);
    usados.add(cancion.id);
  }

  const portadaPreferida = normalizarTexto(seed.portadaCancion);

  const porTituloPreferido = canciones.find(
    (cancion) =>
      portadaPreferida &&
      normalizarTexto(cancion.nombre).includes(portadaPreferida) &&
      cancion.imagen &&
      !imagenesUsadas.has(cancion.imagen)
  );

  let portadaCancion =
    porTituloPreferido ||
    elegidas.find(
      (cancion) =>
        cancion.imagen &&
        !imagenesUsadas.has(cancion.imagen) &&
        matchArtistaPrincipal(cancion, seed)
    ) ||
    elegidas.find(
      (cancion) => cancion.imagen && !imagenesUsadas.has(cancion.imagen)
    ) ||
    elegidas[0];

  if (portadaCancion && !elegidas.some((c) => c.id === portadaCancion.id)) {
    elegidas.unshift(portadaCancion);
    if (elegidas.length > cantidad) elegidas.pop();
  }

  if (portadaCancion?.imagen) {
    imagenesUsadas.add(portadaCancion.imagen);
  }

  if (portadaCancion && elegidas[0]?.id !== portadaCancion.id) {
    const sinPortada = elegidas.filter((c) => c.id !== portadaCancion.id);
    return {
      cancionesIds: [portadaCancion, ...sinPortada].map((c) => c.id),
      imagen: portadaCancion.imagen || null,
    };
  }

  return {
    cancionesIds: elegidas.map((cancion) => cancion.id),
    imagen: portadaCancion?.imagen || null,
  };
}

export function ensureCatalogoPlaylists() {
  const canciones = (getItem(KEYS.canciones) || []).filter(
    (cancion) => cancion.activo
  );
  const existentes = getItem(KEYS.playlists) || [];
  const deUsuario = existentes.filter(
    (playlist) => !isCatalogoPlaylist(playlist)
  );
  const imagenesUsadas = new Set();

  const catalogo = playlistsCatalogoSeed.map((seed, index) => {
    const { cancionesIds, imagen } = pickCancionesParaPlaylist(
      seed,
      canciones,
      8 + (index % 4),
      imagenesUsadas
    );

    return {
      id: seed.id,
      usuarioId: CATALOGO_USUARIO_ID,
      esCatalogo: true,
      esMeGusta: false,
      nombre: seed.nombre,
      descripcion: seed.descripcion,
      seccion: seed.seccion,
      color: seed.color,
      creador: seed.creador,
      imagen,
      cancionesIds,
    };
  });

  const actualizadas = [...catalogo, ...deUsuario];
  setItem(KEYS.playlists, actualizadas);
  return actualizadas;
}

/** Hash determinístico a partir del id de usuario (mismo usuario = mismo orden). */
function hashSemilla(texto) {
  let hash = 2166136261;
  const str = String(texto || "invitado");
  for (let i = 0; i < str.length; i += 1) {
    hash ^= str.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function crearPrng(semilla) {
  let estado = hashSemilla(semilla);
  return () => {
    estado = (Math.imul(estado, 1664525) + 1013904223) >>> 0;
    return estado / 4294967296;
  };
}

/** Orden distinto por usuario, estable entre recargas. */
export function ordenarPlaylistsPorUsuario(playlists, usuarioId, clave = "") {
  if (!Array.isArray(playlists) || playlists.length <= 1) {
    return playlists || [];
  }

  const copia = [...playlists];
  const random = crearPrng(`${usuarioId || "invitado"}:${clave}`);

  for (let i = copia.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }

  return copia;
}

export function getPlaylistsCatalogo(seccion, playlistsFuente, usuarioId) {
  const playlists = playlistsFuente || getItem(KEYS.playlists) || [];

  const filtradas = playlists.filter(
    (playlist) =>
      isCatalogoPlaylist(playlist) &&
      (!seccion || playlist.seccion === seccion)
  );

  if (!usuarioId) return filtradas;

  return ordenarPlaylistsPorUsuario(
    filtradas,
    usuarioId,
    seccion || "catalogo"
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

  const todasIds = ordenarPlaylistsPorUsuario(
    (getItem(KEYS.canciones) || [])
      .filter((cancion) => cancion.activo)
      .map((cancion) => cancion.id),
    usuarioId,
    "me-gusta"
  );

  const meGusta = {
    id: crypto.randomUUID(),
    usuarioId,
    nombre: NOMBRE_ME_GUSTA,
    cancionesIds: todasIds,
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

  if (playlist?.imagen) return playlist.imagen;

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

/** Llena "Tus me gusta" con todas las canciones activas del catálogo. */
export function llenarMeGustaConTodasCanciones(usuarioId) {
  if (!usuarioId) return getItem(KEYS.playlists) || [];

  const playlists = ensureMeGustaPlaylist(usuarioId);
  const todasIds = ordenarPlaylistsPorUsuario(
    (getItem(KEYS.canciones) || [])
      .filter((cancion) => cancion.activo)
      .map((cancion) => cancion.id),
    usuarioId,
    "me-gusta"
  );

  if (todasIds.length === 0) return playlists;

  const actualizadas = playlists.map((playlist) => {
    if (
      playlist.usuarioId !== usuarioId ||
      !isMeGustaPlaylist(playlist)
    ) {
      return playlist;
    }

    return {
      ...playlist,
      cancionesIds: todasIds,
    };
  });

  setItem(KEYS.playlists, actualizadas);
  notifyPlaylistsUpdated();
  return actualizadas;
}

/** @deprecated usar llenarMeGustaConTodasCanciones */
export function seedCancionAleatoriaSiVacia(usuarioId) {
  return llenarMeGustaConTodasCanciones(usuarioId);
}
