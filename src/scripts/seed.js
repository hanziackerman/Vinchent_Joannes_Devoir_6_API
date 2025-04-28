/**
 * @fileoverview Script pour alimenter la base de données avec des données initiales
 */

require('dotenv').config();
const mongoose = require('mongoose');
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
    catways: [{
        "catwayNumber": "1",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "2",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "3",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "4",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "5",
        "catwayType": "long",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "6",
        "catwayType": "short",
        "catwayState": "En cours de réparation. Ne peut être réservée actuellement"
    },
    {
        "catwayNumber": "7",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "8",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "9",
        "catwayType": "long",
        "catwayState": "Plusieurs grandes tâches de peinture bleue sur le ponton"
    },
    {
        "catwayNumber": "10",
        "catwayType": "long",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "11",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "12",
        "catwayType": "short",
        "catwayState": "grosse tâche d'huile et trou en fin de ponton"
    },
    {
        "catwayNumber": "13",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "14",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "15",
        "catwayType": "long",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "16",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "17",
        "catwayType": "short",
        "catwayState": "2 planches bougent lorsqu'on marche dessus"
    },
    {
        "catwayNumber": "18",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "19",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "20",
        "catwayType": "long",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "21",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "22",
        "catwayType": "short",
        "catwayState": "bon état"
    },
    {
        "catwayNumber": "23",
        "catwayType": "short",
        "catwayState": "La bite d'amarrage est légèrement désolidarisée"
    },
    {
        "catwayNumber": "24",
        "catwayType": "short",
        "catwayState": "bon état"
    }]
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
        const admin = await User.create(initialData.users[0]);
        console.log('Utilisateur admin créé avec succès');

        // Création des catways
        await Catway.insertMany(initialData.catways);
        console.log('Catways créés');

        // Création des réservations
        const reservations = [{
            "user": admin._id,
            "catwayNumber": "1",
            "clientName": "Thomas Martin",
            "boatName": "Carolina",
            "startDate": new Date("2024-05-21T06:00:00Z"),
            "endDate": new Date("2024-10-27T06:00:00Z")
        },
        {
            "user": admin._id,
            "catwayNumber": "2",
            "clientName": "John Doe",
            "boatName": "Groeland",
            "startDate": new Date("2024-05-18T06:00:00Z"),
            "endDate": new Date("2024-11-30T06:00:00Z")
        },
        {
            "user": admin._id,
            "catwayNumber": "3",
            "clientName": "Margareth Wurtz",
            "boatName": "Sirène",
            "startDate": new Date("2024-06-20T06:00:00Z"),
            "endDate": new Date("2024-08-27T06:00:00Z")
        },
        {
            "user": admin._id,
            "catwayNumber": "7",
            "clientName": "Ralph Laurent",
            "boatName": "Surcouf",
            "startDate": new Date("2024-07-01T06:00:00Z"),
            "endDate": new Date("2024-10-13T06:00:00Z")
        },
        {
            "user": admin._id,
            "catwayNumber": "11",
            "clientName": "Jack Sparrow",
            "boatName": "Black perl",
            "startDate": new Date("2024-08-13T06:00:00Z"),
            "endDate": new Date("2024-09-13T06:00:00Z")
        },
        {
            "user": admin._id,
            "catwayNumber": "13",
            "clientName": "Jacky Snow",
            "boatName": "Léandra",
            "startDate": new Date("2024-09-18T06:00:00Z"),
            "endDate": new Date("2024-12-23T06:00:00Z")
        }];

        await Reservation.insertMany(reservations);
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