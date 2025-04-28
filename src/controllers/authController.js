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
    console.log('Affichage de la page de connexion');
    if (req.session.userId) {
        console.log('Session existante, redirection vers le dashboard');
        return res.redirect('/dashboard');
    }
    res.render('auth/login', {
        title: 'Connexion',
        error: req.session.error,
        layout: 'layouts/main'
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
        console.log('Tentative de connexion avec:', { email: req.body.email });
        const { email, password } = req.body;

        if (!email || !password) {
            console.log('Champs manquants');
            req.session.error = 'Veuillez remplir tous les champs';
            return res.redirect('/login');
        }

        const user = await User.findOne({ email });
        console.log('Utilisateur trouvé:', user ? 'Oui' : 'Non');
        
        if (!user) {
            console.log('Utilisateur non trouvé');
            req.session.error = 'Email ou mot de passe incorrect';
            return res.redirect('/login');
        }

        const isMatch = await user.comparePassword(password);
        console.log('Mot de passe correct:', isMatch ? 'Oui' : 'Non');
        
        if (!isMatch) {
            console.log('Mot de passe incorrect');
            req.session.error = 'Email ou mot de passe incorrect';
            return res.redirect('/login');
        }

        // Stockage des informations de session
        req.session.userId = user._id;
        req.session.user = {
            _id: user._id,
            email: user.email,
            username: user.username
        };

        console.log('Session créée:', req.session);

        // Message de succès et redirection
        req.session.success = 'Connexion réussie';
        
        // Sauvegarder la session avant la redirection
        req.session.save((err) => {
            if (err) {
                console.error('Erreur lors de la sauvegarde de la session:', err);
                req.session.error = 'Une erreur est survenue lors de la connexion';
                return res.redirect('/login');
            }
            console.log('Session sauvegardée, redirection vers le dashboard');
            res.redirect('/dashboard');
        });
    } catch (error) {
        console.error('Erreur de connexion:', error);
        req.session.error = 'Une erreur est survenue lors de la connexion';
        res.redirect('/login');
    }
};

/**
 * Déconnexion
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.logout = (req, res) => {
    console.log('Déconnexion');
    req.session.destroy(err => {
        if (err) {
            console.error('Erreur lors de la déconnexion:', err);
        }
        res.redirect('/');
    });
}; 