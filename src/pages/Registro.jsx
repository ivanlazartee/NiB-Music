import registroBg from "../assets/img/registro-bg.png";
import "./registro.css";

import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaXTwitter } from "react-icons/fa6";

function Registro() {
  return (
    <section className="registro-page">
      <img
        src={registroBg}
        alt="Registro NiB Music"
        className="registro-bg"
      />

      <div className="registro-overlay">
        <div className="registro-card">

          <h2>Crear Cuenta</h2>

          <p className="registro-subtitle">
            Creá tu cuenta y empezá a disfrutar de toda la experiencia NiB Music.
          </p>

          <form className="registro-form">

            <label>Nombre</label>
            <input
              type="text"
              placeholder="Ingresá tu nombre"
            />

            <label>Apellido</label>
            <input
              type="text"
              placeholder="Ingresá tu apellido"
            />

            <label>Correo electrónico</label>
            <input
              type="email"
              placeholder="ejemplo@email.com"
            />

            <label>Contraseña</label>
            <input
              type="password"
              placeholder="********"
            />

            <label>Confirmar contraseña</label>
            <input
              type="password"
              placeholder="********"
            />

            <button type="submit" className="registro-btn">
              Crear cuenta
            </button>

          </form>

          <div className="registro-divider">
            <span>o continuá con</span>
          </div>

          <div className="registro-social-login">

            <button type="button" className="registro-social-btn">
              <FcGoogle />
              <span>Google</span>
            </button>

            <button type="button" className="registro-social-btn">
              <FaFacebookF />
              <span>Facebook</span>
            </button>

            <button type="button" className="registro-social-btn">
              <FaXTwitter />
              <span>X</span>
            </button>

          </div>

          <p className="registro-footer">
            ¿Ya tenés una cuenta?
            <a href="/login"> Iniciar sesión</a>
          </p>

        </div>
      </div>
    </section>
  );
}

export default Registro;