# Documentation des Endpoints API

## 🔐 Authentification

### POST /login
- **Description** : Authentifie un utilisateur
- **Corps de la requête** :
```json
{
  "email": "string",
  "password": "string"
}
```
- **Réponse** : 
  - 200 : Connexion réussie
  - 401 : Identifiants invalides
  - 400 : Données manquantes

### GET /logout
- **Description** : Déconnecte l'utilisateur actuel
- **Authentification** : Requise
- **Réponse** : 
  - 200 : Déconnexion réussie
  - 401 : Non authentifié

## 👥 Gestion des Utilisateurs

### GET /users
- **Description** : Liste tous les utilisateurs
- **Authentification** : Requise
- **Paramètres de requête** :
  - `page` (optionnel) : Numéro de page
  - `limit` (optionnel) : Nombre d'éléments par page
- **Réponse** :
  - 200 : Liste des utilisateurs
  - 401 : Non authentifié

### GET /users/:email
- **Description** : Récupère les détails d'un utilisateur
- **Authentification** : Requise
- **Paramètres** :
  - `email` : Email de l'utilisateur
- **Réponse** :
  - 200 : Détails de l'utilisateur
  - 404 : Utilisateur non trouvé
  - 401 : Non authentifié

### POST /users
- **Description** : Crée un nouvel utilisateur
- **Authentification** : Requise
- **Corps de la requête** :
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}
```
- **Réponse** :
  - 201 : Utilisateur créé
  - 400 : Données invalides
  - 409 : Email déjà utilisé
  - 401 : Non authentifié

### PUT /users/:email
- **Description** : Modifie un utilisateur existant
- **Authentification** : Requise
- **Paramètres** :
  - `email` : Email de l'utilisateur
- **Corps de la requête** :
```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "role": "string"
}
```
- **Réponse** :
  - 200 : Utilisateur modifié
  - 404 : Utilisateur non trouvé
  - 400 : Données invalides
  - 401 : Non authentifié

### DELETE /users/:email
- **Description** : Supprime un utilisateur
- **Authentification** : Requise
- **Paramètres** :
  - `email` : Email de l'utilisateur
- **Réponse** :
  - 200 : Utilisateur supprimé
  - 404 : Utilisateur non trouvé
  - 401 : Non authentifié

## 🚤 Gestion des Catways

### GET /catways
- **Description** : Liste tous les catways
- **Authentification** : Requise
- **Paramètres de requête** :
  - `page` (optionnel) : Numéro de page
  - `limit` (optionnel) : Nombre d'éléments par page
  - `available` (optionnel) : Filtrer par disponibilité
- **Réponse** :
  - 200 : Liste des catways
  - 401 : Non authentifié

### GET /catways/:id
- **Description** : Récupère les détails d'un catway
- **Authentification** : Requise
- **Paramètres** :
  - `id` : Identifiant du catway
- **Réponse** :
  - 200 : Détails du catway
  - 404 : Catway non trouvé
  - 401 : Non authentifié

### POST /catways
- **Description** : Crée un nouveau catway
- **Authentification** : Requise
- **Corps de la requête** :
```json
{
  "number": "string",
  "length": "number",
  "width": "number",
  "price": "number"
}
```
- **Réponse** :
  - 201 : Catway créé
  - 400 : Données invalides
  - 401 : Non authentifié

### PUT /catways/:id
- **Description** : Modifie un catway existant
- **Authentification** : Requise
- **Paramètres** :
  - `id` : Identifiant du catway
- **Corps de la requête** :
```json
{
  "number": "string",
  "length": "number",
  "width": "number",
  "price": "number"
}
```
- **Réponse** :
  - 200 : Catway modifié
  - 404 : Catway non trouvé
  - 400 : Données invalides
  - 401 : Non authentifié

### DELETE /catways/:id
- **Description** : Supprime un catway
- **Authentification** : Requise
- **Paramètres** :
  - `id` : Identifiant du catway
- **Réponse** :
  - 200 : Catway supprimé
  - 404 : Catway non trouvé
  - 401 : Non authentifié

## 📅 Gestion des Réservations

### GET /catways/:id/reservations
- **Description** : Liste les réservations d'un catway
- **Authentification** : Requise
- **Paramètres** :
  - `id` : Identifiant du catway
- **Paramètres de requête** :
  - `page` (optionnel) : Numéro de page
  - `limit` (optionnel) : Nombre d'éléments par page
  - `startDate` (optionnel) : Date de début
  - `endDate` (optionnel) : Date de fin
- **Réponse** :
  - 200 : Liste des réservations
  - 404 : Catway non trouvé
  - 401 : Non authentifié

### POST /catways/:id/reservations
- **Description** : Crée une nouvelle réservation
- **Authentification** : Requise
- **Paramètres** :
  - `id` : Identifiant du catway
- **Corps de la requête** :
```json
{
  "startDate": "date",
  "endDate": "date",
  "userId": "string",
  "boatName": "string",
  "boatLength": "number"
}
```
- **Réponse** :
  - 201 : Réservation créée
  - 400 : Données invalides ou dates non disponibles
  - 404 : Catway non trouvé
  - 401 : Non authentifié

### PUT /catways/:id/reservations/:reservationId
- **Description** : Modifie une réservation existante
- **Authentification** : Requise
- **Paramètres** :
  - `id` : Identifiant du catway
  - `reservationId` : Identifiant de la réservation
- **Corps de la requête** :
```json
{
  "startDate": "date",
  "endDate": "date",
  "userId": "string",
  "boatName": "string",
  "boatLength": "number"
}
```
- **Réponse** :
  - 200 : Réservation modifiée
  - 400 : Données invalides ou dates non disponibles
  - 404 : Catway ou réservation non trouvé
  - 401 : Non authentifié

### DELETE /catways/:id/reservations/:reservationId
- **Description** : Supprime une réservation
- **Authentification** : Requise
- **Paramètres** :
  - `id` : Identifiant du catway
  - `reservationId` : Identifiant de la réservation
- **Réponse** :
  - 200 : Réservation supprimée
  - 404 : Catway ou réservation non trouvé
  - 401 : Non authentifié 