import { useState, useEffect } from 'react';
import './MessageriePage.css';
import ConversationList from '../../components/messagerie/ConversationList';
import ChatWindow from '../../components/messagerie/ChatWindow';
import NewConversationModal from '../../components/messagerie/NewConversationModal';
import { conversationsService, messagesService } from '../../services/api';

function MessageriePage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);
  
  const currentUserId = "1";

  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await conversationsService.getAll();
      const sorted = data.sort((a, b) => {
        const dateA = new Date(a.lastMessageTime || 0);
        const dateB = new Date(b.lastMessageTime || 0);
        return dateB - dateA;
      });
      setConversations(sorted);
    } catch (err) {
      console.error('Erreur lors du chargement des conversations:', err);
      setError('Impossible de charger les conversations. Vérifiez que json-server est démarré.');
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      if (!selectedConversation) {
        setMessages([]);
        return;
      }

      try {
        const data = await messagesService.getByConversationId(selectedConversation.id);
        setMessages(data);
      } catch (err) {
        console.error('Erreur lors du chargement des messages:', err);
        setMessages([]);
      }
    };

    loadMessages();
  }, [selectedConversation]);

  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  const handleNewMessage = () => {
    setIsNewConversationModalOpen(true);
  };

  const handleCloseNewConversationModal = () => {
    setIsNewConversationModalOpen(false);
  };

  const handleConversationCreated = async (conversation) => {
    await loadConversations();
    setSelectedConversation(conversation);
  };

  const handleSendMessage = async (conversationId, text) => {
    try {
      const newMessage = await messagesService.create({
        conversationId,
        senderId: currentUserId,
        text
      });

      setMessages(prev => [...prev, newMessage]);

      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        await conversationsService.update(conversationId, {
          lastMessage: text,
          lastMessageTime: new Date().toISOString()
        });

        await loadConversations();
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      throw err;
    }
  };

  const handleDeleteConversation = async (conversationId) => {
    try {
      await conversationsService.delete(conversationId);
      
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      
      await loadConversations();
    } catch (err) {
      console.error('Erreur lors de la suppression de la conversation:', err);
      setError('Impossible de supprimer la conversation. Veuillez réessayer.');
    }
  };

  return (
    <div className="messagerie-page-container">
      <div className="messagerie-page-content">
        <h1 className="messagerie-page-title">Messagerie</h1>

        {error && (
          <div className="messagerie-error">
            {error}
          </div>
        )}

        {loading ? (
          <div className="messagerie-loading">
            Chargement des conversations...
          </div>
        ) : (
          <div className="messagerie-layout">
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
              onNewMessage={handleNewMessage}
              onDeleteConversation={handleDeleteConversation}
            />

            <ChatWindow
              selectedConversation={selectedConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={currentUserId}
            />
          </div>
        )}

        <NewConversationModal
          isOpen={isNewConversationModalOpen}
          onClose={handleCloseNewConversationModal}
          onConversationCreated={handleConversationCreated}
          currentUserId={currentUserId}
        />
      </div>
    </div>
  );
}

export default MessageriePage;
