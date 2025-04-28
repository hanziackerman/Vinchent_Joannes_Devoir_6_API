/**
 * @fileoverview Modèle Mongoose pour les réservations
 */

const mongoose = require('mongoose');

/**
 * Schéma réservation
 * @typedef {Object} ReservationSchema
 * @property {ObjectId} user - Référence vers l'utilisateur
 * @property {string} catwayNumber - Numéro du catway réservé
 * @property {string} clientName - Nom du client
 * @property {string} boatName - Nom du bateau
 * @property {Date} startDate - Date de début
 * @property {Date} endDate - Date de fin
 */
const reservationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    catwayNumber: {
        type: String,
        required: [true, 'Le numéro du catway est requis'],
        trim: true
    },
    clientName: {
        type: String,
        required: [true, 'Le nom du client est requis'],
        trim: true,
        minlength: [2, 'Le nom du client doit contenir au moins 2 caractères']
    },
    boatName: {
        type: String,
        required: [true, 'Le nom du bateau est requis'],
        trim: true
    },
    startDate: {
        type: Date,
        required: [true, 'La date de début est requise']
    },
    endDate: {
        type: Date,
        required: [true, 'La date de fin est requise']
    }
}, {
    timestamps: true
});

/**
 * Validation des dates
 */
reservationSchema.pre('save', async function(next) {
    if (this.startDate >= this.endDate) {
        next(new Error('La date de fin doit être postérieure à la date de début'));
    }

    if (this.startDate < new Date()) {
        next(new Error('La date de début ne peut pas être dans le passé'));
    }

    // Vérifier la disponibilité du catway
    const Catway = mongoose.model('Catway');
    const catway = await Catway.findOne({ catwayNumber: this.catwayNumber });
    
    if (!catway) {
        next(new Error('Catway non trouvé'));
    }

    const isAvailable = await catway.isAvailable(this.startDate, this.endDate);
    if (!isAvailable) {
        next(new Error('Le catway n\'est pas disponible pour ces dates'));
    }

    next();
});

module.exports = mongoose.model('Reservation', reservationSchema); 