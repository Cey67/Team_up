import './TeamComposition.css';

/**
 * Composant TeamComposition - Affiche la composition des équipes sur un terrain 5v5
 * Emplacements simples : 1 gardien, 1 défense, 2 milieux, 1 attaque
 * Utilise l'image du terrain fournie dans assets
 * 
 * @param {Array} teamA - Liste des joueurs de l'équipe A
 * @param {Array} teamB - Liste des joueurs de l'équipe B
 */
function TeamComposition({ teamA = [], teamB = [] }) {
  /**
   * Formate le nom d'un joueur (prénom + initiale du nom)
   * @param {Object} player - Données du joueur
   * @returns {string} - Nom formaté
   */
  const formatPlayerName = (player) => {
    if (!player) return '';
    return `${player.firstName} ${player.lastName.charAt(0)}.`;
  };

  /**
   * Organise les joueurs par position pour une équipe 5v5
   * Structure : 1 gardien, 1 défense, 2 milieux, 1 attaque
   * @param {Array} players - Liste des joueurs
   * @returns {Object} - Joueurs organisés par position
   */
  const organizeByPosition = (players) => {
    const positions = {
      gardien: [],
      defense: [],
      milieu: [],
      attaque: [],
    };

    players.forEach(player => {
      const position = player.position?.toLowerCase() || '';
      
      if (position.includes('gardien') || position.includes('goal')) {
        positions.gardien.push(player);
      } else if (position.includes('défense') || position.includes('defense') || position.includes('défenseur')) {
        positions.defense.push(player);
      } else if (position.includes('milieu')) {
        positions.milieu.push(player);
      } else if (position.includes('attaquant') || position.includes('attaque') || position.includes('avant')) {
        positions.attaque.push(player);
      } else {
        // Si pas de position définie, distribuer dans les postes manquants
        if (positions.gardien.length === 0) {
          positions.gardien.push(player);
        } else if (positions.defense.length === 0) {
          positions.defense.push(player);
        } else if (positions.milieu.length < 2) {
          positions.milieu.push(player);
        } else {
          positions.attaque.push(player);
        }
      }
    });

    return positions;
  };

  /**
   * Rendu d'un joueur à une position spécifique
   * @param {Object} player - Données du joueur
   * @param {string} positionKey - Clé de la position (gardien, defense, milieu, attaque)
   * @param {number} index - Index pour les positions multiples (milieu)
   * @returns {JSX.Element} - Élément de joueur
   */
  const renderPlayer = (player, positionKey, index = 0) => {
    if (!player) {
      return (
        <div 
          key={`${positionKey}-${index}-empty`}
          className="team-composition-player-slot team-composition-player-slot-empty"
          title="Emplacement vide"
        >
          <span className="team-composition-slot-label">{getPositionLabel(positionKey, index)}</span>
        </div>
      );
    }

    return (
      <div 
        key={player.id || `${positionKey}-${index}`}
        className="team-composition-player-slot"
        title={`${player.firstName} ${player.lastName} - ${player.position || 'Joueur'}`}
      >
        <div className="team-composition-player-badge">
          {player.jerseyNumber || '?'}
        </div>
        <span className="team-composition-player-name">
          {formatPlayerName(player)}
        </span>
      </div>
    );
  };

  /**
   * Obtient le label d'une position
   * @param {string} positionKey - Clé de la position
   * @param {number} index - Index pour les positions multiples
   * @returns {string} - Label de la position
   */
  const getPositionLabel = (positionKey, index = 0) => {
    const labels = {
      gardien: 'G',
      defense: 'D',
      milieu: index === 0 ? 'M1' : 'M2',
      attaque: 'A',
    };
    return labels[positionKey] || '?';
  };

  const positionsA = organizeByPosition(teamA);
  const positionsB = organizeByPosition(teamB);

  return (
    <div className="team-composition">
      <h3 className="team-composition-title">Composition des équipes (5v5)</h3>
      
      <div className="team-composition-field-wrapper">
        <div className="team-composition-field" />
        
        <div className="team-composition-overlay">
          {/* Équipe A (à gauche) */}
          <div className="team-composition-team team-composition-team-a">
            <div className="team-composition-team-label">Équipe A</div>
            
            {/* Positions fixes pour 5v5 */}
            <div className="team-composition-positions">
              {/* Attaque */}
              <div className="team-composition-position-row team-composition-position-attaque">
                {renderPlayer(positionsA.attaque[0], 'attaque')}
              </div>
              
              {/* Milieux (2) */}
              <div className="team-composition-position-row team-composition-position-milieu">
                {renderPlayer(positionsA.milieu[0], 'milieu', 0)}
                {renderPlayer(positionsA.milieu[1], 'milieu', 1)}
              </div>
              
              {/* Défense */}
              <div className="team-composition-position-row team-composition-position-defense">
                {renderPlayer(positionsA.defense[0], 'defense')}
              </div>
              
              {/* Gardien */}
              <div className="team-composition-position-row team-composition-position-gardien">
                {renderPlayer(positionsA.gardien[0], 'gardien')}
              </div>
            </div>
          </div>

          {/* Équipe B (à droite) */}
          <div className="team-composition-team team-composition-team-b">
            <div className="team-composition-team-label">Équipe B</div>
            
            {/* Positions fixes pour 5v5 */}
            <div className="team-composition-positions">
              {/* Attaque */}
              <div className="team-composition-position-row team-composition-position-attaque">
                {renderPlayer(positionsB.attaque[0], 'attaque')}
              </div>
              
              {/* Milieux (2) */}
              <div className="team-composition-position-row team-composition-position-milieu">
                {renderPlayer(positionsB.milieu[0], 'milieu', 0)}
                {renderPlayer(positionsB.milieu[1], 'milieu', 1)}
              </div>
              
              {/* Défense */}
              <div className="team-composition-position-row team-composition-position-defense">
                {renderPlayer(positionsB.defense[0], 'defense')}
              </div>
              
              {/* Gardien */}
              <div className="team-composition-position-row team-composition-position-gardien">
                {renderPlayer(positionsB.gardien[0], 'gardien')}
              </div>
            </div>
          </div>
        </div>
      </div>

      {(teamA.length === 0 && teamB.length === 0) && (
        <div className="team-composition-empty-state">
          <p>Les équipes seront composées automatiquement selon les positions avant le match.</p>
        </div>
      )}
    </div>
  );
}

export default TeamComposition;