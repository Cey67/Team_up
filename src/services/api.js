/**
 * Service API pour communiquer avec json-server
 * Centralise tous les appels API pour faciliter la maintenance
 * et la transition vers un vrai backend Express plus tard
 */

const API_BASE_URL = 'http://localhost:3001';

/**
 * Fonction utilitaire pour effectuer des requêtes HTTP
 * Gère les erreurs de manière centralisée
 * 
 * @param {string} endpoint - Endpoint de l'API (ex: '/players')
 * @param {object} options - Options de la requête fetch (method, body, etc.)
 * @returns {Promise} - Promesse résolue avec les données JSON
 */
async function fetchAPI(endpoint, options = {}) {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Erreur lors de l'appel API ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Service pour les joueurs (effectif)
 */
export const playersService = {
  /**
   * Récupère tous les joueurs
   * @returns {Promise<Array>} - Liste de tous les joueurs
   */
  getAll: async () => {
    return fetchAPI('/players');
  },

  /**
   * Récupère un joueur par son ID
   * @param {number} id - ID du joueur
   * @returns {Promise<Object>} - Données du joueur
   */
  getById: async (id) => {
    return fetchAPI(`/players/${id}`);
  },

  /**
   * Crée un nouveau joueur
   * @param {object} playerData - Données du joueur à créer
   * @returns {Promise<Object>} - Joueur créé
   */
  create: async (playerData) => {
    return fetchAPI('/players', {
      method: 'POST',
      body: JSON.stringify(playerData),
    });
  },

  /**
   * Met à jour un joueur
   * @param {number} id - ID du joueur
   * @param {object} playerData - Données à mettre à jour
   * @returns {Promise<Object>} - Joueur mis à jour
   */
  update: async (id, playerData) => {
    return fetchAPI(`/players/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(playerData),
    });
  },

  /**
   * Supprime un joueur
   * @param {number} id - ID du joueur
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    return fetchAPI(`/players/${id}`, {
      method: 'DELETE',
    });
  },

  /**
   * Recherche des joueurs par critères
   * @param {object} filters - Critères de recherche (ex: { role: 'Joueur' })
   * @returns {Promise<Array>} - Liste des joueurs correspondants
   */
  search: async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    return fetchAPI(`/players?${queryParams}`);
  },
};

/**
 * Service pour les statistiques des joueurs
 */
export const statisticsService = {
  /**
   * Récupère toutes les statistiques
   * @returns {Promise<Array>} - Liste de toutes les statistiques
   */
  getAll: async () => {
    return fetchAPI('/statistics');
  },

  /**
   * Récupère les statistiques d'un joueur par son ID
   * @param {number} playerId - ID du joueur
   * @returns {Promise<Object>} - Statistiques du joueur
   */
  getByPlayerId: async (playerId) => {
    const stats = await fetchAPI(`/statistics?playerId=${playerId}`);
    return stats[0] || null;
  },

  /**
   * Récupère les statistiques par ID de statistique
   * @param {number} id - ID de la statistique
   * @returns {Promise<Object>} - Statistiques
   */
  getById: async (id) => {
    return fetchAPI(`/statistics/${id}`);
  },

  /**
   * Met à jour les statistiques d'un joueur
   * @param {number} id - ID de la statistique
   * @param {object} statsData - Données à mettre à jour
   * @returns {Promise<Object>} - Statistiques mises à jour
   */
  update: async (id, statsData) => {
    return fetchAPI(`/statistics/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(statsData),
    });
  },
};

/**
 * Service pour les équipes
 */
export const teamsService = {
  /**
   * Récupère toutes les équipes
   * @returns {Promise<Array>} - Liste de toutes les équipes
   */
  getAll: async () => {
    return fetchAPI('/teams');
  },

  /**
   * Récupère une équipe par son ID
   * @param {number} id - ID de l'équipe
   * @returns {Promise<Object>} - Données de l'équipe
   */
  getById: async (id) => {
    return fetchAPI(`/teams/${id}`);
  },
};

/**
 * Service pour les matchs
 */
export const matchesService = {
  /**
   * Récupère tous les matchs
   * @returns {Promise<Array>} - Liste de tous les matchs
   */
  getAll: async () => {
    return fetchAPI('/matches');
  },

  /**
   * Récupère un match par son ID
   * @param {number} id - ID du match
   * @returns {Promise<Object>} - Données du match
   */
  getById: async (id) => {
    return fetchAPI(`/matches/${id}`);
  },
};

/**
 * Service pour les présences
 */
