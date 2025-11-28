import { useState, useRef } from 'react';
import './AvatarUpload.css';
import defaultAvatar from '../../assets/user.png';

/**
 * Composant pour l'upload et l'affichage de l'avatar utilisateur
 * Design adapté pour la page profil : icône "+" bleu au centre
 * 
 * @param {string} currentPhoto - URL de la photo actuelle (peut être null)
 * @param {Function} onPhotoUpdate - Callback appelé après sélection d'une nouvelle photo
 * @param {string} firstName - Prénom de l'utilisateur (pour l'avatar par défaut)
 * @param {string} lastName - Nom de l'utilisateur (pour l'avatar par défaut)
 */
function AvatarUpload({ currentPhoto, onPhotoUpdate, firstName, lastName }) {
  const [preview, setPreview] = useState(currentPhoto);
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
        const photoUrl = reader.result;
        setPreview(photoUrl);
        setIsUploading(false);
        
        // Appel du callback pour notifier le parent
        // Dans une vraie application, on enverrait le fichier au serveur ici
        if (onPhotoUpdate) {
          onPhotoUpdate(photoUrl);
        }
      };

      reader.onerror = () => {
        alert('Erreur lors de la lecture du fichier');
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Erreur lors de l\'upload de la photo:', error);
      alert('Une erreur est survenue lors de l\'upload de la photo');
      setIsUploading(false);
    }
  };

  /**
   * Ouvre le sélecteur de fichier
   */
  const handleAvatarClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click();
    }
  };

  /**
   * Génère les initiales pour l'avatar par défaut
   * @returns {string} - Initiales (ex: "CS" pour "Ceyhun SAPMAZ")
   */
  const getInitials = () => {
    const firstInitial = firstName?.charAt(0)?.toUpperCase() || '';
    const lastInitial = lastName?.charAt(0)?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  };

  // Détermine l'image à afficher
  const displayImage = preview || currentPhoto || defaultAvatar;
  const showInitials = !preview && !currentPhoto;

  return (
    <div className="avatar-upload-container">
      <div 
        className={`avatar-wrapper ${isUploading ? 'avatar-uploading' : ''}`}
        onClick={handleAvatarClick}
        role="button"
        tabIndex={0}
        aria-label="Changer la photo de profil"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleAvatarClick();
          }
        }}
      >
        {showInitials ? (
          <div className="avatar-initials">
            {getInitials()}
          </div>
        ) : (
          <img 
            src={displayImage} 
            alt={`${firstName} ${lastName}`}
            className="avatar-image"
          />
        )}
        
        {/* Icône "+" bleu en bas à droite pour indiquer l'upload */}
        <div className="avatar-upload-icon">
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="3"
            className="avatar-plus-icon"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </div>

        {/* Indicateur de chargement */}
        {isUploading && (
          <div className="avatar-loading">
            <div className="avatar-loading-spinner"></div>
          </div>
        )}
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="avatar-file-input"
        aria-label="Sélectionner une photo de profil"
      />
    </div>
  );
}

export default AvatarUpload;
