import { Link } from 'react-router-dom';
import '../../pages/auth/Auth.css';

function AuthCardLogin() {
  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique frontend uniquement - pas de validation ni d'appel API
  };

  return (
    <div className="auth-form-panel">
      <div className="auth-form-content">
        <h1 className="auth-title">Se connecter</h1>
        
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
                autoComplete="current-password"
              />
              <span className="auth-input-icon password-icon"></span>
            </div>
          </div>

          {/* Bouton de soumission */}
          <button type="submit" className="auth-submit-button">
            Se connecter
          </button>
        </form>

        {/* Liens de navigation */}
        <div className="auth-links">
          <Link to="/register" className="auth-link">
            Créer un compte
          </Link>
          <Link to="/forgot-password" className="auth-link">
            Mot de passe oublié ?
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthCardLogin;

