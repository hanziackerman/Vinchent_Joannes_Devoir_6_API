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
- **Réponse** : Redirige vers le dashboard en cas de succès

### GET /logout
- **Description** : Déconnecte l'utilisateur
- **Authentification** : Requise
- **Réponse** : Redirige vers la page de connexion

## 👥 Gestion des Utilisateurs

### GET /users
- **Description** : Récupère la liste des utilisateurs
- **Authentification** : Requise
- **Réponse** :
```json
[
  {
    "email": "string",
    "username": "string",
    "role": "string"
  }
]
```

### GET /users/:email
- **Description** : Récupère les détails d'un utilisateur
- **Authentification** : Requise
- **Paramètres** :
  - `email` : Email de l'utilisateur
- **Réponse** :
```json
{
  "email": "string",
  "username": "string",
  "role": "string"
}
```

### POST /users
- **Description** : Crée un nouvel utilisateur
- **Authentification** : Requise
- **Corps de la requête** :
```json
{
  "email": "string",
  "username": "string",
  "password": "string",
  "role": "string"
}
```
- **Réponse** : L'utilisateur créé

### PUT /users/:email
- **Description** : Modifie un utilisateur existant
- **Authentification** : Requise
- **Paramètres** :
  - `email` : Email de l'utilisateur
- **Corps de la requête** :
```json
{
  "username": "string",
  "password": "string",
  "role": "string"
}
```
- **Réponse** : L'utilisateur modifié

### DELETE /users/:email
- **Description** : Supprime un utilisateur
- **Authentification** : Requise
- **Paramètres** :
  - `email` : Email de l'utilisateur
- **Réponse** : 204 No Content

## 🚤 Gestion des Catways

### GET /catways
- **Description** : Récupère la liste des catways
- **Authentification** : Requise
- **Réponse** :
```json
[
  {
    "id": "string",
    "number": "string",
    "length": "number",
    "width": "number",
    "draft": "number"
  }
]
```

### GET /catways/:id
- **Description** : Récupère les détails d'un catway
- **Authentification** : Requise
- **Paramètres** :
  - `id` : ID du catway
- **Réponse** :
```json
{
  "id": "string",
  "number": "string",
  "length": "number",
  "width": "number",
  "draft": "number"
}
```

### POST /catways
- **Description** : Crée un nouveau catway
- **Authentification** : Requise
- **Corps de la requête** :
```json
{
  "number": "string",
  "length": "number",
  "width": "number",
  "draft": "number"
}
```
- **Réponse** : Le catway créé

### PUT /catways/:id
- **Description** : Modifie un catway existant
- **Authentification** : Requise
- **Paramètres** :
  - `id` : ID du catway
- **Corps de la requête** :
```json
{
  "number": "string",
  "length": "number",
  "width": "number",
  "draft": "number"
}
```
- **Réponse** : Le catway modifié

### DELETE /catways/:id
- **Description** : Supprime un catway
- **Authentification** : Requise
- **Paramètres** :
  - `id` : ID du catway
- **Réponse** : 204 No Content

## 📅 Gestion des Réservations

### GET /catways/:id/reservations
- **Description** : Récupère les réservations d'un catway
- **Authentification** : Requise
- **Paramètres** :
  - `id` : ID du catway
- **Réponse** :
```json
[
  {
    "id": "string",
    "catwayId": "string",
    "userId": "string",
    "startDate": "date",
    "endDate": "date",
    "status": "string"
  }
]
```

### POST /catways/:id/reservations
- **Description** : Crée une nouvelle réservation pour un catway
- **Authentification** : Requise
- **Paramètres** :
  - `id` : ID du catway
- **Corps de la requête** :
```json
{
  "startDate": "date",
  "endDate": "date"
}
```
- **Réponse** : La réservation créée

### PUT /catways/:id/reservations/:reservationId
- **Description** : Modifie une réservation existante
- **Authentification** : Requise
- **Paramètres** :
  - `id` : ID du catway
  - `reservationId` : ID de la réservation
- **Corps de la requête** :
```json
{
  "startDate": "date",
  "endDate": "date",
  "status": "string"
}
```
- **Réponse** : La réservation modifiée

### DELETE /catways/:id/reservations/:reservationId
- **Description** : Supprime une réservation
- **Authentification** : Requise
- **Paramètres** :
  - `id` : ID du catway
  - `reservationId` : ID de la réservation
- **Réponse** : 204 No Content 