import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { getItem, setItem, KEYS } from "../../utils/localStorage";
import "./UsuariosAdmin.css";

function UsuariosAdmin() {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    cargarUsuarios();
  }, []);

  const cargarUsuarios = () => {
    const usuariosGuardados = getItem(KEYS.usuarios) || [];

    setUsuarios(
      usuariosGuardados.filter((usuario) => usuario.rol === "premium")
    );
  };

  const desactivarUsuario = (id) => {
    const usuariosGuardados = getItem(KEYS.usuarios) || [];

    const usuario = usuariosGuardados.find((usuario) => usuario.id === id);

    if (!usuario) return;

    Swal.fire({
      title: "¿Desactivar cuenta?",
      text: `La cuenta de ${usuario.nombre} quedará desactivada.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, desactivar",
      cancelButtonText: "Cancelar",
      background: "#0f0f0f",
      color: "#ffffff",
      confirmButtonColor: "#d4af37",
      cancelButtonColor: "#555555",
    }).then((resultado) => {
      if (!resultado.isConfirmed) return;

      const usuariosActualizados = usuariosGuardados.map((usuario) =>
        usuario.id === id
          ? {
              ...usuario,
              activo: false,
              fechaDesactivacion: new Date().toISOString(),
            }
          : usuario
      );

      setItem(KEYS.usuarios, usuariosActualizados);
      cargarUsuarios();

      Swal.fire({
        title: "Cuenta desactivada",
        text: "La cuenta fue desactivada correctamente.",
        icon: "success",
        background: "#0f0f0f",
        color: "#ffffff",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#d4af37",
      });
    });
  };

  const eliminarUsuario = (id) => {
    const usuariosGuardados = getItem(KEYS.usuarios) || [];

    const usuario = usuariosGuardados.find((usuario) => usuario.id === id);

    if (!usuario) return;

    Swal.fire({
      title: "¿Eliminar cuenta definitivamente?",
      text: `Se eliminará permanentemente la cuenta de ${usuario.nombre}. Esta acción no se puede deshacer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
      background: "#0f0f0f",
      color: "#ffffff",
      confirmButtonColor: "#d4af37",
      cancelButtonColor: "#555555",
    }).then((resultado) => {
      if (!resultado.isConfirmed) return;

      const usuariosActualizados = usuariosGuardados.filter(
        (usuario) => usuario.id !== id
      );

      setItem(KEYS.usuarios, usuariosActualizados);
      cargarUsuarios();

      Swal.fire({
        title: "Cuenta eliminada",
        text: "La cuenta fue eliminada definitivamente.",
        icon: "success",
        background: "#0f0f0f",
        color: "#ffffff",
        confirmButtonText: "Aceptar",
        confirmButtonColor: "#d4af37",
      });
    });
  };

  const formatearFecha = (fecha) => {
    if (!fecha) return "Sin fecha";

    return new Date(fecha).toLocaleDateString("es-AR");
  };

return (
  <section className="usuarios-admin">
    <div className="usuarios-admin-header">
      <div>
        <h2>Usuarios Premium</h2>
        <p>Gestioná las cuentas de los usuarios de NiB Music.</p>
      </div>

      <div className="usuarios-admin-contador">
        <span>{usuarios.length}</span>
        <small>Usuarios</small>
      </div>
    </div>

    {usuarios.length === 0 ? (
      <div className="usuarios-admin-vacio">
        <p>No hay usuarios premium registrados.</p>
      </div>
    ) : (
      <div className="usuarios-admin-tabla-container">
        <table className="usuarios-admin-tabla">
          <thead>
            <tr>
              <th>Usuario</th>
              <th>Email</th>
              <th>Fecha de registro</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {usuarios.map((usuario) => (
              <tr key={usuario.id}>
                <td>
                  <div className="usuario-info">
                    <img
                      src={usuario.avatar}
                      alt={`Avatar de ${usuario.nombre}`}
                    />

                    <div>
                      <strong>{usuario.nombre}</strong>
                      <span>Premium</span>
                    </div>
                  </div>
                </td>

                <td className="usuario-email">
                  {usuario.email}
                </td>

                <td>
                  {formatearFecha(usuario.fechaRegistro)}
                </td>

                <td>
                  <span
                    className={
                      usuario.activo === false
                        ? "estado estado-inactivo"
                        : "estado estado-activo"
                    }
                  >
                    <span className="estado-punto"></span>
                    {usuario.activo === false ? "Desactivada" : "Activa"}
                  </span>
                </td>

                <td>
                  <div className="usuario-acciones">
                    {usuario.activo !== false && (
                      <button
                        className="btn-desactivar"
                        onClick={() => desactivarUsuario(usuario.id)}
                      >
                        Desactivar
                      </button>
                    )}

                    <button
                      className="btn-eliminar"
                      onClick={() => eliminarUsuario(usuario.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </section>
);
}

export default UsuariosAdmin;