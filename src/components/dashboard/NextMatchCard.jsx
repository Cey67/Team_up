import './Card.css';

function NextMatchCard() {
  const nextMatch = null;

  return (
    <div className="card match-card next-match-card">
      <h3 className="card-title">Prochain match</h3>
      <div className="card-content">
        {nextMatch ? (
          <div className="match-info">
            <p className="match-date">{nextMatch.date}</p>
            <p className="match-location">{nextMatch.location}</p>
            <p className="match-teams">{nextMatch.team1} vs {nextMatch.team2}</p>
          </div>
        ) : (
          <p className="card-empty">Aucun match programmé</p>
        )}
      </div>
    </div>
  );
}

export default NextMatchCard;

