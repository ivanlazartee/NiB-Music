import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PlayerBar from "../components/PlayerBar";
import { useAuth } from "../context/AuthContext";

const MainLayout = () => {
  const [search, setSearch] = useState("");
  const { usuarioActual } = useAuth();

  const esPremium = usuarioActual?.rol === "premium";

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-layout__content">
        <Navbar
          search={search}
          setSearch={setSearch}
        />

        <main className="app-layout__main">
          <Outlet context={{ search }} />
        </main>
      </div>

      {esPremium && <PlayerBar />}
    </div>
  );
};

export default MainLayout;
