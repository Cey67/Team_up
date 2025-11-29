import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { matchesService, playersService, attendancesService } from '../../services/api';
import MatchInfo from '../../components/match/MatchInfo';
import './MatchDetailPage.css';

/**
 * Page de détail d'un match
 * Affiche toutes les informations d'un match, les joueurs inscrits, la composition des équipes
 * Permet de rejoindre/quitter un match
 */
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

  /**
   * Fonction utilitaire pour charger/recharger toutes les données du match
   * Centralise la logique de chargement pour éviter les incohérences
   */
  const loadMatchData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charge le match
      const matchData = await matchesService.getById(id);
      
      // Charge tous les joueurs
      const allPlayers = await playersService.getAll();
      setPlayers(allPlayers);

      // Charge les présences pour ce match (comme dans la page présences)
      const attendances = await attendancesService.getByMatchId(id);
      
      // Calcule le nombre de joueurs présents UNIQUEMENT (ignore pending et absent)
      // Filtre d'abord par matchId puis par statut "present" uniquement
      const presentCount = attendances
        .filter(att => String(att.matchId) === String(id))
        .filter(att => att.status === 'present')
        .length;
      
      const maxPlayers = matchData.maxPlayers || 10;
      
      // Recalcule le statut dynamiquement basé sur les présences réelles
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
      
      // Enrichit avec des données calculées
      // CRITIQUE: On ignore complètement matchData.playersCount et on force le recalcul
      // On crée un nouvel objet sans le playersCount du matchData pour éviter toute confusion
      const enrichedMatch = {
        id: matchData.id,
        date: matchData.date,
        time: matchData.time,
        location: matchData.location,
        type: matchData.type || '5v5',
        maxPlayers,
        playersCount: presentCount, // TOUJOURS recalculé depuis les présences réelles
        status, // Statut recalculé dynamiquement
        createdBy: matchData.createdBy,
        teamId: matchData.teamId,
        createdAt: matchData.createdAt,
        score: matchData.score,
      };
      
      setMatch(enrichedMatch);
      
      // Enrichit TOUS les joueurs avec leurs statuts de présence (comme page présences)
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

  /**
   * Charge les données du match au montage du composant
   */
  useEffect(() => {
    if (id) {
      loadMatchData();
    }
  }, [id]);

  /**
   * Recharge les données quand on revient sur la page (depuis présences par exemple)
   * Écoute les changements de focus de la fenêtre
   */
  useEffect(() => {
    const handleFocus = () => {
      if (id && !loading) {
        // Utilise la fonction centralisée pour recharger toutes les données
        loadMatchData();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, loading]);

  /**
   * Vérifie si l'utilisateur actuel participe au match
   * @returns {boolean} - True si l'utilisateur participe
   */
  const isUserParticipating = () => {
    // TODO: Récupérer l'ID de l'utilisateur depuis l'authentification
    const currentUserId = 1;
    return matchPlayers.some(player => player.id == currentUserId);
  };


  /**
   * Gère l'action de rejoindre/quitter le match
   */
  const handleJoinLeave = async () => {
    if (!match) return;

    try {
      setIsJoining(true);
      const currentUserId = 1; // TODO: Récupérer depuis l'authentification

      if (isUserParticipating()) {
        // Quitter le match (retirer la présence)
        const attendances = await attendancesService.getByMatchId(id);
        const userAttendance = attendances.find(att => att.playerId == currentUserId);
        
        if (userAttendance) {
          // Supprime la présence
          await attendancesService.delete(userAttendance.id);
        }
      } else {
        // Rejoindre le match (ajouter la présence)
        await attendancesService.upsert({
          matchId: id,
          playerId: currentUserId,
          status: 'present',
        });
      }
      
      // Recharge toutes les données avec la fonction centralisée pour garantir la cohérence
      await loadMatchData();
    } catch (err) {
      console.error('Erreur lors de la participation au match:', err);
      setError('Une erreur est survenue. Veuillez réessayer.');
    } finally {
      setIsJoining(false);
    }
  };

  /**
   * Formate la date au format français
   */
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
  };

  /**
   * Gère la suppression du match
   */
  const handleDelete = async () => {
    if (!match) return;

    try {
      setIsDeleting(true);
      setError(null);

      // Supprime le match via l'API
      await matchesService.delete(id);
      
      // Redirige vers la liste des matchs
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
        {/* Header avec bouton retour */}
        <div className="match-detail-header">
          <button
            className="match-detail-back-button"
            onClick={() => navigate('/match')}
          >
            ← Retour
          </button>
          <h1 className="match-detail-title">Détail du match</h1>
        </div>

        {/* Informations principales */}
        <MatchInfo match={match} />

        {/* Actions */}
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

          {/* Bouton de suppression */}
          <button
            className="match-detail-delete-button"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={isDeleting}
          >
            🗑️ Supprimer le match
          </button>

          {/* Bouton pour gérer les présences */}
          <Link 
            to={`/presences`} 
            className="match-players-link-presences"
          >
            📋 Gérer les présences →
          </Link>
        </div>

        {/* Confirmation de suppression */}
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
