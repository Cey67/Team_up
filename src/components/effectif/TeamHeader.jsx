import './TeamHeader.css';
import logo2 from '../../assets/logo2.svg';

/**
 * Composant d'en-tête pour afficher le logo et le nom de l'équipe
 * Utilisé dans la page Effectif pour identifier l'équipe
 * 
 * @param {string} teamName - Nom de l'équipe à afficher
 * @param {string} teamLogo - URL ou chemin vers le logo de l'équipe (optionnel, utilise logo2 par défaut)
 */
function TeamHeader({ teamName = 'FC STRASBOURG', teamLogo }) {
  // Utilise logo2 par défaut si aucun logo n'est fourni
  const logoToDisplay = teamLogo || logo2;

  return (
    <div className="team-header">
      <div className="team-header-logo">
        <img src={logoToDisplay} alt={`Logo ${teamName}`} className="team-logo-img" />
      </div>
      <h2 className="team-header-name">{teamName}</h2>
    </div>
  );
}

export default TeamHeader;

