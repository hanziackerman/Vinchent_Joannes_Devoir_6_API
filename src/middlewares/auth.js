/**
 * @fileoverview Middleware d'authentification
 */

const User = require('../models/User');

/**
 * Vérifie si l'utilisateur est connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
exports.isAuthenticated = async (req, res, next) => {
    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId).select('-password');
            if (user) {
                req.user = user;
                res.locals.user = user;
                return next();
            }
        } catch (error) {
            console.error('Erreur d\'authentification:', error);
        }
    }
    req.session.error = 'Veuillez vous connecter pour accéder à cette page';
    res.redirect('/login');
};

/**
 * Vérifie si l'utilisateur n'est pas connecté
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
exports.isNotAuthenticated = (req, res, next) => {
    if (!req.session || !req.session.userId) {
        return next();
    }
    res.redirect('/dashboard');
};

/**
 * Ajoute les informations de l'utilisateur à res.locals
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 * @param {Function} next - Fonction suivante
 */
exports.addUserToLocals = async (req, res, next) => {
    if (req.session && req.session.userId) {
        try {
            const user = await User.findById(req.session.userId).select('-password');
            if (user) {
                req.user = user;
                res.locals.user = user;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        }
    }
    next();
}; 