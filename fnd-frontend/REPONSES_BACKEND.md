# Réponses au Questionnaire Backend - Fast & Delicious

## 📋 RÉSUMÉ DES RÉPONSES

### 1. Stack Technologique
- **Choix** : Node.js/Express (JavaScript)
- **Raison** : Par expérience

### 2. Base de Données
- **Type** : MySQL
- **ORM** : Prisma
- **Hébergement** : XAMPP (local pour le moment)

### 3. Hébergement
- **Environnement** : Local (XAMPP)
- **Base de données** : MySQL via XAMPP

### 4. Authentification
- **Méthode** : JWT + OAuth2 (Google, Apple/iCloud)
- **Réseaux sociaux** : Google, Apple

### 5. Rôles Utilisateurs
- Client
- Admin
- Cuisinier
- Livreur
- Super Admin
- **Permissions** : À définir (voir section dédiée)

### 6. Validation
- **Niveau** : Client + Serveur
- **Rate Limiting** : Pas nécessaire pour le moment

### 7. Paiement
- **Méthode** : Paiement à la livraison (cash) pour début

### 8. Gestion des Stocks
- **Type** : Simple (disponible/indisponible)
- **Notification** : Non spécifié

### 9. Codes Promo
- **Types** : Tous (%, montant fixe, livraison gratuite, produit offert)
- **Règles** : 
  - Montant minimum de commande
  - Validité dans le temps

### 10. Programme de Fidélité
- **Calcul** : X points par Y DH dépensés (ex: 1 point / 10 DH)
- **Utilisation** : 
  - Réduction sur commande (X points = Y DH)
  - Produits gratuits
  - Livraison gratuite
- **Expiration** : Non, points permanents

### 11. Horaires
- **Gestion** : Non (toujours ouvert 20h-05h)

### 12. Zones de Livraison
- **Méthode** : Sélection manuelle par le client
- **Frais** : Coût fixe (non gratuit)

### 13. Notifications
- **Type** : In-app uniquement
- **Événements** :
  - Nouvelle commande (admin)
  - Changement de statut (client)
  - Message reçu (chat)
  - Code promo disponible

### 14. Chat & Support
- **Temps réel** : Oui, avec WebSocket
- **Participants** : Tous les rôles peuvent communiquer (selon spécification du chat)
- **Tickets** : Oui, pour problèmes complexes

### 15. Statistiques
- **Essentielles** : Toutes (CA, commandes, produits vendus, heures de pointe, taux conversion)
- **Export** : PDF et Excel/CSV

### 16. Multi-Restaurants
- **Nombre** : Un seul restaurant

### 17. Upload Images
- **Stockage** : Serveur local

### 18. Intégrations Externes
- **À définir** : Voir section dédiée avec exemples

### 19. Documentation API
- **Format** : Postman Collection
- **Accès** : Privée (authentification requise)

### 20. Environnements
- **Environnements** : Développement (local) puis Production
- **CI/CD** : Non spécifié

---

## 🔐 PERMISSIONS PAR RÔLE - PROPOSITIONS

### **CLIENT**
```javascript
permissions: {
  // Produits
  'products:read': true,
  'products:view-details': true,
  
  // Panier
  'cart:create': true,
  'cart:read': true,
  'cart:update': true,
  'cart:delete': true,
  
  // Commandes
  'orders:create': true,
  'orders:read-own': true,
  'orders:cancel-own': true,
  'orders:track-own': true,
  
  // Favoris
  'favorites:create': true,
  'favorites:read': true,
  'favorites:delete': true,
  
  // Avis
  'reviews:create': true,
  'reviews:read': true,
  'reviews:update-own': true,
  'reviews:delete-own': true,
  
  // Profil
  'profile:read': true,
  'profile:update': true,
  
  // Chat
  'chat:send': true,
  'chat:read-own': true,
  
  // Points
  'loyalty:read': true,
  'loyalty:redeem': true,
  
  // Notifications
  'notifications:read': true,
  'notifications:mark-read': true,
}
```

### **CUISINIER**
```javascript
permissions: {
  // Hérite des permissions CLIENT
  ...clientPermissions,
  
  // Commandes
  'orders:read-all': true,
  'orders:update-status': true, // pending → preparing → ready
  'orders:view-kitchen': true,
  
  // Produits
  'products:read': true,
  'products:update-availability': true, // disponible/indisponible
  
  // Chat
  'chat:read-order': true, // pour les commandes en préparation
  'chat:send-order': true,
  
  // Notifications
  'notifications:read': true,
}
```

### **LIVREUR**
```javascript
permissions: {
  // Hérite des permissions CLIENT
  ...clientPermissions,
  
  // Commandes
  'orders:read-ready': true, // uniquement commandes prêtes
  'orders:update-status': true, // ready → delivering → delivered
  'orders:view-delivery': true,
  'orders:update-location': true, // position GPS
  
  // Chat
  'chat:read-order': true, // pour les commandes en livraison
  'chat:send-order': true,
  
  // Notifications
  'notifications:read': true,
}
```

