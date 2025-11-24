import { Link } from 'react-router-dom';
import './DashboardPage.css';
import TeamSummaryCard from '../../components/dashboard/TeamSummaryCard';
import NextMatchCard from '../../components/dashboard/NextMatchCard';
import LastMatchCard from '../../components/dashboard/LastMatchCard';

/**
 * Page principale du tableau de bord
 * Affiche un résumé de l'équipe, les matchs à venir et passés
 * Propose des actions rapides pour créer un match ou gérer l'effectif
 */
function DashboardPage() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">Tableau de bord</h1>

        {/* Section résumé équipe */}
        <div className="dashboard-team-section">
          <TeamSummaryCard />
        </div>

        {/* Section matchs */}
        <div className="dashboard-matches-section">
          <LastMatchCard />
          <NextMatchCard />
        </div>

        {/* Boutons d'action */}
        <div className="dashboard-actions">
          <Link to="/match" className="dashboard-btn dashboard-btn-primary">
            Créer un match
          </Link>
          <Link to="/effectif" className="dashboard-btn dashboard-btn-secondary">
            Gérer l'effectif
          </Link>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;

