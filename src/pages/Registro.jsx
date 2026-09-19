import { useState } from "react";
import registroBg from "../assets/img/registro-bg.png";
import "./registro.css";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
import {
  FaFacebookF,
  FaXTwitter,
  FaEye,
  FaEyeSlash,
  FaRegCircleUser,
} from "react-icons/fa6";
import Swal from "sweetalert2";
import { useAuth } from "../context/AuthContext";

function Registro() {
  const navigate = useNavigate();
  const { registro } = useAuth();

  const [formulario, setFormulario] = useState({
    nombre: "",
    apellido: "",
    email: "",
    password: "",
    confirmarPassword: "",
  });

  const [errores, setErrores] = useState({});

  const [mostrarPassword, setMostrarPassword] = useState(false);

  const [mostrarConfirmarPassword, setMostrarConfirmarPassword] =
    useState(false);

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormulario({
      ...formulario,
      [name]: value,
    });

    setErrores({
      ...errores,
      [name]: "",
    });
  };

  const validarFormulario = () => {
    const nuevosErrores = {};

    if (!formulario.nombre.trim()) {
      nuevosErrores.nombre = "El nombre es obligatorio.";
    }

    if (!formulario.apellido.trim()) {
      nuevosErrores.apellido = "El apellido es obligatorio.";
    }

    if (!formulario.email.trim()) {
      nuevosErrores.email = "El correo electrónico es obligatorio.";
    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formulario.email)
    ) {
      nuevosErrores.email = "Ingresá un correo electrónico válido.";
    }

    if (!formulario.password) {
      nuevosErrores.password = "La contraseña es obligatoria.";
    } else if (formulario.password.length < 8) {
      nuevosErrores.password =
        "La contraseña debe tener al menos 8 caracteres.";
    }

    if (!formulario.confirmarPassword) {
      nuevosErrores.confirmarPassword =
        "Debés confirmar tu contraseña.";
    } else if (
      formulario.password !== formulario.confirmarPassword
    ) {
      nuevosErrores.confirmarPassword =
        "Las contraseñas no coinciden.";
    }

    return nuevosErrores;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nuevosErrores = validarFormulario();

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    setErrores({});

    const resultado = registro({
      nombre: `${formulario.nombre.trim()} ${formulario.apellido.trim()}`,
      email: formulario.email.trim(),
      password: formulario.password,
    });

    if (!resultado.success) {
      setErrores({
        email: resultado.message,
      });

      return;
    }

    Swal.fire({
      title: "¡Cuenta creada!",
      text: "Tu cuenta fue creada correctamente.",
      icon: "success",
      iconColor: "#d4af37",
      confirmButtonText: "Iniciar sesión",
      confirmButtonColor: "#d4af37",
      background: "#0f0f0f",
      color: "#ffffff",
    }).then(() => {
      navigate("/login");
    });
  };

  return (
    <section className="registro-page">
      <img
        src={registroBg}
        alt="Registro NiB Music"
        className="registro-bg"
      />

      <div className="registro-overlay">
        {/* Navbar */}
        <nav className="registro-navbar">
          <Link to="/">Inicio</Link>
          <Link to="/catalogo">Explorar</Link>
          <Link to="/soporte">Soporte</Link>

          <button
            className="registro-user"
            onClick={mostrarPerfil}
          >
            <FaRegCircleUser size={20} />
          </button>
        </nav>

        {/* Modal */}
        <div className="registro-card">
          <h2>Crear Cuenta</h2>

          <p className="registro-subtitle">
            Creá tu cuenta y empezá a disfrutar de toda la experiencia
            NiB Music.
          </p>

          <form
            className="registro-form"
            onSubmit={handleSubmit}
          >
            <label htmlFor="nombre">Nombre</label>

            <input
              id="nombre"
              name="nombre"
              type="text"
              placeholder="Ingresá tu nombre"
              value={formulario.nombre}
              onChange={handleChange}
              className={
                errores.nombre ? "registro-input-error" : ""
              }
            />

            {errores.nombre && (
              <span className="registro-error">
                {errores.nombre}
              </span>
            )}

            <label htmlFor="apellido">Apellido</label>

            <input
              id="apellido"
              name="apellido"
              type="text"
              placeholder="Ingresá tu apellido"
              value={formulario.apellido}
              onChange={handleChange}
              className={
                errores.apellido ? "registro-input-error" : ""
              }
            />

            {errores.apellido && (
              <span className="registro-error">
                {errores.apellido}
              </span>
            )}

            <label htmlFor="email">Correo electrónico</label>

            <input
              id="email"
              name="email"
              type="email"
              placeholder="ejemplo@email.com"
              value={formulario.email}
              onChange={handleChange}
              className={
                errores.email ? "registro-input-error" : ""
              }
            />

            {errores.email && (
              <span className="registro-error">
                {errores.email}
              </span>
            )}

            <label htmlFor="password">Contraseña</label>

            <div className="registro-password-container">
              <input
                id="password"
                name="password"
                type={mostrarPassword ? "text" : "password"}
                placeholder="********"
                value={formulario.password}
                onChange={handleChange}
                className={
                  errores.password
                    ? "registro-input-error"
                    : ""
                }
              />

              <button
                type="button"
                className="registro-password-toggle"
                onClick={() =>
                  setMostrarPassword(!mostrarPassword)
                }
                aria-label={
                  mostrarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>

            {errores.password && (
              <span className="registro-error">
                {errores.password}
              </span>
            )}

            <label htmlFor="confirmarPassword">
              Confirmar contraseña
            </label>

            <div className="registro-password-container">
              <input
                id="confirmarPassword"
                name="confirmarPassword"
                type={
                  mostrarConfirmarPassword
                    ? "text"
                    : "password"
                }
                placeholder="********"
                value={formulario.confirmarPassword}
                onChange={handleChange}
                className={
                  errores.confirmarPassword
                    ? "registro-input-error"
                    : ""
                }
              />

              <button
                type="button"
                className="registro-password-toggle"
                onClick={() =>
                  setMostrarConfirmarPassword(
                    !mostrarConfirmarPassword
                  )
                }
                aria-label={
                  mostrarConfirmarPassword
                    ? "Ocultar contraseña"
                    : "Mostrar contraseña"
                }
              >
                {mostrarConfirmarPassword ? (
                  <FaEyeSlash />
                ) : (
                  <FaEye />
                )}
              </button>
            </div>

            {errores.confirmarPassword && (
              <span className="registro-error">
                {errores.confirmarPassword}
              </span>
            )}

            <button
              type="submit"
              className="registro-btn"
            >
              Crear cuenta
            </button>
          </form>

          <div className="registro-divider">
            <span>o continuá con</span>
          </div>

          <div className="registro-social-login">
            <button
              type="button"
              className="registro-social-btn"
            >
              <FcGoogle />
              <span>Google</span>
            </button>

            <button
              type="button"
              className="registro-social-btn"
            >
              <FaFacebookF />
              <span>Facebook</span>
            </button>

            <button
              type="button"
              className="registro-social-btn"
            >
              <FaXTwitter />
              <span>X</span>
            </button>
          </div>

          <p className="registro-footer">
            ¿Ya tenés una cuenta?
            <Link to="/login"> Iniciar sesión</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Registro;