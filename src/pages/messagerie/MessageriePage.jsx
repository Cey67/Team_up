import { useState, useEffect } from 'react';
import './MessageriePage.css';
import ConversationList from '../../components/messagerie/ConversationList';
import ChatWindow from '../../components/messagerie/ChatWindow';
import NewConversationModal from '../../components/messagerie/NewConversationModal';
import { conversationsService, messagesService } from '../../services/api';

/**
 * Page de messagerie
 * Affiche la liste des conversations et une zone de recherche/chat
 * Les données sont chargées depuis db.json via json-server
 */
function MessageriePage() {
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isNewConversationModalOpen, setIsNewConversationModalOpen] = useState(false);
  
  // ID de l'utilisateur actuel (à remplacer par un vrai système d'authentification plus tard)
  const currentUserId = "1";

  /**
   * Charge toutes les conversations
   * Fonction réutilisable pour recharger la liste après création d'une nouvelle conversation
   */
  const loadConversations = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await conversationsService.getAll();
      // Trier les conversations par date du dernier message (plus récent en premier)
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

  /**
   * Charge toutes les conversations au montage du composant
   */
  useEffect(() => {
    loadConversations();
  }, []);

  /**
   * Charge les messages de la conversation sélectionnée
   */
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

  /**
   * Gère la sélection d'une conversation
   * @param {Object} conversation - La conversation sélectionnée
   */
  const handleSelectConversation = (conversation) => {
    setSelectedConversation(conversation);
  };

  /**
   * Gère le clic sur le bouton "Nouveau message"
   * Ouvre le modal pour sélectionner un destinataire
   */
  const handleNewMessage = () => {
    setIsNewConversationModalOpen(true);
  };

  /**
   * Gère la fermeture du modal de nouvelle conversation
   */
  const handleCloseNewConversationModal = () => {
    setIsNewConversationModalOpen(false);
  };

  /**
   * Gère la création d'une nouvelle conversation
   * Recharge la liste des conversations et sélectionne la nouvelle conversation
   * @param {Object} conversation - La conversation créée ou existante
   */
  const handleConversationCreated = async (conversation) => {
    // Recharger la liste des conversations pour inclure la nouvelle
    await loadConversations();
    // Sélectionner automatiquement la nouvelle conversation
    setSelectedConversation(conversation);
  };

  /**
   * Gère l'envoi d'un nouveau message
   * @param {string} conversationId - ID de la conversation
   * @param {string} text - Texte du message
   */
  const handleSendMessage = async (conversationId, text) => {
    try {
      // Créer le message
      const newMessage = await messagesService.create({
        conversationId,
        senderId: currentUserId,
        text
      });

      // Ajouter le message à la liste locale
      setMessages(prev => [...prev, newMessage]);

      // Mettre à jour la conversation avec le dernier message
      const conversation = conversations.find(c => c.id === conversationId);
      if (conversation) {
        await conversationsService.update(conversationId, {
          lastMessage: text,
          lastMessageTime: new Date().toISOString()
        });

        // Recharger les conversations pour mettre à jour l'ordre
        await loadConversations();
      }
    } catch (err) {
      console.error('Erreur lors de l\'envoi du message:', err);
      throw err;
    }
  };

  /**
   * Gère la suppression d'une conversation
   * @param {string} conversationId - ID de la conversation à supprimer
   */
  const handleDeleteConversation = async (conversationId) => {
    try {
      await conversationsService.delete(conversationId);
      
      // Si la conversation supprimée était sélectionnée, désélectionner
      if (selectedConversation?.id === conversationId) {
        setSelectedConversation(null);
        setMessages([]);
      }
      
      // Recharger la liste des conversations
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

        {/* Affichage des erreurs */}
        {error && (
          <div className="messagerie-error">
            {error}
          </div>
        )}

        {/* Affichage du chargement */}
        {loading ? (
          <div className="messagerie-loading">
            Chargement des conversations...
          </div>
        ) : (
          <div className="messagerie-layout">
            {/* Panneau gauche : Liste des conversations */}
            <ConversationList
              conversations={conversations}
              selectedConversation={selectedConversation}
              onSelectConversation={handleSelectConversation}
              onNewMessage={handleNewMessage}
              onDeleteConversation={handleDeleteConversation}
            />

            {/* Panneau droit : Zone de chat */}
            <ChatWindow
              selectedConversation={selectedConversation}
              messages={messages}
              onSendMessage={handleSendMessage}
              currentUserId={currentUserId}
            />
          </div>
        )}

        {/* Modal pour créer une nouvelle conversation */}
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
