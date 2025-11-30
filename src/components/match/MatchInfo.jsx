import './MatchInfo.css';

function MatchInfo({ match }) {
  const formatDate = (dateString) => {
    if (!dateString) return 'Non défini';
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

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
          <span className="match-info-icon">📍</span>
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
