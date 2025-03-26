/**
 * @fileoverview Modèle Mongoose pour les utilisateurs
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * Schéma utilisateur
 * @typedef {Object} UserSchema
 * @property {string} username - Nom d'utilisateur
 * @property {string} email - Adresse email
 * @property {string} password - Mot de passe hashé
 */
const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Le nom d\'utilisateur est requis'],
        trim: true,
        minlength: [3, 'Le nom d\'utilisateur doit contenir au moins 3 caractères'],
        maxlength: [50, 'Le nom d\'utilisateur ne peut pas dépasser 50 caractères'],
        match: [/^[a-zA-Z0-9_-]+$/, 'Le nom d\'utilisateur ne peut contenir que des lettres, chiffres, tirets et underscores']
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/, 'Veuillez entrer une adresse email valide']
    },
    password: {
        type: String,
        required: [true, 'Le mot de passe est requis'],
        minlength: [8, 'Le mot de passe doit contenir au moins 8 caractères'],
        validate: {
            validator: function(password) {
                // Au moins une majuscule, une minuscule, un chiffre et un caractère spécial
                const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
                return passwordRegex.test(password);
            },
            message: 'Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial'
        }
    }
}, {
    timestamps: true
});

/**
 * Hash le mot de passe avant la sauvegarde
 */
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        // Vérification de la complexité du mot de passe avant le hash
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/;
        if (!passwordRegex.test(this.password)) {
            throw new Error('Le mot de passe doit contenir au moins une majuscule, une minuscule, un chiffre et un caractère spécial');
        }

        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

/**
 * Vérifie si le mot de passe correspond
 * @param {string} candidatePassword - Mot de passe à vérifier
 * @returns {Promise<boolean>} - True si le mot de passe correspond
 */
userSchema.methods.comparePassword = async function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Index pour optimiser les recherches par email
userSchema.index({ email: 1 });

module.exports = mongoose.model('User', userSchema); 