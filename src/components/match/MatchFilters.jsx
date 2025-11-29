import { useState } from 'react';
import './MatchFilters.css';
import selectionListeIcon from '../../assets/selection-liste.png';

/**
 * Composant MatchFilters - Permet de filtrer les matchs
 * Expose des callbacks pour modifier l'état dans la page parente
 * 
 * @param {Object} filters - État actuel des filtres
 * @param {Function} onFilterChange - Callback appelé lors du changement de filtre (newFilters)
 */
function MatchFilters({ filters = {}, onFilterChange }) {
  const [localFilters, setLocalFilters] = useState({
    date: filters.date || '',
    location: filters.location || '',
    type: filters.type || '',
    status: filters.status || '',
  });

  /**
   * Gère le changement d'un filtre
   * @param {string} filterName - Nom du filtre modifié
   * @param {string} value - Nouvelle valeur du filtre
   */
  const handleFilterChange = (filterName, value) => {
    const newFilters = {
      ...localFilters,
      [filterName]: value,
    };
    setLocalFilters(newFilters);
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };

  /**
   * Réinitialise tous les filtres
   */
  const handleReset = () => {
    const emptyFilters = {
      date: '',
      location: '',
      type: '',
      status: '',
    };
    setLocalFilters(emptyFilters);
    if (onFilterChange) {
      onFilterChange(emptyFilters);
    }
  };

  const hasActiveFilters = Object.values(localFilters).some(value => value !== '');

  return (
    <div className="match-filters">
      <div className="match-filters-header">
        <h3 className="match-filters-title">Filtres</h3>
        {hasActiveFilters && (
          <button 
            className="match-filters-reset"
            onClick={handleReset}
            title="Réinitialiser les filtres"
          >
            Réinitialiser
          </button>
        )}
      </div>

      <div className="match-filters-content">
        {/* Filtre par date */}
        <div className="match-filter-group">
          <label htmlFor="filter-date" className="match-filter-label">
            Date
          </label>
          <input
            id="filter-date"
            type="date"
            className="match-filter-input"
            value={localFilters.date}
            onChange={(e) => handleFilterChange('date', e.target.value)}
          />
        </div>

        {/* Filtre par lieu */}
        <div className="match-filter-group">
          <label htmlFor="filter-location" className="match-filter-label">
            Lieu
          </label>
          <div className="match-filter-select-wrapper">
            <select
              id="filter-location"
              className="match-filter-select"
              value={localFilters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            >
              <option value="">Tous les lieux</option>
              <option value="KG5">KG5</option>
              <option value="Urban Soccer">Urban Soccer</option>
            </select>
            <img src={selectionListeIcon} alt="Lieu" className="match-filter-select-icon" />
          </div>
        </div>

        {/* Filtre par statut */}
        <div className="match-filter-group">
          <label htmlFor="filter-status" className="match-filter-label">
            Statut
          </label>
          <div className="match-filter-select-wrapper">
            <select
              id="filter-status"
              className="match-filter-select"
              value={localFilters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Tous les statuts</option>
              <option value="upcoming">À venir</option>
              <option value="finished">Terminés</option>
            </select>
            <img src={selectionListeIcon} alt="Statut" className="match-filter-select-icon" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default MatchFilters;
