import playerImage from '../assets/player.jpg';
import '../pages/auth/Auth.css';

/**
 * Composant pour afficher l'image du joueur dans les pages d'authentification
 * 
 * @component
 */
function AuthPlayerImage() {
  return (
    <div className="auth-image-panel">
      <div className="auth-image-frame">
        <img 
          src={playerImage} 
          alt="Joueur de football" 
          className="auth-player-image"
          onError={(e) => {
            // Fallback si l'image n'est pas trouvée
            e.target.style.display = 'none';
          }}
        />
      </div>
    </div>
  );
}

export default AuthPlayerImage;

