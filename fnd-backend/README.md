# Fast & Delicious - Backend API

Backend REST API pour l'application Fast & Delicious Restaurant développé avec Node.js, Express, MySQL et Prisma.

## 🚀 Installation

### Prérequis
- Node.js (v18 ou supérieur)
- MySQL (via XAMPP)
- npm ou yarn

### Étapes d'installation

1. **Cloner le projet et installer les dépendances**
```bash
cd fnd-backend
npm install
```

2. **Configurer la base de données**
- Démarrer XAMPP et MySQL
- Créer une base de données nommée `fnd_restaurant` dans phpMyAdmin

3. **Configurer les variables d'environnement**
```bash
cp .env.example .env
# Éditer .env avec vos configurations
```

4. **Générer le client Prisma**
```bash
npm run prisma:generate
```

5. **Exécuter les migrations**
```bash
npm run prisma:migrate
```

6. **Optionnel : Seed la base de données**
```bash
npm run prisma:seed
```

7. **Démarrer le serveur**
```bash
# Développement
npm run dev

# Production
npm start
```

Le serveur démarre sur `http://localhost:5000`

## 📁 Structure du Projet

```
fnd-backend/
├── prisma/
│   ├── schema.prisma      # Schéma de base de données
│   └── seed.js            # Données de test
├── src/
│   ├── config/            # Configuration (DB, JWT, etc.)
│   ├── controllers/       # Contrôleurs (logique métier)
│   ├── middleware/        # Middleware (auth, validation, etc.)
│   ├── models/            # Modèles Prisma (optionnel)
│   ├── routes/            # Routes API
│   ├── services/          # Services (email, SMS, etc.)
│   ├── utils/             # Utilitaires
│   ├── validators/        # Validateurs
│   ├── socket/            # WebSocket handlers
│   └── server.js          # Point d'entrée
├── uploads/               # Fichiers uploadés
├── logs/                  # Logs de l'application
├── .env                   # Variables d'environnement
├── .env.example           # Exemple de configuration
└── package.json
```

## 🔐 Authentification

L'API utilise JWT pour l'authentification avec support OAuth2 (Google, Apple).

### Endpoints d'authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/google` - Connexion Google
- `POST /api/auth/apple` - Connexion Apple
- `POST /api/auth/refresh` - Rafraîchir token
- `GET /api/auth/me` - Utilisateur actuel

## 📚 Documentation API

La documentation Postman est disponible dans `/docs/postman-collection.json`

Pour importer dans Postman :
1. Ouvrir Postman
2. Import → File
3. Sélectionner `docs/postman-collection.json`

## 🗄️ Base de Données

### Modèles principaux
- **User** - Utilisateurs (clients, admin, cuisinier, livreur)
- **Product** - Produits du menu
- **Order** - Commandes
- **Cart** - Panier d'achat
- **Review** - Avis clients
- **LoyaltyPoints** - Points de fidélité
- **PromoCode** - Codes promo
- **Message** - Messages du chat
- **Notification** - Notifications in-app

### Prisma Studio
Pour visualiser et modifier la base de données :
```bash
npm run prisma:studio
```

## 🔧 Scripts Disponibles

- `npm start` - Démarrer le serveur en production
- `npm run dev` - Démarrer en mode développement (nodemon)
- `npm run prisma:generate` - Générer le client Prisma
- `npm run prisma:migrate` - Exécuter les migrations
- `npm run prisma:studio` - Ouvrir Prisma Studio
- `npm run prisma:seed` - Seed la base de données
- `npm test` - Exécuter les tests

## 🌐 Endpoints API

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit
- `POST /api/products` - Créer un produit (admin)
- `PUT /api/products/:id` - Modifier un produit (admin)
- `DELETE /api/products/:id` - Supprimer un produit (admin)

### Commandes
- `GET /api/orders` - Liste des commandes
- `GET /api/orders/:id` - Détails d'une commande
- `POST /api/orders` - Créer une commande
- `PUT /api/orders/:id/status` - Changer le statut (admin)

### Panier
- `GET /api/cart` - Récupérer le panier
- `POST /api/cart/items` - Ajouter un article
- `PUT /api/cart/items/:id` - Modifier la quantité
- `DELETE /api/cart/items/:id` - Supprimer un article

### Favoris
- `GET /api/favorites` - Liste des favoris
- `POST /api/favorites/:productId` - Ajouter aux favoris
- `DELETE /api/favorites/:productId` - Retirer des favoris

### Avis
- `GET /api/reviews` - Liste des avis
- `POST /api/reviews` - Créer un avis
- `PUT /api/reviews/:id` - Modifier un avis (admin)

### Points de Fidélité
- `GET /api/loyalty/points` - Points de l'utilisateur
- `GET /api/loyalty/history` - Historique des points
- `POST /api/loyalty/redeem` - Échanger des points

### Codes Promo
- `GET /api/promos` - Liste des codes promo (admin)
- `POST /api/promos` - Créer un code promo (admin)
- `POST /api/promos/validate` - Valider un code promo

### Chat
- `GET /api/chat/orders/:orderId` - Messages d'une commande
- `POST /api/chat/orders/:orderId` - Envoyer un message

### Notifications
- `GET /api/notifications` - Liste des notifications
- `PUT /api/notifications/:id/read` - Marquer comme lue

### Admin
- `GET /api/admin/stats/dashboard` - Statistiques dashboard
- `GET /api/admin/stats/sales` - Statistiques ventes
- `GET /api/admin/reports/sales` - Rapport ventes (PDF/CSV)

## 🔒 Sécurité

- Authentification JWT
- Hashage des mots de passe avec bcrypt
- Validation des données avec express-validator
- Protection CORS
- Helmet pour les headers sécurisés
- Rate limiting (optionnel)

## 📝 Logs

Les logs sont enregistrés dans le dossier `logs/` avec Winston :
- `combined.log` - Tous les logs
- `error.log` - Erreurs uniquement

## 🧪 Tests

```bash
npm test
```

## 📄 Licence

ISC

## 👥 Support

Pour toute question ou problème, ouvrir une issue sur le repository.

