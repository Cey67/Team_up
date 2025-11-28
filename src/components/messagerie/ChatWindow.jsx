import { useState, useRef, useEffect } from 'react';
import './ChatWindow.css';

/**
 * Formate l'heure d'un message pour l'affichage dans la conversation
 * @param {string} timestamp - Timestamp ISO
 * @returns {string} Heure formatée (ex: "14:30")
 */
const formatMessageTime = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  return date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });
};

/**
 * Composant Message - Affiche un message individuel dans la conversation
 */
function Message({ message, isOwn, isGroup }) {
  return (
    <div className={`chat-message ${isOwn ? 'chat-message-own' : 'chat-message-other'}`}>
      <div className="chat-message-content">
        {isGroup && !isOwn && message.senderName && (
          <span className="chat-message-sender-name">{message.senderName}</span>
        )}
        <p className="chat-message-text">{message.text}</p>
        <span className="chat-message-time">{formatMessageTime(message.timestamp)}</span>
      </div>
    </div>
  );
}

/**
 * Composant ChatWindow - Fenêtre de chat principale
 * Affiche les messages et permet d'envoyer de nouveaux messages
 * @param {Object} selectedConversation - Conversation actuellement sélectionnée
 * @param {Array} messages - Liste des messages de la conversation
 * @param {Function} onSendMessage - Fonction appelée pour envoyer un message
 * @param {string} currentUserId - ID de l'utilisateur actuel
 */
function ChatWindow({ 
  selectedConversation, 
  messages = [],
  onSendMessage,
  currentUserId = "1"
}) {
  const [messageText, setMessageText] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  /**
   * Fait défiler vers le bas quand de nouveaux messages arrivent
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  /**
   * Focus sur l'input quand une conversation est sélectionnée
   */
  useEffect(() => {
    if (selectedConversation) {
      inputRef.current?.focus();
    }
  }, [selectedConversation]);

  /**
   * Gère l'envoi d'un message
   */
  const handleSendMessage = async (e) => {
    e.preventDefault();
    
    if (!messageText.trim() || !selectedConversation || sending) {
      return;
    }

    const text = messageText.trim();
    setMessageText('');
    setSending(true);

    try {
      await onSendMessage(selectedConversation.id, text);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du message:', error);
      // Remettre le texte en cas d'erreur
      setMessageText(text);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  /**
   * Gère la touche Entrée (envoie le message)
   * Shift+Entrée pour un saut de ligne
   */
  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  return (
    <div className="chat-window-panel">
      {selectedConversation ? (
        <>
          {/* En-tête de la conversation */}
          <div className="chat-window-header">
            <div className="chat-window-header-info">
              <h2 className="chat-window-header-name">
                {selectedConversation.isGroup 
                  ? selectedConversation.name 
                  : `${selectedConversation.firstName} ${selectedConversation.lastName}`}
              </h2>
              {selectedConversation.isGroup ? (
                <span className="chat-window-header-position">
                  {selectedConversation.members?.length || 0} membres
                </span>
              ) : selectedConversation.position && (
                <span className="chat-window-header-position">{selectedConversation.position}</span>
              )}
            </div>
            {!selectedConversation.isGroup && selectedConversation.isOnline && (
              <span className="chat-window-header-online">En ligne</span>
            )}
          </div>

          {/* Zone des messages */}
          <div className="chat-window-messages">
            {messages.length === 0 ? (
              <div className="chat-window-empty">
                <p>Aucun message pour le moment</p>
                <p className="chat-window-empty-subtitle">
                  {selectedConversation.isGroup
                    ? "Commencez la conversation avec l'équipe"
                    : `Commencez la conversation avec ${selectedConversation.firstName}`}
                </p>
              </div>
            ) : (
              <>
                {messages.map((message) => (
                  <Message
                    key={message.id}
                    message={message}
                    isOwn={String(message.senderId) === currentUserId}
                    isGroup={selectedConversation.isGroup}
                  />
                ))}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>

          {/* Zone de saisie */}
          <form className="chat-window-input-area" onSubmit={handleSendMessage}>
            <textarea
              ref={inputRef}
              className="chat-window-input"
              placeholder="Tapez votre message..."
              value={messageText}
              onChange={(e) => setMessageText(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending || !selectedConversation}
              rows={1}
              aria-label="Zone de saisie de message"
            />
            <button
              type="submit"
              className="chat-window-send-btn"
              disabled={!messageText.trim() || sending || !selectedConversation}
              aria-label="Envoyer le message"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </form>
        </>
      ) : (
        <div className="chat-window-empty">
          <div className="chat-window-empty-content">
            <svg 
              width="64" 
              height="64" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              className="chat-window-empty-icon"
            >
              <path d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z" />
              <path d="M22 6L12 13L2 6" />
            </svg>
            <p className="chat-window-empty-title">Aucune conversation sélectionnée</p>
            <p className="chat-window-empty-subtitle">
              Sélectionnez une conversation pour commencer à discuter
            </p>
          </div>
        </div>
      )}

    </div>
  );
}

export default ChatWindow;
