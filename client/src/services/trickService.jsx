import axios from 'axios';

const API_URL = 'http://localhost:5000/api/tricks';

// Récupérer les tricks par niveau en ajoutant le token dans les en-têtes
export const getTricksByLevel = async (level) => {
  const token = localStorage.getItem('token');
  try {
    const response = await axios.get(`${API_URL}/${level}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });    
    return response.data;
  } catch (error) {
    console.error('Erreur lors de la récupération des tricks:', error);
    throw error;
  }
};

// Fonction pour mettre à jour ou ajouter un trick
export const updateTrickStatus = async (trickId, status, token, user) => {
  token = token || localStorage.getItem('token');  

  try {
    const userTricks = user && user.tricks ? user.tricks : [];
    const existingTrick = userTricks.find(trick => trick.trickId.toString() === trickId);
    const method = existingTrick ? 'PUT' : 'POST';

    const response = await axios({
      method: method,
      url: `${API_URL}/userTricks`,
      data: { trickId, status },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Mettre à jour le token si la réponse en contient un nouveau
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }

    // Si on a fait un POST, récupérer les nouvelles données de l'utilisateur
    if (method === 'POST') {
      const updatedUserResponse = await axios.get(`http://localhost:5000/api/users/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      return { ...response.data, user: updatedUserResponse.data }; // Retourne le message + user mis à jour
    }

    return response.data;
  } catch (error) {
    console.error('Erreur lors de la mise à jour du trick:', error);
    throw error;
  }
};
