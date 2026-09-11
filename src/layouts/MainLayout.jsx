import { useState } from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const [search, setSearch] = useState("");

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
    </div>
  );
};

export default MainLayout;