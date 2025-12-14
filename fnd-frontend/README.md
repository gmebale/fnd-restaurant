# F&D Fast & Delicious — Frontend React

Une plateforme complète de commande de fast-food en ligne, moderne et réactive, construite avec **React.js**, **Tailwind CSS**, **Framer Motion** et **Lucide React**.

## 🎯 Caractéristiques principales

### Pour les clients
- ✅ Navigation fluide et menu filtrable par catégories
- ✅ Panier persistant (localStorage)
- ✅ Gestion des favoris
- ✅ Historique des commandes avec suivi en temps réel
- ✅ Points de fidélité et codes promotionnels
- ✅ Chat en direct avec le restaurant
- ✅ Avis et évaluations après livraison
- ✅ Profil utilisateur avec édition

### Pour les administrateurs
- ✅ Dashboard avec statistiques clés
- ✅ Gestion complète des commandes (statuts, filtres, raccourcis clavier)
- ✅ Module Cuisine: suivi des commandes à préparer
- ✅ Module Livraison: gestion des commandes prêtes
- ✅ CRUD produits (créer, modifier, supprimer, marquer populaire/indisponible)
- ✅ Avis clients et statistiques d'évaluation
- ✅ Notifications de nouvelles commandes (son + navigateur)

## 🚀 Installation et démarrage

### Prérequis
- **Node.js** 16+ et **npm** 8+
- Git

### Étapes d'installation

```powershell
# Cloner/naviguez vers le dossier du projet
cd 'c:\Users\asus\Desktop\F&D Restaurant\fnd-frontend'

# Installer les dépendances
npm install

# Démarrer le serveur de développement
npm start
```

Le site sera disponible à **http://localhost:3000** après `npm start` (ou le port indiqué par CRA).

### Build pour la production

```powershell
npm run build
```

## 📁 Structure du projet

```
src/
├── App.jsx                          # Router et Setup des providers
├── main.jsx                          # Entry point React
├── index.css                         # Styles globaux + Tailwind
├── components/
│   ├── Layout.jsx                   # Wrapper principal
│   ├── Header.jsx                   # Header fixe + admin nav
│   ├── Footer.jsx                   # Footer
│   ├── AdminNav.jsx                 # Sidebar admin
│   ├── MenuCard.jsx                 # Carte produit
│   ├── CartItem.jsx                 # Ligne panier
│   ├── CategoryFilter.jsx           # Filtre par catégorie
│   ├── FavoriteButton.jsx           # Bouton cœur
│   ├── OrderChat.jsx                # Chat client-restaurant
│   ├── OrderTracker.jsx             # Barre de progression commande
│   ├── ReviewModal.jsx              # Modal d'avis
│   ├── LoyaltyDisplay.jsx           # Affichage points fidélité
│   ├── OrderNotifications.jsx       # Notifications admin
│   └── PageTransition.jsx           # Animations page
├── contexts/
│   ├── AuthContext.jsx              # Gestion utilisateur (démo)
│   └── CartContext.jsx              # Gestion panier (localStorage)
├── lib/
│   └── api.js                       # API mock (en-mémoire)
└── pages/
    ├── Home.jsx                     # Page d'accueil
    ├── Menu.jsx                     # Page menu
    ├── Cart.jsx                     # Page panier + checkout
    ├── Orders.jsx                   # Historique commandes client
    ├── Favorites.jsx                # Produits favoris
    ├── Profile.jsx                  # Profil utilisateur
    └── admin/
        ├── AdminDashboard.jsx       # Tableau de bord admin
        ├── AdminOrders.jsx          # Gestion commandes
        ├── AdminProducts.jsx        # CRUD produits
        ├── AdminKitchen.jsx         # Commandes à préparer
        ├── AdminDelivery.jsx        # Commandes à livrer
        └── AdminReviews.jsx         # Avis clients
```

## 🎨 Design System

### Couleurs
- **Primaire**: `#fc0000` (Rouge vif)
- **Accent**: `#FFB703` (Jaune or)
- **Fond**: `#FFF8E7` (Crème)
- **Admin**: `#111827` (Gris foncé)

### Typographie
- **Titres**: Poppins (bold, extrabold)
- **Corps**: Inter (regular, semibold)

### Composants
- Arrondi: `rounded-lg`, `rounded-xl`
- Ombres: `shadow-md`, `shadow-lg`, `shadow-xl`
- Espacements: Tailwind defaults + espacements cohérents

## 🔐 Authentification & Autorisations

### Client (démo)
- Utilisateur par défaut: "Client Démo" (`role: 'client'`)
- Accès: Home, Menu, Cart, Orders, Favorites, Profile

