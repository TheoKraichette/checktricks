import React, { useState, useEffect } from 'react';
import { updateTrickStatus } from '../../services/trickService';

const TrickItem = ({ trick, user, token, setUser }) => {
  const userTrickStatus = user?.tricks?.find((t) => t.trickId === trick._id)?.status || 'A apprendre';
  const [status, setStatus] = useState(userTrickStatus);
  const [displayedStatus, setDisplayedStatus] = useState(userTrickStatus);
  const [levelMessage, setLevelMessage] = useState('');

  useEffect(() => {
    if (user && user.tricks) {
      const updatedTrick = user.tricks.find((t) => t.trickId === trick._id);
      setDisplayedStatus(updatedTrick ? updatedTrick.status : 'A apprendre');
      setStatus(updatedTrick ? updatedTrick.status : 'A apprendre');
    }
  }, [user, trick]);

  const handleStatusChange = async () => {
    try {
      const validStatus = status === 'A apprendre' ? 'En cours' : status;
      const response = await updateTrickStatus(trick._id, validStatus, token, user);  
      if (response) {
        if (response.message === 'Trick mis à jour avec succès' || response.message.includes('Félicitations')) {
          const updatedUser = response.user?.user || response.user;
          const updatedTrick = updatedUser?.tricks.find(t => t.trickId === trick._id);
          setStatus(updatedTrick ? updatedTrick.status : 'En cours');
          setDisplayedStatus(updatedTrick ? updatedTrick.status : 'En cours');
          setUser(updatedUser);
          if (response.message.includes('Félicitations')) {
            setLevelMessage(response.message);
            setTimeout(() => setLevelMessage(''), 5000);
          }
        }
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  // Fonction pour obtenir la classe CSS en fonction du statut
  const getStatusClass = (status) => {
    switch (status) {
      case 'A apprendre':
        return 'status-to-learn'; // Classe pour "A apprendre"
      case 'En cours':
        return 'status-in-progress'; // Classe pour "En cours"
      case 'Maîtrisé':
        return 'status-mastered'; // Classe pour "Maîtrisé"
      default:
        return '';
    }
  };

  return (
    <div className="trick-item">
      <h3>{trick.name}</h3>
      <p>Difficulté : <strong>{trick.difficulty}</strong></p>
      <p>Status actuel : <span className={getStatusClass(displayedStatus)}>{displayedStatus}</span> </p> {/* Appliquer la classe conditionnelle */}
      <select value={status} onChange={(e) => setStatus(e.target.value)}>
        <option value="En cours">En cours</option>
        <option value="Maîtrisé">Maîtrisé</option>
      </select>
      <button onClick={handleStatusChange}>Changer le statut</button>
      {levelMessage && <div className="level-message">{levelMessage}</div>}
    </div>
  );
};

export default TrickItem;
