import './Card.css';

function LastMatchCard() {
  const lastMatch = null;

  return (
    <div className="card match-card last-match-card">
      <h3 className="card-title">Dernier match</h3>
      <div className="card-content">
        {lastMatch ? (
          <div className="match-info">
            <p className="match-date">{lastMatch.date}</p>
            <p className="match-location">{lastMatch.location}</p>
            <p className="match-result">
              {lastMatch.team1} {lastMatch.score1} - {lastMatch.score2} {lastMatch.team2}
            </p>
          </div>
        ) : (
          <p className="card-empty">Aucun match récent</p>
        )}
      </div>
    </div>
  );
}

export default LastMatchCard;

