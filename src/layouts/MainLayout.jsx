import { useRef, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PlayerBar from "../components/PlayerBar";
import QueuePanel from "../components/QueuePanel";
import GuestSearchPanel from "../components/GuestSearchPanel";
import { useAuth } from "../context/AuthContext";
import { usePlayer } from "../context/PlayerContext";
import { getItem, KEYS } from "../utils/localStorage";

const MainLayout = () => {
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);
  const navigate = useNavigate();
  const { usuarioActual } = useAuth();
  const { reproducir, cargarCola, reordenarCola, cancionActual, cola } =
    usePlayer();

  const esInvitado = !usuarioActual;
  const mostrarPlayer =
    usuarioActual?.rol === "premium" || usuarioActual?.rol === "admin";
  const puedeReproducir = mostrarPlayer;

  const canciones = getItem(KEYS.canciones) || [];
  const cancionesFallback = canciones
    .filter((cancion) => cancion.activo)
    .slice(0, 6);
  const cancionesCola = cola.length > 0 ? cola : cancionesFallback;

  const focusSearch = () => {
    searchInputRef.current?.focus();
  };

  const handlePlayCancion = (cancion) => {
    if (!puedeReproducir) {
      navigate("/registro");
      return;
    }

    if (cola.length === 0) {
      cargarCola(cancionesFallback);
    }

    reproducir(cancion);
  };

  const handleReordenar = (desdeIndex, hastaIndex) => {
    if (cola.length === 0) {
      const reordenada = [...cancionesFallback];
      const [movida] = reordenada.splice(desdeIndex, 1);
      reordenada.splice(hastaIndex, 0, movida);
      cargarCola(reordenada);
      return;
    }

    reordenarCola(desdeIndex, hastaIndex);
  };

  return (
    <div
      className={
        mostrarPlayer ? "app-layout app-layout--with-player" : "app-layout"
      }
    >
      <div className="app-shell">
        <aside className="app-panel app-panel--sidebar">
          <Sidebar />
        </aside>

        <header className="app-shell__top">
          <Navbar
            search={search}
            setSearch={setSearch}
            searchInputRef={searchInputRef}
          />
        </header>

        <section className="app-panel app-panel--center">
          <main className="app-panel__main">
            <Outlet context={{ search, setSearch, focusSearch }} />
          </main>
        </section>

        <aside className="app-panel app-panel--right">
          {esInvitado ? (
            <GuestSearchPanel onBuscar={focusSearch} />
          ) : (
            <QueuePanel
              canciones={cancionesCola}
              cancionActualId={cancionActual?.id}
              onSelectCancion={handlePlayCancion}
              onReordenar={handleReordenar}
            />
          )}
        </aside>
      </div>

      {mostrarPlayer && <PlayerBar />}
    </div>
  );
};

export default MainLayout;
