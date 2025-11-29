import MatchCard from './MatchCard';
import './MatchList.css';

/**
 * Composant MatchList - Affiche une liste de MatchCard
 * Composant ultra simple, sans logique métier, juste un map sur les matchs
 * 
 * @param {Array} matches - Liste des matchs à afficher
 */
function MatchList({ matches = [] }) {
  if (matches.length === 0) {
    return (
      <div className="match-list-empty">
        <p>Aucun match trouvé.</p>
        <p className="match-list-empty-subtitle">
          Créez votre premier match pour commencer !
        </p>
      </div>
    );
  }

  return (
    <div className="match-list">
      {matches.map((match) => (
        <MatchCard key={match.id} match={match} />
      ))}
    </div>
  );
}

export default MatchList;
