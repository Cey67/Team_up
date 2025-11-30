# Team Up ⚽

**Plateforme de Gestion de Matchs de Football Amateurs**

![React](https://img.shields.io/badge/React-19.2-blue)
![Vite](https://img.shields.io/badge/Vite-7.2-purple)
![React Router](https://img.shields.io/badge/React_Router-6.30-red)

Une application web moderne conçue pour simplifier l'organisation de matchs de football amateurs. Team Up permet aux joueurs de créer, gérer et participer à des matchs entre amis, collègues ou membres d'une même communauté, tout en suivant les statistiques et les présences.

## Vue d'ensemble

Team Up est une plateforme complète de gestion de matchs de football amateurs qui simplifie l'organisation des rencontres sportives. L'application permet de créer et gérer des matchs, d'organiser les équipes, de suivre les présences, de consulter les statistiques individuelles et collectives, et de communiquer via un système de messagerie intégré.

## Fonctionnalités principales

**Authentification sécurisée** : Inscription, connexion et gestion de profil utilisateur avec upload de photo

**Gestion des matchs** : Création, visualisation et gestion de matchs avec filtres multicritères (date, lieu, type, créateur)

**Gestion d'effectif** : Organisation des joueurs de l'équipe avec recherche, filtres et tri avancés

**Suivi des présences** : Gestion des présences aux matchs avec statistiques d'assiduité

**Statistiques détaillées** : Suivi des performances individuelles et collectives avec tableaux de bord

**Messagerie intégrée** : Communication entre les membres de l'équipe via un système de conversation

**Paramètres d'équipe** : Gestion des paramètres de l'équipe avec upload de logo

**Interface moderne** : Design responsive avec thème clair/sombre et navigation intuitive

## Architecture

Team Up est construit comme une application web moderne et évolutive :

### Stack technique

**Frontend :**

- React 19.2+ avec JavaScript
- Vite 7.2 pour le développement rapide et le build
- React Router DOM 6.30 pour le routage côté client
- CSS Modules pour le style scoped par composant

**Backend (développement) :**

- JSON Server pour simuler une API REST (phase de développement)
- Node.js pour le serveur de développement
- Backend Express + PostgreSQL (à implémenter)

**Infrastructure :**

- ESLint pour la qualité du code
- Vite pour le build et le développement
- JSON Server avec watch mode pour la persistance des données

## Structure du projet

```
Team_up/
├── src/
│   ├── assets/           # Images, icônes et ressources statiques
│   ├── components/       # Composants React réutilisables
│   │   ├── auth/         # Composants d'authentification
│   │   │   ├── AuthCardLogin.jsx
│   │   │   ├── AuthCardRegister.jsx
│   │   │   └── AuthPlayerImage.jsx
│   │   ├── dashboard/    # Composants du tableau de bord
│   │   │   ├── LastMatchCard.jsx
│   │   │   ├── NextMatchCard.jsx
│   │   │   └── TeamSummaryCard.jsx
│   │   ├── effectif/     # Composants de gestion d'effectif
│   │   │   ├── EffectifSearchBar.jsx
│   │   │   ├── FilterModal.jsx
│   │   │   ├── PlayersTable.jsx
│   │   │   ├── SortMenu.jsx
│   │   │   └── TeamHeader.jsx
│   │   ├── layout/       # Composants de layout
│   │   │   ├── Layout.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── SidebarContext.jsx
│   │   ├── match/        # Composants de gestion de matchs
│   │   │   ├── CreateMatchModal.jsx
│   │   │   ├── MatchCard.jsx
│   │   │   ├── MatchFilters.jsx
│   │   │   ├── MatchInfo.jsx
│   │   │   ├── MatchList.jsx
│   │   │   ├── MatchPlayers.jsx
│   │   │   └── TeamComposition.jsx
│   │   ├── messagerie/   # Composants de messagerie
│   │   │   ├── ChatWindow.jsx
│   │   │   ├── ConversationItem.jsx
│   │   │   ├── ConversationList.jsx
│   │   │   └── NewConversationModal.jsx
│   │   ├── parametres/   # Composants de paramètres
│   │   │   └── TeamLogoUpload.jsx
│   │   ├── presences/    # Composants de gestion des présences
│   │   │   ├── AttendanceList.jsx
│   │   │   ├── AttendanceStats.jsx
│   │   │   └── MatchCard.jsx
│   │   ├── profil/       # Composants de profil
│   │   │   ├── AvatarUpload.jsx
│   │   │   └── ThemeToggle.jsx
│   │   └── statistiques/ # Composants de statistiques
│   │       └── PlayerStatsCard.jsx
│   ├── pages/            # Pages de l'application
│   │   ├── auth/         # Pages d'authentification
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── dashboard/    # Page d'accueil / tableau de bord
│   │   ├── effectif/     # Page de gestion d'effectif
│   │   ├── HomePage/     # Page d'accueil publique
│   │   ├── match/        # Pages de gestion de matchs
│   │   │   ├── MatchesPage.jsx
│   │   │   └── MatchDetailPage.jsx
│   │   ├── messagerie/   # Page de messagerie
│   │   ├── parametres/   # Page de paramètres
│   │   ├── presences/    # Page de gestion des présences
│   │   ├── profil/       # Page de profil utilisateur
│   │   └── statistiques/ # Page de statistiques
│   ├── services/         # Services et API
│   │   └── api.js        # Service centralisé pour les appels API
│   ├── App.jsx           # Composant principal avec routage
│   ├── App.css           # Styles globaux de l'application
│   ├── main.jsx          # Point d'entrée de l'application
│   └── index.css         # Styles de base
├── public/               # Fichiers statiques
│   └── vite.svg
├── db.json               # Base de données JSON (json-server)
├── index.html            # Fichier HTML principal
├── vite.config.js        # Configuration Vite
├── eslint.config.js      # Configuration ESLint
├── package.json          # Dépendances et scripts
└── README.md             # Documentation du projet
```

## 📚 Documentation

Toute la documentation d'analyse et de spécification est disponible dans le dossier [`docs/`](./docs/) :

- [Index de la documentation](./docs/00-INDEX.md)
- [Spécification API REST](./docs/01-SPECIFICATION-API-REST.md)
- [Dictionnaire des données](./docs/02-DICTIONNAIRE-DES-DONNEES.md)
- [Modèle Conceptuel de Données (MCD)](./docs/03-MODELE-CONCEPTUEL-DONNEES.md)
- [Modèle Logique de Données (MLD) PostgreSQL](./docs/04-MODELE-LOGIQUE-DONNEES.md)
- [Spécifications fonctionnelles et techniques](./docs/05-SPECIFICATIONS-FONCTIONNELLES-TECHNIQUES.md)
- [Diagrammes UML](./docs/06-DIAGRAMMES-UML.md)

## 📦 Lien du Répertoire Git

**Répertoire public GitHub :** https://github.com/Cey67/Team_up/tree/dev

## Installation

### Prérequis

- **Node.js** 18 ou supérieur
- **npm** ou **pnpm** (recommandé)

### Installation

**1. Cloner le dépôt**

```bash
git clone <repository-url>
cd Team_up
```

> Remplacez `<repository-url>` par l'URL de votre dépôt Git.

**2. Installer les dépendances**

```bash
npm install
# ou
pnpm install
```

**3. Démarrer JSON Server** (dans un terminal séparé)

```bash
npm run json-server
# ou
pnpm json-server
```

Le serveur API sera accessible à `http://localhost:3001`

**4. Démarrer le serveur de développement** (dans un autre terminal)

```bash
npm run dev
# ou
pnpm dev
```

**5. Accéder à l'application**

- Frontend : http://localhost:5173
- API : http://localhost:3001

## 🛠️ Développement

### Scripts disponibles

| Commande              | Description                             |
| --------------------- | --------------------------------------- |
| `npm run dev`         | Démarrer le serveur de développement    |
| `npm run build`       | Construire l'application en production  |
| `npm run preview`     | Prévisualiser le build de production    |
| `npm run lint`        | Exécuter ESLint pour la qualité du code |
| `npm run json-server` | Démarrer JSON Server API (port 3001)    |

### Configuration JSON Server

Le fichier `db.json` à la racine contient toutes les données de l'application :

- Users (utilisateurs)
- Teams (équipes)
- Players (joueurs)
- Matches (matchs)
- Attendances (présences)
- Statistics (statistiques)
- Conversations (conversations)
- Messages (messages)

Pour modifier les données, éditez directement `db.json`. Les changements seront automatiquement reflétés grâce à l'option `--watch`.

### Variables d'environnement

Actuellement, l'application utilise des endpoints API codés en dur. Pour la production, considérez :

- Configuration de l'URL de base de l'API
- Paramètres spécifiques à l'environnement
- Tokens d'authentification API
- Variables pour les services externes (email, upload de fichiers)

## Fonctionnalités détaillées

### Tableau de bord

- Vue d'ensemble des prochains matchs
- Résumé des dernières rencontres
- Statistiques personnelles et d'équipe
- Accès rapide aux fonctionnalités principales

### Authentification

- **Inscription** : Création de compte avec validation
- **Connexion** : Authentification sécurisée
- **Profil** : Gestion du profil utilisateur avec upload de photo
- **Thème** : Basculement entre thème clair et sombre

### Gestion des matchs

- **Création de match** : Formulaire complet pour créer un nouveau match (date, lieu, heure, équipes)
- **Liste des matchs** : Affichage des matchs à venir et passés
- **Détails d'un match** : Vue détaillée avec informations, joueurs inscrits, composition des équipes
- **Filtres multicritères** : Recherche par date, lieu, type, créateur
- **Composition d'équipes** : Répartition automatique ou manuelle des joueurs

### Gestion d'effectif

- **Liste des joueurs** : Affichage de tous les membres de l'équipe
- **Recherche** : Barre de recherche pour trouver rapidement un joueur
- **Filtres avancés** : Filtrage par rôle, position, statut
- **Tri** : Tri par nom, date d'inscription, statistiques
- **Gestion des rôles** : Attribution de rôles (joueur, capitaine, admin)

### Présences

- **Gestion des présences** : Marquage de présence/absence pour chaque match
- **Statistiques d'assiduité** : Taux de présence par joueur et par match
- **Historique** : Suivi des présences sur tous les matchs

### Statistiques

- **Statistiques individuelles** : Performances personnelles (buts, passes, matchs joués)
- **Statistiques d'équipe** : Métriques collectives et comparaisons
- **Historique** : Évolution des performances dans le temps

### Messagerie

- **Conversations** : Création et gestion de conversations entre membres
- **Messages en temps réel** : Envoi et réception de messages
- **Historique** : Archive des conversations et messages

### Paramètres

- **Paramètres d'équipe** : Gestion du nom, logo et informations de l'équipe
- **Upload de logo** : Téléchargement et modification du logo d'équipe
- **Configuration** : Paramètres généraux de l'application

## Architecture technique

### Services API

Le fichier `src/services/api.js` centralise tous les appels API :

- **playersService** : Gestion des joueurs (CRUD)
- **matchesService** : Gestion des matchs (CRUD)
- **statisticsService** : Gestion des statistiques
- **teamsService** : Gestion des équipes
- **attendancesService** : Gestion des présences
- **conversationsService** : Gestion des conversations
- **messagesService** : Gestion des messages

Cette architecture facilite la transition future vers un backend Express réel.

### Routage

L'application utilise React Router pour la navigation :

- Routes publiques : `/`, `/login`, `/register`
- Routes protégées avec sidebar : `/dashboard`, `/match`, `/effectif`, `/statistiques`, `/presences`, `/messagerie`, `/profil`, `/parametres`
- Route dynamique : `/match/:id` pour les détails d'un match

## Déploiement

### Build de production

Construire l'application :

```bash
npm run build
```

Les fichiers optimisés seront générés dans le dossier `dist/`.

### Prévisualisation du build

Prévisualiser le build de production :

```bash
npm run preview
```

### Déploiement en production

Pour le déploiement en production :

1. Construire l'application : `npm run build`
2. Servir le dossier `dist/` avec un serveur de fichiers statiques (Nginx, Apache, etc.)
3. Configurer les endpoints API pour pointer vers votre backend de production
4. Configurer les variables d'environnement si nécessaire
5. Options de déploiement : Vercel, Render, Railway, Netlify

## Design

L'application propose un design moderne avec :

- Interface responsive s'adaptant à tous les écrans
- Navigation par sidebar rétractable
- Thème clair/sombre personnalisable
- Animations et transitions fluides
- Design centré sur l'expérience utilisateur

## Roadmap

### Phase actuelle (30/11/2025) ✅

- ✅ Frontend React statique avec données mockées
- ✅ Interface utilisateur complète
- ✅ Composants réutilisables
- ✅ Service API centralisé
- ✅ Documentation complète :
  - ✅ README.md complet
  - ✅ Spécification API REST
  - ✅ Dictionnaire des données
  - ✅ Modèle Conceptuel de Données (MCD)
  - ✅ Modèle Logique de Données (MLD) PostgreSQL
  - ✅ Spécifications fonctionnelles et techniques
  - ✅ Diagrammes UML (use cases, flux, séquences)

### Prochaines étapes

- [ ] Backend Express avec PostgreSQL
- [ ] Authentification JWT
- [ ] Upload de fichiers (photos, logos)
- [ ] Notifications en temps réel
- [ ] Emails de réinitialisation de mot de passe
- [ ] Système de rôles et permissions
- [ ] Tests unitaires et d'intégration
- [ ] Documentation API REST complète

## Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Forkez le projet
2. Créez une branche pour votre fonctionnalité (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Pushez vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## Auteur

**Ceyhun SAPMAZ**

- Projet développé dans le cadre du CDA 25

**Note** : Cette application est en développement actif. Certaines fonctionnalités peuvent être en cours de développement.

## Licence

Ce projet est un projet éducatif et de démonstration.

---

**Team Up** - Simplifiez l'organisation de vos matchs de football ! ⚽
