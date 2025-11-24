import { Link } from 'react-router-dom';
import './HomePage.css';
import logo2 from '../../assets/logo2.svg';

/**
 * Page d'accueil de l'application Team Up
 * Présente l'application et ses avantages avec des boutons d'action centrés
 */
function HomePage() {
  return (
    <div className="home-container">
      {/* Logo en haut à gauche */}
      <div className="home-logo-container">
        <img src={logo2} alt="Team Up Logo" className="home-logo" />
      </div>

      <div className="home-content">
        <h1 className="home-title">
          Team Up
        </h1>
        
        {/* Sous-titre */}
        <p className="home-subtitle">
          Organisez vos matchs de football entre amis, collègues ou membres de votre communauté
        </p>

        {/* Boutons d'action centrés */}
        <div className="home-actions">
          <Link to="/register" className="home-btn home-btn-primary">
            S'inscrire
          </Link>
          <Link to="/login" className="home-btn home-btn-secondary">
            Se connecter
          </Link>
        </div>

        {/* Section des avantages */}
        <section className="home-benefits">
          <h2 className="home-benefits-title">Ce que Team Up peut vous apporter</h2>
          
          <div className="home-benefits-list">
            <div className="home-benefit-item">
              <span className="home-benefit-icon">📅</span>
              <div className="home-benefit-content">
                <h3 className="home-benefit-title">Organisation simplifiée</h3>
                <p className="home-benefit-description">
                  Créez et gérez vos matchs en quelques clics. Trouvez facilement des joueurs disponibles et équilibrez vos équipes.
                </p>
              </div>
            </div>

            <div className="home-benefit-item">
              <span className="home-benefit-icon">👥</span>
              <div className="home-benefit-content">
                <h3 className="home-benefit-title">Gestion des équipes</h3>
                <p className="home-benefit-description">
                  Formez vos équipes, invitez vos amis et suivez les statistiques de chaque joueur et de votre équipe.
                </p>
              </div>
            </div>

            <div className="home-benefit-item">
              <span className="home-benefit-icon">🔍</span>
              <div className="home-benefit-content">
                <h3 className="home-benefit-title">Recherche intuitive</h3>
                <p className="home-benefit-description">
                  Trouvez rapidement des matchs selon vos critères : date, lieu, type de match ou créateur.
                </p>
              </div>
            </div>

            <div className="home-benefit-item">
              <span className="home-benefit-icon">📊</span>
              <div className="home-benefit-content">
                <h3 className="home-benefit-title">Suivi des performances</h3>
                <p className="home-benefit-description">
                  Consultez votre tableau de bord personnel pour suivre vos statistiques et votre historique de matchs.
                </p>
              </div>
            </div>

            <div className="home-benefit-item">
              <span className="home-benefit-icon">⚽</span>
              <div className="home-benefit-content">
                <h3 className="home-benefit-title">Créneaux horaires flexibles</h3>
                <p className="home-benefit-description">
                  Gérez facilement les créneaux horaires de vos matchs et recevez des notifications pour ne rien manquer.
                </p>
              </div>
            </div>

            <div className="home-benefit-item">
              <span className="home-benefit-icon">🏆</span>
              <div className="home-benefit-content">
                <h3 className="home-benefit-title">Communauté active</h3>
                <p className="home-benefit-description">
                  Rejoignez une communauté de passionnés de football et participez à des matchs réguliers près de chez vous.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HomePage;
