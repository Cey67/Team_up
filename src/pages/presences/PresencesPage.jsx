import { useState, useEffect, useMemo } from 'react';
import './PresencesPage.css';
import MatchCard from '../../components/presences/MatchCard';
import AttendanceList from '../../components/presences/AttendanceList';
import AttendanceStats from '../../components/presences/AttendanceStats';
import { matchesService, playersService, attendancesService } from '../../services/api';

/**
 * Page de gestion des présences
 * Affiche les matchs à venir avec la liste des joueurs et leur statut de présence
 * Permet de modifier les présences pour chaque match
 */
function PresencesPage() {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingAttendance, setUpdatingAttendance] = useState(null); // { matchId, playerId }

  /**
   * Charge toutes les données nécessaires au montage du composant
   * Récupère les matchs, les joueurs et les présences
   */
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Charge les matchs à venir uniquement
        const allMatches = await matchesService.getAll();
        const upcomingMatches = allMatches.filter(match => match.status === 'upcoming');
        
        // Trie les matchs par date (plus proche en premier)
        upcomingMatches.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA - dateB;
        });

        setMatches(upcomingMatches);

        // Charge tous les joueurs
        const allPlayers = await playersService.getAll();
        setPlayers(allPlayers);

        // Charge toutes les présences
        const allAttendances = await attendancesService.getAll();
        setAttendances(allAttendances);

        // Développe automatiquement le premier match s'il existe
        if (upcomingMatches.length > 0) {
          setExpandedMatchId(upcomingMatches[0].id);
        }
      } catch (err) {
        console.error('Erreur lors du chargement des données:', err);
        setError('Impossible de charger les données. Vérifiez que json-server est démarré.');
        setMatches([]);
        setPlayers([]);
        setAttendances([]);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * Gère le développement/réduction d'un match
   * @param {number} matchId - ID du match
   */
  const handleToggleMatch = (matchId) => {
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);
  };

  /**
   * Gère le changement de statut de présence d'un joueur
   * Met à jour les présences localement et via l'API
   * 
   * @param {number} matchId - ID du match
   * @param {number} playerId - ID du joueur
   * @param {string} newStatus - Nouveau statut ('present', 'absent', 'pending')
   */
  const handleStatusChange = async (matchId, playerId, newStatus) => {
    // Indique qu'une mise à jour est en cours
    setUpdatingAttendance({ matchId, playerId });
    
    try {
      // Met à jour via l'API et récupère la présence mise à jour/créée
      const updatedAttendance = await attendancesService.upsert({
        matchId,
        playerId,
        status: newStatus,
      });

      // Met à jour l'état local avec les données retournées par l'API
      setAttendances(prevAttendances => {
        const existingIndex = prevAttendances.findIndex(
          att => att.matchId === matchId && att.playerId === playerId
        );

        if (existingIndex >= 0) {
          // Met à jour la présence existante avec les données de l'API
          const updated = [...prevAttendances];
          updated[existingIndex] = updatedAttendance;
          return updated;
        } else {
          // Ajoute la nouvelle présence retournée par l'API
          return [...prevAttendances, updatedAttendance];
        }
      });

      // Efface l'erreur si la mise à jour réussit
      setError(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la présence:', err);
      setError('Impossible de mettre à jour la présence. Vérifiez que json-server est démarré et réessayez.');
    } finally {
      // Retire l'indicateur de chargement
      setUpdatingAttendance(null);
    }
  };

  /**
   * Calcule les statistiques des présences pour un match
   * Les joueurs sans présence enregistrée sont comptés comme "pending"
   * @param {number} matchId - ID du match
   * @returns {Object} - Statistiques { presentCount, absentCount, pendingCount, totalCount }
   */
  const getMatchStats = (matchId) => {
    const matchAttendances = attendances.filter(att => att.matchId === matchId);
    const presentCount = matchAttendances.filter(att => att.status === 'present').length;
    const absentCount = matchAttendances.filter(att => att.status === 'absent').length;
    const recordedPendingCount = matchAttendances.filter(att => att.status === 'pending').length;
    
    // Les joueurs sans présence enregistrée sont considérés comme "pending"
    const playersWithoutAttendance = players.length - matchAttendances.length;
    const pendingCount = recordedPendingCount + playersWithoutAttendance;
    
    const totalCount = players.length;

    return {
      presentCount,
      absentCount,
      pendingCount,
      totalCount,
    };
  };

  /**
   * Obtient les présences pour un match spécifique
   * @param {number} matchId - ID du match
   * @returns {Array} - Liste des présences pour ce match
   */
  const getMatchAttendances = (matchId) => {
    return attendances.filter(att => att.matchId === matchId);
  };

  // Vérifie si l'utilisateur peut modifier les présences
  // Pour l'instant, on autorise toujours (sera géré par les rôles plus tard)
  const canEdit = true;

  return (
    <div className="presences-page-container">
      <div className="presences-page-content">
        <h1 className="presences-page-title">Présences</h1>

        {/* Affichage des erreurs */}
        {error && (
          <div className="presences-error">
            {error}
          </div>
        )}

        {/* Affichage du chargement */}
        {loading ? (
          <div className="presences-loading">
            Chargement des données...
          </div>
        ) : matches.length === 0 ? (
          <div className="presences-empty">
            <p>Aucun match à venir pour le moment.</p>
            <p className="presences-empty-subtitle">
              Les matchs à venir apparaîtront ici pour gérer les présences.
            </p>
          </div>
        ) : (
          <div className="presences-matches-list">
            {matches.map((match) => {
              const isExpanded = expandedMatchId === match.id;
              const matchAttendances = getMatchAttendances(match.id);
              const stats = getMatchStats(match.id);

              return (
                <div key={match.id} className="presences-match-wrapper">
                  <MatchCard
                    match={match}
                    onToggleExpand={() => handleToggleMatch(match.id)}
                    isExpanded={isExpanded}
                  />
                  
                  {isExpanded && (
                    <div className="presences-match-content">
                      <AttendanceStats
                        presentCount={stats.presentCount}
                        absentCount={stats.absentCount}
                        pendingCount={stats.pendingCount}
                        totalCount={stats.totalCount}
                      />
                      
                      <AttendanceList
                        players={players}
                        attendances={matchAttendances}
                        onStatusChange={handleStatusChange}
                        matchId={match.id}
                        canEdit={canEdit}
                        updatingAttendance={updatingAttendance}
                      />
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

export default PresencesPage;

