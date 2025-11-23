import AuthCardRegister from '../../components/AuthCardRegister';
import AuthPlayerImage from '../../components/AuthPlayerImage';
import './Auth.css';

/**
 * Page d'inscription de l'application Team Up
 * Affiche un formulaire d'inscription avec une image de joueur en arrière-plan
 */
function RegisterPage() {
  return (
    <div className="auth-container">
      <div className="auth-wrapper auth-wrapper-register">
        {/* Panneau droit avec l'image du joueur */}
        <AuthPlayerImage />

        {/* Panneau gauche avec le formulaire d'inscription */}
        <AuthCardRegister />
      </div>
    </div>
  );
}

export default RegisterPage;
