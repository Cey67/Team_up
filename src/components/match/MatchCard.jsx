import { Link } from 'react-router-dom';
import './MatchCard.css';

/**
 * Composant MatchCard - Affiche une carte individuelle de match simplifiée
 * Affiche seulement : date, heure, lieu, nombre de joueurs sur 10
 * 
 * @param {Object} match - Données du match (id, date, time, location, playersCount)
 */
function MatchCard({ match }) {
  /**
   * Formate la date au format français
   * @param {string} dateString - Date au format ISO (YYYY-MM-DD)
   * @returns {string} - Date formatée (ex: "15 décembre 2024")
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  /**
   * Formate l'heure au format HH:mm
   * @param {string} time - Heure au format HH:mm
   * @returns {string} - Heure formatée
   */
  const formatTime = (time) => {
    return time || 'Non défini';
  };

  /**
   * Vérifie si le match est terminé (passé)
   * @returns {boolean} - True si le match est terminé
   */
  const isFinished = () => {
    // Utilise le statut si disponible
    if (match.status === 'finished') return true;
    
    // Sinon vérifie la date
    if (!match.date || !match.time) return false;
    const matchDateTime = new Date(`${match.date}T${match.time}`);
    return matchDateTime < new Date();
  };

  const finished = isFinished();

  return (
    <Link to={`/match/${match.id}`} className="match-card-link">
      <div className={`match-card ${finished ? 'match-card-past' : ''}`}>
        {/* Indicateur terminé/à venir */}
        <div className={`match-card-indicator ${finished ? 'match-card-indicator-past' : 'match-card-indicator-upcoming'}`}>
          {finished ? '⏰ Terminé' : '📅 À venir'}
        </div>

        {/* Date */}
        <div className="match-card-date">
          {formatDate(match.date)}
        </div>

        {/* Heure */}
        <div className="match-card-time">
          {formatTime(match.time)}
        </div>

        {/* Lieu */}
        <div className="match-card-location">
          <span>{match.location || 'Lieu non défini'}</span>
        </div>

        {/* Nombre de joueurs sur 10 */}
        <div className="match-card-players">
          <span>{match.playersCount || 0} / 10 joueurs</span>
        </div>

        {/* Bouton voir le match */}
        <div className="match-card-footer">
          <button className="match-card-button">
            Voir le match
          </button>
        </div>
      </div>
    </Link>
  );
}

export default MatchCard;