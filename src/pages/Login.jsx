import loginBg from "../assets/img/login-bg.png";
import "./login.css";
import { Link } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import { FaFacebookF, FaXTwitter, FaRegCircleUser } from "react-icons/fa6";
import Swal from "sweetalert2";

function Login() {

const mostrarProveedor = (proveedor) => {
  Swal.fire({
    title: "Próximamente",
    text: `El inicio de sesión con ${proveedor} estará disponible en una próxima versión de NiB Music.`,
    icon: "info",
    iconColor: "#d4af37",
    background: "#0f0f0f",
    color: "#ffffff",
    confirmButtonText: "Entendido",
    confirmButtonColor: "#d4af37",
  });
};

const mostrarPerfil = () => {
  Swal.fire({
    title: "Mi cuenta",
    text: "Iniciá sesión para acceder a tu perfil y administrar tu biblioteca.",
    icon: "info",
    iconColor: "#d4af37",
    background: "#0f0f0f",
    color: "#ffffff",
    confirmButtonText: "Entendido",
    confirmButtonColor: "#d4af37",
  });
};

const manejarLogin = (e) => {
  e.preventDefault();
};
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

<button
  className="login-user"
  onClick={mostrarPerfil}
>
  <FaRegCircleUser size={20} />
</button>
</nav>

        {/* Modal */}
<div className="login-card">
  <h2>Iniciar sesión</h2>

  <p className="login-subtitle">
    Ingresá a tu cuenta para seguir disfrutando de tu música.
  </p>

<form className="login-form" onSubmit={manejarLogin}>

    <label>Correo electrónico</label>
<input
  type="email"
  placeholder="ejemplo@email.com"
  required
  maxLength={50}
/>

    <label>Contraseña</label>
<input
  type="password"
  placeholder="********"
  required
  minLength={8}
  maxLength={20}
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

<button
  type="button"
  className="social-button"
  onClick={() => mostrarProveedor("Google")}
>
  <FcGoogle size={22} />
  Continuar con Google
</button>

<button
  type="button"
  className="social-button"
  onClick={() => mostrarProveedor("Facebook")}
>
  <FaFacebookF size={20} color="#1877F2" />
  Continuar con Facebook
</button>

<button
  type="button"
  className="social-button"
  onClick={() => mostrarProveedor("X")}
>
  <FaXTwitter size={20} />
  Continuar con X
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