import SongCard from "../components/SongCard";
import { cancionesIniciales } from "../utils/seedData";

function Catalogo() {
  const cancionesActivas = cancionesIniciales.filter(
    (cancion) => cancion.activo
  );

  return (
    <section className="catalogo">
      <div className="catalogo__header">
        <div>
          <span className="catalogo__eyebrow">Tu música</span>

          <h1 className="catalogo__title">
            Catálogo
          </h1>

          <p className="catalogo__subtitle">
            Explorá canciones y descubrí nueva música.
          </p>
        </div>
      </div>

      <div className="catalogo__grid">
        {cancionesActivas.map((cancion) => (
          <SongCard
            key={cancion.id}
            cancion={cancion}
          />
        ))}
      </div>
    </section>
  );
}

export default Catalogo;