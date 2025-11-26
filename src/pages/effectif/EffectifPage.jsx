import { useState, useMemo, useEffect } from 'react';
import './EffectifPage.css';
import TeamHeader from '../../components/effectif/TeamHeader';
import EffectifSearchBar from '../../components/effectif/EffectifSearchBar';
import PlayersTable from '../../components/effectif/PlayersTable';
import FilterModal from '../../components/effectif/FilterModal';
import SortMenu from '../../components/effectif/SortMenu';
import { playersService } from '../../services/api';

/**
 * Page de gestion de l'effectif
 * Permet de visualiser et gérer les joueurs de l'équipe
 * Inclut une barre de recherche, des filtres, un tri et un tableau complet des joueurs
 */
function EffectifPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ role: 'all' });
  const [sort, setSort] = useState({ field: 'jerseyNumber', order: 'asc' });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
  const [allPlayers, setAllPlayers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /**
   * Charge les joueurs depuis l'API json-server
   * S'exécute au montage du composant
   */
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
        // En cas d'erreur, on garde un tableau vide pour éviter les erreurs de rendu
        setAllPlayers([]);
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, []);

  /**
   * Filtre et tri les joueurs en fonction des critères sélectionnés
   * Utilise useMemo pour optimiser les performances
   */
  const filteredAndSortedPlayers = useMemo(() => {
    let result = [...allPlayers];

    // Filtrage par recherche (nom, prénom, email)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      result = result.filter(player => 
        player.firstName.toLowerCase().includes(query) ||
        player.lastName.toLowerCase().includes(query) ||
        player.email.toLowerCase().includes(query) ||
        `${player.firstName} ${player.lastName}`.toLowerCase().includes(query)
      );
    }

    // Filtrage par rôle
    if (filters.role && filters.role !== 'all') {
      result = result.filter(player => player.role === filters.role);
    }

    // Tri
    if (sort.field) {
      result.sort((a, b) => {
        let aValue = a[sort.field];
        let bValue = b[sort.field];

        // Gestion des valeurs nulles ou undefined (placées à la fin)
        if (aValue == null && bValue == null) return 0;
        if (aValue == null) return 1;
        if (bValue == null) return -1;

        // Tri numérique pour les nombres
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sort.order === 'asc' ? aValue - bValue : bValue - aValue;
        }

        // Conversion en minuscules pour les chaînes de caractères
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        // Comparaison pour les chaînes
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

  /**
   * Gère la recherche de joueurs
   * Filtre les joueurs en fonction de la requête de recherche
   * 
   * @param {string} query - Terme de recherche
   */
  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  /**
   * Gère le clic sur le bouton Filtrer
   * Ouvre le modal de filtres
   */
  const handleFilter = () => {
    setIsFilterModalOpen(true);
  };

  /**
   * Gère l'application des filtres
   * 
   * @param {object} newFilters - Nouveaux filtres à appliquer
   */
  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
  };

  /**
   * Gère le clic sur le bouton Trier
   * Ouvre le menu de tri
   */
  const handleSort = () => {
    setIsSortMenuOpen(true);
  };

  /**
   * Gère l'application du tri
   * 
   * @param {object} newSort - Nouveau tri à appliquer { field: string, order: 'asc' | 'desc' }
   */
  const handleApplySort = (newSort) => {
    setSort(newSort);
  };

  /**
   * Gère la sélection de joueurs
   * Appelé lorsque des joueurs sont sélectionnés dans le tableau
   * 
   * @param {Array} selectedIds - Tableau des IDs des joueurs sélectionnés
   */
  const handlePlayerSelect = (selectedIds) => {
    console.log('Joueurs sélectionnés:', selectedIds);
    // TODO: Implémenter les actions sur les joueurs sélectionnés
  };

  return (
    <div className="effectif-page-container">
      <div className="effectif-page-content">
        <h1 className="effectif-page-title">Effectif</h1>
        
        {/* En-tête avec logo et nom de l'équipe */}
        <TeamHeader teamName="FC STRASBOURG" />
        
        {/* Barre de recherche avec filtres et tri */}
        <EffectifSearchBar
          onSearch={handleSearch}
          onFilter={handleFilter}
          onSort={handleSort}
        />
        
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
            {/* Tableau des joueurs */}
            <PlayersTable
              players={filteredAndSortedPlayers}
              onPlayerSelect={handlePlayerSelect}
            />
          </>
        )}

        {/* Modal de filtres */}
        <FilterModal
          isOpen={isFilterModalOpen}
          onClose={() => setIsFilterModalOpen(false)}
          currentFilters={filters}
          onApplyFilters={handleApplyFilters}
        />

        {/* Menu de tri */}
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


