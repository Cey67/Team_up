import './PlayerStatsCard.css';

function PlayerStatsCard({ player }) {
  const { name, photo, position, matchesPlayed = 0, goals = 0, assists = 0 } = player;

  return (
    <div className="player-stats-card">
      <div className="player-stats-header">
        {photo ? (
          <img src={photo} alt={name} className="player-stats-photo" />
        ) : (
          <div className="player-stats-photo-placeholder">
            <span>{name.charAt(0).toUpperCase()}</span>
          </div>
        )}
        <div className="player-stats-name-container">
          <h3 className="player-stats-name">{name}</h3>
          {position && (
            <p className="player-stats-position">{position}</p>
          )}
        </div>
      </div>
      
      <div className="player-stats-content">
        <div className="player-stat-item">
          <span className="player-stat-label">Matchs joués</span>
          <span className="player-stat-value">{matchesPlayed}</span>
        </div>
        
        <div className="player-stat-item">
          <span className="player-stat-label">Buts marqués</span>
          <span className="player-stat-value player-stat-goals">{goals}</span>
        </div>
        
        <div className="player-stat-item">
          <span className="player-stat-label">Passes décisives</span>
          <span className="player-stat-value player-stat-assists">{assists}</span>
        </div>
      </div>
    </div>
  );
}

export default PlayerStatsCard;

