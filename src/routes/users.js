/**
 * @fileoverview Routes pour la gestion des utilisateurs
 */

const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middlewares/auth');
const User = require('../models/User');

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Liste des utilisateurs
 *     description: Récupère la liste de tous les utilisateurs
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Liste des utilisateurs récupérée avec succès
 */
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const users = await User.find().select('-password');
        res.render('users/index', {
            title: 'Utilisateurs',
            users
        });
    } catch (error) {
        console.error('Erreur lors de la récupération des utilisateurs:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: 'Une erreur est survenue lors de la récupération des utilisateurs'
        });
    }
});

/**
 * @swagger
 * /users/new:
 *   get:
 *     summary: Formulaire de création
 *     description: Affiche le formulaire de création d'un utilisateur
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Formulaire affiché avec succès
 */
router.get('/new', isAuthenticated, (req, res) => {
    res.render('users/new', {
        title: 'Nouvel utilisateur'
    });
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Création d'un utilisateur
 *     description: Crée un nouvel utilisateur
 *     security:
 *       - sessionAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirection vers la liste des utilisateurs
 */
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        req.session.success = 'Utilisateur créé avec succès';
        res.redirect('/users');
    } catch (error) {
        console.error('Erreur lors de la création de l\'utilisateur:', error);
        res.render('users/new', {
            title: 'Nouvel utilisateur',
            error: error.message,
            user: req.body
        });
    }
});

/**
 * @swagger
 * /users/{email}:
 *   get:
 *     summary: Détails d'un utilisateur
 *     description: Récupère les détails d'un utilisateur spécifique
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Détails de l'utilisateur récupérés avec succès
 */
router.get('/:email', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('-password');
        if (!user) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Utilisateur non trouvé'
            });
        }
        res.render('users/show', {
            title: `Utilisateur ${user.username}`,
            user
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: 'Une erreur est survenue lors de la récupération de l\'utilisateur'
        });
    }
});

/**
 * @swagger
 * /users/{email}/edit:
 *   get:
 *     summary: Formulaire de modification
 *     description: Affiche le formulaire de modification d'un utilisateur
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Formulaire affiché avec succès
 */
router.get('/:email/edit', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('-password');
        if (!user) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Utilisateur non trouvé'
            });
        }
        res.render('users/edit', {
            title: `Modifier l'utilisateur ${user.username}`,
            user
        });
    } catch (error) {
        console.error('Erreur lors de la récupération de l\'utilisateur:', error);
        res.status(500).render('error', {
            title: 'Erreur',
            message: 'Une erreur est survenue lors de la récupération de l\'utilisateur'
        });
    }
});

/**
 * @swagger
 * /users/{email}:
 *   put:
 *     summary: Modification d'un utilisateur
 *     description: Modifie un utilisateur existant
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: email
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
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirection vers la liste des utilisateurs
 */
router.put('/:email', isAuthenticated, async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) {
            return res.status(404).render('error', {
                title: 'Erreur',
                message: 'Utilisateur non trouvé'
            });
        }

        user.username = req.body.username;
        if (req.body.password) {
            user.password = req.body.password;
        }

        await user.save();
        req.session.success = 'Utilisateur modifié avec succès';
        res.redirect('/users');
    } catch (error) {
        console.error('Erreur lors de la modification de l\'utilisateur:', error);
        res.render('users/edit', {
            title: `Modifier l'utilisateur`,
            error: error.message,
            user: { ...req.body, email: req.params.email }
        });
    }
});

/**
 * @swagger
 * /users/{email}:
 *   delete:
 *     summary: Suppression d'un utilisateur
 *     description: Supprime un utilisateur existant
 *     security:
 *       - sessionAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirection vers la liste des utilisateurs
 */
router.delete('/:email', isAuthenticated, async (req, res) => {
    try {
        await User.findOneAndDelete({ email: req.params.email });
        req.session.success = 'Utilisateur supprimé avec succès';
        res.redirect('/users');
    } catch (error) {
        console.error('Erreur lors de la suppression de l\'utilisateur:', error);
        req.session.error = 'Une erreur est survenue lors de la suppression de l\'utilisateur';
        res.redirect('/users');
    }
});

module.exports = router; 