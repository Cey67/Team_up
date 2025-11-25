import './StatistiquesPage.css';
import PlayerStatsCard from '../../components/statistiques/PlayerStatsCard';

/**
 * Page de statistiques des joueurs
 * Affiche une grille de cartes avec les statistiques de chaque joueur
 * Statistiques affichées : matchs joués, buts marqués, passes décisives
 */
function StatistiquesPage() {
  // Données mockées - à remplacer par des données réelles plus tard
  const playersStats = [
    {
      id: 1,
      name: 'Jean Dupont',
      photo: null,
      matchesPlayed: 15,
      goals: 8,
      assists: 5
    },
    {
      id: 2,
      name: 'Marie Martin',
      photo: null,
      matchesPlayed: 12,
      goals: 12,
      assists: 3
    },
    {
      id: 3,
      name: 'Pierre Bernard',
      photo: null,
      matchesPlayed: 18,
      goals: 5,
      assists: 10
    },
    {
      id: 4,
      name: 'Sophie Dubois',
      photo: null,
      matchesPlayed: 14,
      goals: 6,
      assists: 7
    },
    {
      id: 5,
      name: 'Lucas Moreau',
      photo: null,
      matchesPlayed: 16,
      goals: 10,
      assists: 4
    },
    {
      id: 6,
      name: 'Emma Leroy',
      photo: null,
      matchesPlayed: 13,
      goals: 4,
      assists: 8
    },
    {
      id: 7,
      name: 'Thomas Petit',
      photo: null,
      matchesPlayed: 17,
      goals: 7,
      assists: 6
    },
    {
      id: 8,
      name: 'Léa Rousseau',
      photo: null,
      matchesPlayed: 11,
      goals: 9,
      assists: 2
    }
  ];

  return (
    <div className="statistiques-container">
      <div className="statistiques-content">
        <h1 className="statistiques-title">Statistiques des joueurs</h1>

        {playersStats.length === 0 ? (
          <div className="statistiques-empty">
            <p>Aucune statistique disponible pour le moment.</p>
          </div>
        ) : (
          <div className="statistiques-grid">
            {playersStats.map((player) => (
              <PlayerStatsCard key={player.id} player={player} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default StatistiquesPage;

