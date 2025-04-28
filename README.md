# API de Gestion des Catways - Port de Russell

Application web pour la gestion des réservations de catways au port de Russell.

## 🚀 Fonctionnalités

- Authentification des utilisateurs
- Gestion des utilisateurs (CRUD)
- Gestion des catways et leurs caractéristiques
- Système de réservation
- Interface d'administration
- API RESTful documentée

## 📋 Prérequis

- Node.js (v18 ou supérieur)
- MongoDB (v6 ou supérieur)
- npm ou yarn

## 🛠️ Installation

1. Cloner le dépôt :
```bash
git clone https://github.com/hanziackerman/Vinchent_Joannes_Devoir_6_API.git
cd Vinchent_Joannes_Devoir_6_API
```

2. Installer les dépendances :
```bash
npm install
```

3. Configurer les variables d'environnement :
```bash
cp .env.example .env
```
Éditer le fichier `.env` avec vos paramètres :
```
PORT=3002
MONGODB_URI=mongodb://localhost:27017/russell-marina
SESSION_SECRET=votre_secret_ici
```

4. Peupler la base de données :
```bash
npm run seed
```

## 🚀 Démarrage

1. Démarrer en mode développement :
```bash
npm run dev
```

2. Démarrer en mode production :
```bash
npm start
```

L'application sera accessible à l'adresse : `http://localhost:3002`

## 📚 Documentation

- [Documentation des endpoints](ENDPOINTS.md)
- [Historique des versions](VERSION.md)

## 🔒 Sécurité

- Authentification requise pour tous les endpoints (sauf login)
- Hachage des mots de passe avec bcrypt
- Protection CSRF
- Validation des données
- Sessions sécurisées

## 🧪 Tests

```bash
npm test
```

## 📝 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails. 