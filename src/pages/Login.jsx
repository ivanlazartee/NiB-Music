import loginBg from "../assets/img/login-bg.png";
import "./login.css";

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
        <a href="/">Inicio</a>
        <a href="/catalogo">Explorar</a>
        <a href="#">Soporte</a>

<button className="login-user">
  👤
</button>
        </nav>

        {/* Modal */}
        <div className="login-card">

        </div>

      </div>

    </section>
  );
}

export default Login;