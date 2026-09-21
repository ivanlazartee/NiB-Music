import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import "../styles/GuestAuthModal.css";

const GuestAuthModal = ({
  abierto,
  onCerrar,
  anchorRef,
  titulo = "Crea una playlist",
  mensaje = "Iniciá sesión o registrate para crear y compartir playlists.",
}) => {
  const navigate = useNavigate();
  const [posicion, setPosicion] = useState({ top: 140, left: 260 });

  useEffect(() => {
    if (!abierto) return;

    const actualizarPosicion = () => {
      const ancla = anchorRef?.current;

      if (!ancla) return;

      const rect = ancla.getBoundingClientRect();

      setPosicion({
        top: Math.max(12, rect.top),
        left: rect.right + 12,
      });
    };

    actualizarPosicion();
    window.addEventListener("resize", actualizarPosicion);
    window.addEventListener("scroll", actualizarPosicion, true);

    return () => {
      window.removeEventListener("resize", actualizarPosicion);
      window.removeEventListener("scroll", actualizarPosicion, true);
    };
  }, [abierto, anchorRef]);

  if (!abierto) return null;

  const irARegistro = () => {
    onCerrar();
    navigate("/registro");
  };

  const irALogin = () => {
    onCerrar();
    navigate("/login");
  };

  return (
    <div
      className="guest-auth-modal__overlay"
      onClick={onCerrar}
    >
      <div
        className="guest-auth-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guest-auth-modal-title"
        style={{
          top: `${posicion.top}px`,
          left: `${posicion.left}px`,
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <span className="guest-auth-modal__arrow" aria-hidden="true" />

        <h2 id="guest-auth-modal-title">
          {titulo}
        </h2>

        <p>{mensaje}</p>

        <div className="guest-auth-modal__actions">
          <button
            type="button"
            className="guest-auth-modal__ghost"
            onClick={onCerrar}
          >
            Ahora no
          </button>

          <button
            type="button"
            className="guest-auth-modal__secondary"
            onClick={irARegistro}
          >
            Registrate
          </button>

          <button
            type="button"
            className="guest-auth-modal__primary"
            onClick={irALogin}
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
};

export default GuestAuthModal;
