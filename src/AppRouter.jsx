import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Inicio from "./pages/Inicio";
import Catalogo from "./pages/Catalogo";
import DetalleCancion from "./pages/DetalleCancion";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Playlist from "./pages/Playlist";
import Podcasts from "./pages/Podcasts";
import Admin from "./pages/Admin";
import Error404 from "./pages/Error404";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Inicio />} />
          <Route path="/catalogo" element={<Catalogo />} />
          <Route path="/detalle/:id" element={<DetalleCancion />} />
          <Route path="/podcasts" element={<Podcasts />} />

          <Route
            path="/perfil"
            element={
              <PrivateRoute role="premium">
                <Perfil />
              </PrivateRoute>
            }
          />

          <Route
            path="/playlist"
            element={
              <PrivateRoute role={["premium", "admin"]}>
                <Playlist />
              </PrivateRoute>
            }
          />

          <Route
            path="/playlist/:id"
            element={
              <PrivateRoute role={["premium", "admin"]}>
                <Playlist />
              </PrivateRoute>
            }
          />
        </Route>

        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />

        <Route
          path="/registro"
          element={
            <PublicRoute>
              <Registro />
            </PublicRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <PrivateRoute role="admin">
              <Admin />
            </PrivateRoute>
          }
        />

        <Route path="*" element={<Error404 />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;