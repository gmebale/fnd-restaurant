# Guide de Déploiement Rapide sur Vercel - F&D Restaurant

Ce guide vous accompagne étape par étape pour déployer votre application F&D Restaurant sur Vercel.

## 📋 Prérequis

- Compte Vercel (gratuit) : [vercel.com](https://vercel.com)
- Repository GitHub avec votre code
- Base de données MySQL (Hostinger ou autre)

## 🚀 Étape 1 : Préparation du Repository

### 1.1 Push vers GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 1.2 Variables d'environnement
Créez un fichier `.env.local` dans `fnd-frontend/` :
```env
REACT_APP_API_BASE_URL=https://your-backend-url.vercel.app/api
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
```

## 🔧 Étape 2 : Configuration Vercel

### 2.1 Connexion à Vercel
1. Allez sur [vercel.com](https://vercel.com)
2. Connectez-vous avec GitHub
3. Importez votre repository `fnd-restaurant`

### 2.2 Déploiement du Frontend

1. **Sélectionnez le projet frontend** :
   - Dans Vercel Dashboard, cliquez "New Project"
   - Importez `fnd-frontend/` depuis votre repo

2. **Configuration** :
   - **Framework Preset** : React
   - **Root Directory** : `fnd-frontend`
   - **Build Command** : `npm run build`
   - **Output Directory** : `build`

3. **Variables d'environnement** :
   ```
   REACT_APP_API_BASE_URL=https://your-backend-url.vercel.app/api
   REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id
   ```

4. **Déployez** : Cliquez "Deploy"

### 2.3 Déploiement du Backend

1. **Sélectionnez le projet backend** :
   - Dans Vercel Dashboard, cliquez "New Project"
   - Importez `fnd-backend/` depuis votre repo

2. **Configuration** :
   - **Framework Preset** : Other
   - **Root Directory** : `fnd-backend`
   - **Build Command** : `npm run build` (ou laissez vide)
   - **Output Directory** : `api`

3. **Variables d'environnement** (obligatoires) :
   ```
   DATABASE_URL=mysql://username:password@host:3306/database_name
   JWT_SECRET=your-super-secret-jwt-key
   JWT_REFRESH_SECRET=your-refresh-secret-key
   CORS_ORIGIN=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```

4. **Variables d'environnement** (optionnelles) :
   ```
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your-email@gmail.com
   EMAIL_PASS=your-app-password
   ```

5. **Déployez** : Cliquez "Deploy"

## 🔗 Étape 3 : Mise à jour des URLs

### 3.1 Récupérez les URLs
- **Frontend URL** : `https://fnd-frontend-[hash].vercel.app`
- **Backend URL** : `https://fnd-backend-[hash].vercel.app`

### 3.2 Mettez à jour les variables
Dans les paramètres Vercel du frontend :
- Mettez à jour `REACT_APP_API_BASE_URL` avec l'URL du backend

Dans les paramètres Vercel du backend :
- Mettez à jour `CORS_ORIGIN` avec l'URL du frontend

### 3.3 Redeployez
- Redeployez les deux projets après mise à jour des variables

## 🗄️ Étape 4 : Configuration Base de Données

### 4.1 Migration Prisma
```bash
# Localement, depuis fnd-backend/
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4.2 Variables de base de données
Assurez-vous que `DATABASE_URL` dans Vercel pointe vers votre base Hostinger :
```
DATABASE_URL=mysql://user:password@hostinger-host:3306/database_name
```

## 🧪 Étape 5 : Tests

### 5.1 Test du Backend
Visitez : `https://your-backend-url.vercel.app/api/health`

Devrait retourner :
```json
{
  "status": "OK",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### 5.2 Test du Frontend
Visitez : `https://your-frontend-url.vercel.app`

- La page d'accueil devrait se charger
- Essayez de vous inscrire/connexion
- Vérifiez la console pour les erreurs

### 5.3 Test des APIs
Testez quelques endpoints avec curl :
```bash
# Test des produits
curl https://your-backend-url.vercel.app/api/products

# Test de l'authentification
curl -X POST https://your-backend-url.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password"}'
```

## 🔧 Étape 6 : Dépannage

### Erreurs Courantes

#### Build Frontend échoue
- Vérifiez les logs Vercel
- Assurez-vous que toutes les dépendances sont dans `package.json`
- Vérifiez les variables d'environnement

#### Backend ne démarre pas
- Vérifiez `DATABASE_URL`
- Assurez-vous que Prisma est généré
- Vérifiez les logs pour les erreurs de connexion DB

#### CORS erreurs
- Vérifiez `CORS_ORIGIN` dans le backend
- Assurez-vous que l'URL du frontend est correcte

#### Base de données inaccessible
- Vérifiez les credentials Hostinger
- Assurez-vous que l'IP de Vercel est autorisée
- Testez la connexion localement

## 📝 Étape 7 : Domaines Personnalisés (Optionnel)

### 7.1 Frontend
1. Dans Vercel Dashboard > Settings > Domains
2. Ajoutez votre domaine personnalisé
3. Configurez les DNS selon les instructions

### 7.2 Mise à jour des URLs
- Mettez à jour `REACT_APP_API_BASE_URL` avec le nouveau domaine
- Mettez à jour `CORS_ORIGIN` avec le domaine frontend

## ✅ Checklist Final

- [ ] Repository poussé sur GitHub
- [ ] Frontend déployé sur Vercel
- [ ] Backend déployé sur Vercel
- [ ] Variables d'environnement configurées
- [ ] URLs mises à jour et redeployées
- [ ] Base de données accessible
- [ ] Tests passés
- [ ] Domaines personnalisés (si souhaité)

## 📞 Support

Si vous rencontrez des problèmes :
1. Vérifiez les logs Vercel
2. Testez localement d'abord
3. Consultez la documentation Vercel
4. Vérifiez les issues GitHub du projet

---

**Temps estimé** : 30-60 minutes
**Coût** : Gratuit (plans Vercel gratuits)
