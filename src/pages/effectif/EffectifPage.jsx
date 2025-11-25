import { useState, useMemo } from 'react';
import './EffectifPage.css';
import TeamHeader from '../../components/effectif/TeamHeader';
import EffectifSearchBar from '../../components/effectif/EffectifSearchBar';
import PlayersTable from '../../components/effectif/PlayersTable';
import FilterModal from '../../components/effectif/FilterModal';
import SortMenu from '../../components/effectif/SortMenu';

/**
 * Page de gestion de l'effectif
 * Permet de visualiser et gérer les joueurs de l'équipe
 * Inclut une barre de recherche, des filtres, un tri et un tableau complet des joueurs
 */
function EffectifPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({ role: 'all' });
  const [sort, setSort] = useState({ field: 'lastName', order: 'asc' });
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);

  /**
   * Données mockées des joueurs
   * À remplacer par un appel API dans le futur
   */
  const allPlayers = [
    {
      id: 1,
      firstName: 'Ceyhun',
      lastName: 'SAPMAZ',
      role: 'Joueur',
      isAdmin: true,
      email: 'ceyhuns@gmail.com',
      phone: '0769669900',
      dateOfBirth: '2004-06-22',
      photo: null
    },
    {
      id: 2,
      firstName: 'Kenan',
      lastName: 'TEKBAS',
      role: 'Joueur',
      isAdmin: false,
      email: 'kenant@gmail.com',
      phone: '0796996600',
      dateOfBirth: '2005-04-13',
      photo: null
    },
    {
      id: 3,
      firstName: 'Alexandre',
      lastName: 'DUPONT',
      role: 'Joueur',
      isAdmin: false,
      email: 'alex.dupont@example.com',
      phone: '0612345678',
      dateOfBirth: '1998-03-15',
      photo: null
    },
    {
      id: 4,
      firstName: 'Marie',
      lastName: 'MARTIN',
      role: 'Joueur',
      isAdmin: false,
      email: 'marie.martin@example.com',
      phone: '0623456789',
      dateOfBirth: '1990-07-20',
      photo: null
    },
    {
      id: 5,
      firstName: 'Thomas',
      lastName: 'BERNARD',
      role: 'Joueur',
      isAdmin: false,
      email: 'thomas.bernard@example.com',
      phone: '0634567890',
      dateOfBirth: '2000-11-05',
      photo: null
    }
  ];

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

        // Conversion en minuscules pour les chaînes de caractères
        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        // Comparaison
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
        
        {/* Tableau des joueurs */}
        <PlayersTable
          players={filteredAndSortedPlayers}
          onPlayerSelect={handlePlayerSelect}
        />

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


