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

export default {
  players: playersService,
  statistics: statisticsService,
  teams: teamsService,
  matches: matchesService,
};

