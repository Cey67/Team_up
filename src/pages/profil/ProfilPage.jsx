import { useState } from 'react';
import './ProfilPage.css';
import AvatarUpload from '../../components/profil/AvatarUpload';

function ProfilPage() {
  const [userData, setUserData] = useState({
    id: '1',
    firstName: 'Ceyhun',
    lastName: 'SAPMAZ',
    email: 'ceyhuns2004@gmail.com',
    phone: '07 69 06 09 00',
    dateOfBirth: '', // Format: JJ/MM/AAAA
    photo: null,
    position: 'Gardien',
    jerseyNumber: 1,
    role: 'Joueur',
    isAdmin: true,
    team: 'Nom de l\'équipe'
  });

  const [activeTab, setActiveTab] = useState('identite');

  const handlePhotoUpdate = (photoUrl) => {
    setUserData(prev => ({
      ...prev,
      photo: photoUrl
    }));
  };

  const handleFieldChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLeaveTeam = () => {
    if (window.confirm('Êtes-vous sûr de vouloir quitter l\'équipe ?')) {
      console.log('Quitter l\'équipe');
    }
  };

  const handleSave = () => {
    if (!userData.firstName.trim() || !userData.lastName.trim()) {
      alert('Veuillez remplir tous les champs obligatoires (Nom et Prénom)');
      return;
    }

    console.log('Données à enregistrer:', userData);
    alert('Profil enregistré avec succès !');
  };

  return (
    <div className="profil-container">
      <div className="profil-content">
        <h1 className="profil-title">Profil</h1>

        <div className="profil-card">
          <div className="profil-card-layout">
            <div className="profil-left-section">
              <div className="profil-avatar-wrapper">
                <AvatarUpload 
                  currentPhoto={userData.photo}
                  onPhotoUpdate={handlePhotoUpdate}
                  firstName={userData.firstName}
                  lastName={userData.lastName}
                />
                <h2 className="profil-user-name">
                  {userData.firstName} {userData.lastName}
                </h2>
              </div>

              <div className="profil-nav-buttons">
                <button 
                  className={`profil-nav-btn ${activeTab === 'identite' ? 'profil-nav-btn-active' : ''}`}
                  onClick={() => setActiveTab('identite')}
                >
                  Identité
                </button>
                <button 
                  className={`profil-nav-btn ${activeTab === 'quitter' ? 'profil-nav-btn-active' : ''}`}
                  onClick={handleLeaveTeam}
                >
                  Quitter l'équipe
                </button>
              </div>
            </div>

            <div className="profil-right-section">
              <div className="profil-form-section">
                <label className="profil-form-label" htmlFor="firstName">
                  Nom : <span className="profil-required">*</span>
                </label>
                <input
                  id="firstName"
                  type="text"
                  className="profil-form-input"
                  value={userData.firstName}
                  onChange={(e) => handleFieldChange('firstName', e.target.value)}
                  required
                />
              </div>

              <div className="profil-form-section">
                <label className="profil-form-label" htmlFor="lastName">
                  Prénom : <span className="profil-required">*</span>
                </label>
                <input
                  id="lastName"
                  type="text"
                  className="profil-form-input"
                  value={userData.lastName}
                  onChange={(e) => handleFieldChange('lastName', e.target.value)}
                  required
                />
              </div>

              <div className="profil-form-section">
                <label className="profil-form-label" htmlFor="email">
                  E-mail :
                </label>
                <input
                  id="email"
                  type="email"
                  className="profil-form-input"
                  value={userData.email}
                  onChange={(e) => handleFieldChange('email', e.target.value)}
                />
              </div>

              <div className="profil-form-section">
                <label className="profil-form-label" htmlFor="phone">
                  Téléphone :
                </label>
                <input
                  id="phone"
                  type="tel"
                  className="profil-form-input"
                  value={userData.phone}
                  onChange={(e) => handleFieldChange('phone', e.target.value)}
                  placeholder="07 12 34 56 78"
                />
              </div>

              <div className="profil-form-section">
                <label className="profil-form-label" htmlFor="dateOfBirth">
                  Date de naissance :
                </label>
                <input
                  id="dateOfBirth"
                  type="text"
                  className="profil-form-input"
                  value={userData.dateOfBirth}
                  onChange={(e) => handleFieldChange('dateOfBirth', e.target.value)}
                  placeholder="JJ / MM / AA"
                />
              </div>

              <div className="profil-form-actions">
                <button 
                  type="button"
                  className="profil-save-btn"
                  onClick={handleSave}
                >
                  Enregistrer
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilPage;
