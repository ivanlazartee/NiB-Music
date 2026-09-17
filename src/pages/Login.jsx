import loginBg from "../assets/img/login-bg.png";
import "./login.css";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaSpotify, FaApple } from "react-icons/fa";

function Login() {
  return (
    <section className="login-page">

      <img
        src={loginBg}
        alt="NiB Music"
        className="login-bg"
      />

      <div className="login-overlay">

        {/* Navbar */}
<nav className="login-navbar">
  <Link to="/">Inicio</Link>

  <Link to="/catalogo">Explorar</Link>

  <Link to="/soporte">Soporte</Link>

  <button className="login-user">
    👤
  </button>
</nav>

        {/* Modal */}
<div className="login-card">
  <h2>Iniciar sesión</h2>

  <p className="login-subtitle">
    Ingresá a tu cuenta para seguir disfrutando de tu música.
  </p>

  <form className="login-form">

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

<Link to="/" className="forgot-password">
  ¿Olvidaste tu contraseña?
</Link>

<button type="submit" className="login-button">
  Ingresar
</button>

<div className="login-divider">
  <span>o continuá con</span>
</div>

<div className="social-login">

  <button type="button" className="social-button">
    <FcGoogle size={22} />
    Continuar con Google
  </button>

  <button type="button" className="social-button">
    <FaSpotify size={22} color="#1DB954" />
    Continuar con Spotify
  </button>

  <button type="button" className="social-button">
    <FaApple size={22} />
    Continuar con Apple Music
  </button>

</div>

<p className="register-text">
  ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
</p>

  </form>
</div>

      </div>

    </section>
  );
}

export default Login;