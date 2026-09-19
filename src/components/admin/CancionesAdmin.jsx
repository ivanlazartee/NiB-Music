import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Pencil, Plus, Search, X } from "lucide-react";

import { getItem, setItem, KEYS } from "../../utils/localStorage";
import "./CancionesAdmin.css";

const formularioInicial = {
  nombre: "",
  artista: "",
  album: "",
  genero: "",
  anio: "",
  imagen: "",
  archivo: "",
};

function CancionesAdmin() {
  const [canciones, setCanciones] = useState(
    () => getItem(KEYS.canciones) || []
  );

  const [busqueda, setBusqueda] = useState("");
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [cancionEditando, setCancionEditando] = useState(null);
  const [formulario, setFormulario] = useState(formularioInicial);
  const [cancionAConfirmar, setCancionAConfirmar] = useState(null);

  const guardarCanciones = (nuevasCanciones) => {
    setCanciones(nuevasCanciones);
    setItem(KEYS.canciones, nuevasCanciones);
  };

  const cancionesFiltradas = canciones.filter((cancion) => {
    const texto = `${cancion.nombre} ${cancion.artista} ${cancion.album}`
      .toLowerCase();

    return texto.includes(busqueda.toLowerCase().trim());
  });

  const abrirFormularioNuevo = () => {
    setCancionEditando(null);
    setFormulario({ ...formularioInicial });
    setMostrarFormulario(true);
  };

  const abrirFormularioEditar = (cancion) => {
    setCancionEditando(cancion.id);

    setFormulario({
      nombre: cancion.nombre,
      artista: cancion.artista,
      album: cancion.album,
      genero: cancion.genero,
      anio: String(cancion.anio),
      imagen: cancion.imagen,
      archivo: cancion.archivo,
    });

    setMostrarFormulario(true);
  };

  const cerrarFormulario = () => {
    setMostrarFormulario(false);
    setCancionEditando(null);
    setFormulario({ ...formularioInicial });
  };

  const actualizarCampo = (event) => {
    const { name, value } = event.target;

    setFormulario((anterior) => ({
      ...anterior,
      [name]: value,
    }));
  };

  const guardarFormulario = (event) => {
    event.preventDefault();

    const datos = {
      nombre: formulario.nombre.trim(),
      artista: formulario.artista.trim(),
      album: formulario.album.trim(),
      genero: formulario.genero.trim(),
      anio: Number(formulario.anio),
      imagen: formulario.imagen.trim(),
      archivo: formulario.archivo.trim(),
    };

    if (cancionEditando !== null) {
      const cancionesActualizadas = canciones.map((cancion) =>
        cancion.id === cancionEditando
          ? { ...cancion, ...datos }
          : cancion
      );

      guardarCanciones(cancionesActualizadas);
    } else {
      const nuevaCancion = {
        id: uuidv4(),
        ...datos,
        activo: true,
      };

      guardarCanciones([...canciones, nuevaCancion]);
    }

    cerrarFormulario();
  };

  const cambiarEstadoCancion = () => {
    if (!cancionAConfirmar) return;

    const cancionesActualizadas = canciones.map((cancion) =>
      cancion.id === cancionAConfirmar.id
        ? { ...cancion, activo: !cancion.activo }
        : cancion
    );

    guardarCanciones(cancionesActualizadas);
    setCancionAConfirmar(null);
  };

  return (
    <section className="canciones-admin">
      <div className="canciones-admin__header">
        <div>
          <h2>Administración de canciones</h2>
          <p>
            Agregá, editá y administrá las canciones de NiB Music.
          </p>
        </div>

        <button
          type="button"
          className="canciones-admin__primary"
          onClick={abrirFormularioNuevo}
        >
          <Plus size={18} />
          Agregar canción
        </button>
      </div>

      <div className="canciones-admin__toolbar">
        <label className="canciones-admin__search">
          <Search size={18} />

          <input
            type="search"
            placeholder="Buscar por canción, artista o álbum..."
            value={busqueda}
            onChange={(event) => setBusqueda(event.target.value)}
          />
        </label>

        <span>
          {canciones.length} canciones ·{" "}
          {canciones.filter((cancion) => cancion.activo).length} activas
        </span>
      </div>

      <div className="canciones-admin__table-wrapper">
        <table className="canciones-admin__table">
          <thead>
            <tr>
              <th>Canción</th>
              <th>Álbum</th>
              <th>Género</th>
              <th>Año</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>

          <tbody>
            {cancionesFiltradas.map((cancion) => (
              <tr key={cancion.id}>
                <td>
                  <div className="canciones-admin__song">
                    <img
                      src={cancion.imagen}
                      alt=""
                      onError={(event) => {
                        event.currentTarget.style.visibility = "hidden";
                      }}
                    />

                    <div>
                      <strong>{cancion.nombre}</strong>
                      <span>{cancion.artista}</span>
                    </div>
                  </div>
                </td>

                <td>{cancion.album}</td>
                <td>{cancion.genero}</td>
                <td>{cancion.anio}</td>

                <td>
                  <span
                    className={
                      cancion.activo
                        ? "canciones-admin__status canciones-admin__status--active"
                        : "canciones-admin__status canciones-admin__status--inactive"
                    }
                  >
                    {cancion.activo ? "Activa" : "Inactiva"}
                  </span>
                </td>

                <td>
                  <div className="canciones-admin__actions">
                    <button
                      type="button"
                      onClick={() => abrirFormularioEditar(cancion)}
                      aria-label={`Editar ${cancion.nombre}`}
                    >
                      <Pencil size={16} />
                      Editar
                    </button>

                    <button
                      type="button"
                      className={
                        cancion.activo
                          ? "canciones-admin__deactivate"
                          : "canciones-admin__activate"
                      }
                      onClick={() => setCancionAConfirmar(cancion)}
                    >
                      {cancion.activo ? "Desactivar" : "Activar"}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {cancionesFiltradas.length === 0 && (
          <p className="canciones-admin__empty">
            No encontramos canciones con esa búsqueda.
          </p>
        )}
      </div>

      {mostrarFormulario && (
        <div className="canciones-admin__overlay">
          <div
            className="canciones-admin__modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="canciones-admin-form-title"
          >
            <div className="canciones-admin__modal-header">
              <h3 id="canciones-admin-form-title">
                {cancionEditando !== null
                  ? "Editar canción"
                  : "Agregar canción"}
              </h3>

              <button
                type="button"
                onClick={cerrarFormulario}
                aria-label="Cerrar formulario"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={guardarFormulario}>
              <div className="canciones-admin__form-grid">
                <label>
                  Nombre
                  <input
                    name="nombre"
                    value={formulario.nombre}
                    onChange={actualizarCampo}
                    required
                  />
                </label>

                <label>
                  Artista
                  <input
                    name="artista"
                    value={formulario.artista}
                    onChange={actualizarCampo}
                    required
                  />
                </label>

                <label>
                  Álbum
                  <input
                    name="album"
                    value={formulario.album}
                    onChange={actualizarCampo}
                    required
                  />
                </label>

                <label>
                  Género
                  <input
                    name="genero"
                    value={formulario.genero}
                    onChange={actualizarCampo}
                    required
                  />
                </label>

                <label>
                  Año
                  <input
                    type="number"
                    name="anio"
                    min="1900"
                    max="2100"
                    value={formulario.anio}
                    onChange={actualizarCampo}
                    required
                  />
                </label>

                <label>
                  URL de la portada
                  <input
                    type="url"
                    name="imagen"
                    value={formulario.imagen}
                    onChange={actualizarCampo}
                    required
                  />
                </label>

                <label className="canciones-admin__full-width">
                  URL del archivo de audio
                  <input
                    type="url"
                    name="archivo"
                    value={formulario.archivo}
                    onChange={actualizarCampo}
                    required
                  />
                </label>
              </div>

              <div className="canciones-admin__modal-actions">
                <button
                  type="button"
                  className="canciones-admin__secondary"
                  onClick={cerrarFormulario}
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  className="canciones-admin__primary"
                >
                  {cancionEditando !== null
                    ? "Guardar cambios"
                    : "Agregar canción"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {cancionAConfirmar && (
        <div className="canciones-admin__overlay">
          <div
            className="canciones-admin__modal canciones-admin__modal--confirm"
            role="dialog"
            aria-modal="true"
            aria-labelledby="canciones-admin-confirm-title"
          >
            <h3 id="canciones-admin-confirm-title">
              {cancionAConfirmar.activo
                ? "¿Desactivar canción?"
                : "¿Activar canción?"}
            </h3>

            <p>
              {cancionAConfirmar.activo
                ? `"${cancionAConfirmar.nombre}" dejará de aparecer en el catálogo público.`
                : `"${cancionAConfirmar.nombre}" volverá a aparecer en el catálogo público.`}
            </p>

            <div className="canciones-admin__modal-actions">
              <button
                type="button"
                className="canciones-admin__secondary"
                onClick={() => setCancionAConfirmar(null)}
              >
                Cancelar
              </button>

              <button
                type="button"
                className="canciones-admin__primary"
                onClick={cambiarEstadoCancion}
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default CancionesAdmin;