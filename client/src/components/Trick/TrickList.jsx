import React, { useEffect, useState, useContext } from 'react';
import TrickItem from './TrickItem';
import { getTricksByLevel } from '../../services/trickService';
import AuthContext from '../../context/AuthContext';

const TrickList = ({ level, token }) => {
  const [tricks, setTricks] = useState([]);
  const { user, setUser } = useContext(AuthContext);

  useEffect(() => {
    const fetchTricks = async () => {
      const data = await getTricksByLevel(level); // Récupérer tous les tricks du niveau sélectionné
      setTricks(data);
    };
    fetchTricks();
  }, [level]);

  // Organiser les tricks par niveau
  const categorizeTricksByLevel = (tricks) => {
    return tricks.reduce((categories, trick) => {
      const trickLevel = trick.level;
      if (!categories[trickLevel]) {
        categories[trickLevel] = [];
      }
      categories[trickLevel].push(trick);
      return categories;
    }, {});
  };

  // Filtrer les tricks en fonction du niveau de l'utilisateur
  const filterTricksByUserLevel = (tricks) => {
    const levels = ['Débutant', 'Confirmé', 'Expert'];
    const userLevelIndex = levels.indexOf(user.level);

    return tricks.filter(trick => {
      const trickLevelIndex = levels.indexOf(trick.level);
      return trickLevelIndex <= userLevelIndex; // Afficher uniquement les tricks accessibles par l'utilisateur
    });
  };

  const filteredTricks = filterTricksByUserLevel(tricks);

  // Organiser les tricks filtrés par niveau
  const categorizedTricks = categorizeTricksByLevel(filteredTricks);

  // Afficher uniquement les tricks correspondant au niveau sélectionné
  const tricksToDisplay = categorizedTricks[level] || [];

  return (
    <div>
      <h2>Tricks de niveau {level}</h2>
    
      {/* Afficher uniquement les tricks de la catégorie sélectionnée */}
      {tricksToDisplay.length > 0 ? (
        <ul className='card-container'>
          {tricksToDisplay.map((trick) => (
            <li key={trick._id}>
              <TrickItem trick={trick} user={user} token={token} setUser={setUser} />
            </li>
          ))}
        </ul>
      ) : (
        <p>Aucun trick disponible pour ce niveau.</p>
      )}
    </div>
  );
};

export default TrickList;
