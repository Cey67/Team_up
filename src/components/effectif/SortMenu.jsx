import { useState, useRef, useEffect } from 'react';
import './SortMenu.css';

/**
 * Composant menu déroulant pour trier les joueurs
 * Permet de choisir le critère de tri et l'ordre (croissant/décroissant)
 * 
 * @param {boolean} isOpen - État d'ouverture du menu
 * @param {function} onClose - Callback appelé pour fermer le menu
 * @param {object} currentSort - Tri actuellement appliqué { field: string, order: 'asc' | 'desc' }
 * @param {function} onApplySort - Callback appelé avec le nouveau tri
 */
function SortMenu({ isOpen, onClose, currentSort = { field: null, order: 'asc' }, onApplySort }) {
  const [sort, setSort] = useState({
    field: currentSort.field || 'lastName',
    order: currentSort.order || 'asc'
  });
  const menuRef = useRef(null);

  // Met à jour le tri local quand currentSort change
  useEffect(() => {
    setSort({
      field: currentSort.field || 'lastName',
      order: currentSort.order || 'asc'
    });
  }, [currentSort]);

  // Ferme le menu si on clique en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target) && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);

  /**
   * Options de tri disponibles
   */
  const sortOptions = [
    { value: 'lastName', label: 'Nom' },
    { value: 'firstName', label: 'Prénom' },
    { value: 'position', label: 'Postes' },
    { value: 'id', label: 'Numéro' }
  ];

  /**
   * Gère le changement de critère de tri
   */
  const handleFieldChange = (field) => {
    setSort(prev => ({ ...prev, field }));
  };

  /**
   * Gère le changement d'ordre de tri
   */
  const handleOrderToggle = () => {
    setSort(prev => ({
      ...prev,
      order: prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  /**
   * Applique le tri
   */
  const handleApply = () => {
    if (onApplySort) {
      onApplySort(sort);
    }
    if (onClose) {
      onClose();
    }
  };

  /**
   * Réinitialise le tri
   */
  const handleReset = () => {
    const resetSort = { field: 'lastName', order: 'asc' };
    setSort(resetSort);
    if (onApplySort) {
      onApplySort(resetSort);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="sort-menu-overlay" onClick={onClose}>
      <div className="sort-menu-content" ref={menuRef} onClick={(e) => e.stopPropagation()}>
        <div className="sort-menu-header">
          <h3 className="sort-menu-title">Trier les joueurs</h3>
          <button
            className="sort-menu-close"
            onClick={onClose}
            aria-label="Fermer le menu de tri"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 5L15 15M15 5L5 15"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="sort-menu-body">
          {/* Sélection du critère de tri */}
          <div className="sort-group">
            <label className="sort-label">Trier par</label>
            <div className="sort-options">
              {sortOptions.map((option) => (
                <label key={option.value} className="sort-option">
                  <input
                    type="radio"
                    name="sortField"
                    value={option.value}
                    checked={sort.field === option.value}
                    onChange={(e) => handleFieldChange(e.target.value)}
                  />
                  <span>{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Sélection de l'ordre */}
          <div className="sort-group">
            <label className="sort-label">Ordre</label>
            <div className="sort-order-controls">
              <button
                type="button"
                className={`sort-order-btn ${sort.order === 'asc' ? 'active' : ''}`}
                onClick={handleOrderToggle}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 12L10 7L15 12"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Croissant (A-Z)</span>
              </button>
              <button
                type="button"
                className={`sort-order-btn ${sort.order === 'desc' ? 'active' : ''}`}
                onClick={handleOrderToggle}
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 8L10 13L15 8"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Décroissant (Z-A)</span>
              </button>
            </div>
          </div>
        </div>

        <div className="sort-menu-footer">
          <button
            type="button"
            className="sort-btn sort-btn-reset"
            onClick={handleReset}
          >
            Réinitialiser
          </button>
          <button
            type="button"
            className="sort-btn sort-btn-apply"
            onClick={handleApply}
          >
            Appliquer
          </button>
        </div>
      </div>
    </div>
  );
}

export default SortMenu;

