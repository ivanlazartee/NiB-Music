import { useRef, useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PlayerBar from "../components/PlayerBar";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const [search, setSearch] = useState("");
  const searchInputRef = useRef(null);
  const { usuarioActual } = useAuth();

  const mostrarPlayer =
    usuarioActual?.rol === "premium" || usuarioActual?.rol === "admin";

  const focusSearch = () => {
    searchInputRef.current?.focus();
    searchInputRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  return (
    <div
      className={
        mostrarPlayer ? "app-layout app-layout--with-player" : "app-layout"
      }
    >
      <Sidebar />

      <div className="app-layout__content">
        <Navbar
          search={search}
          setSearch={setSearch}
          searchInputRef={searchInputRef}
        />

        <main
          className={
            mostrarPlayer
              ? "app-layout__main app-layout__main--with-player"
              : "app-layout__main"
          }
        >
          <Outlet context={{ search, setSearch, focusSearch }} />
        </main>
      </div>

      {mostrarPlayer && <PlayerBar />}
    </div>
  );
};

export default MainLayout;
