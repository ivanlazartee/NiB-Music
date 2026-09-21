import { Link } from "react-router-dom";
import { Headphones } from "lucide-react";

import "../styles/Podcasts.css";

const episodios = [
  {
    id: 1,
    titulo: "NiB Live: charla con productores",
    fecha: "14 sept",
    duracion: "42 min",
    color: "#2f6fed",
  },
  {
    id: 2,
    titulo: "Beat Talks: cómo arrancar un tema",
    fecha: "12 sept",
    duracion: "28 min",
    color: "#7c3aed",
  },
  {
    id: 3,
    titulo: "Historias detrás del hit",
    fecha: "10 sept",
    duracion: "51 min",
    color: "#0f766e",
  },
  {
    id: 4,
    titulo: "Playlist secrets de la semana",
    fecha: "8 sept",
    duracion: "33 min",
    color: "#b45309",
  },
];

const categorias = [
  { id: "ranking", titulo: "Ranking de podcasts", color: "#2563eb" },
  { id: "nuevos", titulo: "Nuevos podcasts", color: "#7c3aed" },
  { id: "musica", titulo: "Música y cultura", color: "#db2777" },
  { id: "tech", titulo: "Tech & beats", color: "#0891b2" },
];

function Podcasts() {
  return (
    <section className="podcasts">
      <header className="podcasts__header">
        <div>
          <span className="podcasts__eyebrow">Descubrí</span>
          <h1>Podcasts</h1>
          <p>Episodios nuevos y categorías para explorar en NiB Music.</p>
        </div>
      </header>

      <section className="podcasts__section">
        <div className="podcasts__section-header">
          <h2>Nuevos episodios</h2>
          <Link to="/podcasts/mostrar-todo" className="podcasts__more">
            Mostrar todo
          </Link>
        </div>

        <div className="podcasts__episodes">
          {episodios.map((episodio) => (
            <Link
              key={episodio.id}
              to={`/podcasts/episodio/${episodio.id}`}
              className="podcasts__episode"
            >
              <div
                className="podcasts__episode-cover"
                style={{ background: episodio.color }}
              >
                <Headphones size={34} />
              </div>

              <div className="podcasts__episode-meta">
                <span className="podcasts__dot" />
                <h3>{episodio.titulo}</h3>
                <p>
                  {episodio.fecha} · {episodio.duracion}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="podcasts__section">
        <div className="podcasts__section-header">
          <h2>Categorías</h2>
        </div>

        <div className="podcasts__categories">
          {categorias.map((categoria) => (
            <Link
              key={categoria.id}
              to={`/podcasts/categoria/${categoria.id}`}
              className="podcasts__category"
              style={{ background: categoria.color }}
            >
              {categoria.titulo}
            </Link>
          ))}
        </div>
      </section>
    </section>
  );
}

export default Podcasts;
