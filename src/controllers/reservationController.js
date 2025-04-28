/**
 * @fileoverview Contrôleur pour la gestion des réservations
 */

const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');
const User = require('../models/User');

/**
 * Affiche le formulaire de création d'une réservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showNewReservationForm = async (req, res) => {
    try {
        // Récupérer la liste des catways disponibles
        const catways = await Catway.find().lean();
        
        res.render('reservations/new', {
            title: 'Nouvelle réservation',
            catways,
            error: req.flash('error'),
            success: req.flash('success'),
            formData: req.flash('formData')[0] || {}
        });
    } catch (error) {
        console.error('Erreur lors de l\'affichage du formulaire:', error);
        req.flash('error', 'Une erreur est survenue lors du chargement du formulaire');
        res.redirect('/dashboard');
    }
};

/**
 * Crée une nouvelle réservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.createReservation = async (req, res) => {
    try {
        const { clientName, boatName, catwayNumber, startDate, endDate } = req.body;

        // Validation des dates
        const start = new Date(startDate);
        const end = new Date(endDate);
        const now = new Date();

        if (start < now) {
            req.flash('error', 'La date de début doit être future');
            req.flash('formData', req.body);
            return res.redirect('/reservations/new');
        }

        if (end <= start) {
            req.flash('error', 'La date de fin doit être postérieure à la date de début');
            req.flash('formData', req.body);
            return res.redirect('/reservations/new');
        }

        // Vérifier la disponibilité du catway
        const existingReservation = await Reservation.findOne({
            catwayNumber,
            $or: [
                { startDate: { $lte: end }, endDate: { $gte: start } },
                { startDate: { $gte: start, $lte: end } },
                { endDate: { $gte: start, $lte: end } }
            ]
        });

        if (existingReservation) {
            req.flash('error', 'Ce catway est déjà réservé pour cette période');
            req.flash('formData', req.body);
            return res.redirect('/reservations/new');
        }

        // Créer la réservation
        const reservation = new Reservation({
            clientName,
            boatName,
            catwayNumber,
            startDate,
            endDate,
            user: req.session.userId
        });

        await reservation.save();

        req.flash('success', 'Réservation créée avec succès');
        res.redirect('/dashboard');
    } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        req.flash('error', 'Une erreur est survenue lors de la création de la réservation');
        req.flash('formData', req.body);
        res.redirect('/reservations/new');
    }
};

/**
 * Liste toutes les réservations
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.listReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('user', 'username email')
            .populate('catway')
            .sort({ startDate: 1 })
            .lean();

        // Préparer les réservations pour l'affichage
        const safeReservations = reservations.map(reservation => ({
            ...reservation,
            user: reservation.user || { username: 'Utilisateur inconnu' },
            catway: reservation.catway || { catwayNumber: reservation.catwayNumber }
        }));

        res.render('reservations/index', {
            title: 'Liste des réservations',
            reservations: safeReservations,
            error: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        req.flash('error', 'Une erreur est survenue lors du chargement des réservations');
        res.redirect('/dashboard');
    }
};

/**
 * Affiche les détails d'une réservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.showReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('user', 'username email')
            .lean();

        if (!reservation) {
            req.flash('error', 'Réservation non trouvée');
            return res.redirect('/reservations');
        }

        res.render('reservations/show', {
            title: 'Détails de la réservation',
            reservation,
            error: req.flash('error'),
            success: req.flash('success')
        });
    } catch (error) {
        console.error('Erreur lors de l\'affichage de la réservation:', error);
        req.flash('error', 'Une erreur est survenue lors du chargement de la réservation');
        res.redirect('/reservations');
    }
};

/**
 * Supprime une réservation
 * @param {Object} req - Requête Express
 * @param {Object} res - Réponse Express
 */
exports.deleteReservation = async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            req.flash('error', 'Réservation non trouvée');
            return res.redirect('/reservations');
        }

        // Vérifier si l'utilisateur est autorisé à supprimer
        if (reservation.user.toString() !== req.session.userId && !req.session.user.isAdmin) {
            req.flash('error', 'Vous n\'êtes pas autorisé à supprimer cette réservation');
            return res.redirect('/reservations');
        }

        await reservation.remove();

        req.flash('success', 'Réservation supprimée avec succès');
        res.redirect('/reservations');
    } catch (error) {
        console.error('Erreur lors de la suppression de la réservation:', error);
        req.flash('error', 'Une erreur est survenue lors de la suppression de la réservation');
        res.redirect('/reservations');
    }
}; 