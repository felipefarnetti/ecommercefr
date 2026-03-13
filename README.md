# Ma Boutique - E-commerce

Application e-commerce complète construite avec Next.js, React et MongoDB.

## Stack technique

| Technologie | Version | Rôle |
|---|---|---|
| **Next.js** | 16.1 | Framework React (App Router, Server Components, API Routes) |
| **React** | 19.2 | Interface utilisateur |
| **TypeScript** | 5.9 | Typage statique |
| **Tailwind CSS** | 4.2 | Styles utilitaires (config CSS-based v4) |
| **MongoDB Atlas** | — | Base de données NoSQL (cloud) |
| **Mongoose** | 8.14 | ODM pour MongoDB |

## Services externes

| Service | Utilisation |
|---|---|
| **Stripe** | Paiements en ligne (checkout, webhooks) |
| **Cloudinary** | Hébergement et optimisation des images produits |
| **Mailtrap** | Envoi d'emails transactionnels (vérification, reset mot de passe) |
| **Vercel** | Déploiement et hébergement en production |
| **Vercel Analytics** | Suivi des performances et visites |

## Fonctionnalités

### Boutique
- Catalogue de produits avec grille responsive
- Carrousel de produits en vedette (hero slider)
- Navigation par catégories
- Recherche de produits
- Fiches produits avec galerie d'images, avis et notes
- Panier d'achat
- Liste de souhaits (wishlist)
- Paiement Stripe (panier complet ou achat instantané)

### Utilisateurs
- Inscription / connexion (NextAuth v5 avec JWT)
- Vérification email
- Réinitialisation de mot de passe
- Profil utilisateur avec avatar
- Historique des commandes

### Administration
- Tableau de bord avec statistiques (Recharts)
- CRUD produits (création, modification, suppression)
- Gestion des produits en vedette
- Gestion des commandes (statut)
- Gestion des utilisateurs

## Architecture du projet

```
app/
├── (home_route)/          # Pages publiques (accueil, produit, panier, recherche...)
├── (guest_routes)/        # Pages non-authentifiées (inscription, connexion, reset)
├── (private_routes)/      # Pages authentifiées (profil, commandes, wishlist)
├── (admin)/               # Pages d'administration (produits, commandes, stats)
├── api/                   # Routes API
│   ├── auth/              # NextAuth
│   ├── checkout/          # Stripe checkout
│   ├── contact/           # Formulaire de contact
│   ├── order/             # Gestion des commandes
│   ├── product/           # Panier, avis, wishlist
│   ├── users/             # Inscription, login, vérification, mot de passe
│   └── webhook/           # Webhook Stripe
├── components/            # Composants React réutilisables
├── hooks/                 # Custom hooks (useAuth)
├── lib/                   # Utilitaires (DB, email, helpers)
├── models/                # Modèles Mongoose (Product, User, Order, Cart, etc.)
├── types/                 # Types TypeScript
└── ui/                    # Composants UI (icônes)
```

## Bibliothèques principales

| Package | Rôle |
|---|---|
| `next-auth` | Authentification (v5 beta, CredentialsProvider, JWT) |
| `stripe` / `@stripe/react-stripe-js` | Intégration paiements |
| `cloudinary` | SDK Cloudinary pour upload images |
| `mailtrap` / `nodemailer` | Envoi d'emails |
| `mongoose` | ODM MongoDB |
| `bcrypt` | Hashage des mots de passe |
| `formik` / `yup` | Formulaires et validation |
| `react-slick` | Carrousels d'images |
| `react-toastify` | Notifications toast |
| `recharts` | Graphiques du dashboard admin |
| `rc-slider` | Slider de prix pour filtres |
| `date-fns` / `dateformat` | Formatage des dates |
| `sharp` | Optimisation d'images côté serveur |
| `@heroicons/react` | Icônes |
| `@fortawesome/*` | Icônes Font Awesome |
| `truncate` | Troncature de texte |

## Installation

```bash
# Cloner le repo
git clone <url-du-repo>
cd next-ecom

# Installer les dépendances
npm install --legacy-peer-deps

# Configurer les variables d'environnement
cp .env.example .env.local
# Remplir les variables (voir section ci-dessous)

# Lancer en développement
npm run dev
```

## Variables d'environnement

Créer un fichier `.env.local` à la racine :

```env
# MongoDB
MONGODB_URI=mongodb+srv://...

# Stripe
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Cloudinary
CLOUD_NAME=...
CLOUD_API_KEY=...
CLOUD_API_SECRET=...

# Mailtrap
MAILTRAP_TOKEN=...
MAILTRAP_USERNAME=api
MAILTRAP_PASSWORD=...

# Email
PERSONAL_EMAIL=admin@example.com
PORT_EMAIL=587
HOST_EMAIL=live.smtp.mailtrap.io

# Auth
AUTH_SECRET=<secret-aleatoire>
NEXTAUTH_URL=http://localhost:3000

# URLs applicatives
SIGN_IN_URL=http://localhost:3000/auth/signin
API_SIGN_IN_ENDPOINT=http://localhost:3000/api/users/signin
PAYMENT_SUCCESS_URL=http://localhost:3000/profile/orders
PAYMENT_CANCEL_URL=http://localhost:3000/profile/orders
VERIFICATION_URL=http://localhost:3000/verify
PASSWORD_RESET_URL=http://localhost:3000/auth/reset-password
```

> Pour la production (Vercel), remplacer `http://localhost:3000` par l'URL de déploiement.

## Scripts

```bash
npm run dev      # Serveur de développement (Turbopack)
npm run build    # Build de production
npm run start    # Serveur de production
npm run lint     # Vérification ESLint
```

## Déploiement

Le projet est déployé sur **Vercel**. Configurer les variables d'environnement dans le dashboard Vercel avec les URLs de production.
