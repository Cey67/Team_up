import { Link } from 'react-router-dom';
import './DashboardPage.css';
import TeamSummaryCard from '../../components/dashboard/TeamSummaryCard';
import NextMatchCard from '../../components/dashboard/NextMatchCard';
import LastMatchCard from '../../components/dashboard/LastMatchCard';

function DashboardPage() {
  return (
    <div className="dashboard-container">
      <div className="dashboard-content">
        <h1 className="dashboard-title">Tableau de bord</h1>

        <div className="dashboard-team-section">
          <TeamSummaryCard />
        </div>

        <div className="dashboard-matches-section">
          <LastMatchCard />
          <NextMatchCard />
        </div>

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

