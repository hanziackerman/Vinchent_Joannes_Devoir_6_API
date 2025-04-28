/**
 * @fileoverview Routes pour la gestion des réservations
 */

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const Reservation = require('../models/Reservation');
const Catway = require('../models/Catway');

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Liste des réservations
 *     description: Récupère la liste de toutes les réservations
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée avec succès
 */
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const reservations = await Reservation.find()
            .populate('user', 'username email')
            .sort('-startDate');

        res.render('reservations/index', {
            title: 'Réservations',
            reservations
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        req.session.error = 'Une erreur est survenue lors de la récupération des réservations';
        res.redirect('/dashboard');
    }
});

/**
 * @swagger
 * /reservations/new:
 *   get:
 *     summary: Formulaire de création
 *     description: Affiche le formulaire de création d'une réservation
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Formulaire affiché avec succès
 */
router.get('/new', isAuthenticated, async (req, res) => {
    try {
        const catways = await Catway.find({ catwayState: 'Disponible' }).sort('catwayNumber');
        res.render('reservations/new', {
            title: 'Nouvelle réservation',
            catways
        });
    } catch (error) {
        console.error('Erreur lors du chargement du formulaire:', error);
        req.session.error = 'Une erreur est survenue lors du chargement du formulaire';
        res.redirect('/reservations');
    }
});

/**
 * @swagger
 * /reservations:
 *   post:
 *     summary: Création d'une réservation
 *     description: Crée une nouvelle réservation
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               catwayNumber:
 *                 type: string
 *               clientName:
 *                 type: string
 *               boatName:
 *                 type: string
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 */
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const reservation = new Reservation({
            ...req.body,
            user: req.user._id
        });
        await reservation.save();
        req.session.success = 'Réservation créée avec succès';
        res.redirect('/reservations');
    } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        const catways = await Catway.find({ catwayState: 'Disponible' }).sort('catwayNumber');
        res.render('reservations/new', {
            title: 'Nouvelle réservation',
            error: error.message,
            catways,
            reservation: req.body
        });
    }
});

/**
 * @swagger
 * /reservations/{id}:
 *   get:
 *     summary: Détails d'une réservation
 *     description: Récupère les détails d'une réservation spécifique
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id)
            .populate('user', 'username email');
        
        if (!reservation) {
            req.session.error = 'Réservation non trouvée';
            return res.redirect('/reservations');
        }

        const catway = await Catway.findOne({ catwayNumber: reservation.catwayNumber });
        
        res.render('reservations/show', {
            title: 'Détails de la réservation',
            reservation,
            catway
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la réservation:', error);
        req.session.error = 'Une erreur est survenue lors de la récupération de la réservation';
        res.redirect('/reservations');
    }
});

/**
 * @swagger
 * /reservations/{id}/edit:
 *   get:
 *     summary: Formulaire de modification
 *     description: Affiche le formulaire de modification d'une réservation
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.get('/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            req.session.error = 'Réservation non trouvée';
            return res.redirect('/reservations');
        }

        const catways = await Catway.find().sort('catwayNumber');
        
        res.render('reservations/edit', {
            title: 'Modifier la réservation',
            reservation,
            catways
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la réservation:', error);
        req.session.error = 'Une erreur est survenue lors de la récupération de la réservation';
        res.redirect('/reservations');
    }
});

/**
 * @swagger
 * /reservations/{id}:
 *   put:
 *     summary: Modification d'une réservation
 *     description: Modifie une réservation existante
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);
        if (!reservation) {
            req.session.error = 'Réservation non trouvée';
            return res.redirect('/reservations');
        }

        Object.assign(reservation, req.body);
        await reservation.save();
        
        req.session.success = 'Réservation modifiée avec succès';
        res.redirect('/reservations');
    } catch (error) {
        console.error('Erreur lors de la modification de la réservation:', error);
        const catways = await Catway.find().sort('catwayNumber');
        res.render('reservations/edit', {
            title: 'Modifier la réservation',
            error: error.message,
            reservation: { ...req.body, _id: req.params.id },
            catways
        });
    }
});

/**
 * @swagger
 * /reservations/{id}:
 *   delete:
 *     summary: Suppression d'une réservation
 *     description: Supprime une réservation existante
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 */
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        req.session.success = 'Réservation supprimée avec succès';
        res.redirect('/reservations');
    } catch (error) {
        console.error('Erreur lors de la suppression de la réservation:', error);
        req.session.error = 'Une erreur est survenue lors de la suppression de la réservation';
        res.redirect('/reservations');
    }
});

module.exports = router; 