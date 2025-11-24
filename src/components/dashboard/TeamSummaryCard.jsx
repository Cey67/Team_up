import './Card.css';
import logo2 from '../../assets/logo2.svg';

/**
 * Card affichant un résumé de l'équipe
 * Affiche le nom de l'équipe, le logo et le nombre de joueurs dans l'effectif
 */
function TeamSummaryCard() {
  // Données mockées - à remplacer par des données réelles plus tard
  const teamData = {
    name: 'Nom de l\'équipe',
    rosterCount: 0
  };

  return (
    <div className="card team-summary-card">
      <div className="card-header">
        <img src={logo2} alt="Team Logo" className="team-logo" />
        <div className="team-info">
          <h2 className="team-name">{teamData.name}</h2>
          <p className="team-roster">Effectif : {teamData.rosterCount} joueur{teamData.rosterCount > 1 ? 's' : ''}</p>
        </div>
      </div>
    </div>
  );
}

export default TeamSummaryCard;

