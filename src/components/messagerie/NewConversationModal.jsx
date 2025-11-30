import { useState, useEffect } from 'react';
import './NewConversationModal.css';
import { playersService, conversationsService } from '../../services/api';

const getInitials = (firstName, lastName) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return firstInitial + lastInitial;
};

function NewConversationModal({ isOpen, onClose, onConversationCreated, currentUserId = "1" }) {
  const [players, setPlayers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const loadPlayers = async () => {
      try {
        setLoading(true);
        setError(null);
        const allPlayers = await playersService.getAll();
        const availablePlayers = allPlayers.filter(player => player.id !== currentUserId);
        setPlayers(availablePlayers);
      } catch (err) {
        console.error('Erreur lors du chargement des joueurs:', err);
        setError('Impossible de charger la liste des joueurs.');
      } finally {
        setLoading(false);
      }
    };

    loadPlayers();
  }, [isOpen, currentUserId]);

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
      setSelectedPlayer(null);
      setError(null);
    }
  }, [isOpen]);

  const filteredPlayers = players.filter((player) => {
    if (!searchQuery.trim()) {
      return true;
    }
    const fullName = `${player.firstName} ${player.lastName}`.toLowerCase();
    const position = player.position ? player.position.toLowerCase() : '';
    const email = player.email ? player.email.toLowerCase() : '';
    return fullName.includes(searchQuery.toLowerCase()) || 
           position.includes(searchQuery.toLowerCase()) ||
           email.includes(searchQuery.toLowerCase());
  });

  const findExistingConversation = async (recipientId) => {
    try {
      const allConversations = await conversationsService.getAll();
      return allConversations.find(conv => conv.userId === recipientId) || null;
    } catch (err) {
      console.error('Erreur lors de la recherche de conversation:', err);
      return null;
    }
  };

  const handleCreateConversation = async (player) => {
    try {
      setLoading(true);
      setError(null);

      const existingConversation = await findExistingConversation(player.id);
      
      if (existingConversation) {
        if (onConversationCreated) {
          onConversationCreated(existingConversation);
        }
        onClose();
        return;
      }

      const newConversation = {
        userId: player.id,
        firstName: player.firstName,
        lastName: player.lastName,
        position: player.position || '',
        lastMessage: '',
        lastMessageTime: new Date().toISOString(),
        unread: 0,
        photo: player.photo || null,
        isOnline: false
      };

      const createdConversation = await conversationsService.create(newConversation);
      
      if (onConversationCreated) {
        onConversationCreated(createdConversation);
      }
      
      onClose();
    } catch (err) {
      console.error('Erreur lors de la création de la conversation:', err);
      setError('Impossible de créer la conversation. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectPlayer = (player) => {
    setSelectedPlayer(player);
    handleCreateConversation(player);
  };

  if (!isOpen) return null;

  return (
    <div className="new-conversation-modal-overlay" onClick={onClose}>
      <div className="new-conversation-modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="new-conversation-modal-header">
          <h2 className="new-conversation-modal-title">Nouveau message</h2>
          <button
            className="new-conversation-modal-close"
            onClick={onClose}
            aria-label="Fermer le modal"
            disabled={loading}
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6L18 18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="new-conversation-modal-body">
          <div className="new-conversation-search">
            <svg 
              className="new-conversation-search-icon" 
              width="18" 
              height="18" 
              viewBox="0 0 24 24" 
              fill="none" 
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle 
                cx="11" 
                cy="11" 
                r="8" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
              <path 
                d="M21 21L16.65 16.65" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              />
            </svg>
            <input
              type="text"
              className="new-conversation-search-input"
              placeholder="Rechercher un joueur..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Rechercher un joueur"
              disabled={loading}
            />
          </div>

          {error && (
            <div className="new-conversation-error">
              {error}
            </div>
          )}

          <div className="new-conversation-players-list">
            {loading && players.length === 0 ? (
              <div className="new-conversation-loading">
                Chargement des joueurs...
              </div>
            ) : filteredPlayers.length === 0 ? (
              <div className="new-conversation-empty">
                <p>Aucun joueur trouvé</p>
                <p className="new-conversation-empty-subtitle">
                  {searchQuery ? 'Essayez une autre recherche' : 'Aucun joueur disponible'}
                </p>
              </div>
            ) : (
              filteredPlayers.map((player) => (
                <div
                  key={player.id}
                  className={`new-conversation-player-item ${selectedPlayer?.id === player.id ? 'selected' : ''}`}
                  onClick={() => !loading && handleSelectPlayer(player)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !loading) {
                      e.preventDefault();
                      handleSelectPlayer(player);
                    }
                  }}
                >
                  <div className="new-conversation-player-avatar">
                    {player.photo ? (
                      <img 
                        src={player.photo} 
                        alt={`${player.firstName} ${player.lastName}`} 
                        className="new-conversation-player-avatar-image" 
                      />
                    ) : (
                      <span className="new-conversation-player-avatar-initials">
                        {getInitials(player.firstName, player.lastName)}
                      </span>
                    )}
                  </div>
                  <div className="new-conversation-player-info">
                    <div className="new-conversation-player-name">
                      {player.firstName} {player.lastName}
                    </div>
                    {player.position && (
                      <div className="new-conversation-player-position">
                        {player.position}
                      </div>
                    )}
                  </div>
                  {loading && selectedPlayer?.id === player.id && (
                    <div className="new-conversation-loading-spinner">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="spinner"
                      >
                        <circle
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray="32"
                          strokeDashoffset="32"
                        >
                          <animate
                            attributeName="stroke-dasharray"
                            dur="2s"
                            values="0 32;16 16;0 32;0 32"
                            repeatCount="indefinite"
                          />
                          <animate
                            attributeName="stroke-dashoffset"
                            dur="2s"
                            values="0;-16;-32;-32"
                            repeatCount="indefinite"
                          />
                        </circle>
                      </svg>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NewConversationModal;

