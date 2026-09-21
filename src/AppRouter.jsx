import { BrowserRouter, Routes, Route } from "react-router-dom";

import Catalogo from "./pages/Catalogo";
import DetalleCancion from "./pages/DetalleCancion";
import Login from "./pages/Login";
import Registro from "./pages/Registro";
import Perfil from "./pages/Perfil";
import Playlist from "./pages/Playlist";
import Admin from "./pages/Admin";

function AppRouter () {
    return (
        <BrowserRouter>
        <Routes>
            <Route path="/" element={<Catalogo/>}/>
            <Route path="/detalle/:id" element={<DetalleCancion/>}/>
            <Route path="/login" element={<Login/>}/>
            <Route path="/registro" element={<Registro/>}/>
            <Route path="/perfil" element={<Perfil/>}/>
            <Route path="/playlist" element={<Admin/>}/>
            <Route path="/admin" element={<Playlist/>}/>
        </Routes>
        </BrowserRouter>
    )
}

export default AppRouter