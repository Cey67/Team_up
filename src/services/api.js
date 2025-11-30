const API_BASE_URL = 'http://localhost:3001';

/**
 * Fonction utilitaire pour effectuer des requêtes HTTP
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

export const playersService = {
  getAll: async () => {
    return fetchAPI('/players');
  },

  getById: async (id) => {
    return fetchAPI(`/players/${id}`);
  },

  create: async (playerData) => {
    return fetchAPI('/players', {
      method: 'POST',
      body: JSON.stringify(playerData),
    });
  },

  update: async (id, playerData) => {
    return fetchAPI(`/players/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(playerData),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/players/${id}`, {
      method: 'DELETE',
    });
  },

  search: async (filters) => {
    const queryParams = new URLSearchParams(filters).toString();
    return fetchAPI(`/players?${queryParams}`);
  },
};

export const statisticsService = {
  getAll: async () => {
    return fetchAPI('/statistics');
  },

  getByPlayerId: async (playerId) => {
    const stats = await fetchAPI(`/statistics?playerId=${playerId}`);
    return stats[0] || null;
  },

  getById: async (id) => {
    return fetchAPI(`/statistics/${id}`);
  },

  update: async (id, statsData) => {
    return fetchAPI(`/statistics/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(statsData),
    });
  },
};

export const teamsService = {
  getAll: async () => {
    return fetchAPI('/teams');
  },

  getById: async (id) => {
    return fetchAPI(`/teams/${id}`);
  },
};

export const matchesService = {
  getAll: async () => {
    return fetchAPI('/matches');
  },

  getById: async (id) => {
    return fetchAPI(`/matches/${id}`);
  },

  create: async (matchData) => {
    return fetchAPI('/matches', {
      method: 'POST',
      body: JSON.stringify(matchData),
    });
  },

  update: async (id, matchData) => {
    return fetchAPI(`/matches/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(matchData),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/matches/${id}`, {
      method: 'DELETE',
    });
  },
};

export const attendancesService = {
  getAll: async () => {
    return fetchAPI('/attendances');
  },

  getByMatchId: async (matchId) => {
    return fetchAPI(`/attendances?matchId=${matchId}`);
  },

  getByPlayerId: async (playerId) => {
    return fetchAPI(`/attendances?playerId=${playerId}`);
  },

  getById: async (id) => {
    return fetchAPI(`/attendances/${id}`);
  },

  upsert: async (attendanceData) => {
    try {
      const matchAttendances = await fetchAPI(`/attendances?matchId=${attendanceData.matchId}`);
      
      const existing = matchAttendances.find(
        att => att.matchId === attendanceData.matchId && att.playerId === attendanceData.playerId
      );
      
      if (existing) {
        return fetchAPI(`/attendances/${existing.id}`, {
          method: 'PATCH',
          body: JSON.stringify({
            ...attendanceData,
            updatedAt: new Date().toISOString(),
          }),
        });
      } else {
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

  update: async (id, attendanceData) => {
    return fetchAPI(`/attendances/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...attendanceData,
        updatedAt: new Date().toISOString(),
      }),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/attendances/${id}`, {
      method: 'DELETE',
    });
  },
};

export const conversationsService = {
  getAll: async () => {
    return fetchAPI('/conversations');
  },

  getById: async (id) => {
    return fetchAPI(`/conversations/${id}`);
  },

  create: async (conversationData) => {
    return fetchAPI('/conversations', {
      method: 'POST',
      body: JSON.stringify(conversationData),
    });
  },

  update: async (id, conversationData) => {
    return fetchAPI(`/conversations/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(conversationData),
    });
  },

  delete: async (id) => {
    return fetchAPI(`/conversations/${id}`, {
      method: 'DELETE',
    });
  },
};

export const messagesService = {
  getAll: async () => {
    return fetchAPI('/messages');
  },

  getByConversationId: async (conversationId) => {
    const messages = await fetchAPI(`/messages?conversationId=${conversationId}`);
    return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  },

  getById: async (id) => {
    return fetchAPI(`/messages/${id}`);
  },

  create: async (messageData) => {
    return fetchAPI('/messages', {
      method: 'POST',
      body: JSON.stringify({
        ...messageData,
        timestamp: new Date().toISOString(),
      }),
    });
  },

  update: async (id, messageData) => {
    return fetchAPI(`/messages/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(messageData),
    });
  },

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

