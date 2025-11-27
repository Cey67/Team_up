import './MatchCard.css';

/**
 * Composant MatchCard - Affiche les informations d'un match
 * Utilisé dans la page présences pour afficher les détails d'un match
 * 
 * @param {Object} match - Données du match (date, time, location, opponent)
 * @param {Function} onToggleExpand - Fonction appelée lors du clic pour développer/réduire
 * @param {boolean} isExpanded - Indique si la carte est développée
 */
function MatchCard({ match, onToggleExpand, isExpanded }) {
  /**
   * Formate la date au format français
   * @param {string} dateString - Date au format ISO (YYYY-MM-DD)
   * @returns {string} - Date formatée (ex: "15 décembre 2024")
   */
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  return (
    <div className={`match-card ${isExpanded ? 'match-card-expanded' : ''}`}>
      <div className="match-card-header" onClick={onToggleExpand}>
        <div className="match-card-info">
          <div className="match-card-date-time">
            <span className="match-card-date">{formatDate(match.date)}</span>
            <span className="match-card-time">{match.time}</span>
          </div>
          <div className="match-card-details">
            <h3 className="match-card-opponent">{match.opponent}</h3>
            <p className="match-card-location">{match.location}</p>
          </div>
        </div>
        <div className="match-card-arrow">
          <span className={`arrow-icon ${isExpanded ? 'arrow-icon-up' : 'arrow-icon-down'}`}>
            ▼
          </span>
        </div>
      </div>
    </div>
  );
}

export default MatchCard;

