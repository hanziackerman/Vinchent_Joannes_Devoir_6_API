/**
 * @fileoverview Script pour alimenter la base de données avec des données initiales
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const Catway = require('../models/Catway');
const Reservation = require('../models/Reservation');

// Données initiales
const initialData = {
    users: [
        {
            username: 'admin',
            email: 'admin@port-russell.fr',
            password: 'Admin@123'
        }
    ],
    catways: [
        {
            catwayNumber: 'A1',
            catwayType: 'long',
            catwayState: 'Disponible'
        },
        {
            catwayNumber: 'A2',
            catwayType: 'short',
            catwayState: 'Disponible'
        },
        {
            catwayNumber: 'B1',
            catwayType: 'long',
            catwayState: 'Disponible'
        },
        {
            catwayNumber: 'B2',
            catwayType: 'short',
            catwayState: 'Disponible'
        }
    ],
    reservations: [
        {
            catwayNumber: 'A1',
            clientName: 'Jean Dupont',
            boatName: 'Le Petit Navire',
            startDate: new Date('2024-07-01'),
            endDate: new Date('2024-07-15')
        },
        {
            catwayNumber: 'B1',
            clientName: 'Marie Martin',
            boatName: 'L\'Aventurier',
            startDate: new Date('2024-08-01'),
            endDate: new Date('2024-08-31')
        }
    ]
};

// Fonction pour alimenter la base de données
async function seedDatabase() {
    try {
        // Connexion à MongoDB
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/port-russell', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('Connexion à MongoDB réussie');

        // Suppression des données existantes
        await Promise.all([
            User.deleteMany({}),
            Catway.deleteMany({}),
            Reservation.deleteMany({})
        ]);
        console.log('Données existantes supprimées');

        // Création des utilisateurs
        for (const userData of initialData.users) {
            const salt = await bcrypt.genSalt(10);
            userData.password = await bcrypt.hash(userData.password, salt);
            await User.create(userData);
        }
        console.log('Utilisateurs créés');

        // Création des catways
        await Catway.insertMany(initialData.catways);
        console.log('Catways créés');

        // Création des réservations
        await Reservation.insertMany(initialData.reservations);
        console.log('Réservations créées');

        console.log('Base de données alimentée avec succès');
        process.exit(0);
    } catch (error) {
        console.error('Erreur lors de l\'alimentation de la base de données:', error);
        process.exit(1);
    }
}

// Exécution du script
seedDatabase(); 