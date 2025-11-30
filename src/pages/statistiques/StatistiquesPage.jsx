import { useState, useEffect } from 'react';
import './StatistiquesPage.css';
import PlayerStatsCard from '../../components/statistiques/PlayerStatsCard';
import { statisticsService, playersService } from '../../services/api';

function StatistiquesPage() {
  const [playersStats, setPlayersStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [stats, players] = await Promise.all([
          statisticsService.getAll(),
          playersService.getAll()
        ]);
        
        const playersMap = new Map();
        players.forEach(player => {
          const id = String(player.id);
          playersMap.set(id, player);
          if (!isNaN(Number(id))) {
            playersMap.set(Number(id), player);
          }
        });
        
        const enrichedStats = stats.map(stat => {
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

