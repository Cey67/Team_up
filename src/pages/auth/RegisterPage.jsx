import AuthCardRegister from '../../components/auth/AuthCardRegister';
import AuthPlayerImage from '../../components/auth/AuthPlayerImage';
import './Auth.css';

function RegisterPage() {
  return (
    <div className="auth-container">
      <div className="auth-wrapper auth-wrapper-register">
        <AuthPlayerImage />
        <AuthCardRegister />
      </div>
    </div>
  );
}

export default RegisterPage;
