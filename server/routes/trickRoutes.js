const express = require('express');
const { addTricks, getTrickById, getTricksByLevel, updateTrickStatus, deleteTrick } = require('../controllers/trickController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Route pour ajouter des tricks
router.post('/add', protect, addTricks);

// Recuperer par trick par id
router.get('/details/:id', getTrickById);

// Route pour récupérer les tricks par niveau
router.get('/:level', protect, getTricksByLevel);

// Route pour ajouter ou mettre à jour un trick à un utilisateur
router.route('/userTricks')
    .post(protect, updateTrickStatus)  // Gérer le POST pour ajouter un trick
    .put(protect, updateTrickStatus);  // Gérer le PUT pour mettre à jour un trick

// Route pour supprimer un trick
router.delete('userTricks/:trickId', protect, deleteTrick);

module.exports = router;
