import './AttendanceStats.css';

/**
 * Composant AttendanceStats - Affiche les statistiques des présences pour un match
 * Montre le nombre de présents, absents et en attente
 * 
 * @param {number} presentCount - Nombre de joueurs présents
 * @param {number} absentCount - Nombre de joueurs absents
 * @param {number} pendingCount - Nombre de joueurs en attente
 * @param {number} totalCount - Nombre total de joueurs
 */
function AttendanceStats({ presentCount, absentCount, pendingCount, totalCount }) {
  /**
   * Calcule le pourcentage de présents
   * @returns {number} - Pourcentage arrondi
   */
  const getPresentPercentage = () => {
    if (totalCount === 0) return 0;
    return Math.round((presentCount / totalCount) * 100);
  };

  return (
    <div className="attendance-stats">
      <div className="attendance-stats-header">
        <h4 className="attendance-stats-title">Statistiques des présences</h4>
        <div className="attendance-stats-percentage">
          <span className="percentage-value">{getPresentPercentage()}%</span>
          <span className="percentage-label">de présents</span>
        </div>
      </div>
      
      <div className="attendance-stats-grid">
        <div className="stat-item stat-item-present">
          <div className="stat-icon">✓</div>
          <div className="stat-content">
            <span className="stat-value">{presentCount}</span>
            <span className="stat-label">Présents</span>
          </div>
        </div>
        
        <div className="stat-item stat-item-absent">
          <div className="stat-icon">✗</div>
          <div className="stat-content">
            <span className="stat-value">{absentCount}</span>
            <span className="stat-label">Absents</span>
          </div>
        </div>
        
        <div className="stat-item stat-item-pending">
          <div className="stat-icon">?</div>
          <div className="stat-content">
            <span className="stat-value">{pendingCount}</span>
            <span className="stat-label">En attente</span>
          </div>
        </div>
        
        <div className="stat-item stat-item-total">
          <div className="stat-icon">👥</div>
          <div className="stat-content">
            <span className="stat-value">{totalCount}</span>
            <span className="stat-label">Total</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AttendanceStats;

