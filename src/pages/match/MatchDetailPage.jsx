import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { matchesService, playersService, attendancesService } from '../../services/api';
import MatchInfo from '../../components/match/MatchInfo';
import './MatchDetailPage.css';

function MatchDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [match, setMatch] = useState(null);
  const [players, setPlayers] = useState([]);
  const [matchPlayers, setMatchPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoining, setIsJoining] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const loadMatchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const matchData = await matchesService.getById(id);
      const allPlayers = await playersService.getAll();
      setPlayers(allPlayers);

      const attendances = await attendancesService.getByMatchId(id);
      
      const presentCount = attendances
        .filter(att => String(att.matchId) === String(id))
        .filter(att => att.status === 'present')
        .length;
      
      const maxPlayers = matchData.maxPlayers || 10;
      
      const matchDate = new Date(`${matchData.date}T${matchData.time || '00:00'}`);
      const now = new Date();
      let status;
      
      if (matchDate < now) {
        status = 'finished';
      } else if (presentCount === maxPlayers) {
        status = 'full';
      } else {
        status = 'upcoming';
      }
      
      const enrichedMatch = {
        id: matchData.id,
        date: matchData.date,
        time: matchData.time,
        location: matchData.location,
        type: matchData.type || '5v5',
        maxPlayers,
        playersCount: presentCount,
        status,
        createdBy: matchData.createdBy,
        teamId: matchData.teamId,
        createdAt: matchData.createdAt,
        score: matchData.score,
      };
      
      setMatch(enrichedMatch);
      
      const enrichedPlayers = allPlayers.map(player => {
        const attendance = attendances.find(att => att.playerId == player.id);
        return {
          ...player,
          status: attendance?.status || 'pending',
        };
      });

      setMatchPlayers(enrichedPlayers);
    } catch (err) {
      console.error('Erreur lors du chargement du match:', err);
      setError('Impossible de charger le match. Vérifiez que json-server est démarré.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      loadMatchData();
    }
  }, [id]);

  useEffect(() => {
    const handleFocus = () => {
      if (id && !loading) {
        loadMatchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, loading]);

  const isUserParticipating = () => {
    const currentUserId = 1;
    return matchPlayers.some(player => player.id == currentUserId);
  };

  const handleJoinLeave = async () => {
    if (!match) return;

    try {
      setIsJoining(true);
      const currentUserId = 1;

      if (isUserParticipating()) {
        const attendances = await attendancesService.getByMatchId(id);
        const userAttendance = attendances.find(att => att.playerId == currentUserId);
        
        if (userAttendance) {
          await attendancesService.delete(userAttendance.id);
        }
      } else {
        await attendancesService.upsert({
          matchId: id,
          playerId: currentUserId,
          status: 'present',
        });
      }
      
      await loadMatchData();
    } catch (err) {
      console.error('Erreur lors de la participation au match:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsJoining(false);
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  const handleDelete = async () => {
    if (!match) return;

    try {
      setIsDeleting(true);
      setError(null);

      await matchesService.delete(id);
      navigate('/match');
    } catch (err) {
      console.error('Erreur lors de la suppression du match:', err);
      setError('Impossible de supprimer le match. Veuillez réessayer.');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (loading) {
    return (
      <div className="match-detail-container">
        <div className="match-detail-loading">
          <p>Chargement du match...</p>
        </div>
      </div>
    );
  }

  if (error || !match) {
    return (
      <div className="match-detail-container">
        <div className="match-detail-error">
          <p>{error || 'Match introuvable'}</p>
          <Link to="/match" className="match-detail-back-link">
            ← Retour aux matchs
          </Link>
        </div>
      </div>
    );
  }

  const participating = isUserParticipating();
  const isFull = match.playersCount >= match.maxPlayers;
  const isPast = new Date(`${match.date}T${match.time || '00:00'}`) < new Date();

  return (
    <div className="match-detail-container">
      <div className="match-detail-content">
        <div className="match-detail-header">
          <button
            className="match-detail-back-button"
            onClick={() => navigate('/match')}
          >
            ← Retour
          </button>
          <h1 className="match-detail-title">Détail du match</h1>
        </div>

        <MatchInfo match={match} />

        <div className="match-detail-actions">
          <div className="match-detail-actions-main">
            {!isPast && !isFull && (
              <button
                className={`match-detail-action-button ${participating ? 'match-detail-action-button-leave' : 'match-detail-action-button-join'}`}
                onClick={handleJoinLeave}
                disabled={isJoining}
              >
                {isJoining
                  ? 'Chargement...'
                  : participating
                  ? '✗ Quitter le match'
                  : '✓ Rejoindre le match'}
              </button>
            )}
            {isFull && (
              <div className="match-detail-full-message">
                ⚠️ Ce match est complet
              </div>
            )}
            {isPast && (
              <div className="match-detail-past-message">
                📅 Ce match est terminé
              </div>
            )}
          </div>

          <button
            className="match-detail-delete-button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
          >
            🗑️ Supprimer le match
          </button>

          <Link 
            to={`/presences`} 
            className="match-players-link-presences"
          >
            📋 Gérer les présences →
          </Link>
        </div>

        {showDeleteConfirm && (
          <div 
            className="match-detail-delete-confirm"
            onClick={() => !isDeleting && setShowDeleteConfirm(false)}
          >
            <div 
              className="match-detail-delete-confirm-content"
              onClick={(e) => e.stopPropagation()}
            >
              <h3>Confirmer la suppression</h3>
              <p>Êtes-vous sûr de vouloir supprimer ce match ? Cette action est irréversible.</p>
              <div className="match-detail-delete-confirm-actions">
                <button
                  className="match-detail-delete-confirm-cancel"
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                >
                  Annuler
                </button>
                <button
                  className="match-detail-delete-confirm-delete"
                  onClick={handleDelete}
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Suppression...' : 'Supprimer'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MatchDetailPage;
