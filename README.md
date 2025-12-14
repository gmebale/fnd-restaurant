# 🍔 F&D Fast & Delicious Restaurant

Une plateforme complète de commande de fast-food en ligne moderne et réactive, composée d'une application frontend React et d'une API backend Node.js/Express avec base de données MySQL.

## 🎯 Caractéristiques principales

### Pour les clients
- ✅ **Navigation fluide** : Menu filtrable par catégories avec interface intuitive
- ✅ **Panier persistant** : Gestion du panier avec localStorage
- ✅ **Gestion des favoris** : Ajout et suppression rapide des produits favoris
- ✅ **Suivi des commandes** : Historique complet avec tracking en temps réel
- ✅ **Programme de fidélité** : Système de points et codes promotionnels
- ✅ **Chat en direct** : Communication temps réel avec le restaurant
- ✅ **Avis et évaluations** : Système de notation après livraison
- ✅ **Profil utilisateur** : Gestion des informations personnelles

### Pour les administrateurs
- ✅ **Dashboard complet** : Statistiques clés et métriques importantes
- ✅ **Gestion des commandes** : Interface avancée avec raccourcis clavier
- ✅ **Module Cuisine** : Suivi des commandes à préparer
- ✅ **Module Livraison** : Gestion des commandes prêtes à livrer
- ✅ **CRUD Produits** : Création, modification, suppression des produits
- ✅ **Gestion des avis** : Consultation et statistiques des évaluations
- ✅ **Notifications temps réel** : Alertes sonores et navigateur

## 🛠️ Technologies utilisées

### Frontend
- **React** 18.2 - Framework JavaScript moderne
- **React Router DOM** 6.14 - Routage côté client
- **Tailwind CSS** 4 - Framework CSS utilitaire
- **Framer Motion** 10 - Animations et transitions
- **Lucide React** - Bibliothèque d'icônes
- **Axios** - Client HTTP pour les appels API

### Backend
- **Node.js** - Runtime JavaScript côté serveur
- **Express.js** - Framework web minimaliste
- **Prisma ORM** - ORM moderne pour bases de données
- **MySQL** - Système de gestion de base de données
- **JWT** - Authentification sécurisée
- **Socket.io** - Communication temps réel
- **bcrypt** - Hashage des mots de passe

### Déploiement
- **Netlify** - Hébergement frontend (gratuit)
- **Hostinger** - Hébergement backend et base de données

## 🚀 Installation et démarrage

### Prérequis
- **Node.js** 16+ et **npm** 8+
- **MySQL** (via XAMPP ou serveur local)
- **Git**

### Étapes d'installation

1. **Cloner le projet**
```bash
git clone https://github.com/votre-username/fnd-restaurant.git
cd fnd-restaurant
```

2. **Configuration du Backend**
```bash
cd fnd-backend

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.example .env
# Éditer .env avec vos configurations MySQL

# Générer le client Prisma
npm run prisma:generate

# Exécuter les migrations
npm run prisma:migrate

# Optionnel : Seed la base de données
npm run prisma:seed

# Démarrer le serveur backend
npm run dev
```

