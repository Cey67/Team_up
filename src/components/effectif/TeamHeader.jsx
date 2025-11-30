import './TeamHeader.css';
import logo2 from '../../assets/logo2.svg';

function TeamHeader({ teamName = 'FC STRASBOURG', teamLogo }) {
  const logoToDisplay = teamLogo || logo2;

  return (
    <div className="team-header">
      <div className="team-header-logo">
        <img src={logoToDisplay} alt={`Logo ${teamName}`} className="team-logo-img" />
      </div>
      <h2 className="team-header-name">{teamName}</h2>
    </div>
  );
}

export default TeamHeader;

