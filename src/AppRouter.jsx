import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "./layouts/MainLayout";

import Catalogo from "./pages/Catalogo";
import DetalleCancion from "./pages/DetalleCancion";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Playlist from "./pages/Playlist";
import Admin from "./pages/Admin";
import Error404 from "./pages/Error404";

import PrivateRoute from "./components/PrivateRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
  <Route path="/" element={<Catalogo />} />
  <Route path="/catalogo" element={<Catalogo />} />
  <Route path="/detalle/:id" element={<DetalleCancion />} />
  <Route path="/perfil" element={<Perfil />} />
  <Route path="/playlist" element={<Playlist />} />
</Route>

        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />

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