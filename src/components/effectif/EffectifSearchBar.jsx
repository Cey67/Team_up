import { useState } from 'react';
import './EffectifSearchBar.css';

/**
 * Composant de barre de recherche avec filtres et tri
 * Permet de rechercher, filtrer et trier les joueurs de l'effectif
 * 
 * @param {function} onSearch - Callback appelé lors de la recherche (reçoit la valeur de recherche)
 * @param {function} onFilter - Callback appelé lors du clic sur le bouton Filtrer
 * @param {function} onSort - Callback appelé lors du clic sur le bouton Trier
 */
function EffectifSearchBar({ onSearch, onFilter, onSort }) {
  const [searchValue, setSearchValue] = useState('');

  /**
   * Gère le changement de valeur dans le champ de recherche
   * Appelle le callback onSearch avec la nouvelle valeur
   */
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchValue(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  /**
   * Gère le clic sur le bouton Filtrer
   */
  const handleFilterClick = () => {
    if (onFilter) {
      onFilter();
    }
  };

  /**
   * Gère le clic sur le bouton Trier
   */
  const handleSortClick = () => {
    if (onSort) {
      onSort();
    }
  };

  return (
    <div className="effectif-search-bar">
      <div className="search-input-wrapper">
        <svg
          className="search-icon"
          width="20"
          height="20"
          viewBox="0 0 20 20"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9 17C13.4183 17 17 13.4183 17 9C17 4.58172 13.4183 1 9 1C4.58172 1 1 4.58172 1 9C1 13.4183 4.58172 17 9 17Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M19 19L14.65 14.65"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <input
          type="text"
          className="search-input"
          placeholder="Rechercher"
          value={searchValue}
          onChange={handleSearchChange}
          aria-label="Rechercher un joueur"
        />
      </div>
      <div className="search-actions">
        <button
          type="button"
          className="action-btn filter-btn"
          onClick={handleFilterClick}
          aria-label="Filtrer les joueurs"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M2 4H14M4 8H12M6 12H10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          Filtrer
        </button>
        <button
          type="button"
          className="action-btn sort-btn"
          onClick={handleSortClick}
          aria-label="Trier les joueurs"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4 6L8 2L12 6M4 10L8 14L12 10"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Trier
        </button>
      </div>
    </div>
  );
}

export default EffectifSearchBar;

