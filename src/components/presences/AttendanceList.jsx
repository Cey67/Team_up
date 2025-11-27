import './AttendanceList.css';

/**
 * Composant AttendanceList - Affiche la liste des joueurs avec leur statut de présence
 * Permet de modifier le statut de présence pour chaque joueur
 * 
 * @param {Array} players - Liste des joueurs
 * @param {Array} attendances - Liste des présences pour ce match
 * @param {Function} onStatusChange - Fonction appelée lors du changement de statut (matchId, playerId, newStatus)
 * @param {number} matchId - ID du match
 * @param {boolean} canEdit - Indique si l'utilisateur peut modifier les présences
 * @param {Object|null} updatingAttendance - Objet { matchId, playerId } indiquant quelle présence est en cours de mise à jour
 */
function AttendanceList({ players, attendances, onStatusChange, matchId, canEdit = true, updatingAttendance = null }) {
  /**
   * Obtient le statut de présence d'un joueur pour ce match
   * @param {number} playerId - ID du joueur
   * @returns {string} - Statut de présence ('present', 'absent', 'pending')
   */
  const getPlayerStatus = (playerId) => {
    const attendance = attendances.find(att => att.playerId === playerId);
    return attendance ? attendance.status : 'pending';
  };

  /**
   * Gère le changement de statut de présence
   * @param {number} playerId - ID du joueur
   * @param {string} newStatus - Nouveau statut ('present', 'absent', 'pending')
   */
  const handleStatusChange = (playerId, newStatus) => {
    if (canEdit && onStatusChange) {
      onStatusChange(matchId, playerId, newStatus);
    }
  };

  /**
   * Obtient les classes CSS pour le statut
   * @param {string} status - Statut de présence
   * @returns {string} - Classes CSS
   */
  const getStatusClasses = (status) => {
    const baseClass = 'attendance-status';
    switch (status) {
      case 'present':
        return `${baseClass} ${baseClass}-present`;
      case 'absent':
        return `${baseClass} ${baseClass}-absent`;
      case 'pending':
      default:
        return `${baseClass} ${baseClass}-pending`;
    }
  };

  /**
   * Obtient le label du statut
   * @param {string} status - Statut de présence
   * @returns {string} - Label en français
   */
  const getStatusLabel = (status) => {
    switch (status) {
      case 'present':
        return 'Présent';
      case 'absent':
        return 'Absent';
      case 'pending':
      default:
        return 'En attente';
    }
  };

  /**
   * Obtient l'icône du statut
   * @param {string} status - Statut de présence
   * @returns {string} - Icône
   */
  const getStatusIcon = (status) => {
    switch (status) {
      case 'present':
        return '✓';
      case 'absent':
        return '✗';
      case 'pending':
      default:
        return '?';
    }
  };

  return (
    <div className="attendance-list">
      <h4 className="attendance-list-title">Liste des joueurs</h4>
      <div className="attendance-list-content">
        {players.length === 0 ? (
          <div className="attendance-list-empty">
            Aucun joueur dans l'effectif
          </div>
        ) : (
          <div className="attendance-list-grid">
            {players.map((player) => {
              const status = getPlayerStatus(player.id);
              return (
                <div key={player.id} className="attendance-item">
                  <div className="attendance-player-info">
                    <div className="attendance-player-number">
                      {player.jerseyNumber || '—'}
                    </div>
                    <div className="attendance-player-details">
                      <span className="attendance-player-name">
                        {player.firstName} {player.lastName}
                      </span>
                      <span className="attendance-player-position">
                        {player.position || 'Non défini'}
                      </span>
                    </div>
                  </div>
                  
                  {canEdit ? (
                    <div className="attendance-status-buttons">
                      {updatingAttendance && 
                       updatingAttendance.matchId === matchId && 
                       updatingAttendance.playerId === player.id ? (
                        <div className="status-btn-loading">
                          <span className="loading-spinner">⏳</span>
                          <span className="loading-text">Mise à jour...</span>
                        </div>
                      ) : (
                        <>
                          <button
                            className={`status-btn status-btn-present ${status === 'present' ? 'status-btn-active' : ''}`}
                            onClick={() => handleStatusChange(player.id, 'present')}
                            title="Marquer comme présent"
                            disabled={updatingAttendance !== null}
                          >
                            <span className="status-btn-icon">✓</span>
                            <span className="status-btn-label">Présent</span>
                          </button>
                          <button
                            className={`status-btn status-btn-pending ${status === 'pending' ? 'status-btn-active' : ''}`}
                            onClick={() => handleStatusChange(player.id, 'pending')}
                            title="Marquer comme en attente"
                            disabled={updatingAttendance !== null}
                          >
                            <span className="status-btn-icon">?</span>
                            <span className="status-btn-label">Attente</span>
                          </button>
                          <button
                            className={`status-btn status-btn-absent ${status === 'absent' ? 'status-btn-active' : ''}`}
                            onClick={() => handleStatusChange(player.id, 'absent')}
                            title="Marquer comme absent"
                            disabled={updatingAttendance !== null}
                          >
                            <span className="status-btn-icon">✗</span>
                            <span className="status-btn-label">Absent</span>
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className={getStatusClasses(status)}>
                      <span className="status-icon">{getStatusIcon(status)}</span>
                      <span className="status-label">{getStatusLabel(status)}</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default AttendanceList;

