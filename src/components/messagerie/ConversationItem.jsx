import './ConversationItem.css';

const getInitials = (firstName, lastName) => {
  const firstInitial = firstName ? firstName.charAt(0).toUpperCase() : '';
  const lastInitial = lastName ? lastName.charAt(0).toUpperCase() : '';
  return firstInitial + lastInitial;
};

function ConversationItem({ conversation, isActive, onClick, onDelete }) {
  const { 
    id, 
    firstName, 
    lastName,
    name,
    isGroup = false,
    lastMessage, 
    lastMessageTime,
    unread, 
    photo,
    isOnline = false,
    position
  } = conversation;

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Êtes-vous sûr de vouloir supprimer la conversation avec ${isGroup ? name : `${firstName} ${lastName}`} ?`)) {
      if (onDelete) {
        onDelete(id);
      }
    }
  };

  return (
    <div
      className={`conversation-item ${isActive ? 'conversation-item-active' : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      aria-label={`Conversation avec ${isGroup ? name : `${firstName} ${lastName}`}`}
    >
      <div className="conversation-item-avatar-wrapper">
        {isGroup ? (
          <div className="conversation-item-group-avatar">
            <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
        ) : (
          <>
            <div className="conversation-item-avatar">
              {photo ? (
                <img src={photo} alt={`${firstName} ${lastName}`} className="conversation-item-avatar-image" />
              ) : (
                <span className="conversation-item-avatar-initials">{getInitials(firstName, lastName)}</span>
              )}
            </div>
            {isOnline && (
              <span className="conversation-item-online-indicator" title="En ligne"></span>
            )}
          </>
        )}
      </div>
      
      <div className="conversation-item-info">
        <div className="conversation-item-name">
          {isGroup ? name : `${firstName} ${lastName}`}
        </div>
      </div>
      
      {unread > 0 && (
        <div 
          className="conversation-item-notification-dot" 
          aria-label={`${unread} message${unread > 1 ? 's' : ''} non lu${unread > 1 ? 's' : ''}`}
          title={`${unread} message${unread > 1 ? 's' : ''} non lu${unread > 1 ? 's' : ''}`}
        />
      )}
      
      <button
        className="conversation-item-delete-btn"
        onClick={handleDelete}
        aria-label="Supprimer la conversation"
        title="Supprimer la conversation"
      >
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
          <line x1="10" y1="11" x2="10" y2="17" />
          <line x1="14" y1="11" x2="14" y2="17" />
        </svg>
      </button>
    </div>
  );
}

export default ConversationItem;
