import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { Heart, ListMusic, LogOut, Plus } from "lucide-react";

import logoNib from "../assets/img/Nib-Home.png";
import { useAuth } from "../context/AuthContext";
import {
  ensureMeGustaPlaylist,
  getPlaylistsDeUsuario,
  getPortadaPlaylist,
  isMeGustaPlaylist,
} from "../utils/playlists";
import GuestAuthModal from "./GuestAuthModal";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { usuarioActual, logout } = useAuth();
  const [mostrarModalPlaylist, setMostrarModalPlaylist] = useState(false);
  const [playlists, setPlaylists] = useState([]);
  const playlistCardRef = useRef(null);

  const esInvitado = !usuarioActual;
  const nombreUsuario = usuarioActual?.nombre || "Usuario";

  useEffect(() => {
    if (!usuarioActual?.id) {
      setPlaylists([]);
      return;
    }

    const actualizadas = ensureMeGustaPlaylist(usuarioActual.id);
    setPlaylists(actualizadas);
  }, [usuarioActual?.id, location.pathname]);

  const playlistsDelUsuario = getPlaylistsDeUsuario(
    usuarioActual?.id,
    playlists
  );

  return (
    <aside className="sidebar">
      <div className="sidebar__glow" />

      <NavLink to="/" className="sidebar__brand-link">
        <img
          src={logoNib}
          alt="NiB Music"
          className="sidebar__brand-image"
        />
      </NavLink>

      {usuarioActual?.rol === "admin" && (
        <nav className="sidebar__nav">
          <NavLink to="/admin" className="sidebar__link">
            <ListMusic size={19} />
            <span>Admin</span>
          </NavLink>
        </nav>
      )}

      {esInvitado ? (
        <div className="sidebar__section sidebar__library">
          <div className="sidebar__library-header">
            <p className="sidebar__section-title sidebar__section-title--library">
              Tu biblioteca
            </p>

            <button
              type="button"
              className="sidebar__library-add"
              aria-label="Crear playlist"
              onClick={() => setMostrarModalPlaylist(true)}
            >
              <Plus size={18} />
            </button>
          </div>

          <div
            className="sidebar__library-card"
            ref={playlistCardRef}
          >
            <h3>Crea tu primera playlist</h3>
            <p>Es fácil y rápido. Te guiamos paso a paso.</p>
            <button
              type="button"
              className="sidebar__library-button"
              onClick={() => setMostrarModalPlaylist(true)}
            >
              Crear playlist
            </button>
          </div>

          <div className="sidebar__library-card">
            <h3>Descubrí podcasts para seguir</h3>
            <p>Enterate de episodios nuevos apenas salgan.</p>
            <button
              type="button"
              className="sidebar__library-button"
              onClick={() => navigate("/podcasts")}
            >
              Explorar podcasts
            </button>
          </div>
        </div>
      ) : (
        <div className="sidebar__section sidebar__library">
          <div className="sidebar__library-header">
            <p className="sidebar__section-title sidebar__section-title--library">
              Tu biblioteca
            </p>

            <button
              type="button"
              className="sidebar__library-add"
              aria-label="Crear playlist"
              onClick={() => navigate("/playlist")}
            >
              <Plus size={18} />
            </button>
          </div>

          <div className="sidebar__library-list">
            {playlistsDelUsuario.map((playlist) => {
              const esMeGusta = isMeGustaPlaylist(playlist);
              const portada = getPortadaPlaylist(playlist);
              const estaActiva = location.pathname === `/playlist/${playlist.id}`;

              return (
                <button
                  key={playlist.id}
                  type="button"
                  className={`sidebar__library-item ${
                    estaActiva ? "sidebar__library-item--active" : ""
                  }`}
                  onClick={() => navigate(`/playlist/${playlist.id}`)}
                >
                  {esMeGusta ? (
                    <span
                      className="sidebar__library-item-cover sidebar__library-item-cover--liked"
                      aria-hidden="true"
                    >
                      <Heart size={20} fill="currentColor" />
                    </span>
                  ) : (
                    <img
                      src={portada}
                      alt={playlist.nombre}
                      className="sidebar__library-item-cover"
                    />
                  )}

                  <span className="sidebar__library-item-info">
                    <strong>{playlist.nombre}</strong>
                    <small>Playlist · {nombreUsuario}</small>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      <div className="sidebar__bottom">
        {usuarioActual && (
          <button
            type="button"
            className="sidebar__logout-button"
            onClick={logout}
          >
            <LogOut size={18} />
            <span>Cerrar sesión</span>
          </button>
        )}
      </div>

      <GuestAuthModal
        abierto={mostrarModalPlaylist}
        onCerrar={() => setMostrarModalPlaylist(false)}
        anchorRef={playlistCardRef}
      />
    </aside>
  );
};

export default Sidebar;
