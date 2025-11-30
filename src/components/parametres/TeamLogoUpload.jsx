import { useState, useRef } from 'react';
import './TeamLogoUpload.css';
import defaultLogo from '../../assets/logo.svg';

function TeamLogoUpload({ currentLogo, onLogoUpdate, teamName }) {
  const [preview, setPreview] = useState(currentLogo);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image (JPG, PNG, etc.)');
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      alert('L\'image est trop volumineuse. Taille maximale : 5MB');
      return;
    }

    setIsUploading(true);

    try {
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const logoUrl = reader.result;
        setPreview(logoUrl);
        setIsUploading(false);
        
        if (onLogoUpdate) {
          onLogoUpdate(logoUrl);
        }
      };

      reader.onerror = () => {
        alert('Erreur lors de la lecture du fichier');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors de l\'upload du logo:', error);
      alert('Une erreur est survenue lors de l\'upload du logo');
      setIsUploading(false);
    }
  };

  const handleLogoClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  const displayImage = preview || currentLogo || defaultLogo;

  return (
    <div className="team-logo-upload-container">
      <div 
        className={`team-logo-wrapper ${isUploading ? 'team-logo-uploading' : ''}`}
        onClick={handleLogoClick}
        role="button"
        tabIndex={0}
        aria-label="Changer le logo de l'équipe"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleLogoClick();
          }
        }}
      >
        <img 
          src={displayImage} 
          alt={`Logo ${teamName || 'équipe'}`}
          className="team-logo-image"
        />
        
        <div className="team-logo-upload-icon">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
            className="team-logo-plus-icon"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>

        {isUploading && (
          <div className="team-logo-loading">
            <div className="team-logo-loading-spinner"></div>
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="team-logo-file-input"
        aria-label="Sélectionner un logo d'équipe"
      />
    </div>
  );
}

export default TeamLogoUpload;

