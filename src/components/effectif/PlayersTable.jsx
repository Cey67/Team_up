import { useState } from 'react';
import './PlayersTable.css';

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const months = [
    'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
    'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
  ];
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
};

const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return first + last;
};

function PlayersTable({ players = [], onPlayerSelect }) {
  const [selectedPlayers, setSelectedPlayers] = useState(new Set());
  const [selectAll, setSelectAll] = useState(false);

  const defaultPlayers = [
    {
      id: 1,
      firstName: 'Ceyhun',
      lastName: 'SAPMAZ',
      role: 'Joueur + Coach',
      position: 'Gardien',
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
      position: 'Milieu de terrain',
      isAdmin: false,
      email: 'kenant@gmail.com',
      phone: '0796996600',
      dateOfBirth: '2005-04-13',
      photo: null
    }
  ];

  const displayPlayers = players.length > 0 ? players : defaultPlayers;

  const handlePlayerSelect = (playerId) => {
    const newSelected = new Set(selectedPlayers);
    if (newSelected.has(playerId)) {
      newSelected.delete(playerId);
    } else {
      newSelected.add(playerId);
    }
    setSelectedPlayers(newSelected);
    setSelectAll(newSelected.size === displayPlayers.length);
    
    if (onPlayerSelect) {
      onPlayerSelect(Array.from(newSelected));
    }
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedPlayers(new Set());
      setSelectAll(false);
      if (onPlayerSelect) {
        onPlayerSelect([]);
      }
    } else {
      const allIds = new Set(displayPlayers.map(p => p.id));
      setSelectedPlayers(allIds);
      setSelectAll(true);
      if (onPlayerSelect) {
        onPlayerSelect(Array.from(allIds));
      }
    }
  };

  return (
    <div className="players-table-container">
      <table className="players-table">
        <thead>
          <tr>
            <th className="checkbox-col">
              <input
                type="checkbox"
                checked={selectAll}
                onChange={handleSelectAll}
                aria-label="Sélectionner tous les joueurs"
              />
            </th>
            <th>#</th>
            <th>Photo</th>
            <th>Nom</th>
            <th>Prénom</th>
            <th>Postes</th>
            <th>Admin</th>
            <th>E-mail</th>
            <th>Téléphone</th>
            <th>Date de naissance</th>
          </tr>
        </thead>
        <tbody>
          {displayPlayers.map((player) => (
            <tr
              key={player.id}
              className={selectedPlayers.has(player.id) ? 'selected' : ''}
            >
              <td className="checkbox-col">
                <input
                  type="checkbox"
                  checked={selectedPlayers.has(player.id)}
                  onChange={() => handlePlayerSelect(player.id)}
                  aria-label={`Sélectionner ${player.firstName} ${player.lastName}`}
                />
              </td>
              <td className="number-col">{player.jerseyNumber ?? player.id}</td>
              <td className="photo-col">
                {player.photo ? (
                  <img
                    src={player.photo}
                    alt={`${player.firstName} ${player.lastName}`}
                    className="player-photo"
                  />
                ) : (
                  <div className="player-photo-placeholder">
                    {getInitials(player.firstName, player.lastName)}
                  </div>
                )}
              </td>
              <td className="lastname-col">{player.lastName}</td>
              <td className="firstname-col">{player.firstName}</td>
              <td className="role-col">{player.position || 'Non défini'}</td>
              <td className="admin-col">
                {player.isAdmin ? (
                  <svg
                    className="check-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M16.667 5L7.5 14.167L3.333 10"
                      stroke="#4CAF50"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  <svg
                    className="cross-icon"
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 5L15 15M15 5L5 15"
                      stroke="#F44336"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                )}
              </td>
              <td className="email-col">{player.email}</td>
              <td className="phone-col">{player.phone}</td>
              <td className="birthdate-col">
                {formatDate(player.dateOfBirth)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {displayPlayers.length === 0 && (
        <div className="no-players-message">
          Aucun joueur trouvé
        </div>
      )}
    </div>
  );
}

export default PlayersTable;

