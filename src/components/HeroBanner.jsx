import { Link } from "react-router-dom";

import heroNib from "../assets/img/hero-nib.png";

const HeroBanner = () => {
  return (
    <section className="hero-banner">
      <img
        src={heroNib}
        alt="NiB Music - La música te conecta"
        className="hero-banner__image"
      />

      <div className="hero-banner__actions">
        <Link
          to="/catalogo"
          className="hero-banner__primary-button"
        >
          Explorar catálogo
        </Link>

        <Link
          to="/ver-mas"
          className="hero-banner__secondary-button"
        >
          Ver más
        </Link>
      </div>
    </section>
  );
};

export default HeroBanner;