import { useState } from 'react';
import './ThemeToggle.css';

/**
 * Composant toggle pour changer le thème (Clair/Sombre)
 * Affiche deux boutons côte à côte avec un indicateur visuel de sélection
 * 
 * @param {string} currentTheme - Thème actuel ('clair' ou 'sombre')
 * @param {Function} onThemeChange - Callback appelé lors du changement de thème
 */
function ThemeToggle({ currentTheme = 'clair', onThemeChange }) {
  const [theme, setTheme] = useState(currentTheme);

  /**
   * Gère le changement de thème
   * @param {string} newTheme - Nouveau thème sélectionné
   */
  const handleThemeSelect = (newTheme) => {
    setTheme(newTheme);
    if (onThemeChange) {
      onThemeChange(newTheme);
    }
  };

  return (
    <div className="theme-toggle-container">
      <button
        type="button"
        className={`theme-toggle-btn ${theme === 'clair' ? 'theme-toggle-active' : ''}`}
        onClick={() => handleThemeSelect('clair')}
        aria-label="Thème clair"
      >
        Clair
      </button>
      
      <div className="theme-toggle-separator">
        <svg 
          width="16" 
          height="16" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2"
          className="theme-toggle-arrow"
        >
          <path d="M8 3 L16 12 L8 21" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M8 3 L16 12 L8 21" strokeLinecap="round" strokeLinejoin="round" transform="translate(8, 0)" />
        </svg>
      </div>

      <button
        type="button"
        className={`theme-toggle-btn ${theme === 'sombre' ? 'theme-toggle-active' : ''}`}
        onClick={() => handleThemeSelect('sombre')}
        aria-label="Thème sombre"
      >
        Sombre
      </button>
    </div>
  );
}

export default ThemeToggle;

