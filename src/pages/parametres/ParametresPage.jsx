import { useState } from 'react';
import './ParametresPage.css';
import TeamLogoUpload from '../../components/parametres/TeamLogoUpload';

function ParametresPage() {
  const [teamData, setTeamData] = useState({
    id: '1',
    name: 'FC STRASBOURG',
    logo: null,
    age: 'Adultes tout âge',
    teamType: 'Groupe d\'amis',
    format: '5 vs 5'
  });

  const [activeTab, setActiveTab] = useState('informations');

  const handleLogoUpdate = (logoUrl) => {
    setTeamData(prev => ({
      ...prev,
      logo: logoUrl
    }));
  };

  const handleFieldChange = (field, value) => {
    setTeamData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDeleteTeam = () => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer l\'équipe ? Cette action est irréversible.')) {
      console.log('Supprimer l\'équipe');
    }
  };

  const handleSave = () => {
    if (!teamData.name.trim()) {
      alert('Veuillez remplir le nom de l\'équipe');
      return;
    }

    console.log('Données à enregistrer:', teamData);
    alert('Paramètres de l\'équipe enregistrés avec succès !');
  };

  return (
    <div className="parametres-container">
      <div className="parametres-content">
        <h1 className="parametres-title">Paramètres</h1>

        <div className="parametres-card">
          <div className="parametres-card-layout">
            <div className="parametres-left-section">
              <div className="parametres-logo-wrapper">
                <TeamLogoUpload 
                  currentLogo={teamData.logo}
                  onLogoUpdate={handleLogoUpdate}
                  teamName={teamData.name}
                />
                <h2 className="parametres-team-name">
                  {teamData.name || 'Nom de l\'équipe'}
                </h2>
              </div>

              <div className="parametres-nav-buttons">
                <button 
                  className={`parametres-nav-btn ${activeTab === 'informations' ? 'parametres-nav-btn-active' : ''}`}
                  onClick={() => setActiveTab('informations')}
                >
                  Informations de l'équipe
                </button>
                <button 
                  className={`parametres-nav-btn ${activeTab === 'supprimer' ? 'parametres-nav-btn-active' : ''}`}
                  onClick={handleDeleteTeam}
                >
                  Supprimer l'équipe
                </button>
              </div>
            </div>

            <div className="parametres-right-section">
              {activeTab === 'informations' && (
                <>
                  <div className="parametres-form-group">
                    <h3 className="parametres-form-group-title">Équipe :</h3>
                    
                    <div className="parametres-form-section">
                      <label className="parametres-form-label" htmlFor="name">
                        Nom :
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="parametres-form-input"
                        value={teamData.name}
                        onChange={(e) => handleFieldChange('name', e.target.value)}
                        required
                      />
                    </div>

                    <div className="parametres-form-section">
                      <label className="parametres-form-label" htmlFor="age">
                        Age :
                      </label>
                      <select
                        id="age"
                        className="parametres-form-select"
                        value={teamData.age}
                        onChange={(e) => handleFieldChange('age', e.target.value)}
                      >
                        <option value="Adultes tout âge">Adultes tout âge</option>
                        <option value="18-25 ans">18-25 ans</option>
                        <option value="26-35 ans">26-35 ans</option>
                        <option value="36-45 ans">36-45 ans</option>
                        <option value="46 ans et plus">46 ans et plus</option>
                        <option value="Jeunes (moins de 18 ans)">Jeunes (moins de 18 ans)</option>
                      </select>
                    </div>

                    <div className="parametres-form-section">
                      <label className="parametres-form-label" htmlFor="teamType">
                        Type d'équipe :
                      </label>
                      <select
                        id="teamType"
                        className="parametres-form-select"
                        value={teamData.teamType}
                        onChange={(e) => handleFieldChange('teamType', e.target.value)}
                      >
                        <option value="Groupe d'amis">Groupe d'amis</option>
                        <option value="Club officiel">Club officiel</option>
                        <option value="Entreprise">Entreprise</option>
                        <option value="Association">Association</option>
                        <option value="Autre">Autre</option>
                      </select>
                    </div>

                    <div className="parametres-form-section">
                      <label className="parametres-form-label" htmlFor="format">
                        Format :
                      </label>
                      <select
                        id="format"
                        className="parametres-form-select"
                        value={teamData.format}
                        onChange={(e) => handleFieldChange('format', e.target.value)}
                      >
                        <option value="5 vs 5">5 vs 5</option>
                        <option value="7 vs 7">7 vs 7</option>
                        <option value="9 vs 9">9 vs 9</option>
                        <option value="11 vs 11">11 vs 11</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="parametres-form-actions">
                <button 
                  type="button"
                  className="parametres-save-btn"
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

export default ParametresPage;
