import { useState, useMemo, useEffect } from 'react';
import './EffectifPage.css';
import TeamHeader from '../../components/effectif/TeamHeader';
import EffectifSearchBar from '../../components/effectif/EffectifSearchBar';
import PlayersTable from '../../components/effectif/PlayersTable';
import FilterModal from '../../components/effectif/FilterModal';
import SortMenu from '../../components/effectif/SortMenu';
import { playersService } from '../../services/api';

function EffectifPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ role: 'all' });
  const [sort, setSort] = useState({ field: 'jerseyNumber', order: 'asc' });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        const players = await playersService.getAll();
        setAllPlayers(players);
      } catch (err) {
        console.error('Erreur lors du chargement des joueurs:', err);
        setError('Impossible de charger les joueurs. Vérifiez que json-server est démarré.');
        setAllPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  const filteredAndSortedPlayers = useMemo(() => {
    let result = [...allPlayers];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(player => 
        player.firstName.toLowerCase().includes(query) ||
        player.lastName.toLowerCase().includes(query) ||
        player.email.toLowerCase().includes(query) ||
        `${player.firstName} ${player.lastName}`.toLowerCase().includes(query)
      );
    }

    if (filters.role && filters.role !== 'all') {
      result = result.filter(player => player.role === filters.role);
    }

    if (sort.field) {
      result.sort((a, b) => {
        let aValue = a[sort.field];
        let bValue = b[sort.field];

        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sort.order === 'asc' ? aValue - bValue : bValue - aValue;
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) {
          return sort.order === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sort.order === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [searchQuery, filters, sort, allPlayers]);

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  const handleSort = () => {
    setIsSortMenuOpen(true);
  };

  const handleApplySort = (newSort) => {
    setSort(newSort);
  };

  const handlePlayerSelect = (selectedIds) => {
    console.log('Joueurs sélectionnés:', selectedIds);
  };

  return (
    <div className="effectif-page-container">
      <div className="effectif-page-content">
        <h1 className="effectif-page-title">Effectif</h1>
        
        <TeamHeader teamName="FC STRASBOURG" />
        
        <EffectifSearchBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
        />
        
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
            Chargement des joueurs...
          </div>
        ) : filteredAndSortedPlayers.length === 0 ? (
          <div style={{ 
            padding: '2rem', 
            textAlign: 'center',
            color: '#666'
          }}>
            {allPlayers.length === 0 
              ? 'Aucun joueur trouvé dans la base de données.'
              : 'Aucun joueur ne correspond à vos critères de recherche ou de filtrage.'}
          </div>
        ) : (
          <>
            <PlayersTable
              players={filteredAndSortedPlayers}
              onPlayerSelect={handlePlayerSelect}
            />
          </>
        )}

        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          currentFilters={filters}
          onApplyFilters={handleApplyFilters}
        />

        <SortMenu
          isOpen={isSortMenuOpen}
          onClose={() => setIsSortMenuOpen(false)}
          currentSort={sort}
          onApplySort={handleApplySort}
        />
      </div>
    </div>
  );
}

export default EffectifPage;


