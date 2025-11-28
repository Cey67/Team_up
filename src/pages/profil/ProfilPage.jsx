import { useState } from 'react';
import './ProfilPage.css';
import AvatarUpload from '../../components/profil/AvatarUpload';

/**
 * Page de profil utilisateur
 * Design avec section gauche (avatar + navigation) et section droite (formulaire éditable)
 * Correspond au design de la maquette fournie
 */
function ProfilPage() {
  // Données mockées - à remplacer par des données réelles depuis l'API plus tard
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

  /**
   * Gère la mise à jour de la photo de profil après upload
   * @param {string} photoUrl - URL de la photo uploadée
   */
  const handlePhotoUpdate = (photoUrl) => {
    setUserData(prev => ({
      ...prev,
      photo: photoUrl
    }));
  };

  /**
   * Gère la mise à jour des champs du formulaire
   * @param {string} field - Nom du champ à mettre à jour
   * @param {string} value - Nouvelle valeur
   */
  const handleFieldChange = (field, value) => {
    setUserData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * Gère l'action "Quitter l'équipe"
   */
  const handleLeaveTeam = () => {
    if (window.confirm('Êtes-vous sûr de vouloir quitter l\'équipe ?')) {
      // TODO: Implémenter la logique de quitter l'équipe
      console.log('Quitter l\'équipe');
    }
  };

  /**
   * Gère l'enregistrement des données du profil
   * Valide les champs requis avant de sauvegarder
   */
  const handleSave = () => {
    // Validation des champs requis
    if (!userData.firstName.trim() || !userData.lastName.trim()) {
      alert('Veuillez remplir tous les champs obligatoires (Nom et Prénom)');
      return;
    }

    // TODO: Envoyer les données au serveur via l'API
    console.log('Données à enregistrer:', userData);
    
    // Simulation d'un enregistrement réussi
    alert('Profil enregistré avec succès !');
  };

  return (
    <div className="profil-container">
      <div className="profil-content">
        <h1 className="profil-title">Profil</h1>

        {/* Card principale avec deux sections */}
        <div className="profil-card">
          <div className="profil-card-layout">
            {/* Section gauche : Avatar + Navigation */}
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

              {/* Boutons de navigation */}
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

            {/* Section droite : Formulaire */}
            <div className="profil-right-section">
              {/* Formulaire d'identité */}
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

              {/* Bouton d'enregistrement */}
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
