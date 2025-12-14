# Guide de Déploiement - F&D Fast & Delicious Restaurant

Ce guide complet couvre toutes les étapes nécessaires avant le déploiement de votre application sur GitHub et les plateformes d'hébergement. Il inclut la préparation du projet, la configuration, les tests et les meilleures pratiques.

## 📋 Vue d'ensemble du Projet

**F&D Fast & Delicious** est une plateforme complète de commande de fast-food en ligne composée de :

- **Frontend** : Application React moderne avec interface utilisateur réactive
- **Backend** : API REST Node.js/Express avec base de données MySQL
- **Base de données** : Hébergée sur Hostinger (MySQL)

### Technologies utilisées
- **Frontend** : React 18, Tailwind CSS, Framer Motion
- **Backend** : Node.js, Express, Prisma ORM, MySQL
- **Authentification** : JWT avec support OAuth2
- **Temps réel** : Socket.io pour chat et notifications
- **Déploiement** : Netlify (gratuit)

## 🚀 Préparation avant Déploiement

### 1. Vérification de la Structure du Projet

Assurez-vous que votre projet suit cette structure :

```
FND Restaurant/
├── fnd-frontend/          # Application React
│   ├── public/
│   ├── src/
│   ├── package.json
│   └── README.md
├── fnd-backend/           # API Node.js
│   ├── prisma/
│   ├── src/
│   ├── package.json
│   └── README.md
├── DEPLOYMENT_GUIDE.md    # Ce fichier
└── README.md             # README principal du projet
```

### 2. Nettoyage et Optimisation

#### Frontend
```bash
cd fnd-frontend

# Supprimer les dépendances inutiles
npm audit fix

# Construire pour la production
npm run build

# Vérifier la taille du build
du -sh build/
```

#### Backend
```bash
cd fnd-backend

# Supprimer les dépendances inutiles
npm audit fix

# Générer le client Prisma optimisé
npm run prisma:generate

# Tester les migrations
npm run prisma:migrate
```

### 3. Configuration des Variables d'Environnement

#### Backend (.env)
```env
# Base de données (Hostinger)
DATABASE_URL="mysql://username:password@hostinger-host:3306/database_name"

# JWT
JWT_SECRET="your-super-secret-jwt-key"
JWT_REFRESH_SECRET="your-refresh-secret-key"

# OAuth (optionnel)
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Email (optionnel)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT=587
EMAIL_USER="your-email@gmail.com"
EMAIL_PASS="your-app-password"

# Upload
UPLOAD_PATH="./uploads"
MAX_FILE_SIZE=5242880

# Logs
LOG_LEVEL="info"

# CORS
FRONTEND_URL="https://your-netlify-site.netlify.app"
```

#### Frontend (.env.local)
```env
REACT_APP_API_BASE_URL="https://your-netlify-functions-url.netlify.app/.netlify/functions"
REACT_APP_GOOGLE_CLIENT_ID="your-google-client-id"
```

### 4. Tests et Validation

#### Tests Backend
```bash
cd fnd-backend

# Tests unitaires
npm test

# Tests d'intégration (si disponibles)
npm run test:integration

# Vérifier les logs
tail -f logs/combined.log
```

#### Tests Frontend
```bash
cd fnd-frontend

# Linting
npm run lint

# Tests unitaires
npm test

# Build de production
npm run build
```

### 5. Sécurité et Conformité

#### Audit de Sécurité
```bash
# Audit des dépendances
cd fnd-backend && npm audit
cd ../fnd-frontend && npm audit

# Vérifier les secrets exposés
grep -r "password\|secret\|key" . --exclude-dir=node_modules
```

#### Checklist Sécurité
- [ ] Pas de clés API en dur dans le code
- [ ] Variables d'environnement configurées
- [ ] CORS configuré correctement
- [ ] Rate limiting activé
- [ ] Validation des entrées utilisateur
- [ ] Hashage des mots de passe (bcrypt)
- [ ] JWT tokens avec expiration

