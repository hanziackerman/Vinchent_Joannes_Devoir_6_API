/**
 * @fileoverview Configuration Swagger pour la documentation de l'API
 */

const swaggerJSDoc = require('swagger-jsdoc');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Port de Russell',
            version: '1.0.0',
            description: 'API de gestion des catways pour le port de plaisance de Russell',
        },
        servers: [
            {
                url: process.env.API_URL || 'http://localhost:3000',
                description: 'Serveur de développement',
            },
        ],
        components: {
            securitySchemes: {
                sessionAuth: {
                    type: 'apiKey',
                    in: 'cookie',
                    name: 'connect.sid'
                }
            }
        },
        security: [{
            sessionAuth: []
        }]
    },
    apis: ['./src/routes/*.js'], // Chemins des fichiers contenant la documentation
};

module.exports = swaggerJSDoc(options); 