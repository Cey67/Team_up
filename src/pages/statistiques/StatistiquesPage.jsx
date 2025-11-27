import { useState, useEffect } from 'react';
import './StatistiquesPage.css';
import PlayerStatsCard from '../../components/statistiques/PlayerStatsCard';
import { statisticsService, playersService } from '../../services/api';

/**
 * Page de statistiques des joueurs
 * Affiche une grille de cartes avec les statistiques de chaque joueur
 * Statistiques affichées : matchs joués, buts marqués, passes décisives
 */
function StatistiquesPage() {
  const [playersStats, setPlayersStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Charge les statistiques depuis l'API json-server
   * Enrichit les statistiques avec le poste de chaque joueur
   * S'exécute au montage du composant
   */
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Charge les statistiques et les joueurs en parallèle
        const [stats, players] = await Promise.all([
          statisticsService.getAll(),
          playersService.getAll()
        ]);
        
        // Crée un map des joueurs par ID pour faciliter la recherche
        // Gère les cas où les IDs sont des strings ou des nombres
        const playersMap = new Map();
        players.forEach(player => {
          const id = String(player.id);
          playersMap.set(id, player);
          // Ajoute aussi la version numérique si l'ID est une string numérique
          if (!isNaN(Number(id))) {
            playersMap.set(Number(id), player);
          }
        });
        
        // Enrichit les statistiques avec le poste de chaque joueur
        const enrichedStats = stats.map(stat => {
          // Essaie d'abord avec le playerId tel quel, puis en string
          const player = playersMap.get(stat.playerId) || playersMap.get(String(stat.playerId));
          return {
            ...stat,
            position: player?.position || null
          };
        });
        
        setPlayersStats(enrichedStats);
      } catch (err) {
        console.error('Erreur lors du chargement des statistiques:', err);
        setError('Impossible de charger les statistiques. Vérifiez que json-server est démarré.');
        // En cas d'erreur, on garde un tableau vide pour éviter les erreurs de rendu
        setPlayersStats([]);
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, []);

  return (
    <div className="statistiques-container">
      <div className="statistiques-content">
        <h1 className="statistiques-title">Statistiques des joueurs</h1>

        {/* Affichage des erreurs */}
        {error && (
          <div style={{ 
            padding: '1rem', 
            backgroundColor: '#fee', 
            color: '#c33', 
            borderRadius: '8px',
            marginBottom: '1rem'
          }}>
            {error}
          </div>
        )}

        {/* Affichage du chargement */}
        {loading ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            color: '#666'
          }}>
            Chargement des statistiques...
          </div>
        ) : playersStats.length === 0 ? (
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

