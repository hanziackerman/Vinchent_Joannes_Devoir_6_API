/**
 * @fileoverview Routes principales de l'application
 */

const express = require('express');
const router = express.Router();
const { isAuthenticated, isNotAuthenticated } = require('../middlewares/auth');
const indexController = require('../controllers/indexController');
const authController = require('../controllers/authController');

/**
 * @swagger
 * /:
 *   get:
 *     summary: Page d'accueil
 *     description: Affiche la page d'accueil avec le formulaire de connexion
 *     responses:
 *       200:
 *         description: Page d'accueil affichée avec succès
 */
router.get('/', indexController.showHomePage);

/**
 * @swagger
 * /login:
 *   get:
 *     summary: Page de connexion
 *     description: Affiche le formulaire de connexion
 *     responses:
 *       200:
 *         description: Formulaire de connexion affiché
 *   post:
 *     summary: Traitement de la connexion
 *     description: Authentifie l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         application/x-www-form-urlencoded:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       302:
 *         description: Redirection vers le tableau de bord ou la page de connexion
 */
router.get('/login', isNotAuthenticated, authController.showLoginPage);
router.post('/login', authController.login);

/**
 * @swagger
 * /logout:
 *   get:
 *     summary: Déconnexion
 *     description: Déconnecte l'utilisateur
 *     responses:
 *       302:
 *         description: Redirection vers la page d'accueil
 */
router.get('/logout', isAuthenticated, authController.logout);

/**
 * @swagger
 * /dashboard:
 *   get:
 *     summary: Tableau de bord
 *     description: Affiche le tableau de bord de l'utilisateur
 *     security:
 *       - sessionAuth: []
 *     responses:
 *       200:
 *         description: Tableau de bord affiché avec succès
 *       401:
 *         description: Non autorisé
 */
router.get('/dashboard', isAuthenticated, indexController.showDashboard);

module.exports = router; 