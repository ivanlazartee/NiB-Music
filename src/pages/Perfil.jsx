import { useEffect, useState } from "react";
import { LogOut } from "lucide-react";
import Swal from "sweetalert2";

import { useAuth } from "../context/AuthContext";
import "../styles/Perfil.css";

function Perfil() {
  const { usuarioActual, actualizarPerfil, logout } = useAuth();

  const [nombre, setNombre] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    if (usuarioActual) {
      setNombre(usuarioActual.nombre || "");
      setAvatar(usuarioActual.avatar || "");
    }
  }, [usuarioActual]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!nombre.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Nombre requerido",
        text: "Ingresá un nombre para continuar.",
        confirmButtonText: "Entendido",
      });

      return;
    }

    if (!avatar.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Avatar requerido",
        text: "Ingresá una URL para tu avatar.",
        confirmButtonText: "Entendido",
      });

      return;
    }

    const resultado = actualizarPerfil({
      nombre: nombre.trim(),
      avatar: avatar.trim(),
    });

    if (!resultado.success) {
      Swal.fire({
        icon: "error",
        title: "No se pudo actualizar",
        text: resultado.message,
        confirmButtonText: "Entendido",
      });

      return;
    }

    Swal.fire({
      icon: "success",
      title: "Perfil actualizado",
      text: "Tus datos se actualizaron correctamente.",
      confirmButtonText: "Perfecto",
    });
  };

  if (!usuarioActual) {
    return null;
  }

  return (
    <main className="perfil">
      <section className="perfil__card">
        <div className="perfil__header">
          <h1 className="perfil__title">Mi perfil</h1>

          <p className="perfil__subtitle">
            Administrá la información de tu cuenta.
          </p>
        </div>

        <div className="perfil__avatar-container">
          <img
            src={avatar || "https://via.placeholder.com/150"}
            alt={`Avatar de ${usuarioActual.nombre}`}
            className="perfil__avatar"
          />
        </div>

        <form className="perfil__form" onSubmit={handleSubmit}>
          <div className="perfil__field">
            <label htmlFor="nombre" className="perfil__label">
              Nombre
            </label>

            <input
              id="nombre"
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="perfil__input"
            />
          </div>

          <div className="perfil__field">
            <label htmlFor="email" className="perfil__label">
              Email
            </label>

            <input
              id="email"
              type="email"
              value={usuarioActual.email}
              disabled
              className="perfil__input perfil__input--disabled"
            />
          </div>

          <div className="perfil__field">
            <label htmlFor="avatar" className="perfil__label">
              URL del avatar
            </label>

            <input
              id="avatar"
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://..."
              className="perfil__input"
            />
          </div>

          <button type="submit" className="perfil__button">
            Guardar cambios
          </button>
        </form>

        <button
          type="button"
          className="perfil__logout"
          onClick={logout}
        >
          <LogOut size={18} />
          <span>Cerrar sesión</span>
        </button>
      </section>
    </main>
  );
}

export default Perfil;
