# Port de Plaisance de Russell - Gestion des Catways

Application web de gestion des réservations de catways pour le port de plaisance de Russell.

## Fonctionnalités

- Authentification sécurisée
- Gestion des catways (CRUD)
- Gestion des réservations (CRUD)
- Gestion des utilisateurs (CRUD)
- Documentation API intégrée
- Interface utilisateur intuitive

## Technologies utilisées

- Backend : Node.js avec Express
- Base de données : MongoDB
- Template Engine : EJS
- Documentation API : Swagger
- Frontend : Bootstrap 5
- Sécurité : bcrypt, express-session

## Prérequis

- Node.js (v14 ou supérieur)
- MongoDB (v4.4 ou supérieur)
- npm ou yarn

## Installation

1. Cloner le dépôt :
```bash
git clone [url-du-repo]
cd port-russell-api
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
- Copier le fichier `.env.example` en `.env`
- Modifier les variables selon votre environnement

4. Alimenter la base de données :
```bash
npm run seed
```

5. Démarrer l'application :
```bash
# Mode développement
npm run dev

# Mode production
npm start
```

## Structure du projet

```
src/
├── controllers/     # Logique métier
├── models/         # Modèles Mongoose
├── routes/         # Routes de l'API
├── views/          # Templates EJS
├── middlewares/    # Middlewares Express
├── scripts/        # Scripts utilitaires
└── app.js         # Point d'entrée
```

## API Endpoints

### Authentification
- `POST /login` : Connexion
- `GET /logout` : Déconnexion

### Utilisateurs
- `GET /users` : Liste des utilisateurs
- `GET /users/:email` : Détails d'un utilisateur
- `POST /users` : Création d'un utilisateur
- `PUT /users/:email` : Modification d'un utilisateur
- `DELETE /users/:email` : Suppression d'un utilisateur

### Catways
- `GET /catways` : Liste des catways
- `GET /catways/:id` : Détails d'un catway
- `POST /catways` : Création d'un catway
- `PUT /catways/:id` : Modification d'un catway
- `DELETE /catways/:id` : Suppression d'un catway

### Réservations
- `GET /catways/:id/reservations` : Liste des réservations d'un catway
- `POST /catways/:id/reservations` : Création d'une réservation
- `PUT /catways/:id/reservations/:reservationId` : Modification d'une réservation
- `DELETE /catways/:id/reservations/:reservationId` : Suppression d'une réservation

## Documentation

La documentation complète de l'API est disponible à l'adresse `/api-docs` une fois l'application démarrée.

## Sécurité

- Authentification requise pour toutes les opérations
- Mots de passe hashés avec bcrypt
- Protection contre les injections NoSQL
- Validation des données entrantes
- Sessions sécurisées

## Déploiement

L'application peut être déployée sur n'importe quelle plateforme supportant Node.js :
- Heroku
- DigitalOcean
- AWS
- Azure
- etc.

## Contribution

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## Licence

MIT 