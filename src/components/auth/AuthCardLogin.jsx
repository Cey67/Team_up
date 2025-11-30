import { Link, useNavigate } from 'react-router-dom';
import '../../pages/auth/Auth.css';
import emailIcon from '../../assets/email.png';
import passwordIcon from '../../assets/mdp.png';

function AuthCardLogin() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="auth-form-panel">
      <div className="auth-form-content">
        <h1 className="auth-title">Se connecter</h1>
        
        <form onSubmit={handleSubmit} className="auth-form" noValidate>
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
                autoComplete="current-password"
              />
              <img src={passwordIcon} alt="Password icon" className="auth-input-icon" />
            </div>
          </div>

          <button type="submit" className="auth-submit-button">
            Se connecter
          </button>
        </form>

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

