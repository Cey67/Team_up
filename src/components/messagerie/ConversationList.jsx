import { useState } from 'react';
import './ConversationList.css';
import ConversationItem from './ConversationItem';
import courrierIcon from '../../assets/courrier.png';

function ConversationList({ 
  conversations, 
  selectedConversation, 
  onSelectConversation, 
  onNewMessage,
  onDeleteConversation
}) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    if (!searchQuery.trim()) {
      return true;
    }
    const fullName = `${conv.firstName} ${conv.lastName}`.toLowerCase();
    const position = conv.position ? conv.position.toLowerCase() : '';
    return fullName.includes(searchQuery.toLowerCase()) || 
           position.includes(searchQuery.toLowerCase());
  });

  return (
    <div className="conversation-list-panel">
      <div className="conversation-list-header">
        <div className="conversation-list-search">
          <svg 
            className="conversation-list-search-icon" 
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
            className="conversation-list-search-input"
            placeholder="Rechercher une conversation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            aria-label="Rechercher une conversation"
          />
        </div>
        <button
          className="conversation-list-new-message-btn"
          onClick={onNewMessage}
          title="Nouveau message"
          aria-label="Nouveau message"
        >
          <img src={courrierIcon} alt="Nouveau message" className="conversation-list-new-message-icon" />
          <svg 
            width="14" 
            height="14" 
            viewBox="0 0 14 14" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className="conversation-list-new-message-plus"
          >
            <path 
              d="M7 1V13M1 7H13" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round"
            />
          </svg>
        </button>
      </div>

      <div className="conversation-list-content">
        {filteredConversations.length === 0 ? (
          <div className="conversation-list-empty">
            <p>Aucune conversation trouvée</p>
            <p className="conversation-list-empty-subtitle">
              {searchQuery ? 'Essayez une autre recherche' : 'Commencez une nouvelle conversation'}
            </p>
          </div>
        ) : (
          filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isActive={selectedConversation?.id === conversation.id}
              onClick={() => onSelectConversation(conversation)}
              onDelete={onDeleteConversation}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default ConversationList;
