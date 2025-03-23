const Trick = require('../models/Trick');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Ajouter plusieurs tricks d'un coup
exports.addTricks = async (req, res) => {
    try {
        const tricks = await Trick.insertMany(req.body);
        res.status(201).json({ message: 'Tricks ajoutés avec succès', tricks });
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de l\'ajout des tricks', error });
    }
};

exports.getTrickById = async (req, res) => {
    try {
        const { id } = req.params;
        const trick = await Trick.findById(id);

        if (!trick) {
            return res.status(404).json({ message: "Trick non trouvé" });
        }

        res.json(trick);
    } catch (error) {
        console.error("Erreur lors de la récupération du trick:", error);
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

// Récupérer tous les tricks par niveau (niveau de l'utilisateur connecté)
exports.getTricksByLevel = async (req, res) => {
    const level = req.user.level;
    const levels = ['Débutant', 'Confirmé', 'Expert'];

    const currentLevelIndex = levels.indexOf(level);

    if (currentLevelIndex === -1) {
        return res.status(400).json({ message: 'Niveau de l\'utilisateur invalide' });
    }

    try {
        const accessibleLevels = levels.slice(0, currentLevelIndex + 1);

        const tricks = await Trick.find({ level: { $in: accessibleLevels } }).sort({ difficulty: 1 });
        res.json(tricks);
    } catch (error) {
        res.status(500).json({ message: 'Erreur lors de la récupération des tricks', error });
    }
};

const getNextLevel = (currentLevel) => {
    const levels = ['Débutant', 'Confirmé', 'Expert'];
    const currentIndex = levels.indexOf(currentLevel);
    return currentIndex < levels.length - 1 ? levels[currentIndex + 1] : currentLevel;
};

exports.updateTrickStatus = async (req, res) => {
    const { trickId, status, stance } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const trickIndex = user.tricks.findIndex(trick => trick.trickId.toString() === trickId);

        if (req.method === 'POST') {
            if (trickIndex !== -1) {
                return res.status(400).json({ message: 'Ce trick est déjà enregistré. Utilisez PUT pour le mettre à jour.' });
            }

            user.tricks.push({
                trickId,
                status,
                stance,
                updatedAt: Date.now()
            });

        } else if (req.method === 'PUT') {
            if (trickIndex === -1) {
                return res.status(400).json({ message: "Trick non trouvé dans les tricks de l'utilisateur. Utilisez POST pour l'ajouter." });
            }

            user.tricks[trickIndex].status = status;
            user.tricks[trickIndex].stance = stance;
            user.tricks[trickIndex].updatedAt = Date.now();
        }

        await user.save();

        const tricksForLevel = await Trick.find({ level: user.level });
        const totalTricksForLevel = tricksForLevel.length;

        const masteredTricksForLevel = user.tricks.filter(trick =>
            trick.status === 'Maîtrisé' &&
            tricksForLevel.some(dbTrick => dbTrick._id.toString() === trick.trickId.toString())
        ).length;

        if (totalTricksForLevel > 0 && masteredTricksForLevel / totalTricksForLevel >= 0.5) {
            const nextLevel = getNextLevel(user.level);
            if (user.level !== nextLevel) {
                user.level = nextLevel;
                await user.save();
                const newToken = generateToken(user);
                return res.json({ message: `Félicitations, vous êtes maintenant ${nextLevel}!`, user, token: newToken });
            }
        }

        res.json({ message: 'Trick mis à jour avec succès', user });

    } catch (error) {
        console.error('Erreur lors de la mise à jour du trick', error);
        res.status(500).json({ error: error.message, message: 'Erreur lors de la mise à jour du trick' });
    }
};

// Supprimer un trick d'un utilisateur
exports.deleteTrick = async (req, res) => {
    const { trickId } = req.params;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);

        const trickIndex = user.tricks.findIndex(trick => trick.trickId.toString() === trickId);

        if (trickIndex === -1) {
            return res.status(400).json({ message: 'Le trick n\'existe pas dans vos tricks.' });
        }

        user.tricks.splice(trickIndex, 1);

        await user.save();

        res.json({ message: 'Trick supprimé avec succès.', user });
    } catch (error) {
        console.error('Erreur lors de la suppression du trick', error);
        res.status(500).json({ error: error.message, message: 'Erreur lors de la suppression du trick' });
    }
};

const generateToken = (user) => {
    return token = jwt.sign({ id: user._id, level: user.level, }, process.env.JWT_SECRET, { expiresIn: '1h' });
};
