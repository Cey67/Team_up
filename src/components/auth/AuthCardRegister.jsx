import { Link } from 'react-router-dom';
import '../../pages/auth/Auth.css';

function AuthCardRegister() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique frontend uniquement - pas de validation ni d'appel API
  };

  return (
    <div className="auth-form-panel">
      <div className="auth-form-content">
        <h1 className="auth-title">S'inscrire</h1>
        
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
          {/* Champ Nom d'utilisateur */}
          <div className="auth-input-group">
            <label htmlFor="username" className="auth-label">
              Nom d'utilisateur
            </label>
            <div className="auth-input-wrapper">
              <input
                type="text"
                id="username"
                name="username"
                className="auth-input"
                placeholder="votre_nom_utilisateur"
                autoComplete="username"
              />
              <span className="auth-input-icon user-icon"></span>
            </div>
          </div>

          {/* Champ Email */}
          <div className="auth-input-group">
            <label htmlFor="email" className="auth-label">
              E-mail
            </label>
            <div className="auth-input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                className="auth-input"
                placeholder="votre.email@exemple.com"
                autoComplete="email"
              />
              <span className="auth-input-icon email-icon"></span>
            </div>
          </div>

          {/* Champ Mot de passe */}
          <div className="auth-input-group">
            <label htmlFor="password" className="auth-label">
              Mot de passe
            </label>
            <div className="auth-input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                className="auth-input"
                placeholder="••••••••"
                autoComplete="new-password"
              />
              <span className="auth-input-icon password-icon"></span>
            </div>
          </div>

          {/* Bouton de soumission */}
          <button type="submit" className="auth-submit-button">
            S'inscrire
          </button>
        </form>

        {/* Lien de navigation */}
        <div className="auth-links auth-links-single">
          <Link to="/login" className="auth-link">
            Vous avez déjà un compte ?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthCardRegister;

