import { Search } from "lucide-react";

import "../styles/GuestSearchPanel.css";

const GuestSearchPanel = ({ onBuscar }) => {
  return (
    <aside className="guest-search-panel">
      <div className="guest-search-panel__content">
        <h2 className="guest-search-panel__title">
          Buscar algo para escuchar
        </h2>

        <button
          type="button"
          className="guest-search-panel__button"
          onClick={onBuscar}
        >
          <Search size={18} />
          Buscar
        </button>
      </div>
    </aside>
  );
};

export default GuestSearchPanel;
