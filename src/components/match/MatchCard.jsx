import { Link } from 'react-router-dom';
import './MatchCard.css';

function MatchCard({ match }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Date non définie';
    const date = new Date(dateString);
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const formatTime = (time) => {
    return time || 'Non défini';
  };

  const isFinished = () => {
    if (match.status === 'finished') return true;
    
    if (!match.date || !match.time) return false;
    const matchDateTime = new Date(`${match.date}T${match.time}`);
    return matchDateTime < new Date();
  };

  const finished = isFinished();

  return (
    <Link to={`/match/${match.id}`} className="match-card-link">
      <div className={`match-card ${finished ? 'match-card-past' : ''}`}>
        <div className={`match-card-indicator ${finished ? 'match-card-indicator-past' : 'match-card-indicator-upcoming'}`}>
          {finished ? '⏰ Terminé' : '📅 À venir'}
        </div>

        <div className="match-card-date">
          {formatDate(match.date)}
        </div>

        <div className="match-card-time">
          {formatTime(match.time)}
        </div>

        <div className="match-card-location">
          <span>{match.location || 'Lieu non défini'}</span>
        </div>

        <div className="match-card-players">
          <span>{match.playersCount || 0} / 10 joueurs</span>
        </div>

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