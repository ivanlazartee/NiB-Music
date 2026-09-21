export const KEYS = {
  canciones: "canciones",
  usuarios: "usuarios",
  playlists: "playlists",
  usuarioActual: "usuarioActual",
  cola: "cola",
  colaPorUsuario: "colaPorUsuario",
};

export function getItem(key) {
  const data = localStorage.getItem(key);

  return data ? JSON.parse(data) : null;
}

export function setItem(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function removeItem(key) {
  localStorage.removeItem(key);
}

export function initItem(key, initialValue) {
  if (!getItem(key)) {
    setItem(key, initialValue);
  }
}