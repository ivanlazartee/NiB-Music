import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  return (
    <div className="app-layout">
      <Sidebar />

      <div className="app-layout__content">
        <Navbar />

        <main className="app-layout__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;