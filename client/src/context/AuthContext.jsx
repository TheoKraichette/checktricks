import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext({
  user: null,
  token: "",
  login: () => {},
  register: () => {},
  logout: () => {},
  loading: true
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur si un token existe
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          // Utiliser la nouvelle route GET /user pour récupérer les infos de l'utilisateur
          const response = await axios.get('http://localhost:5000/api/users/user', {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(response.data.user); 
        } catch (error) {
          console.error('Erreur lors de la récupération du profil:', error);
          logout(); // Déconnexion si le token est invalide
        }
      }
      setLoading(false); // Mettre à jour le chargement une fois que l'utilisateur est récupéré
    };

    fetchUser();
  }, [token]);

  // Connexion de l'utilisateur
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'http://localhost:5000/api/users/login',
        { email, password }
      );
      const { user, token } = response.data;
  
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
      
      return null; // Aucun message d'erreur si tout va bien
    } catch (error) {
      console.error('Erreur de connexion:', error.response?.data?.message || error.message);
      return error.response?.data?.message || "Une erreur s'est produite lors de la connexion";
    }
  };
  
  

  // Inscription de l'utilisateur
  const register = async (userData) => {
    try {
      const { user, token } = await axios.post('http://localhost:5000/api/users/register', userData).then(res => res.data);
      localStorage.setItem('token', token);
      setToken(token);
      setUser(user);
    } catch (error) {
      console.error('Erreur d\'inscription:', error);
      throw error;
    }
  };

  // Déconnexion de l'utilisateur
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, login, register, logout, loading }}>
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
