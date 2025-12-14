# Guide Complet : Hébergement Gratuit sur Netlify

Ce guide vous explique étape par étape comment héberger votre application F&D Restaurant (frontend + backend) gratuitement sur Netlify, avec votre base de données sur Hostinger.

## 📋 Prérequis

- ✅ Compte GitHub avec votre repository
- ✅ Compte Netlify (gratuit)
- ✅ Base de données MySQL sur Hostinger configurée
- ✅ Application testée localement

## 🚀 Étape 1 : Préparation du Frontend

### 1.1 Configuration pour Netlify

Le frontend React peut être déployé directement sur Netlify. Assurez-vous que :

```bash
cd fnd-frontend

# Vérifier le build
npm run build

# Le dossier build/ doit être créé
ls -la build/
```

### 1.2 Configuration des Variables d'Environnement

Créez un fichier `fnd-frontend/.env.production` :

```env
# URL de votre API Netlify Functions
REACT_APP_API_BASE_URL=https://your-site-name.netlify.app/.netlify/functions

# Google OAuth (si utilisé)
REACT_APP_GOOGLE_CLIENT_ID=your-google-client-id

# Autres variables nécessaires
REACT_APP_APP_NAME="F&D Fast & Delicious"
```

## 🔧 Étape 2 : Conversion du Backend en Netlify Functions

Netlify ne supporte pas les applications Express traditionnelles, mais nous pouvons utiliser **Netlify Functions** (AWS Lambda) pour notre API.

### 2.1 Structure des Fonctions

Créez un dossier `netlify/functions/` dans votre repository principal :

```
FND Restaurant/
├── fnd-frontend/
├── fnd-backend/          # Garder pour développement local
├── netlify/
│   └── functions/
│       ├── api.js       # Point d'entrée principal
│       ├── products.js
│       ├── orders.js
│       ├── auth.js
│       └── utils.js
└── package.json         # Pour les fonctions
```

### 2.2 Création du package.json pour les fonctions

Créez `netlify/package.json` :

```json
{
  "name": "fnd-netlify-functions",
  "version": "1.0.0",
  "description": "Netlify Functions for F&D Restaurant API",
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "mysql2": "^3.6.5",
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "express-validator": "^7.0.1",
    "multer": "^1.4.5-lts.1",
    "socket.io": "^4.7.4",
    "winston": "^3.11.0"
  },
  "devDependencies": {
    "prisma": "^5.7.0"
  }
}
```

### 2.3 Exemple de Fonction Produits

Créez `netlify/functions/products.js` :

```javascript
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  try {
    const path = event.path.replace('/.netlify/functions/products', '');
    const method = event.httpMethod;

    if (method === 'GET' && path === '') {
      const products = await prisma.product.findMany({
        include: { reviews: true }
      });

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(products)
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ error: 'Route non trouvée' })
    };

  } catch (error) {
    console.error('Erreur:', error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Erreur serveur' })
    };
  } finally {
    await prisma.$disconnect();
  }
};
```

## 🌐 Étape 3 : Déploiement sur Netlify

### 3.1 Connexion GitHub

1. Allez sur [netlify.com](https://netlify.com) et connectez-vous
2. Cliquez sur "New site from Git"
3. Choisissez votre repository GitHub
4. Configurez le build :

**Pour le Frontend :**
- **Branch to deploy** : `main`
- **Build command** : `cd fnd-frontend && npm run build`
- **Publish directory** : `fnd-frontend/build`

**Pour les Fonctions :**
- **Functions directory** : `netlify/functions`

### 3.2 Variables d'Environnement

Dans les paramètres de votre site Netlify, ajoutez :

```
DATABASE_URL=mysql://username:password@host:port/database
JWT_SECRET=votre-cle-secrete-jwt
NODE_ENV=production
```

### 3.3 Déploiement Automatique

Netlify déploie automatiquement à chaque push sur `main`.

## 🔗 Étape 4 : Configuration Finale

### 4.1 Mise à Jour des URLs

Après déploiement :
1. Mettez à jour `REACT_APP_API_BASE_URL` avec l'URL de votre site Netlify
2. Autorisez l'IP de Netlify dans Hostinger

### 4.2 Test des Fonctions

```bash
curl https://your-site.netlify.app/.netlify/functions/products
```

## 📊 Étape 5 : Monitoring

- **Logs** : Dans Netlify dashboard > Functions > Logs
- **Builds** : Dans Deploys > Voir les logs

## 🚨 Dépannage Courant

### Fonctions ne se déploient pas
- Vérifiez que `netlify/functions/` existe
- Assurez-vous que `package.json` est dans `netlify/`

### Erreur DB
- Vérifiez `DATABASE_URL`
- Autorisez les connexions externes dans Hostinger

### CORS errors
- Vérifiez les headers dans vos fonctions

## 💡 Limitations Netlify Gratuit

- **Timeout** : 10 secondes par fonction
- **Mémoire** : 1024 MB max
- **Invocations** : 125k/mois gratuites

## 📞 Support

- **Documentation** : https://docs.netlify.com/
- **Forum** : https://answers.netlify.com/

---

**🎉 Félicitations !** Votre application est maintenant sur Netlify gratuitement.

**URLs :**
- Frontend : `https://your-site.netlify.app`
- API : `https://your-site.netlify.app/.netlify/functions/api`

**Coûts :** 0€/mois
