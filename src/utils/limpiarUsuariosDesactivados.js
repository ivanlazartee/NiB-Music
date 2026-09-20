import { getItem, setItem, removeItem, KEYS } from "./localStorage";

const DIAS_PARA_ELIMINAR = 30;

export function limpiarUsuariosDesactivados() {
  const usuarios = getItem(KEYS.usuarios) || [];

  const ahora = new Date();

  const usuariosActualizados = usuarios.filter((usuario) => {
    // Los usuarios activos y los administradores se conservan.
    if (usuario.rol !== "premium" || usuario.activo !== false) {
      return true;
    }

    // Si una cuenta desactivada no tiene fecha, no la eliminamos.
    if (!usuario.fechaDesactivacion) {
      return true;
    }

    const fechaDesactivacion = new Date(usuario.fechaDesactivacion);

    const diferenciaMilisegundos =
      ahora.getTime() - fechaDesactivacion.getTime();

    const diasDesactivado =
      diferenciaMilisegundos / (1000 * 60 * 60 * 24);

    return diasDesactivado < DIAS_PARA_ELIMINAR;
  });

  if (usuariosActualizados.length !== usuarios.length) {
    setItem(KEYS.usuarios, usuariosActualizados);
  }

  const usuarioActual = getItem(KEYS.usuarioActual);

  if (
    usuarioActual &&
    !usuariosActualizados.some((usuario) => usuario.id === usuarioActual.id)
  ) {
    removeItem(KEYS.usuarioActual);
  }
}