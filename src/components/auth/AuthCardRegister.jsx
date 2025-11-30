import { Link } from 'react-router-dom';
import '../../pages/auth/Auth.css';
import userIcon from '../../assets/user.png';
import emailIcon from '../../assets/email.png';
import passwordIcon from '../../assets/mdp.png';

function AuthCardRegister() {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="auth-form-panel">
      <div className="auth-form-content">
        <h1 className="auth-title">S'inscrire</h1>
        
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
              <img src={userIcon} alt="User icon" className="auth-input-icon" />
            </div>
          </div>

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
              <img src={emailIcon} alt="Email icon" className="auth-input-icon" />
            </div>
          </div>

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
              <img src={passwordIcon} alt="Password icon" className="auth-input-icon" />
            </div>
          </div>

          <button type="submit" className="auth-submit-button">
            S'inscrire
          </button>
        </form>

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

