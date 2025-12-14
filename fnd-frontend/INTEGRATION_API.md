# Intégration API - Frontend

## ✅ Modifications Effectuées

### 1. **Configuration API** (`src/config/api.config.js`)
- ✅ Configuration de l'URL de base de l'API
- ✅ Gestion du stockage des tokens (JWT)
- ✅ Fonctions utilitaires pour tokens et utilisateur

### 2. **Client API** (`src/lib/api.js`)
- ✅ Remplacement complet des mocks par des appels HTTP réels
- ✅ Utilisation d'axios avec intercepteurs
- ✅ Gestion automatique du token JWT dans les headers
- ✅ Refresh automatique du token en cas d'expiration
- ✅ Tous les endpoints API implémentés :
  - Authentification (register, login, logout, refresh)
  - Produits (CRUD)
  - Commandes (CRUD + statuts)
  - Panier (CRUD)
  - Favoris
  - Avis
  - Points de fidélité
  - Codes promo
  - Chat
  - Notifications
  - Admin (stats, rapports)

### 3. **AuthContext** (`src/contexts/AuthContext.jsx`)
- ✅ Authentification réelle avec API
- ✅ Vérification automatique de l'authentification au démarrage
- ✅ Stockage du token et de l'utilisateur
- ✅ Fonctions login, register, logout
- ✅ Fonction loginAsAdmin pour connexion admin

### 4. **CartContext** (`src/contexts/CartContext.jsx`)
- ✅ Panier synchronisé avec l'API backend
- ✅ Chargement automatique du panier au login
- ✅ Toutes les opérations (add, update, remove, clear) via API
- ✅ Gestion des erreurs

### 5. **Pages Mises à Jour**

#### **Cart.jsx**
- ✅ Création de commande via API
- ✅ Validation des codes promo
- ✅ Gestion des points de fidélité
- ✅ Calcul correct des totaux (sous-total, réduction, livraison)

#### **Favorites.jsx**
- ✅ Chargement des favoris depuis l'API
- ✅ Gestion de l'authentification
- ✅ Gestion des erreurs

#### **Orders.jsx**
- ✅ Chargement des commandes depuis l'API
- ✅ Affichage correct des statuts
- ✅ Gestion de l'authentification
- ✅ Intégration avec ReviewModal

#### **Profile.jsx**
- ✅ Mise à jour du profil (prêt pour endpoint backend)
- ✅ Gestion des rôles (ADMIN, SUPER_ADMIN)
- ✅ Messages de succès/erreur

### 6. **Composants Mises à Jour**

#### **FavoriteButton.jsx**
- ✅ Toggle favoris via API
- ✅ Vérification de l'état favori depuis l'API
- ✅ Gestion de l'authentification
- ✅ États de chargement

#### **LoyaltyDisplay.jsx**
- ✅ Chargement des points depuis l'API
- ✅ Affichage des statistiques (gagnés, dépensés)

## 🔧 Configuration Requise

### Variables d'Environnement

Créer un fichier `.env` dans `fnd-frontend/` :

```env
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_WS_URL=ws://localhost:5000
```

### Installation

```bash
cd fnd-frontend
npm install
```

## 📡 Endpoints Utilisés

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `POST /api/auth/logout` - Déconnexion
- `GET /api/auth/me` - Utilisateur actuel
- `POST /api/auth/refresh` - Rafraîchir token

### Produits
- `GET /api/products` - Liste produits
- `GET /api/products/popular` - Produits populaires
- `GET /api/products/:id` - Détails produit

### Commandes
- `GET /api/orders` - Liste commandes
- `POST /api/orders` - Créer commande
- `GET /api/orders/:id` - Détails commande
- `PUT /api/orders/:id/status` - Changer statut

### Panier
- `GET /api/cart` - Récupérer panier
- `POST /api/cart/items` - Ajouter article
- `PUT /api/cart/items/:id` - Modifier quantité
- `DELETE /api/cart/items/:id` - Supprimer article
- `DELETE /api/cart` - Vider panier

### Favoris
- `GET /api/favorites` - Liste favoris
- `POST /api/favorites/:productId` - Ajouter favori
- `DELETE /api/favorites/:productId` - Retirer favori

### Points de Fidélité
- `GET /api/loyalty/points` - Points utilisateur
- `GET /api/loyalty/history` - Historique

### Codes Promo
- `POST /api/promos/validate` - Valider code promo

## 🔐 Gestion de l'Authentification

### Flux d'Authentification

1. **Login/Register**
   - L'utilisateur se connecte ou s'inscrit
   - Le backend retourne `accessToken` et `refreshToken`
   - Les tokens sont stockés dans `localStorage`
   - L'utilisateur est stocké dans `localStorage` et `AuthContext`

2. **Requêtes Authentifiées**
   - Chaque requête HTTP inclut automatiquement le token dans le header `Authorization: Bearer <token>`
   - L'intercepteur axios ajoute le token automatiquement

3. **Refresh Token**
   - Si une requête retourne 401, l'intercepteur tente de rafraîchir le token
   - Si le refresh réussit, la requête originale est réessayée
   - Si le refresh échoue, l'utilisateur est déconnecté

4. **Logout**
   - Les tokens sont supprimés du `localStorage`
   - L'utilisateur est retiré du contexte
   - Une requête de logout est envoyée au backend

## ⚠️ Notes Importantes

### Format des Données

Le backend utilise des formats spécifiques :

- **Statuts de commande** : `PENDING`, `PREPARING`, `READY`, `DELIVERING`, `DELIVERED`, `CANCELLED` (en majuscules)
- **Rôles** : `CLIENT`, `ADMIN`, `CUISINIER`, `LIVREUR`, `SUPER_ADMIN` (en majuscules)
- **Dates** : Format ISO (ex: `2024-01-01T12:00:00.000Z`)

### Gestion des Erreurs

Toutes les erreurs API sont gérées avec :
- Messages d'erreur affichés à l'utilisateur
- Logs dans la console pour le debugging
- Gestion des erreurs réseau
- Gestion des erreurs d'authentification

### États de Chargement

Les composants gèrent les états :
- `loading` - Chargement en cours
- `error` - Erreur survenue
- `data` - Données chargées

## 🚀 Prochaines Étapes

1. **Backend** : Implémenter les controllers backend (voir `fnd-backend/GUIDE_IMPLEMENTATION.md`)

2. **WebSocket** : Intégrer Socket.IO pour le chat temps réel

3. **Tests** : Tester tous les endpoints avec le backend

4. **Optimisations** :
   - Cache des données fréquemment utilisées
   - Optimistic updates pour une meilleure UX
   - Retry logic pour les requêtes échouées

5. **Sécurité** :
   - Validation côté client
   - Sanitization des inputs
   - Protection CSRF (si nécessaire)

## 📝 Checklist

- [x] Configuration API créée
- [x] Client API avec axios implémenté
- [x] AuthContext mis à jour
- [x] CartContext mis à jour
- [x] Pages mises à jour (Cart, Orders, Favorites, Profile)
- [x] Composants mis à jour (FavoriteButton, LoyaltyDisplay)
- [ ] Tests d'intégration
- [ ] Documentation Postman
- [ ] WebSocket intégré

## 🔗 Liens Utiles

- Backend API : `http://localhost:5000/api`
- Documentation Backend : `fnd-backend/README.md`
- Guide d'implémentation : `fnd-backend/GUIDE_IMPLEMENTATION.md`

