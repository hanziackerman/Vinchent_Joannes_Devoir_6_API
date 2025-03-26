/**
 * @fileoverview Contrôleur pour l'authentification
 */

const User = require('../models/User');

/**
 * Affiche la page de connexion
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showLoginPage = (req, res) => {
    res.render('auth/login', {
        title: 'Connexion',
        error: req.session.error
    });
    delete req.session.error;
};

/**
 * Traite la connexion
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            req.session.error = 'Email ou mot de passe incorrect';
            return res.redirect('/login');
        }

        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            req.session.error = 'Email ou mot de passe incorrect';
            return res.redirect('/login');
        }

        req.session.userId = user._id;
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Erreur de connexion:', error);
        req.session.error = 'Une erreur est survenue';
        res.redirect('/login');
    }
};

/**
 * Déconnexion
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.logout = (req, res) => {
    req.session.destroy(err => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
        }
        res.redirect('/');
    });
}; 