3. **Configuration du Frontend**
```bash
cd ../fnd-frontend

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

### URLs de développement
- **Frontend** : http://localhost:3000
- **Backend** : http://localhost:5000

## 📁 Structure du projet

```
FND Restaurant/
├── fnd-frontend/              # Application React
│   ├── public/               # Assets statiques
│   ├── src/
│   │   ├── components/       # Composants réutilisables
│   │   ├── contexts/         # Contextes React (Auth, Cart)
│   │   ├── lib/              # Utilitaires et API
│   │   ├── pages/            # Pages de l'application
│   │   │   ├── admin/        # Pages administrateur
│   │   │   └── ...           # Pages client
│   │   ├── App.jsx           # Router principal
│   │   └── main.jsx          # Point d'entrée React
│   ├── package.json
│   └── README.md
├── fnd-backend/               # API Node.js/Express
│   ├── prisma/
│   │   ├── schema.prisma     # Schéma base de données
│   │   └── seed.js           # Données de test
│   ├── src/
│   │   ├── config/           # Configuration (DB, JWT)
│   │   ├── controllers/      # Logique métier
│   │   ├── middleware/       # Middleware personnalisé
│   │   ├── routes/           # Définition des routes API
│   │   ├── socket/           # Gestion WebSocket
│   │   ├── utils/            # Utilitaires
│   │   ├── validators/       # Validation des données
│   │   └── server.js         # Point d'entrée serveur
│   ├── uploads/              # Fichiers uploadés
│   ├── logs/                 # Logs de l'application
│   ├── package.json
│   └── README.md
├── DEPLOYMENT_GUIDE.md        # Guide de déploiement détaillé
├── NETLIFY_DEPLOYMENT_GUIDE.md # Guide déploiement Netlify
└── README.md                  # Ce fichier
```

## 🔐 Authentification

L'application utilise JWT pour l'authentification avec support OAuth2 (Google, Apple).

### Rôles utilisateur
- **Client** : Accès aux fonctionnalités de commande
- **Admin** : Accès complet à la gestion
- **Cuisinier** : Gestion des commandes cuisine
- **Livreur** : Gestion des livraisons

## 📊 Base de données

### Modèles principaux
- **User** : Utilisateurs (clients, admin, cuisinier, livreur)
- **Product** : Produits du menu avec catégories
- **Order** : Commandes avec statuts détaillés
- **Cart** : Paniers d'achat temporaires
- **Review** : Avis et évaluations clients
- **LoyaltyPoints** : Système de fidélité
- **PromoCode** : Codes promotionnels
- **Message** : Messages du chat
- **Notification** : Notifications push

### Prisma Studio
Pour visualiser et gérer la base de données :
```bash
cd fnd-backend
npm run prisma:studio
```

## 🎨 Design System

### Palette de couleurs
- **Primaire** : `#fc0000` (Rouge vif)
- **Accent** : `#FFB703` (Jaune or)
- **Fond** : `#FFF8E7` (Crème)
- **Admin** : `#111827` (Gris foncé)

### Typographie
- **Titres** : Poppins (bold, extrabold)
- **Corps** : Inter (regular, semibold)

## 🌐 API Endpoints principaux

### Produits
- `GET /api/products` - Liste des produits
- `POST /api/products` - Créer un produit (admin)

### Commandes
- `GET /api/orders` - Liste des commandes
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id/status` - Changer le statut

### Authentification
- `POST /api/auth/login` - Connexion
- `POST /api/auth/register` - Inscription
- `GET /api/auth/me` - Utilisateur actuel

### Panier & Favoris
- `GET /api/cart` - Récupérer le panier
- `POST /api/favorites/:productId` - Ajouter aux favoris

## 🚀 Déploiement

### Préparation
1. Suivre le guide dans `DEPLOYMENT_GUIDE.md`
2. Configurer les variables d'environnement
3. Tester l'application en local

### Déploiement Netlify
```bash
# Frontend
cd fnd-frontend
npm run build
# Déployer le dossier build sur Netlify

# Backend (fonctions serverless)
# Utiliser Netlify Functions ou déployer sur Hostinger
```

### Base de données
- Hébergement sur **Hostinger MySQL**
- Migrations Prisma automatisées
- Backup automatique recommandé

## 📱 Fonctionnalités clés

### Expérience Client
- **Menu interactif** : Filtrage par catégories, recherche
- **Commande simplifiée** : Ajout au panier, checkout rapide
- **Suivi temps réel** : Notifications push des statuts
- **Chat intégré** : Support client direct

### Panel Administrateur
- **Dashboard analytics** : Ventes, commandes, clients
- **Gestion opérationnelle** : Cuisine, livraison, stocks
- **CRUD complet** : Produits, utilisateurs, promotions
- **Rapports détaillés** : Export PDF/CSV

## 🔧 Scripts disponibles

### Frontend
```bash
npm start          # Démarrage développement
npm run build      # Build production
npm test           # Tests unitaires
npm run lint       # Linting du code
```

### Backend
```bash
npm run dev        # Démarrage développement (nodemon)
npm start          # Démarrage production
npm run prisma:generate  # Générer client Prisma
npm run prisma:migrate   # Exécuter migrations
npm run prisma:studio    # Interface graphique DB
npm run prisma:seed      # Seed la base de données
```

## 🧪 Tests

```bash
# Tests frontend
cd fnd-frontend && npm test

# Tests backend (si configurés)
cd fnd-backend && npm test
```

## 📝 Documentation

- **[Guide de Déploiement](DEPLOYMENT_GUIDE.md)** - Déploiement complet sur Netlify
- **[README Backend](fnd-backend/README.md)** - Documentation API détaillée
- **[README Frontend](fnd-frontend/README.md)** - Guide d'utilisation frontend

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence ISC.

## 👥 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Contacter l'équipe de développement

---

**F&D Fast & Delicious © 2025** — Rabat, Agdal
#   f n d - r e s t a u r a n t  
 