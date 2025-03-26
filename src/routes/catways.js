/**
 * @fileoverview Routes pour la gestion des catways
 */

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const Catway = require('../models/Catway');

/**
 * @swagger
 * /catways:
 *   get:
 *     summary: Liste des catways
 *     description: Récupère la liste de tous les catways
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Liste des catways récupérée avec succès
 */
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const catways = await Catway.find().sort('catwayNumber');
        res.render('catways/index', {
            title: 'Catways',
            catways
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des catways:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: 'Une erreur est survenue lors de la récupération des catways'
        });
    }
});

/**
 * @swagger
 * /catways/new:
 *   get:
 *     summary: Formulaire de création
 *     description: Affiche le formulaire de création d'un catway
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Formulaire affiché avec succès
 */
router.get('/new', isAuthenticated, (req, res) => {
    res.render('catways/new', {
        title: 'Nouveau catway'
    });
});

/**
 * @swagger
 * /catways:
 *   post:
 *     summary: Création d'un catway
 *     description: Crée un nouveau catway
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
 *               catwayType:
 *                 type: string
 *                 enum: [long, short]
 *               catwayState:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirection vers la liste des catways
 */
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const catway = new Catway(req.body);
        await catway.save();
        req.session.success = 'Catway créé avec succès';
        res.redirect('/catways');
    } catch (error) {
        console.error('Erreur lors de la création du catway:', error);
        res.render('catways/new', {
            title: 'Nouveau catway',
            error: error.message,
            catway: req.body
        });
    }
});

/**
 * @swagger
 * /catways/{id}:
 *   get:
 *     summary: Détails d'un catway
 *     description: Récupère les détails d'un catway spécifique
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
 *         description: Détails du catway récupérés avec succès
 */
router.get('/:id', isAuthenticated, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Catway non trouvé'
            });
        }
        res.render('catways/show', {
            title: `Catway ${catway.catwayNumber}`,
            catway
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du catway:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: 'Une erreur est survenue lors de la récupération du catway'
        });
    }
});

/**
 * @swagger
 * /catways/{id}/edit:
 *   get:
 *     summary: Formulaire de modification
 *     description: Affiche le formulaire de modification d'un catway
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
router.get('/:id/edit', isAuthenticated, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Catway non trouvé'
            });
        }
        res.render('catways/edit', {
            title: `Modifier le catway ${catway.catwayNumber}`,
            catway
        });
    } catch (error) {
        console.error('Erreur lors de la récupération du catway:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: 'Une erreur est survenue lors de la récupération du catway'
        });
    }
});

/**
 * @swagger
 * /catways/{id}:
 *   put:
 *     summary: Modification d'un catway
 *     description: Modifie l'état d'un catway existant
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
 *               catwayState:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirection vers la liste des catways
 */
router.put('/:id', isAuthenticated, async (req, res) => {
    try {
        const catway = await Catway.findOne({ catwayNumber: req.params.id });
        if (!catway) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Catway non trouvé'
            });
        }
        catway.catwayState = req.body.catwayState;
        await catway.save();
        req.session.success = 'Catway modifié avec succès';
        res.redirect('/catways');
    } catch (error) {
        console.error('Erreur lors de la modification du catway:', error);
        res.render('catways/edit', {
            title: `Modifier le catway ${req.params.id}`,
            error: error.message,
            catway: { ...req.body, catwayNumber: req.params.id }
        });
    }
});

/**
 * @swagger
 * /catways/{id}:
 *   delete:
 *     summary: Suppression d'un catway
 *     description: Supprime un catway existant
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirection vers la liste des catways
 */
router.delete('/:id', isAuthenticated, async (req, res) => {
    try {
        await Catway.findOneAndDelete({ catwayNumber: req.params.id });
        req.session.success = 'Catway supprimé avec succès';
        res.redirect('/catways');
    } catch (error) {
        console.error('Erreur lors de la suppression du catway:', error);
        req.session.error = 'Une erreur est survenue lors de la suppression du catway';
        res.redirect('/catways');
    }
});

module.exports = router; 