### Admin (démo)
- Basculez vers admin avec le bouton User en haut à droite
- Accès: Dashboard admin, Orders, Kitchen, Delivery, Products, Reviews
- Redirection automatique si accès non autorisé

**Note**: Actuellement, l'authentification est un stub. Intégrez avec une API réelle (JWT, OAuth, etc.) en remplaçant `src/contexts/AuthContext.jsx`.

## 🔗 API Mock

L'application utilise une API en-mémoire dans `src/lib/api.js`. Pour intégrer avec un backend réel:

1. Remplacez les fonctions dans `src/lib/api.js` par des appels axios/fetch:

```javascript
export async function fetchProducts({ category } = {}) {
  const response = await fetch(`/api/products?category=${category}`)
  return response.json()
}
```

2. Pointez vers votre backend:
   - Créez un fichier `.env.local` avec `REACT_APP_API_BASE_URL=http://your-backend.com`
   - Mettez à jour les appels API pour utiliser cette variable

3. Exemple intégration avec axios (Create React App):

```javascript
import axios from 'axios'

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api'
})

export async function fetchProducts({ category } = {}) {
  const { data } = await api.get('/products', { params: { category } })
  return data
}
```

## ⌨️ Raccourcis clavier

**Admin Orders (Gestion Commandes)**:
- `1` - Filtrer: Pending
- `2` - Filtrer: Preparing
- `3` - Filtrer: Ready
- `4` - Filtrer: Delivering
- `5` - Filtrer: Delivered
- `6` - Filtrer: Cancelled

## 🎯 Pages & Flux utilisateur

### Flux Client
1. **Home**: Accueil avec hero et produits populaires
2. **Menu**: Parcourir le menu, filtrer par catégorie
3. **Cart**: Ajouter articles, saisir adresse/téléphone, commander
4. **Orders**: Voir l'historique, tracker en temps réel, chat, avis
5. **Favorites**: Accéder rapidement aux produits favoris
6. **Profile**: Gérer infos personnelles, fidélité

### Flux Admin
1. **Dashboard**: Vue d'ensemble statistiques, accès rapide
2. **Orders**: Gérer toutes les commandes, changer statuts
3. **Kitchen**: Commandes à préparer, marquer prête
4. **Delivery**: Commandes prêtes à livrer, tracker
5. **Products**: CRUD complet (créer, modifier, supprimer)
6. **Reviews**: Consultation avis clients, moyenne d'évaluation

## 🔔 Notifications

- **Clients**: Notifications push pour mise à jour statut commande
- **Admin**: Son + notification navigateur pour nouvelles commandes

## 📱 Responsivité

- ✅ Mobile-first design
- ✅ Grilles flexibles (1 col mobile, 2-3 cols desktop)
- ✅ Menu mobile déroulant
- ✅ Admin nav caché sur mobile

## 🛠️ Technologies

- **React** 18.2
- **React Router DOM** 6.14
- **Tailwind CSS** 4
- **Framer Motion** 10 (animations)
- **Lucide React** (icônes)
- **TanStack React Query** 5 (gestion async, optionnel)
- **Axios** (HTTP client, pour API réelle)

## 🚀 Déploiement

### Vercel (recommandé)

```bash
npm install -g vercel
vercel
```

### Netlify

```bash
npm install -g netlify-cli
netlify deploy
```

### Serveur personnel

```bash
npm run build
# Servir le dossier 'dist' statiquement
```

## 📝 Notes de développement

### Données persistantes
- **Panier**: localStorage (`fnd_cart`)
- **Commandes/Produits/Avis**: En-mémoire (réinitialisé au refresh)

Pour la production, connectez une vraie base de données (MongoDB, PostgreSQL, etc.).

### États de charge
Utilisez `setLoading(true)` → appel API → `setLoading(false)` ou intégrez @tanstack/react-query pour une gestion avancée.

### Formulaires
Les formulaires utilisent des inputs/textareas vanilla + useState. Pour formulaires complexes, envisagez React Hook Form ou Formik.

## 🐛 Dépannage

**Le app ne démarre pas**:
```bash
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install
npm start
```

**Images non affichées**:
- Assurez-vous que les paths d'images (`/images/burger.jpg`, etc.) existent dans `public/`.
- Utilisez des URLs externes ou placeholder services.

**Admin nav ne s'affiche pas**:
- Cliquez sur le bouton User dans le header pour basculer vers admin.
- Vérifiez que `user.role === 'admin'` dans `AuthContext`.

## 📞 Support

Pour toute question, consultez la documentation React, Tailwind CSS ou Framer Motion.

---

**F&D Fast & Delicious © 2025** — Rabat, Agdal
