import { useState, useEffect, useMemo } from 'react';
import './PresencesPage.css';
import MatchCard from '../../components/presences/MatchCard';
import AttendanceList from '../../components/presences/AttendanceList';
import AttendanceStats from '../../components/presences/AttendanceStats';
import { matchesService, playersService, attendancesService } from '../../services/api';

function PresencesPage() {
  const [matches, setMatches] = useState([]);
  const [players, setPlayers] = useState([]);
  const [attendances, setAttendances] = useState([]);
  const [expandedMatchId, setExpandedMatchId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingAttendance, setUpdatingAttendance] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        const allMatches = await matchesService.getAll();
        const allAttendances = await attendancesService.getAll();
        
        const enrichedMatches = allMatches.map(match => {
          const matchAttendances = allAttendances.filter(att => att.matchId == match.id);
          const playersCount = matchAttendances.filter(att => att.status === 'present').length;
          const maxPlayers = match.maxPlayers || 10;
          
          const matchDate = new Date(`${match.date}T${match.time || '00:00'}`);
          const now = new Date();
          let status;
          
          if (matchDate < now) {
            status = 'finished';
          } else if (playersCount === maxPlayers) {
            status = 'full';
          } else {
            status = 'upcoming';
          }
          
          return {
            ...match,
            playersCount,
            status,
          };
        });
        
        const upcomingMatches = enrichedMatches.filter(match => match.status !== 'finished');
        
        upcomingMatches.sort((a, b) => {
          const dateA = new Date(`${a.date}T${a.time}`);
          const dateB = new Date(`${b.date}T${b.time}`);
          return dateA - dateB;
        });

        setMatches(upcomingMatches);

        const allPlayers = await playersService.getAll();
        setPlayers(allPlayers);
        setAttendances(allAttendances);

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

  useEffect(() => {
    const handleFocus = () => {
      if (!loading) {
        const reloadData = async () => {
          try {
            const allMatches = await matchesService.getAll();
            const allAttendances = await attendancesService.getAll();
            
            const enrichedMatches = allMatches.map(match => {
              const matchAttendances = allAttendances.filter(att => att.matchId == match.id);
              const playersCount = matchAttendances.filter(att => att.status === 'present').length;
              const maxPlayers = match.maxPlayers || 10;
              
              const matchDate = new Date(`${match.date}T${match.time || '00:00'}`);
              const now = new Date();
              let status;
              
              if (matchDate < now) {
                status = 'finished';
              } else if (playersCount === maxPlayers) {
                status = 'full';
              } else {
                status = 'upcoming';
              }
              
              return {
                ...match,
                playersCount,
                status,
              };
            });
            
            const upcomingMatches = enrichedMatches.filter(match => match.status !== 'finished');
            
            upcomingMatches.sort((a, b) => {
              const dateA = new Date(`${a.date}T${a.time}`);
              const dateB = new Date(`${b.date}T${b.time}`);
              return dateA - dateB;
            });

            setMatches(upcomingMatches);
            setAttendances(allAttendances);
          } catch (err) {
            console.error('Erreur lors du rechargement:', err);
          }
        };
        
        reloadData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loading]);

  const handleToggleMatch = (matchId) => {
    setExpandedMatchId(expandedMatchId === matchId ? null : matchId);
  };

  const handleStatusChange = async (matchId, playerId, newStatus) => {
    setUpdatingAttendance({ matchId, playerId });
    
    try {
      const updatedAttendance = await attendancesService.upsert({
        matchId,
        playerId,
        status: newStatus,
      });

      setAttendances(prevAttendances => {
        const existingIndex = prevAttendances.findIndex(
          att => att.matchId === matchId && att.playerId === playerId
        );

        let updatedAttendances;
        if (existingIndex >= 0) {
          updatedAttendances = [...prevAttendances];
          updatedAttendances[existingIndex] = updatedAttendance;
        } else {
          updatedAttendances = [...prevAttendances, updatedAttendance];
        }
        
        const matchAttendances = updatedAttendances.filter(att => att.matchId === matchId);
        const playersCount = matchAttendances.filter(att => att.status === 'present').length;
        const maxPlayers = 10;
        
        setMatches(prevMatches => {
          return prevMatches.map(m => {
            if (m.id === matchId) {
              const matchDate = new Date(`${m.date}T${m.time || '00:00'}`);
              const now = new Date();
              let status;
              
              if (matchDate < now) {
                status = 'finished';
              } else if (playersCount === maxPlayers) {
                status = 'full';
              } else {
                status = 'upcoming';
              }
              
              return {
                ...m,
                playersCount,
                status,
              };
            }
            return m;
          });
        });
        
        return updatedAttendances;
      });

      setError(null);
    } catch (err) {
      console.error('Erreur lors de la mise à jour de la présence:', err);
      setError('Impossible de mettre à jour la présence. Vérifiez que json-server est démarré et réessayez.');
    } finally {
      setUpdatingAttendance(null);
    }
  };

  const getMatchStats = (matchId) => {
    const matchAttendances = attendances.filter(att => att.matchId === matchId);
    const presentCount = matchAttendances.filter(att => att.status === 'present').length;
    const absentCount = matchAttendances.filter(att => att.status === 'absent').length;
    const recordedPendingCount = matchAttendances.filter(att => att.status === 'pending').length;
    
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

  const getMatchAttendances = (matchId) => {
    return attendances.filter(att => att.matchId === matchId);
  };

  const canEdit = true;

  return (
    <div className="presences-page-container">
      <div className="presences-page-content">
        <h1 className="presences-page-title">Présences</h1>

        {error && (
          <div className="presences-error">
            {error}
          </div>
        )}

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

