/**
 * @fileoverview Contrôleur pour les pages principales
 */

const User = require('../models/User');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');

/**
 * Affiche la page d'accueil
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showHomePage = (req, res) => {
    res.render('index', { title: 'Accueil' });
};

/**
 * Affiche le tableau de bord
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showDashboard = async (req, res) => {
    try {
        // Get latest 5 reservations with full user data
        const latestReservations = await Reservation.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate({
                path: 'user',
                select: 'username email'
            })
            .lean();

        // Get current date
        const currentDate = new Date();

        // Get counts using Promise.all for concurrent execution
        const [totalUsers, totalCatways, totalReservations, activeReservations] = await Promise.all([
            User.countDocuments(),
            Catway.countDocuments(),
            Reservation.countDocuments(),
            Reservation.countDocuments({
                startDate: { $lte: currentDate },
                endDate: { $gte: currentDate }
            })
        ]);

        // Prepare stats object
        const stats = {
            totalUsers,
            totalCatways,
            totalReservations,
            activeReservations
        };

        // Préparer les réservations pour l'affichage en gérant les données manquantes
        const safeReservations = latestReservations.map(reservation => ({
            ...reservation,
            user: {
                username: reservation.user?.username || 'Utilisateur inconnu',
                email: reservation.user?.email || 'Email inconnu'
            },
            clientName: reservation.clientName || 'Client inconnu',
            boatName: reservation.boatName || 'Bateau inconnu',
            catwayNumber: reservation.catwayNumber || 'Non assigné',
            startDate: reservation.startDate || new Date(),
            endDate: reservation.endDate || new Date(),
            _id: reservation._id
        }));

        res.render('dashboard/index', {
            title: 'Tableau de bord',
            latestReservations: safeReservations,
            stats,
            error: null
        });
    } catch (error) {
        console.error('Error in showDashboard:', error);
        res.render('dashboard/index', {
            title: 'Tableau de bord',
            latestReservations: [],
            stats: {
                totalUsers: 0,
                totalCatways: 0,
                totalReservations: 0,
                activeReservations: 0
            },
            error: 'Une erreur est survenue lors du chargement du tableau de bord'
        });
    }
}; 