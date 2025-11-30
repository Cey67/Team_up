import playerImage from '../../assets/player.jpg';
import '../../pages/auth/Auth.css';

function AuthPlayerImage() {
  return (
    <div className="auth-image-panel">
      <div className="auth-image-frame">
        <img 
          src={playerImage} 
          alt="Joueur de football" 
          className="auth-player-image"
          onError={(e) => {
            e.target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

export default AuthPlayerImage;

