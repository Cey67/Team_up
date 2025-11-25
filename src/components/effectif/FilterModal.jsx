import { useState, useEffect } from 'react';
import './FilterModal.css';

/**
 * Composant modal pour filtrer les joueurs
 * Permet de filtrer par rôle, statut admin, et autres critères
 * 
 * @param {boolean} isOpen - État d'ouverture du modal
 * @param {function} onClose - Callback appelé pour fermer le modal
 * @param {object} currentFilters - Filtres actuellement appliqués
 * @param {function} onApplyFilters - Callback appelé avec les nouveaux filtres
 */
function FilterModal({ isOpen, onClose, currentFilters = {}, onApplyFilters }) {
  const [filters, setFilters] = useState({
    role: currentFilters.role || 'all',
    ...currentFilters
  });

  // Met à jour les filtres locaux quand currentFilters change
  useEffect(() => {
    setFilters({
      role: currentFilters.role || 'all',
      ...currentFilters
    });
  }, [currentFilters]);

  /**
   * Gère le changement d'un filtre
   */
  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: value
    }));
  };

  /**
   * Applique les filtres et ferme le modal
   */
  const handleApply = () => {
    if (onApplyFilters) {
      onApplyFilters(filters);
    }
    if (onClose) {
      onClose();
    }
  };

  /**
   * Réinitialise tous les filtres
   */
  const handleReset = () => {
    const resetFilters = {
      role: 'all'
    };
    setFilters(resetFilters);
    if (onApplyFilters) {
      onApplyFilters(resetFilters);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="filter-modal-overlay" onClick={onClose}>
      <div className="filter-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="filter-modal-header">
          <h2 className="filter-modal-title">Filtrer les joueurs</h2>
          <button
            className="filter-modal-close"
            onClick={onClose}
            aria-label="Fermer le modal de filtres"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="filter-modal-body">
          {/* Filtre par rôle */}
          <div className="filter-group">
            <label className="filter-label">Rôle</label>
            <div className="filter-options">
              <label className="filter-option">
                <input
                  type="radio"
                  name="role"
                  value="all"
                  checked={filters.role === 'all'}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                />
                <span>Tous</span>
              </label>
              <label className="filter-option">
                <input
                  type="radio"
                  name="role"
                  value="Joueur"
                  checked={filters.role === 'Joueur'}
                  onChange={(e) => handleFilterChange('role', e.target.value)}
                />
                <span>Joueur</span>
              </label>
            </div>
          </div>
        </div>

        <div className="filter-modal-footer">
          <button
            type="button"
            className="filter-btn filter-btn-reset"
            onClick={handleReset}
          >
            Réinitialiser
          </button>
          <button
            type="button"
            className="filter-btn filter-btn-apply"
            onClick={handleApply}
          >
            Appliquer les filtres
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterModal;

