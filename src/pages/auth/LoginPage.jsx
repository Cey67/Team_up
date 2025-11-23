import AuthCardLogin from '../../components/AuthCardLogin';
import AuthPlayerImage from '../../components/AuthPlayerImage';
import './Auth.css';

/**
 * Page de connexion de l'application Team Up
 * Affiche un formulaire de connexion avec une image de joueur en arrière-plan
 */
function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        {/* Panneau gauche avec l'image du joueur */}
        <AuthPlayerImage />

        {/* Panneau droit avec le formulaire de connexion */}
        <AuthCardLogin />
      </div>
    </div>
  );
}

export default LoginPage;
