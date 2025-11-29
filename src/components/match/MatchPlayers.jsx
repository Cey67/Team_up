import './MatchPlayers.css';

/**
 * Composant MatchPlayers - Liste des joueurs inscrits au match
 * Affiche les avatars, noms, positions et badges de présence
 * 
 * @param {Array} players - Liste des joueurs inscrits au match
 * @param {boolean} canEdit - Indique si l'utilisateur peut modifier (si admin)
 */
function MatchPlayers({ players = [], canEdit = false }) {
  if (players.length === 0) {
    return (
      <div className="match-players-empty">
        <p>Aucun joueur inscrit pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="match-players">
      <h3 className="match-players-title">Joueurs inscrits ({players.length})</h3>
      
      <div className="match-players-list">
        {players.map((player) => (
          <div key={player.id} className="match-player-item">
            <div className="match-player-avatar">
              {player.photo ? (
                <img src={player.photo} alt={`${player.firstName} ${player.lastName}`} />
              ) : (
                <div className="match-player-avatar-placeholder">
                  {player.firstName.charAt(0)}{player.lastName.charAt(0)}
                </div>
              )}
            </div>
            
            <div className="match-player-info">
              <div className="match-player-name">
                {player.firstName} {player.lastName}
              </div>
              {player.position && (
                <div className="match-player-position">{player.position}</div>
              )}
            </div>

            {player.status && (
              <div className={`match-player-status match-player-status-${player.status}`}>
                {player.status === 'present' && '✓ Présent'}
                {player.status === 'absent' && '✗ Absent'}
                {player.status === 'pending' && '? En attente'}
              </div>
            )}

            {player.jerseyNumber && (
              <div className="match-player-number">
                #{player.jerseyNumber}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default MatchPlayers;
