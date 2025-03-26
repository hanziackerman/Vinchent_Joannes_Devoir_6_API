/**
 * @fileoverview Contrôleur pour les pages principales
 */

const Reservation = require('../models/Reservation');

/**
 * Affiche la page d'accueil
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showHomePage = (req, res) => {
    res.render('index', {
        title: 'Accueil'
    });
};

/**
 * Affiche le tableau de bord
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showDashboard = async (req, res) => {
    try {
        // Récupère les réservations en cours
        const currentReservations = await Reservation.find({
            startDate: { $lte: new Date() },
            endDate: { $gte: new Date() }
        }).sort({ startDate: 1 });

        res.render('dashboard', {
            title: 'Tableau de bord',
            currentReservations
        });
    } catch (error) {
        console.error('Erreur lors du chargement du tableau de bord:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: 'Une erreur est survenue lors du chargement du tableau de bord'
        });
    }
}; 