const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Création d'un utilisateur
exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Utilisateur déjà existant' });
        }

        const user = await User.create({ username, email, password });
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({ user, token });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
    }
};

// Connexion de l'utilisateur
exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Utilisateur non trouvé' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Mot de passe incorrect' });
        }

        const token = jwt.sign({ id: user._id, level: user.level, }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({ user, token, level: user.level }); // Renvoyer le niveau de l'utilisateur
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la connexion' });
    }
};

// Fonction pour récupérer les informations de l'utilisateur
exports.getUser = async (req, res) => {
    // Récupérer le token depuis l'en-tête de la requête
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Token manquant' });
    }

    try {
        // Vérifier le token et décoder les informations de l'utilisateur
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id); // Utiliser l'ID du token pour trouver l'utilisateur

        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }

        // Retourner les informations de l'utilisateur
        res.json({ user });
    } catch (error) {
        res.status(401).json({ message: 'Token invalide' });
    }
};