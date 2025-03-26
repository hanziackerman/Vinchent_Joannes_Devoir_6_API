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
 * /catways/{id}/reservations:
 *   get:
 *     summary: Liste des réservations d'un catway
 *     description: Récupère la liste des réservations pour un catway spécifique
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Liste des réservations récupérée avec succès
 */
router.get('/:id/reservations', isAuthenticated, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Catway non trouvé'
            });
        }

        const reservations = await Reservation.find({ catwayNumber: req.params.id })
            .sort({ startDate: 1 });

        res.render('reservations/index', {
            title: `Réservations du catway ${catway.catwayNumber}`,
            catway,
            reservations
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des réservations:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: 'Une erreur est survenue lors de la récupération des réservations'
        });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/new:
 *   get:
 *     summary: Formulaire de création
 *     description: Affiche le formulaire de création d'une réservation
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formulaire affiché avec succès
 */
router.get('/:id/reservations/new', isAuthenticated, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Catway non trouvé'
            });
        }

        res.render('reservations/new', {
            title: 'Nouvelle réservation',
            catway
        });
    } catch (error) {
        console.error('Erreur lors de l\'affichage du formulaire:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: 'Une erreur est survenue'
        });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations:
 *   post:
 *     summary: Création d'une réservation
 *     description: Crée une nouvelle réservation pour un catway
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
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
 *     responses:
 *       302:
 *         description: Redirection vers la liste des réservations
 */
router.post('/:id/reservations', isAuthenticated, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Catway non trouvé'
            });
        }

        const reservation = new Reservation({
            ...req.body,
            catwayNumber: req.params.id
        });

        await reservation.save();
        req.session.success = 'Réservation créée avec succès';
        res.redirect(`/catways/${req.params.id}/reservations`);
    } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error);
        res.render('reservations/new', {
            title: 'Nouvelle réservation',
            catway,
            error: error.message,
            reservation: req.body
        });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{reservationId}:
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
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de la réservation récupérés avec succès
 */
router.get('/:id/reservations/:reservationId', isAuthenticated, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.reservationId);
        if (!reservation || reservation.catwayNumber !== req.params.id) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Réservation non trouvée'
            });
        }

        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Catway non trouvé'
            });
        }

        res.render('reservations/show', {
            title: 'Détails de la réservation',
            reservation,
            catway
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la réservation:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: 'Une erreur est survenue'
        });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{reservationId}/edit:
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
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formulaire affiché avec succès
 */
router.get('/:id/reservations/:reservationId/edit', isAuthenticated, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.reservationId);
        if (!reservation || reservation.catwayNumber !== req.params.id) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Réservation non trouvée'
            });
        }

        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Catway non trouvé'
            });
        }

        res.render('reservations/edit', {
            title: 'Modifier la réservation',
            reservation,
            catway
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de la réservation:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: 'Une erreur est survenue'
        });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{reservationId}:
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
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
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
 *     responses:
 *       302:
 *         description: Redirection vers la liste des réservations
 */
router.put('/:id/reservations/:reservationId', isAuthenticated, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.reservationId);
        if (!reservation || reservation.catwayNumber !== req.params.id) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Réservation non trouvée'
            });
        }

        Object.assign(reservation, req.body);
        await reservation.save();
        req.session.success = 'Réservation modifiée avec succès';
        res.redirect(`/catways/${req.params.id}/reservations`);
    } catch (error) {
        console.error('Erreur lors de la modification de la réservation:', error);
        res.render('reservations/edit', {
            title: 'Modifier la réservation',
            error: error.message,
            reservation: { ...req.body, _id: req.params.reservationId },
            catway: { catwayNumber: req.params.id }
        });
    }
});

/**
 * @swagger
 * /catways/{id}/reservations/{reservationId}:
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
 *       - in: path
 *         name: reservationId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirection vers la liste des réservations
 */
router.delete('/:id/reservations/:reservationId', isAuthenticated, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.reservationId);
        if (!reservation || reservation.catwayNumber !== req.params.id) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Réservation non trouvée'
            });
        }

        await reservation.remove();
        req.session.success = 'Réservation supprimée avec succès';
        res.redirect(`/catways/${req.params.id}/reservations`);
    } catch (error) {
        console.error('Erreur lors de la suppression de la réservation:', error);
        req.session.error = 'Une erreur est survenue lors de la suppression de la réservation';
        res.redirect(`/catways/${req.params.id}/reservations`);
    }
});

module.exports = router; 