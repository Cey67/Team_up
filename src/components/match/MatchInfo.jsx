import './MatchInfo.css';
import locationIcon from '../../assets/location.png';

/**
 * Composant MatchInfo - Affiche les informations principales d'un match
 * Utilisé dans MatchDetail pour afficher les détails (date, heure, lieu, type, etc.)
 * 
 * @param {Object} match - Données du match
 */
function MatchInfo({ match }) {
  /**
   * Formate la date au format français
   * @param {string} dateString - Date au format ISO (YYYY-MM-DD)
   * @returns {string} - Date formatée (ex: "15 décembre 2024")
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  /**
   * Obtient la classe CSS pour le statut
   * @param {string} status - Statut du match
   * @returns {string} - Classe CSS
   */
  const getStatusClass = (status) => {
    switch (status) {
      case 'open':
        return 'match-info-status-open';
      case 'full':
        return 'match-info-status-full';
      case 'finished':
        return 'match-info-status-finished';
      case 'upcoming':
        return 'match-info-status-upcoming';
      default:
        return 'match-info-status-default';
    }
  };

  /**
   * Obtient le label du statut
   * @param {string} status - Statut du match
   * @returns {string} - Label en français
   */
  const getStatusLabel = (status) => {
    switch (status) {
      case 'open':
        return 'Ouvert';
      case 'full':
        return 'Complet';
      case 'finished':
        return 'Terminé';
      case 'upcoming':
        return 'À venir';
      default:
        return 'Inconnu';
    }
  };

  /**
   * Vérifie si le match est dans le passé
   * @returns {boolean} - True si le match est passé
   */
  const isPast = () => {
    if (!match.date || !match.time) return false;
    const matchDateTime = new Date(`${match.date}T${match.time}`);
    return matchDateTime < new Date();
  };

  if (!match) {
    return (
      <div className="match-info-empty">
        <p>Aucune information disponible.</p>
      </div>
    );
  }

  const past = isPast();

  return (
    <div className="match-info">
      <div className="match-info-header">
        <h2 className="match-info-title">
          {match.type || 'Match'} - Entre nous
        </h2>
        <div className={`match-info-status ${getStatusClass(match.status)}`}>
          {getStatusLabel(match.status)}
        </div>
      </div>

      <div className="match-info-content">
        <div className="match-info-item">
          <span className="match-info-icon">📅</span>
          <div className="match-info-details">
            <span className="match-info-label">Date</span>
            <span className="match-info-value">{formatDate(match.date)}</span>
          </div>
        </div>

        <div className="match-info-item">
          <span className="match-info-icon">🕐</span>
          <div className="match-info-details">
            <span className="match-info-label">Heure</span>
            <span className="match-info-value">{match.time || 'Non défini'}</span>
          </div>
        </div>

        <div className="match-info-item">
          <img src={locationIcon} alt="Lieu" className="match-info-icon match-info-icon-location" />
          <div className="match-info-details">
            <span className="match-info-label">Lieu</span>
            <span className="match-info-value">{match.location || 'Non défini'}</span>
          </div>
        </div>

        <div className="match-info-item">
          <span className="match-info-icon">⚽</span>
          <div className="match-info-details">
            <span className="match-info-label">Type</span>
            <span className="match-info-value">{match.type || '5v5'}</span>
          </div>
        </div>

        <div className="match-info-item">
          <span className="match-info-icon">👥</span>
          <div className="match-info-details">
            <span className="match-info-label">Joueurs inscrits</span>
            <span className="match-info-value">
              {match.playersCount || 0} / {match.maxPlayers || 10}
            </span>
          </div>
        </div>

        {/* Score pour les matchs passés */}
        {past && match.score && (
          <div className="match-info-item match-info-score">
            <span className="match-info-icon">⚽</span>
            <div className="match-info-details">
              <span className="match-info-label">Score</span>
              <span className="match-info-value match-info-score-value">
                {match.score.teamA || 0} - {match.score.teamB || 0}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchInfo;
