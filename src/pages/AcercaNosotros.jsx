import { useState } from "react";
import { Code2, Palette, ShieldCheck, Music2 } from "lucide-react";

import "../styles/AcercaNosotros.css";

const integrantes = [
  {
    id: "ivan",
    nombre: "Iván",
    rol: "Tech Lead",
    responsabilidades: "Usuario Premium · Reproductor · Deploy",
    frase:
      "Conectando cada pieza del proyecto para que la música nunca deje de sonar.",
    imagen: "/equipo/ivan.png",
    iniciales: "I",
    Icono: Code2,
  },
  {
    id: "nico",
    nombre: "Nico",
    rol: "Desarrollador de autenticación",
    responsabilidades: "Autenticación · Administración de usuarios",
    frase:
      "Creando una experiencia segura y organizada para cada usuario de NiB Music.",
    imagen: "/equipo/nico.png",
    iniciales: "N",
    Icono: ShieldCheck,
  },
  {
    id: "fede",
    nombre: "Fede",
    rol: "Design Lead & Scrum Master",
    responsabilidades: "Diseño · Experiencia del visitante · CRUD de canciones",
    frase:
      "Transformando ideas en una experiencia visual donde cada canción encuentra su lugar.",
    imagen: "/equipo/fede.png",
    iniciales: "F",
    Icono: Palette,
  },
];

function TarjetaIntegrante({ integrante }) {
  const [errorImagen, setErrorImagen] = useState(false);

  const Icono = integrante.Icono;

  return (
    <article className="nosotros-card">
      <div className="nosotros-card__avatar">
        <span className="nosotros-card__iniciales">
          {integrante.iniciales}
        </span>

        {!errorImagen && (
          <img
            src={integrante.imagen}
            alt={`Fotografía de ${integrante.nombre}`}
            className="nosotros-card__foto"
            onError={() => setErrorImagen(true)}
          />
        )}
      </div>

      <div className="nosotros-card__contenido">
        <div className="nosotros-card__icono">
          <Icono size={22} />
        </div>

        <h2 className="nosotros-card__nombre">
          {integrante.nombre}
        </h2>

        <span className="nosotros-card__rol">
          {integrante.rol}
        </span>

        <p className="nosotros-card__responsabilidades">
          {integrante.responsabilidades}
        </p>

        <div className="nosotros-card__separador" />

        <p className="nosotros-card__frase">
          {integrante.frase}
        </p>
      </div>
    </article>
  );
}

function AcercaNosotros() {
  return (
    <div className="nosotros">
      <header className="nosotros__header">
        <div className="nosotros__etiqueta">
          <Music2 size={16} />
          <span>NiB Music</span>
        </div>

        <h1 className="nosotros__titulo">
          Detrás de cada canción,
          <br />
          <span>hay un equipo.</span>
        </h1>

        <p className="nosotros__descripcion">
          Somos un equipo de tres desarrolladores que unimos
          nuestras ideas, conocimientos y creatividad para
          construir NiB Music, una plataforma donde la tecnología
          y la música se encuentran.
        </p>
      </header>

      <section
        className="nosotros__equipo"
        aria-labelledby="nosotros-equipo-titulo"
      >
        <div className="nosotros__seccion-header">
          <div>
            <span className="nosotros__seccion-etiqueta">
              EL EQUIPO
            </span>

            <h2
              className="nosotros__seccion-titulo"
              id="nosotros-equipo-titulo"
            >
              Conocenos
            </h2>
          </div>

          <span className="nosotros__contador">
            03 integrantes
          </span>
        </div>

        <div className="nosotros__grid">
          {integrantes.map((integrante) => (
            <TarjetaIntegrante
              key={integrante.id}
              integrante={integrante}
            />
          ))}
        </div>
      </section>

      <footer className="nosotros__footer">
        <Music2 size={20} />

        <p>
          Tres personas. Una misma pasión por crear.
        </p>

        <span>NiB Music</span>
      </footer>
    </div>
  );
}

export default AcercaNosotros;