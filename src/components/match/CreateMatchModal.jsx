import { useState } from 'react';
import './CreateMatchModal.css';

/**
 * Composant CreateMatchModal - Modale pour créer un nouveau match
 * Formulaire complet avec validation et interaction avec l'API
 * 
 * @param {boolean} isOpen - Indique si la modale est ouverte
 * @param {Function} onClose - Fonction appelée pour fermer la modale
 * @param {Function} onCreateMatch - Fonction appelée lors de la création (matchData)
 */
function CreateMatchModal({ isOpen, onClose, onCreateMatch }) {
  const [formData, setFormData] = useState({
    date: '',
    time: '',
    location: '',
    type: '5v5',
    maxPlayers: 10,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * Gère le changement d'un champ du formulaire
   * @param {string} fieldName - Nom du champ modifié
   * @param {string} value - Nouvelle valeur
   */
  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
    // Efface l'erreur du champ modifié
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

  /**
   * Valide le formulaire
   * @returns {boolean} - True si le formulaire est valide
   */
  const validate = () => {
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'La date est requise';
    } else {
      const matchDate = new Date(`${formData.date}T${formData.time || '00:00'}`);
      const now = new Date();
      if (matchDate < now) {
        newErrors.date = 'La date ne peut pas être dans le passé';
      }
    }

    if (!formData.time) {
      newErrors.time = "L'heure est requise";
    }

    if (!formData.location || formData.location === '') {
      newErrors.location = 'Le lieu est requis';
    }

    // Type et maxPlayers sont maintenant fixes (5v5 = 10 joueurs), pas besoin de validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * Gère la soumission du formulaire
   * @param {Event} e - Événement de soumission
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const matchData = {
        ...formData,
        type: '5v5', // Toujours 5v5
        maxPlayers: 10, // Fixé à 10 pour 5v5
        status: 'upcoming', // Statut 'upcoming' pour qu'il apparaisse dans la page présences
        playersCount: 0,
        createdBy: 1, // TODO: Récupérer depuis l'authentification
        teamId: 1, // TODO: Récupérer depuis l'utilisateur
        createdAt: new Date().toISOString(),
      };

      if (onCreateMatch) {
        await onCreateMatch(matchData);
        // Le parent (MatchesPage) gère la fermeture du modal après le rechargement
      }

      // Réinitialise le formulaire
      setFormData({
        date: '',
        time: '',
        location: '',
        type: '5v5',
        maxPlayers: 10,
      });
      setErrors({});
    } catch (error) {
      console.error('Erreur lors de la création du match:', error);
      setErrors({ submit: 'Une erreur est survenue lors de la création du match' });
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Gère la fermeture de la modale
   */
  const handleClose = () => {
    if (!isSubmitting) {
      setFormData({
        date: '',
        time: '',
        location: '',
        type: '5v5',
        maxPlayers: 10,
      });
      setErrors({});
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="create-match-modal-overlay" onClick={handleClose}>
      <div className="create-match-modal" onClick={(e) => e.stopPropagation()}>
        <div className="create-match-modal-header">
          <h2 className="create-match-modal-title">Créer un nouveau match</h2>
          <button
            className="create-match-modal-close"
            onClick={handleClose}
            disabled={isSubmitting}
            aria-label="Fermer"
          >
            ×
          </button>
        </div>

        <form className="create-match-modal-form" onSubmit={handleSubmit}>
          {/* Date */}
          <div className="create-match-form-group">
            <label htmlFor="create-date" className="create-match-label">
              Date <span className="required">*</span>
            </label>
            <input
              id="create-date"
              type="date"
              className={`create-match-input ${errors.date ? 'error' : ''}`}
              value={formData.date}
              onChange={(e) => handleChange('date', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.date && (
              <span className="create-match-error">{errors.date}</span>
            )}
          </div>

          {/* Heure */}
          <div className="create-match-form-group">
            <label htmlFor="create-time" className="create-match-label">
              Heure <span className="required">*</span>
            </label>
            <input
              id="create-time"
              type="time"
              className={`create-match-input ${errors.time ? 'error' : ''}`}
              value={formData.time}
              onChange={(e) => handleChange('time', e.target.value)}
              disabled={isSubmitting}
            />
            {errors.time && (
              <span className="create-match-error">{errors.time}</span>
            )}
          </div>

          {/* Lieu */}
          <div className="create-match-form-group">
            <label htmlFor="create-location" className="create-match-label">
              Lieu <span className="required">*</span>
            </label>
            <select
              id="create-location"
              className={`create-match-select ${errors.location ? 'error' : ''}`}
              value={formData.location}
              onChange={(e) => handleChange('location', e.target.value)}
              disabled={isSubmitting}
            >
              <option value="">Sélectionner un lieu</option>
              <option value="KG5">KG5</option>
              <option value="Urban Soccer">Urban Soccer</option>
            </select>
            {errors.location && (
              <span className="create-match-error">{errors.location}</span>
            )}
          </div>

          {/* Type - Toujours 5v5 */}
          <div className="create-match-form-group">
            <label htmlFor="create-type" className="create-match-label">
              Type
            </label>
            <input
              id="create-type"
              type="text"
              className="create-match-input"
              value="5v5"
              disabled
              readOnly
            />
            <span className="create-match-hint">Format standard : 5 contre 5</span>
          </div>

          {/* Nombre maximum de joueurs - Fixé à 10 pour 5v5 */}
          <div className="create-match-form-group">
            <label htmlFor="create-max-players" className="create-match-label">
              Nombre maximum de joueurs
            </label>
            <input
              id="create-max-players"
              type="number"
              className="create-match-input"
              value="10"
              disabled
              readOnly
            />
            <span className="create-match-hint">5 joueurs par équipe</span>
          </div>


          {/* Erreur générale */}
          {errors.submit && (
            <div className="create-match-error-message">{errors.submit}</div>
          )}

          {/* Boutons */}
          <div className="create-match-modal-actions">
            <button
              type="button"
              className="create-match-button create-match-button-cancel"
              onClick={handleClose}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button
              type="submit"
              className="create-match-button create-match-button-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Création...' : 'Créer le match'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateMatchModal;
