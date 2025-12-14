# Guide d'Implémentation - Backend Fast & Delicious

## 📋 État Actuel

La structure complète du backend a été créée avec :
- ✅ Configuration de base (Express, Prisma, MySQL)
- ✅ Schéma de base de données complet
- ✅ Routes définies pour tous les endpoints
- ✅ Middleware d'authentification et autorisation
- ✅ Système de permissions par rôle
- ✅ WebSocket pour le chat temps réel
- ✅ Structure des controllers (stubs)

## 🚀 Prochaines Étapes

### Phase 1 : Configuration Initiale

1. **Installer les dépendances**
```bash
cd fnd-backend
npm install
```

2. **Configurer le fichier .env**
```bash
cp .env.example .env
# Éditer .env avec vos configurations MySQL (XAMPP)
```

3. **Créer la base de données**
- Démarrer XAMPP
- Ouvrir phpMyAdmin (http://localhost/phpmyadmin)
- Créer une base de données nommée `fnd_restaurant`

4. **Générer Prisma Client**
```bash
npm run prisma:generate
```

5. **Exécuter les migrations**
```bash
npm run prisma:migrate
# Nom de la migration : init
```

### Phase 2 : Implémentation des Controllers

Les controllers suivants doivent être implémentés (fichiers stub créés) :

#### 1. **auth.controller.js** (Priorité HAUTE)
- [ ] `register` - Inscription avec hashage bcrypt
- [ ] `login` - Connexion avec génération JWT
- [ ] `refreshToken` - Rafraîchir le token
- [ ] `googleAuth` / `googleCallback` - OAuth Google
- [ ] `appleAuth` - OAuth Apple
- [ ] `changePassword` - Changer mot de passe
- [ ] `forgotPassword` / `resetPassword` - Réinitialisation

#### 2. **product.controller.js** (Priorité HAUTE)
- [ ] `getAllProducts` - Liste avec filtres (catégorie, disponible)
- [ ] `getProductById` - Détails d'un produit
- [ ] `getPopularProducts` - Produits populaires
- [ ] `getCategories` - Liste des catégories
- [ ] `createProduct` - Créer produit (admin)
- [ ] `updateProduct` - Modifier produit (admin)
- [ ] `deleteProduct` - Supprimer produit (admin)
- [ ] `uploadImage` - Upload image produit

#### 3. **order.controller.js** (Priorité HAUTE)
- [ ] `createOrder` - Créer commande depuis panier
- [ ] `getOrders` - Liste commandes (filtrée par user)
- [ ] `getOrderById` - Détails commande
- [ ] `updateOrderStatus` - Changer statut
- [ ] `cancelOrder` - Annuler commande
- [ ] `getPendingOrders` - Commandes en attente (cuisine)
- [ ] `getReadyOrders` - Commandes prêtes (livraison)
- [ ] `getOrderStats` - Statistiques commandes

#### 4. **cart.controller.js** (Priorité HAUTE)
- [ ] `getCart` - Récupérer panier utilisateur
- [ ] `addItem` - Ajouter article au panier
- [ ] `updateItem` - Modifier quantité
- [ ] `removeItem` - Supprimer article
- [ ] `clearCart` - Vider panier
- [ ] `validateCart` - Valider panier avant commande

#### 5. **favorite.controller.js** (Priorité MOYENNE)
- [ ] `getFavorites` - Liste favoris utilisateur
- [ ] `addFavorite` - Ajouter aux favoris
- [ ] `removeFavorite` - Retirer des favoris

#### 6. **review.controller.js** (Priorité MOYENNE)
- [ ] `createReview` - Créer avis
- [ ] `getReviews` - Liste avis (avec filtres)
- [ ] `getProductReviews` - Avis d'un produit
- [ ] `updateReview` - Modifier avis
- [ ] `deleteReview` - Supprimer avis
- [ ] `getReviewStats` - Statistiques avis
- [ ] `respondToReview` - Réponse admin

#### 7. **loyalty.controller.js** (Priorité MOYENNE)
- [ ] `getPoints` - Points utilisateur
- [ ] `getHistory` - Historique transactions
- [ ] `redeemPoints` - Échanger points
- [ ] `getRules` - Règles du programme

#### 8. **promo.controller.js** (Priorité MOYENNE)
- [ ] `createPromoCode` - Créer code promo (admin)
- [ ] `getPromoCodes` - Liste codes promo
- [ ] `validatePromoCode` - Valider code promo
- [ ] `updatePromoCode` - Modifier code promo
- [ ] `deletePromoCode` - Supprimer code promo

#### 9. **chat.controller.js** (Priorité MOYENNE)
- [ ] `getOrderMessages` - Messages d'une commande
- [ ] `sendMessage` - Envoyer message
- [ ] `getUnreadMessages` - Messages non lus
- [ ] `markAsRead` - Marquer comme lu

#### 10. **notification.controller.js** (Priorité MOYENNE)
- [ ] `getNotifications` - Liste notifications
- [ ] `markAsRead` - Marquer comme lue
- [ ] `markAllAsRead` - Tout marquer comme lu
- [ ] `deleteNotification` - Supprimer notification

#### 11. **admin.controller.js** (Priorité BASSE)
- [ ] `getDashboardStats` - Stats dashboard
- [ ] `getSalesStats` - Stats ventes
- [ ] `getProductStats` - Stats produits
- [ ] `getOrderStats` - Stats commandes
- [ ] `getUserStats` - Stats utilisateurs
- [ ] `getSalesReport` - Rapport ventes (PDF/CSV)
- [ ] `getProductReport` - Rapport produits (PDF/CSV)

#### 12. **upload.controller.js** (Priorité BASSE)
- [ ] `uploadImage` - Upload image unique
- [ ] `uploadImages` - Upload multiples images
- [ ] `deleteFile` - Supprimer fichier

### Phase 3 : Services à Créer

#### 1. **email.service.js**
```javascript
// Service d'envoi d'emails avec nodemailer
- sendConfirmationEmail(user)
- sendOrderConfirmation(order)
- sendPasswordResetEmail(user, token)
- sendPromoCodeEmail(user, promoCode)
```

#### 2. **sms.service.js** (Optionnel)
```javascript
// Service d'envoi de SMS (Twilio ou équivalent)
- sendOTP(phone, code)
- sendOrderNotification(phone, order)
```

#### 3. **loyalty.service.js**
```javascript
// Service de gestion des points de fidélité
- calculatePoints(orderTotal)
- redeemPoints(userId, points, type)
- addPoints(userId, points, description)
```

#### 4. **promo.service.js**
```javascript
// Service de validation des codes promo
- validatePromoCode(code, orderTotal)
- applyPromoCode(order, promoCode)
- incrementUsage(code)
```

#### 5. **notification.service.js**
```javascript
// Service de création de notifications
- createNotification(userId, type, title, message, link)
- notifyOrderStatusChange(order)
- notifyNewMessage(orderId, userId)
```

### Phase 4 : Tests

Créer des tests pour :
- [ ] Authentification (register, login, OAuth)
- [ ] CRUD Produits
- [ ] CRUD Commandes
- [ ] Gestion Panier
- [ ] Système de points
- [ ] Codes promo

### Phase 5 : Documentation

- [ ] Créer collection Postman complète
- [ ] Documenter tous les endpoints
- [ ] Ajouter exemples de requêtes/réponses
- [ ] Créer guide d'utilisation API

## 📝 Exemple d'Implémentation

### Exemple : auth.controller.js - register

```javascript
const register = async (req, res) => {
  try {
    const { email, password, name, phone } = req.body;

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Hasher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Créer l'utilisateur
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role: 'CLIENT',
        points: 0,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        points: true,
        createdAt: true,
      },
    });

    // Générer les tokens
    const accessToken = generateAccessToken({ userId: user.id });
    const refreshToken = generateRefreshToken({ userId: user.id });

    // Créer le panier pour l'utilisateur
    await prisma.cart.create({
      data: {
        userId: user.id,
      },
    });

    // Créer le compte de points de fidélité
    await prisma.loyaltyPoints.create({
      data: {
        userId: user.id,
        points: 0,
        totalEarned: 0,
        totalSpent: 0,
      },
    });

    res.status(201).json({
      user,
      accessToken,
      refreshToken,
    });
  } catch (error) {
    logger.error('Register error:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};
```

## 🔧 Commandes Utiles

```bash
# Développement
npm run dev

# Production
npm start

# Prisma
npm run prisma:generate    # Générer client
npm run prisma:migrate     # Migrations
npm run prisma:studio      # Interface graphique

# Tests
npm test
```

## 📚 Ressources

- [Prisma Documentation](https://www.prisma.io/docs)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)
- [JWT Best Practices](https://datatracker.ietf.org/doc/html/rfc8725)
- [Socket.IO Documentation](https://socket.io/docs/v4/)

## ⚠️ Notes Importantes

1. **Sécurité** : Toujours valider et sanitizer les inputs
2. **Erreurs** : Utiliser le middleware errorHandler pour toutes les erreurs
3. **Logs** : Logger toutes les actions importantes avec Winston
4. **Permissions** : Vérifier les permissions avant chaque action sensible
5. **Transactions** : Utiliser Prisma transactions pour les opérations complexes

## ✅ Checklist de Déploiement

- [ ] Variables d'environnement configurées
- [ ] Base de données créée et migrée
- [ ] Tests passent
- [ ] Documentation complète
- [ ] Logs configurés
- [ ] Sécurité vérifiée
- [ ] Performance optimisée
- [ ] Backup configuré

