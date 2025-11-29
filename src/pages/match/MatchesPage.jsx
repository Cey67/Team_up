import { useState, useEffect, useMemo } from 'react';
import { matchesService, attendancesService, playersService } from '../../services/api';
import MatchFilters from '../../components/match/MatchFilters';
import MatchList from '../../components/match/MatchList';
import CreateMatchModal from '../../components/match/CreateMatchModal';
import './MatchesPage.css';

/**
 * Page principale des matchs - Orchestrateur
 * Charge tous les matchs, gère l'état des filtres, orchestre les sous-composants
 * Composant orchestrateur, pas un composant visuel direct
 */
function MatchesPage() {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [filters, setFilters] = useState({
    date: '',
    location: '',
    type: '',
    status: '',
  });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Charge tous les matchs (fonction réutilisable)
   */
  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      // Charge les matchs depuis l'API
      const allMatches = await matchesService.getAll();
      
      // Charge toutes les présences pour calculer le nombre de joueurs présents
      const allAttendances = await attendancesService.getAll();
      
      // Enrichit les matchs avec des données calculées
      const enrichedMatches = await Promise.all(allMatches.map(async match => {
        // Calcule le nombre de joueurs présents depuis les présences
        const matchAttendances = allAttendances.filter(att => att.matchId == match.id);
        const playersCount = matchAttendances.filter(att => att.status === 'present').length;
        const maxPlayers = match.maxPlayers || 10;
        
        // Détermine toujours le statut dynamiquement basé sur les présences réelles
        const matchDate = new Date(`${match.date}T${match.time || '00:00'}`);
        const now = new Date();
        let status;
        
        if (matchDate < now) {
          // Match dans le passé = terminé
          status = 'finished';
        } else if (playersCount === maxPlayers) {
          // Exactement 10/10 joueurs = complet
          status = 'full';
        } else {
          // Moins de 10 joueurs = à venir (ouvert)
          status = 'upcoming';
        }

        return {
          ...match,
          playersCount, // Nombre de joueurs présents calculé depuis les présences
          status, // Statut recalculé dynamiquement
          type: match.type || '5v5',
          maxPlayers,
        };
      }));

      setMatches(enrichedMatches);
      setFilteredMatches(enrichedMatches);
    } catch (err) {
      console.error('Erreur lors du chargement des matchs:', err);
      setError('Impossible de charger les matchs. Vérifiez que json-server est démarré.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Charge tous les matchs au montage du composant
   * Récupère les matchs depuis l'API (ou données mockées)
   */
  useEffect(() => {
    loadMatches();
  }, []);

  /**
   * Recharge les matchs quand la fenêtre reprend le focus
   * Permet de mettre à jour le nombre de joueurs après modification des présences
   */
  useEffect(() => {
    const handleFocus = () => {
      if (!loading) {
        loadMatches();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loading]);

  /**
   * Filtre les matchs selon les critères sélectionnés
   * Utilise useMemo pour éviter les recalculs inutiles
   */
  useMemo(() => {
    let filtered = [...matches];

    // Filtre par date
    if (filters.date) {
      filtered = filtered.filter(match => match.date === filters.date);
    }

    // Filtre par lieu
    if (filters.location) {
      filtered = filtered.filter(match =>
        match.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    // Filtre par type
    if (filters.type) {
      filtered = filtered.filter(match => match.type === filters.type);
    }

    // Filtre par statut
    if (filters.status) {
      if (filters.status === 'upcoming') {
        // "À venir" inclut les matchs non terminés (upcoming ET full)
        filtered = filtered.filter(match => match.status !== 'finished');
      } else if (filters.status === 'finished') {
        // "Terminés" inclut uniquement les matchs terminés
        filtered = filtered.filter(match => match.status === 'finished');
      } else {
        // Pour d'autres statuts, correspondance exacte
        filtered = filtered.filter(match => match.status === filters.status);
      }
    }

    setFilteredMatches(filtered);
  }, [matches, filters]);

  /**
   * Gère le changement des filtres
   * @param {Object} newFilters - Nouveaux filtres
   */
  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  /**
   * Gère la création d'un nouveau match
   * Initialise toutes les présences en "pending" pour tous les joueurs
   * @param {Object} matchData - Données du nouveau match
   */
  const handleCreateMatch = async (matchData) => {
    try {
      // Crée le match via l'API
      const createdMatch = await matchesService.create(matchData);
      
      // Initialise toutes les présences en "pending" pour tous les joueurs
      try {
        // Récupère tous les joueurs
        const allPlayers = await playersService.getAll();
        
        // Crée une présence "pending" pour chaque joueur
        const attendancePromises = allPlayers.map(player => 
          attendancesService.upsert({
            matchId: createdMatch.id,
            playerId: player.id,
            status: 'pending', // Par défaut, tous les joueurs sont en attente
          })
        );
        
        // Attend que toutes les présences soient créées
        await Promise.all(attendancePromises);
      } catch (attendanceError) {
        console.error('Erreur lors de l\'initialisation des présences:', attendanceError);
        // Continue même si l'initialisation des présences échoue
      }
      
      // Ferme la modale avant de recharger pour éviter les superpositions
      setIsCreateModalOpen(false);
      
      // Attend un peu pour que le modal se ferme complètement
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Recharge tous les matchs pour avoir les données à jour
      await loadMatches();
    } catch (err) {
      console.error('Erreur lors de la création du match:', err);
      throw err; // Laisse CreateMatchModal gérer l'affichage de l'erreur
    }
  };

  return (
    <div className="matches-page-container">
      <div className="matches-page-content">
        <div className="matches-page-header">
          <h1 className="matches-page-title">Matchs</h1>
          <button
            className="matches-page-create-button"
            onClick={() => setIsCreateModalOpen(true)}
          >
            + Créer un match
          </button>
        </div>

        {/* Affichage des erreurs */}
        {error && (
          <div className="matches-page-error">
            {error}
          </div>
        )}

        {/* Filtres */}
        <MatchFilters filters={filters} onFilterChange={handleFilterChange} />

        {/* Affichage du chargement */}
        {loading ? (
          <div className="matches-page-loading">
            Chargement des matchs...
          </div>
        ) : (
          <MatchList matches={filteredMatches} />
        )}
      </div>

      {/* Modale de création */}
      <CreateMatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateMatch={handleCreateMatch}
      />
    </div>
  );
}

export default MatchesPage;
