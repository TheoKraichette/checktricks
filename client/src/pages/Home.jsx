import React, { useState, useContext } from 'react';
import TrickList from '../components/Trick/TrickList';
import AuthContext from '../context/AuthContext';

const Home = () => {
  const { user } = useContext(AuthContext);
  const [level, setLevel] = useState('Débutant');
  const [activeButton, setActiveButton] = useState('Débutant'); // Ajouter un état pour le bouton actif

  const isLevelAccessible = (buttonLevel) => {
    const levels = ['Débutant', 'Confirmé', 'Expert'];
    const userLevelIndex = levels.indexOf(user.level);
    const buttonLevelIndex = levels.indexOf(buttonLevel);
    return buttonLevelIndex <= userLevelIndex;
  };

  if (!user) {
    return <div className="message">Veuillez vous connecter pour voir les tricks.</div>;
  }

  // Fonction de gestion du clic pour rendre un bouton actif
  const handleButtonClick = (levelOption) => {
    setLevel(levelOption);
    setActiveButton(levelOption);  // Définir le bouton actif
  };

  return (
    <div className="container">
      <h2 className="page-title">Page d'accueil</h2>
      <div className="level-buttons-container">
        {['Débutant', 'Confirmé', 'Expert'].map((levelOption) => (
          <button 
            key={levelOption} 
            onClick={() => handleButtonClick(levelOption)} 
            disabled={!isLevelAccessible(levelOption)}
            className={`level-button ${activeButton === levelOption ? 'active' : ''} ${!isLevelAccessible(levelOption) ? 'disabled' : ''}`}
          >
            {levelOption}
          </button>
        ))}
      </div>
      <TrickList level={level} token={user.token} />
    </div>
  );
};

export default Home;
