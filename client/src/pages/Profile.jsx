import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [tricks, setTricks] = useState([]);
  const [error, setError] = useState(null);

  const STATUSES = ['A apprendre', 'En cours', 'Maîtrisé'];
  const LEVELS = ['Débutant', 'Confirmé', 'Expert'];

  useEffect(() => {
    const fetchTricks = async () => {
      if (user) {
        try {
          const trickDetailsPromises = user.tricks.map(trick =>
            axios.get(`http://localhost:5000/api/tricks/details/${trick.trickId}`)
          );
          const tricksResponses = await Promise.all(trickDetailsPromises);
          const tricksData = tricksResponses.map(response => response.data);

          const allTricks = tricksData.map(trickDetails => {
            const userTrick = user.tricks.find(userTrick => userTrick.trickId === trickDetails._id);
            const trickStatus = userTrick ? (userTrick.status || 'A apprendre') : 'A apprendre';

            return { 
              ...trickDetails, 
              status: trickStatus, 
              level: trickDetails.level 
            };
          });

          setTricks(allTricks);
        } catch (error) {
          console.error("Erreur lors de la récupération des tricks :", error);
          setError('Une erreur est survenue lors du chargement de vos tricks. Veuillez réessayer plus tard.');
        }
      }
    };

    fetchTricks();
  }, [user]);

  const countTricksByStatusAndLevel = (status, level) => {
    return tricks.filter(trick => {
      const trickStatus = trick.status ? trick.status.trim().toLowerCase() : 'a apprendre'; 
      const trickLevel = trick.level ? trick.level.trim().toLowerCase() : '';

      if (status.toLowerCase() === 'a apprendre' && trickStatus === 'a apprendre') {
        return trickLevel === level.trim().toLowerCase();
      }

      return trickStatus === status.trim().toLowerCase() && trickLevel === level.trim().toLowerCase();
    }).length;
  };

  const calculateRemainingTricksToMaster = (level) => {
    const tricksToMaster = countTricksByStatusAndLevel('Maîtrisé', level);
    const tricksInProgress = countTricksByStatusAndLevel('En cours', level);
    const tricksToLearn = countTricksByStatusAndLevel('A apprendre', level);

    const totalTricks = tricksToMaster + tricksInProgress + tricksToLearn;
    return Math.max(0, Math.floor(totalTricks / 2) - tricksToMaster);
  };

  const getNextLevel = (level) => {
    const currentLevelIndex = LEVELS.indexOf(level);
    return LEVELS[currentLevelIndex + 1] || null;
  };

  if (!user) {
    return <div className="message">Veuillez vous connecter pour voir votre profil.</div>;
  }

  return (
    <div className="container">
      <h2 className="username">Profil de {user.username}</h2>
      <p className="email">Email: {user.email}</p>

      <h3 className="tricks-title">Mes Tricks</h3>

      {error && <div className="error-message">{error}</div>}

      {/* Résumé des tricks par niveau */}
      <div className="levels-summary">
        {LEVELS.map((level) => (
          <div key={level} className="level-summary-card">
            <h4>{level}</h4>
            <div className="status-summary">
              <p>Tricks en cours d'apprentissage: {countTricksByStatusAndLevel('En cours', level)}</p>
              <p>Tricks maîtrisés: {countTricksByStatusAndLevel('Maîtrisé', level)}</p>
              <p>
                Plus que {calculateRemainingTricksToMaster(level)} trick(s) à maîtriser pour passer au niveau {getNextLevel(level)}.
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Liste des tricks sous forme de cartes */}
      {tricks.length > 0 ? (
        <div className="tricks-cards-container">
          {tricks.map((trick, index) => (
            <div key={index} className="trick-card">
              <h4 className="trick-name">{trick.name}</h4>
              <p className={`status ${trick.status.toLowerCase().replace(/\s+/g, '-')}`}>{trick.status}</p>
              <p className="trick-level">{trick.level}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="no-tricks">Aucun trick enregistré.</p>
      )}
    </div>
  );
};

export default Profile;
