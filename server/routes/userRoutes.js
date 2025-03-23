const express = require('express');
const { registerUser, loginUser, getUser } = require('../controllers/userController'); // Importer la nouvelle fonction getUser
const router = express.Router();

// Routes existantes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Nouvelle route pour récupérer les informations de l'utilisateur
router.get('/user', getUser);

module.exports = router;
