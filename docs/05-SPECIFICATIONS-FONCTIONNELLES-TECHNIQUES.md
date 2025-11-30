# Spécifications Fonctionnelles et Techniques - Team Up

## Table des matières

1. [Contexte et Objectifs](#1-contexte-et-objectifs)
2. [Spécifications Fonctionnelles](#2-spécifications-fonctionnelles)
3. [Spécifications Techniques](#3-spécifications-techniques)

---

## 1. Contexte et Objectifs

### 1.1 Contexte

Team Up est une application web destinée à simplifier l'organisation de matchs de football amateurs. Elle permet aux joueurs de créer, gérer et participer à des matchs entre amis, collègues ou membres d'une même communauté.

### 1.2 Objectifs

**Objectifs principaux :**

- Faciliter la création et la gestion de matchs amateurs
- Centraliser les informations des joueurs et de l'équipe
- Suivre les statistiques individuelles et collectives
- Gérer les présences aux matchs
- Permettre la communication entre les membres

**Objectifs secondaires :**

- Améliorer l'engagement des joueurs
- Rationaliser la gestion administrative
- Offrir une expérience utilisateur moderne et intuitive

---

## 2. Spécifications Fonctionnelles

### 2.1 Authentification et Gestion des Utilisateurs

#### 2.1.1 Inscription

**Description :** Permet à un nouvel utilisateur de créer un compte.

**Acteurs :** Utilisateur non authentifié

**Préconditions :**

- L'utilisateur n'est pas connecté
- L'email n'existe pas déjà dans la base de données

**Scénario principal :**

1. L'utilisateur accède à la page d'inscription
2. Il remplit le formulaire (prénom, nom, email, mot de passe, téléphone optionnel)
3. Le système valide les données
4. Le système crée le compte et connecte automatiquement l'utilisateur
5. L'utilisateur est redirigé vers le tableau de bord

**Règles de validation :**

- Email : format valide, unique dans la base
- Mot de passe : minimum 8 caractères
- Champs obligatoires : prénom, nom, email, mot de passe

**Postconditions :**

- Un nouveau joueur est créé dans la base de données
- L'utilisateur est authentifié

#### 2.1.2 Connexion

**Description :** Permet à un utilisateur de se connecter avec ses identifiants.

**Acteurs :** Utilisateur non authentifié

**Scénario principal :**

1. L'utilisateur accède à la page de connexion
2. Il saisit son email et son mot de passe
3. Le système vérifie les identifiants
4. Le système génère un token JWT
5. L'utilisateur est redirigé vers le tableau de bord

**Gestion des erreurs :**

- Email ou mot de passe incorrect : affichage d'un message d'erreur
- Compte inexistant : message d'erreur

#### 2.1.3 Gestion du Profil

**Description :** Permet à un utilisateur de modifier ses informations personnelles.

**Acteurs :** Utilisateur authentifié

**Fonctionnalités :**

- Modification du prénom, nom, téléphone, date de naissance
- Upload d'une photo de profil
- Modification du numéro de maillot
- Modification de la position sur le terrain
- Basculement entre thème clair et sombre

**Contraintes :**

- Un utilisateur ne peut modifier que son propre profil (sauf si admin)
- Les modifications sont sauvegardées en temps réel

---

### 2.2 Gestion des Matchs

#### 2.2.1 Création d'un Match

**Description :** Permet à un utilisateur de créer un nouveau match.

**Acteurs :** Utilisateur authentifié

**Préconditions :**

- L'utilisateur est membre d'une équipe
- L'utilisateur est authentifié

**Scénario principal :**

1. L'utilisateur accède à la page des matchs
2. Il clique sur "Créer un match"
3. Il remplit le formulaire :
   - Date du match
   - Heure du match
   - Lieu
   - Type de match (5v5, 7v7, 11v11)
   - Nombre maximum de joueurs
4. Le système valide les données
5. Le match est créé avec le statut "upcoming"
6. L'utilisateur est redirigé vers la page de détails du match

**Règles de validation :**

- La date ne peut pas être dans le passé
- Le nombre maximum de joueurs doit être cohérent avec le type de match
- Tous les champs sont obligatoires

**Postconditions :**

- Un nouveau match est créé dans la base de données
- Le créateur est automatiquement inscrit avec le statut "pending"

#### 2.2.2 Liste des Matchs

**Description :** Affiche la liste de tous les matchs avec possibilité de filtrage.

**Acteurs :** Utilisateur authentifié

**Fonctionnalités :**

- Affichage des matchs à venir et passés
- Filtrage par : date, lieu, type de match, statut (upcoming, finished, cancelled), créateur
- Tri par date (croissant ou décroissant)

**Affichage :**

- Pour chaque match : date, heure, lieu, type, nombre de joueurs inscrits, statut
- Indication visuelle si l'utilisateur est inscrit

#### 2.2.3 Détails d'un Match

**Description :** Affiche les détails complets d'un match.

**Acteurs :** Utilisateur authentifié

**Informations affichées :**

- Date, heure, lieu, type
- Liste des joueurs inscrits avec leurs présences
- Composition des équipes (si le match a commencé)
- Score (si le match est terminé)
- Actions possibles :
  - S'inscrire / Se désinscrire
  - Modifier le match (créateur ou admin uniquement)
  - Supprimer le match (créateur ou admin uniquement)

#### 2.2.4 Modification d'un Match

**Description :** Permet de modifier les informations d'un match.

**Acteurs :** Créateur du match ou Administrateur

**Préconditions :**

- Le match existe
- L'utilisateur est le créateur ou un administrateur
- Le match n'est pas terminé

**Fonctionnalités :**

- Modification de la date, heure, lieu
- Modification du type de match
- Modification du nombre maximum de joueurs
- Ajout du score (si le match est terminé)

#### 2.2.5 Suppression d'un Match

**Description :** Permet de supprimer un match.

**Acteurs :** Créateur du match ou Administrateur

**Préconditions :**

- Le match existe
- L'utilisateur est le créateur ou un administrateur

**Postconditions :**

- Le match et toutes ses présences sont supprimés de la base de données

---

### 2.3 Gestion des Présences

#### 2.3.1 Inscription à un Match

**Description :** Permet à un joueur de s'inscrire à un match.

**Acteurs :** Utilisateur authentifié

**Scénario principal :**

1. L'utilisateur accède aux détails d'un match
2. Il clique sur "S'inscrire"
3. Son statut de présence est défini sur "pending"
4. Le nombre de joueurs inscrits est mis à jour

**Contraintes :**

- Le nombre de joueurs inscrits ne peut pas dépasser `maxPlayers`
- Un joueur ne peut s'inscrire qu'une seule fois par match

#### 2.3.2 Gestion des Présences

**Description :** Permet de gérer les présences des joueurs à un match.

**Acteurs :** Créateur du match, Administrateur, ou Joueur (pour sa propre présence)

**Statuts possibles :**

- `pending` : En attente de réponse
- `present` : Présent
- `absent` : Absent

**Fonctionnalités :**

- Modification du statut de présence
- Vue d'ensemble des présences pour un match
- Statistiques d'assiduité par joueur

---

### 2.4 Gestion d'Effectif

#### 2.4.1 Liste des Joueurs

**Description :** Affiche la liste de tous les joueurs de l'équipe.

**Acteurs :** Utilisateur authentifié

**Fonctionnalités :**

- Affichage de tous les joueurs avec leurs informations principales
- Recherche par nom, prénom, position
- Filtrage par : rôle, position, statut (admin/non-admin)
- Tri par : nom, date d'inscription, statistiques

**Affichage :**

- Pour chaque joueur : photo, nom complet, position, numéro de maillot, rôle
- Accès au profil détaillé

#### 2.4.2 Profil d'un Joueur

**Description :** Affiche les informations complètes d'un joueur.

**Acteurs :** Utilisateur authentifié

**Informations affichées :**

- Informations personnelles
- Statistiques du joueur
- Historique des matchs joués
- Taux de présence

---

### 2.5 Statistiques

#### 2.5.1 Statistiques Individuelles

**Description :** Affiche les statistiques personnelles d'un joueur.

**Acteurs :** Utilisateur authentifié

**Métriques affichées :**

- Nombre de matchs joués
- Nombre de buts
- Nombre de passes décisives
- Cartons jaunes et rouges
- Clean sheets (pour gardiens)
- Arrêts (pour gardiens)

#### 2.5.2 Statistiques d'Équipe

**Description :** Affiche les statistiques collectives de l'équipe.

**Acteurs :** Utilisateur authentifié

**Métriques affichées :**

- Nombre total de matchs joués
- Buts totaux marqués
- Classement des buteurs
- Classement des passeurs
- Taux de présence moyen

---

### 2.6 Messagerie

> **⚠️ STATUT : Fonctionnalité mise en stand-by**
>
> La messagerie n'est **pas incluse dans le périmètre fonctionnel principal** du projet et a été mise en stand-by pour se concentrer sur les fonctionnalités core (authentification, gestion des matchs, équipes, joueurs, statistiques).
>
> Cette fonctionnalité pourra être réactivée dans une phase 2 après validation du MVP.
>
> Pour plus de détails, consultez le [README de la messagerie](../../src/pages/messagerie/README.md).

#### 2.6.1 Liste des Conversations

**Description :** Affiche la liste des conversations de l'utilisateur.

**Acteurs :** Utilisateur authentifié

**Fonctionnalités :**

- Affichage des conversations triées par dernière activité
- Indication du nombre de messages non lus
- Statut en ligne des interlocuteurs
- Création d'une nouvelle conversation

**Note :** Cette fonctionnalité est actuellement en stand-by.

#### 2.6.2 Conversation

**Description :** Affiche les messages d'une conversation et permet d'en envoyer.

**Acteurs :** Utilisateur authentifié

**Fonctionnalités :**

- Affichage de l'historique des messages
- Envoi de nouveaux messages
- Marquage des messages comme lus
- Indication du statut en ligne de l'interlocuteur

**Note :** Cette fonctionnalité est actuellement en stand-by.

---

### 2.7 Paramètres

#### 2.7.1 Paramètres d'Équipe

**Description :** Permet de gérer les paramètres de l'équipe.

**Acteurs :** Administrateur

**Fonctionnalités :**

- Modification du nom de l'équipe
- Upload/modification du logo
- Modification de la description

#### 2.7.2 Paramètres de l'Application

**Description :** Permet de gérer les paramètres généraux de l'application.

**Acteurs :** Utilisateur authentifié

**Fonctionnalités :**

- Basculement entre thème clair et sombre
- Préférences de notification (à implémenter)

---

## 3. Spécifications Techniques

### 3.1 Stack Technique

**Frontend :**

- React 19.2+ (JavaScript)
- React Router DOM 6.30 pour le routage
- Vite 7.2 pour le développement et la compilation
- CSS Modules pour le style scoped par composant

**Backend (Phase actuelle) :**

- JSON Server pour simuler une API REST (port 3001)

**Backend (Phase future) :**

- Node.js + Express.js
- PostgreSQL 14+
- JWT pour l'authentification
- bcrypt pour le hachage des mots de passe

**Base de Données :**

- Phase actuelle : JSON Server avec fichier `db.json`
- Phase future : PostgreSQL avec scripts SQL (voir MLD)

### 3.2 Architecture

**Structure Frontend :**

- Composants réutilisables organisés par domaine (auth, match, effectif, etc.)
- Pages de l'application
- Service API centralisé (`src/services/api.js`)
- État local avec hooks React et Context API

**Routage :**

- Routes publiques : `/`, `/login`, `/register`
- Routes protégées : `/dashboard`, `/match`, `/effectif`, `/statistiques`, `/presences`, `/profil`, `/parametres`
- Route en stand-by : `/messagerie` (fonctionnalité mise en stand-by)

### 3.3 Sécurité

**Phase actuelle :**

- Authentification simulée (pas de vrai JWT)

**Phase future :**

- JWT (JSON Web Tokens) pour l'authentification
- Tokens stockés dans localStorage
- Refresh tokens pour renouveler les sessions
- Hashage des mots de passe avec bcrypt (salt rounds: 10)
- Validation et sanitization de toutes les entrées
- HTTPS en production

### 3.4 Performance

**Optimisations actuelles :**

- Code splitting avec React Router
- Lazy loading des images
- CSS modulaire

**Optimisations futures :**

- Lazy loading des composants
- Mise en cache des données
- Pagination des listes longues
- Compression des assets

### 3.5 Déploiement

**Environnements :**

- Développement : Frontend `http://localhost:5173`, API `http://localhost:3001`
- Production : Frontend (Vercel/Netlify), Backend (Render/Railway), Base de données (PostgreSQL)

**Variables d'environnement :**

- Frontend : `VITE_API_BASE_URL`
- Backend (futur) : `PORT`, `DATABASE_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`

---

**Note :** Pour plus de détails techniques sur l'architecture, la structure du projet et le déploiement, consultez le [README.md](../README.md).
