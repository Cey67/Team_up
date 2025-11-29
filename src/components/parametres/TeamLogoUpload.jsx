import { useState, useRef } from 'react';
import './TeamLogoUpload.css';
import defaultLogo from '../../assets/logo.svg';

/**
 * Composant pour l'upload et l'affichage du logo d'équipe
 * Design adapté pour la page paramètres : icône "+" bleu au centre
 * 
 * @param {string} currentLogo - URL du logo actuel (peut être null)
 * @param {Function} onLogoUpdate - Callback appelé après sélection d'un nouveau logo
 * @param {string} teamName - Nom de l'équipe (pour l'affichage)
 */
function TeamLogoUpload({ currentLogo, onLogoUpdate, teamName }) {
  const [preview, setPreview] = useState(currentLogo);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  /**
   * Gère la sélection d'un fichier image
   * Valide le type et la taille du fichier avant de créer une prévisualisation
   * @param {Event} event - Événement de changement de fichier
   */
  const handleFileChange = async (event) => {
    const file = event.target.files?.[0];
    
    if (!file) return;

    // Validation du type de fichier
    if (!file.type.startsWith('image/')) {
      alert('Veuillez sélectionner un fichier image (JPG, PNG, etc.)');
      return;
    }

    // Validation de la taille (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB en bytes
    if (file.size > maxSize) {
      alert('L\'image est trop volumineuse. Taille maximale : 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Création d'une URL de prévisualisation locale
      const reader = new FileReader();
      
      reader.onloadend = () => {
        const logoUrl = reader.result;
        setPreview(logoUrl);
        setIsUploading(false);
        
        // Appel du callback pour notifier le parent
        // Dans une vraie application, on enverrait le fichier au serveur ici
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

  /**
   * Ouvre le sélecteur de fichier
   */
  const handleLogoClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  // Détermine l'image à afficher
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
        
        {/* Icône "+" bleu en bas à droite pour indiquer l'upload */}
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

        {/* Indicateur de chargement */}
        {isUploading && (
          <div className="team-logo-loading">
            <div className="team-logo-loading-spinner"></div>
          </div>
        )}
      </div>

      {/* Input file caché */}
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

