/**
 * @fileoverview Modèle Mongoose pour les catways
 */

const mongoose = require('mongoose');

/**
 * Schéma catway
 * @typedef {Object} CatwaySchema
 * @property {string} catwayNumber - Numéro unique du catway
 * @property {string} catwayType - Type de catway (long ou short)
 * @property {string} catwayState - État du catway
 */
const catwaySchema = new mongoose.Schema({
    catwayNumber: {
        type: String,
        required: [true, 'Le numéro du catway est requis'],
        unique: true,
        trim: true
    },
    catwayType: {
        type: String,
        required: [true, 'Le type de catway est requis'],
        enum: {
            values: ['long', 'short'],
            message: 'Le type de catway doit être "long" ou "short"'
        }
    },
    catwayState: {
        type: String,
        required: [true, 'L\'état du catway est requis'],
        trim: true
    }
}, {
    timestamps: true
});

/**
 * Vérifie si le catway est disponible pour une période donnée
 * @param {Date} startDate - Date de début
 * @param {Date} endDate - Date de fin
 * @returns {Promise<boolean>} - True si le catway est disponible
 */
catwaySchema.methods.isAvailable = async function(startDate, endDate) {
    const Reservation = mongoose.model('Reservation');
    const conflictingReservation = await Reservation.findOne({
        catwayNumber: this.catwayNumber,
        $or: [
            { startDate: { $lte: endDate }, endDate: { $gte: startDate } }
        ]
    });
    return !conflictingReservation;
};

module.exports = mongoose.model('Catway', catwaySchema); 