### **ADMIN**
```javascript
permissions: {
  // Hérite des permissions CUISINIER + LIVREUR
  ...cuisinierPermissions,
  ...livreurPermissions,
  
  // Produits
  'products:create': true,
  'products:update': true,
  'products:delete': true,
  
  // Commandes
  'orders:read-all': true,
  'orders:update-all': true,
  'orders:cancel-any': true,
  'orders:view-stats': true,
  
  // Codes Promo
  'promos:create': true,
  'promos:read': true,
  'promos:update': true,
  'promos:delete': true,
  
  // Avis
  'reviews:read-all': true,
  'reviews:delete-any': true,
  'reviews:respond': true, // réponse admin
  
  // Utilisateurs
  'users:read': true,
  'users:update': true,
  
  // Statistiques
  'stats:dashboard': true,
  'stats:reports': true,
  'stats:export': true,
  
  // Chat
  'chat:read-all': true,
  'chat:send-any': true,
  
  // Tickets Support
  'tickets:read': true,
  'tickets:update': true,
  'tickets:close': true,
}
```

### **SUPER ADMIN**
```javascript
permissions: {
  // Hérite de TOUTES les permissions ADMIN
  ...adminPermissions,
  
  // Gestion Utilisateurs
  'users:create': true,
  'users:delete': true,
  'users:assign-role': true,
  'users:manage-permissions': true,
  
  // Configuration Système
  'system:settings': true,
  'system:backup': true,
  'system:logs': true,
  
  // Gestion Rôles
  'roles:create': true,
  'roles:update': true,
  'roles:delete': true,
  
  // Accès Complet
  '*': true, // toutes les permissions
}
```

---

## 🔌 INTÉGRATIONS EXTERNES - PROPOSITIONS

### 1. **Google Maps API** 🗺️
**Utilité dans l'app :**
- Validation des adresses de livraison
- Calcul automatique de la distance
- Affichage de la position du livreur en temps réel
- Géocodage (adresse → coordonnées GPS)
- Suggestions d'adresses lors de la saisie

**Endpoints nécessaires :**
```
POST /api/maps/validate-address
POST /api/maps/geocode
GET  /api/maps/distance
GET  /api/maps/directions
```

**Coût** : Gratuit jusqu'à 28,500 requêtes/mois, puis payant

---

### 2. **Service SMS (Twilio ou équivalent local)** 📱
**Utilité dans l'app :**
- Envoi de code de confirmation OTP
- Notification SMS pour changement de statut de commande
- Rappel de commande
- Alertes importantes (retard, annulation)

**Endpoints nécessaires :**
```
POST /api/sms/send-otp
POST /api/sms/send-notification
POST /api/sms/send-alert
```

**Coût** : Variable selon le fournisseur (Twilio ~0.05€/SMS)

---

### 3. **Service Email (SendGrid, Mailgun, ou SMTP)** 📧
**Utilité dans l'app :**
- Confirmation d'inscription
- Confirmation de commande (ticket)
- Récapitulatif de commande
- Codes promo personnalisés
- Rappels de commande
- Newsletter (futur)

**Endpoints nécessaires :**
```
POST /api/email/send-confirmation
POST /api/email/send-order-receipt
POST /api/email/send-promo
POST /api/email/send-newsletter
```

**Coût** : SendGrid gratuit jusqu'à 100 emails/jour, Mailgun similaire

---

### 4. **Service de Paiement (Stripe, PayPal - pour futur)** 💳
**Utilité dans l'app :**
- Paiement en ligne sécurisé
- Gestion des remboursements
- Historique des transactions
- Intégration carte bancaire

**Endpoints nécessaires :**
```
POST /api/payment/create-intent
POST /api/payment/confirm
POST /api/payment/refund
GET  /api/payment/history
```

**Coût** : Commission par transaction (~2.9% + 0.30€ pour Stripe)

---

### 5. **Service de Stockage Cloud (Cloudinary - optionnel)** ☁️
**Utilité dans l'app :**
- Backup des images produits
- Optimisation automatique des images
- CDN pour chargement rapide
- Transformation d'images (redimensionnement)

**Note** : Vous avez choisi stockage local, mais cette option peut être utile pour production

**Coût** : Gratuit jusqu'à 25GB, puis payant

---

### 6. **Service de Monitoring (Sentry - optionnel)** 📊
**Utilité dans l'app :**
- Détection automatique des erreurs
- Tracking des performances
- Alertes en cas de problème critique
- Rapports d'erreurs détaillés

**Coût** : Gratuit jusqu'à 5,000 événements/mois

---

### 7. **Service de Logs (Winston + fichier local)** 📝
**Utilité dans l'app :**
- Enregistrement de toutes les actions importantes
- Debugging facilité
- Audit trail (traçabilité)
- Analyse des performances

**Coût** : Gratuit (local)

---

## 📦 RECOMMANDATIONS D'INTÉGRATIONS POUR MVP

### **Essentielles (Phase 1)**
1. ✅ **Service Email** (SMTP local ou SendGrid) - Pour confirmations
2. ✅ **Google Maps API** - Pour validation adresses (optionnel au début)

### **Utiles (Phase 2)**
3. ✅ **Service SMS** - Pour notifications importantes
4. ✅ **Service de Monitoring** - Pour détection d'erreurs

### **Futures (Phase 3)**
5. ⏳ **Service de Paiement** - Quand paiement en ligne sera nécessaire
6. ⏳ **Cloudinary** - Si migration vers cloud nécessaire

---

## 🎯 PROCHAINES ÉTAPES

1. ✅ Génération de la structure du projet backend
2. ✅ Configuration Prisma avec MySQL
3. ✅ Mise en place de l'authentification JWT + OAuth2
4. ✅ Création des modèles de données
5. ✅ Développement des endpoints API
6. ✅ Intégration WebSocket pour chat
7. ✅ Documentation Postman

Souhaitez-vous que je génère maintenant la structure complète du backend ?

