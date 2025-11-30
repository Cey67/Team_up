import AuthCardLogin from '../../components/auth/AuthCardLogin';
import AuthPlayerImage from '../../components/auth/AuthPlayerImage';
import './Auth.css';

function LoginPage() {
  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <AuthPlayerImage />
        <AuthCardLogin />
      </div>
    </div>
  );
}

export default LoginPage;