export const attendancesService = {
  /**
   * Récupère toutes les présences
   * @returns {Promise<Array>} - Liste de toutes les présences
   */
  getAll: async () => {
    return fetchAPI('/attendances');
  },

  /**
   * Récupère les présences d'un match
   * @param {number} matchId - ID du match
   * @returns {Promise<Array>} - Liste des présences pour ce match
   */
  getByMatchId: async (matchId) => {
    return fetchAPI(`/attendances?matchId=${matchId}`);
  },

  /**
   * Récupère les présences d'un joueur
   * @param {number} playerId - ID du joueur
   * @returns {Promise<Array>} - Liste des présences du joueur
   */
  getByPlayerId: async (playerId) => {
    return fetchAPI(`/attendances?playerId=${playerId}`);
  },

  /**
   * Récupère une présence par son ID
   * @param {number} id - ID de la présence
   * @returns {Promise<Object>} - Données de la présence
   */
  getById: async (id) => {
    return fetchAPI(`/attendances/${id}`);
  },

  /**
   * Crée ou met à jour une présence
   * json-server ne supporte pas bien les filtres multiples avec &,
   * donc on récupère toutes les présences du match et on filtre côté client
   * @param {object} attendanceData - Données de la présence { matchId, playerId, status }
   * @returns {Promise<Object>} - Présence créée ou mise à jour
   */
  upsert: async (attendanceData) => {
    try {
      // Récupère toutes les présences du match
      const matchAttendances = await fetchAPI(`/attendances?matchId=${attendanceData.matchId}`);
      
      // Cherche si une présence existe déjà pour ce match et ce joueur
      const existing = matchAttendances.find(
        att => att.matchId === attendanceData.matchId && att.playerId === attendanceData.playerId
      );
      
      if (existing) {
        // Met à jour la présence existante
        return fetchAPI(`/attendances/${existing.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            ...attendanceData,
            updatedAt: new Date().toISOString(),
          }),
        });
      } else {
        // Crée une nouvelle présence
        return fetchAPI('/attendances', {
          method: 'POST',
          body: JSON.stringify({
            ...attendanceData,
            updatedAt: new Date().toISOString(),
          }),
        });
      }
    } catch (error) {
      console.error('Erreur dans upsert:', error);
      throw error;
    }
  },

  /**
   * Met à jour une présence
   * @param {number} id - ID de la présence
   * @param {object} attendanceData - Données à mettre à jour
   * @returns {Promise<Object>} - Présence mise à jour
   */
  update: async (id, attendanceData) => {
    return fetchAPI(`/attendances/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...attendanceData,
        updatedAt: new Date().toISOString(),
      }),
    });
  },

  /**
   * Supprime une présence
   * @param {number} id - ID de la présence
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    return fetchAPI(`/attendances/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Service pour les conversations
 */
export const conversationsService = {
  /**
   * Récupère toutes les conversations
   * @returns {Promise<Array>} - Liste de toutes les conversations
   */
  getAll: async () => {
    return fetchAPI('/conversations');
  },

  /**
   * Récupère une conversation par son ID
   * @param {string} id - ID de la conversation
   * @returns {Promise<Object>} - Données de la conversation
   */
  getById: async (id) => {
    return fetchAPI(`/conversations/${id}`);
  },

  /**
   * Crée une nouvelle conversation
   * @param {object} conversationData - Données de la conversation à créer
   * @returns {Promise<Object>} - Conversation créée
   */
  create: async (conversationData) => {
    return fetchAPI('/conversations', {
      method: 'POST',
      body: JSON.stringify(conversationData),
    });
  },

  /**
   * Met à jour une conversation
   * @param {string} id - ID de la conversation
   * @param {object} conversationData - Données à mettre à jour
   * @returns {Promise<Object>} - Conversation mise à jour
   */
  update: async (id, conversationData) => {
    return fetchAPI(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(conversationData),
    });
  },

  /**
   * Supprime une conversation
   * @param {string} id - ID de la conversation
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    return fetchAPI(`/conversations/${id}`, {
      method: 'DELETE',
    });
  },
};

/**
 * Service pour les messages
 */
export const messagesService = {
  /**
   * Récupère tous les messages
   * @returns {Promise<Array>} - Liste de tous les messages
   */
  getAll: async () => {
    return fetchAPI('/messages');
  },

  /**
   * Récupère les messages d'une conversation
   * @param {string} conversationId - ID de la conversation
   * @returns {Promise<Array>} - Liste des messages de la conversation, triés par timestamp
   */
  getByConversationId: async (conversationId) => {
    const messages = await fetchAPI(`/messages?conversationId=${conversationId}`);
    // Trier les messages par timestamp (plus ancien en premier)
    return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  },

  /**
   * Récupère un message par son ID
   * @param {string} id - ID du message
   * @returns {Promise<Object>} - Données du message
   */
  getById: async (id) => {
    return fetchAPI(`/messages/${id}`);
  },

  /**
   * Crée un nouveau message
   * @param {object} messageData - Données du message à créer { conversationId, senderId, text }
   * @returns {Promise<Object>} - Message créé
   */
  create: async (messageData) => {
    return fetchAPI('/messages', {
      method: 'POST',
      body: JSON.stringify({
        ...messageData,
        timestamp: new Date().toISOString(),
      }),
    });
  },

  /**
   * Met à jour un message
   * @param {string} id - ID du message
   * @param {object} messageData - Données à mettre à jour
   * @returns {Promise<Object>} - Message mis à jour
   */
  update: async (id, messageData) => {
    return fetchAPI(`/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(messageData),
    });
  },

  /**
   * Supprime un message
   * @param {string} id - ID du message
   * @returns {Promise<void>}
   */
  delete: async (id) => {
    return fetchAPI(`/messages/${id}`, {
      method: 'DELETE',
    });
  },
};

export default {
  players: playersService,
  statistics: statisticsService,
  teams: teamsService,
  matches: matchesService,
  attendances: attendancesService,
  conversations: conversationsService,
  messages: messagesService,
};

