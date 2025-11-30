import { useState } from 'react';
import './CreateMatchModal.css';

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

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({
      ...prev,
      [fieldName]: value,
    }));
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[fieldName];
        return newErrors;
      });
    }
  };

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const matchData = {
        ...formData,
        type: '5v5',
        maxPlayers: 10,
        status: 'upcoming',
        playersCount: 0,
        createdBy: 1,
        teamId: 1,
        createdAt: new Date().toISOString(),
      };

      if (onCreateMatch) {
        await onCreateMatch(matchData);
      }

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

          {errors.submit && (
            <div className="create-match-error-message">{errors.submit}</div>
          )}

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
