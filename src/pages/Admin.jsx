import { useState } from "react";

import CancionesAdmin from "../components/admin/CancionesAdmin";
import UsuariosAdmin from "../components/admin/UsuariosAdmin";

import "../styles/Admin.css";

function Admin() {
  const [seccionActiva, setSeccionActiva] = useState("canciones");

  return (
    <main className="admin-page">
      <header className="admin-page__header">
        <div>
          <span className="admin-page__eyebrow">
            NiB Music
          </span>

          <h1>Panel de administración</h1>

          <p>Gestioná las canciones y los usuarios de la plataforma.</p>
        </div>
      </header>

      <nav className="admin-page__nav" aria-label="Secciones del panel">
        <button
          type="button"
          className={
            seccionActiva === "canciones"
              ? "admin-page__tab admin-page__tab--active"
              : "admin-page__tab"
          }
          onClick={() => setSeccionActiva("canciones")}
        >
          Canciones
        </button>

        <button
          type="button"
          className={
            seccionActiva === "usuarios"
              ? "admin-page__tab admin-page__tab--active"
              : "admin-page__tab"
          }
          onClick={() => setSeccionActiva("usuarios")}
        >
          Usuarios
        </button>
      </nav>

      {seccionActiva === "canciones" ? (
        <CancionesAdmin />
      ) : (
        <UsuariosAdmin />
      )}
    </main>
  );
}

export default Admin;