### 6. Optimisation des Performances

#### Frontend
- [ ] Images optimisées (WebP, lazy loading)
- [ ] Code splitting activé
- [ ] Bundle analysé (`npm install -g webpack-bundle-analyzer`)
- [ ] Service worker pour le cache (PWA)

#### Backend
- [ ] Compression Gzip activée
- [ ] Cache Redis (si disponible)
- [ ] Optimisation des requêtes Prisma
- [ ] Logs structurés

### 7. Documentation

#### Mise à jour des READMEs
- [ ] README principal du projet
- [ ] README backend avec endpoints API
- [ ] README frontend avec guide d'utilisation
- [ ] Documentation des variables d'environnement

#### Génération de Documentation API
```bash
cd fnd-backend

# Installer swagger (si pas déjà fait)
npm install swagger-jsdoc swagger-ui-express

# Générer la documentation
npm run docs:generate
```

## 📦 Préparation du Repository GitHub

### 1. Initialisation Git (si pas déjà fait)
```bash
# Initialiser le repository
git init

# Ajouter le remote GitHub
git remote add origin https://github.com/gmebale/fnd-restaurant.git

# Créer le fichier .gitignore
echo "node_modules/
.env
.env.local
logs/
uploads/
*.log
.DS_Store
build/
dist/" > .gitignore
```

### 2. Structure des Commits
```bash
# Ajouter tous les fichiers
git add .

# Commit initial
git commit -m "Initial commit: F&D Restaurant application

- Frontend React avec interface moderne
- Backend Node.js/Express avec Prisma
- Base de données MySQL sur Hostinger
- Authentification JWT
- Chat temps réel
- Dashboard admin complet"

# Push vers GitHub
git push -u origin main
```

### 3. Branches et Workflow
```
main          # Branche de production
develop       # Branche de développement
feature/*     # Nouvelles fonctionnalités
hotfix/*      # Corrections urgentes
```

### 4. GitHub Actions (CI/CD)
Créer `.github/workflows/deploy.yml` :

```yaml
name: Deploy to Netlify

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    - name: Install dependencies
      run: npm install
    - name: Run tests
      run: npm test

  deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v3
    - name: Deploy to Netlify
      uses: nwtgck/actions-netlify@v2.0
      with:
        publish-dir: './build'
        production-branch: main
        github-token: ${{ secrets.GITHUB_TOKEN }}
        deploy-message: "Deploy from GitHub Actions"
        enable-pull-request-comment: true
        enable-commit-comment: true
        overwrites-pull-request-comment: true
      env:
        NETLIFY_AUTH_TOKEN: ${{ secrets.NETLIFY_AUTH_TOKEN }}
        NETLIFY_SITE_ID: ${{ secrets.NETLIFY_SITE_ID }}
```

## 🔧 Configuration Post-Déploiement

### 1. Monitoring
- [ ] Logs Netlify activés
- [ ] Alertes configurées
- [ ] Monitoring des performances

### 2. Backup
- [ ] Sauvegarde automatique de la base Hostinger
- [ ] Backup des fichiers uploadés

### 3. Maintenance
- [ ] Mise à jour régulière des dépendances
- [ ] Surveillance des vulnérabilités
- [ ] Tests de performance périodiques

## 🚨 Dépannage Courant

### Erreurs de Build
```bash
# Nettoyer le cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Problèmes de Base de Données
- Vérifier la connectivité Hostinger
- Valider les credentials dans .env
- Tester les migrations Prisma

### Erreurs CORS
- Vérifier FRONTEND_URL dans .env backend
- S'assurer que les headers CORS sont configurés

## 📞 Support et Maintenance

### Contacts
- **Développeur** : Votre nom
- **Email** : votre-email@example.com
- **Documentation** : [Lien vers la doc complète]

### Mises à jour
- Garder les dépendances à jour
- Surveiller les nouvelles versions de Netlify
- Tester régulièrement les fonctionnalités

---

**Dernière mise à jour** : Décembre 2024
**Version** : 1.0.0
