import { useState, useEffect, useMemo } from 'react';
import { matchesService, attendancesService, playersService } from '../../services/api';
import MatchFilters from '../../components/match/MatchFilters';
import MatchList from '../../components/match/MatchList';
import CreateMatchModal from '../../components/match/CreateMatchModal';
import './MatchesPage.css';

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

  const loadMatches = async () => {
    try {
      setLoading(true);
      setError(null);

      const allMatches = await matchesService.getAll();
      const allAttendances = await attendancesService.getAll();
      
      const enrichedMatches = await Promise.all(allMatches.map(async match => {
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

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    const handleFocus = () => {
      if (!loading) {
        loadMatches();
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [loading]);

  useMemo(() => {
    let filtered = [...matches];

    if (filters.date) {
      filtered = filtered.filter(match => match.date === filters.date);
    }

    if (filters.location) {
      filtered = filtered.filter(match =>
        match.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.type) {
      filtered = filtered.filter(match => match.type === filters.type);
    }

    if (filters.status) {
      if (filters.status === 'upcoming') {
        filtered = filtered.filter(match => match.status !== 'finished');
      } else if (filters.status === 'finished') {
        filtered = filtered.filter(match => match.status === 'finished');
      } else {
        filtered = filtered.filter(match => match.status === filters.status);
      }
    }

    setFilteredMatches(filtered);
  }, [matches, filters]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  const handleCreateMatch = async (matchData) => {
    try {
      const createdMatch = await matchesService.create(matchData);
      
      try {
        const allPlayers = await playersService.getAll();
        
        const attendancePromises = allPlayers.map(player => 
          attendancesService.upsert({
            matchId: createdMatch.id,
            playerId: player.id,
            status: 'pending',
          })
        );
        
        await Promise.all(attendancePromises);
      } catch (attendanceError) {
        console.error('Erreur lors de l\'initialisation des présences:', attendanceError);
      }
      
      setIsCreateModalOpen(false);
      await new Promise(resolve => setTimeout(resolve, 100));
      await loadMatches();
    } catch (err) {
      console.error('Erreur lors de la création du match:', err);
      throw err;
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

        {error && (
          <div className="matches-page-error">
            {error}
          </div>
        )}

        <MatchFilters filters={filters} onFilterChange={handleFilterChange} />

        {loading ? (
          <div className="matches-page-loading">
            Chargement des matchs...
          </div>
        ) : (
          <MatchList matches={filteredMatches} />
        )}
      </div>

      <CreateMatchModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateMatch={handleCreateMatch}
      />
    </div>
  );
}

export default MatchesPage;
