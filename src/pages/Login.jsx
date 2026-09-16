import loginBg from "../assets/img/login-bg.png";
import "./login.css";
import { Link } from "react-router-dom";

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