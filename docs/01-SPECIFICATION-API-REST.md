# Spécification de l'API REST - Team Up

## Vue d'ensemble

Cette spécification définit les routes et méthodes HTTP de l'API REST pour l'application Team Up. L'API est actuellement simulée avec JSON Server, mais ces spécifications serviront de référence pour l'implémentation du backend Express avec PostgreSQL.

**Base URL :** `http://localhost:3001` (développement) / `https://api.teamup.com` (production)

**Format des données :** JSON

**Authentification :** JWT (à implémenter dans le backend réel)

---

## 1. Authentification

### 1.1 Inscription

**POST** `/auth/register`

Créer un nouveau compte utilisateur.

**Corps de la requête :**

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string (email valide)",
  "password": "string (min 8 caractères)",
  "phone": "string (optionnel)",
  "dateOfBirth": "string (format: YYYY-MM-DD)",
  "position": "string (optionnel)"
}
```

**Réponse 201 (Succès) :**

```json
{
  "id": "number",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "token": "string (JWT)",
  "isAdmin": false
}
```

**Réponse 400 (Erreur) :**

```json
{
  "error": "Email déjà utilisé"
}
```

### 1.2 Connexion

**POST** `/auth/login`

Se connecter avec un compte existant.

**Corps de la requête :**

```json
{
  "email": "string",
  "password": "string"
}
```

**Réponse 200 (Succès) :**

```json
{
  "id": "number",
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "token": "string (JWT)",
  "isAdmin": boolean
}
```

**Réponse 401 (Non autorisé) :**

```json
{
  "error": "Email ou mot de passe incorrect"
}
```

### 1.3 Réinitialisation du mot de passe

**POST** `/auth/forgot-password`

Demander une réinitialisation de mot de passe.

**Corps de la requête :**

```json
{
  "email": "string"
}
```

**Réponse 200 (Succès) :**

```json
{
  "message": "Email de réinitialisation envoyé"
}
```

**POST** `/auth/reset-password`

Réinitialiser le mot de passe avec un token.

**Corps de la requête :**

```json
{
  "token": "string",
  "newPassword": "string"
}
```

---

## 2. Joueurs (Players)

### 2.1 Liste des joueurs

**GET** `/players`

Récupérer tous les joueurs de l'équipe.

**Paramètres de requête (optionnels) :**

- `role`: Filtre par rôle (ex: `role=Joueur`)
- `position`: Filtre par position (ex: `position=Milieu de terrain`)
- `isAdmin`: Filtre par statut admin (ex: `isAdmin=true`)

**Réponse 200 (Succès) :**

```json
[
  {
    "id": "number",
    "firstName": "string",
    "lastName": "string",
    "role": "string",
    "isAdmin": boolean,
    "email": "string",
    "phone": "string",
    "dateOfBirth": "string",
    "photo": "string (URL) | null",
    "position": "string",
    "jerseyNumber": number
  }
]
```

### 2.2 Détails d'un joueur

**GET** `/players/:id`

Récupérer les informations d'un joueur spécifique.

**Réponse 200 (Succès) :**

```json
{
  "id": "number",
  "firstName": "string",
  "lastName": "string",
  "role": "string",
  "isAdmin": boolean,
  "email": "string",
  "phone": "string",
  "dateOfBirth": "string",
  "photo": "string (URL) | null",
  "position": "string",
  "jerseyNumber": number
}
```

**Réponse 404 (Non trouvé) :**

```json
{
  "error": "Joueur non trouvé"
}
```

### 2.3 Créer un joueur

**POST** `/players`

Créer un nouveau joueur (réservé aux admins).

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Corps de la requête :**

```json
{
  "firstName": "string",
  "lastName": "string",
  "email": "string",
  "phone": "string",
  "dateOfBirth": "string",
  "position": "string",
  "jerseyNumber": number,
  "role": "string",
  "isAdmin": false
}
```

**Réponse 201 (Succès) :**

```json
{
  "id": "number",
  "firstName": "string",
  "lastName": "string",
  ...
}
```

### 2.4 Mettre à jour un joueur

**PATCH** `/players/:id`

Mettre à jour les informations d'un joueur.

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Corps de la requête :** (champs optionnels, uniquement ceux à modifier)

```json
{
  "firstName": "string",
  "lastName": "string",
  "phone": "string",
  "position": "string",
  "jerseyNumber": number,
  "photo": "string (URL)"
}
```

**Réponse 200 (Succès) :**

```json
{
  "id": "number",
  "firstName": "string",
  ...
}
```

**Réponse 403 (Interdit) :**

```json
{
  "error": "Vous n'avez pas les droits pour modifier ce joueur"
}
```

### 2.5 Supprimer un joueur

**DELETE** `/players/:id`

Supprimer un joueur (réservé aux admins).

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Réponse 204 (Succès - No Content)**

**Réponse 403 (Interdit) :**

```json
{
  "error": "Vous n'avez pas les droits pour supprimer ce joueur"
}
```

---

## 3. Équipes (Teams)

### 3.1 Liste des équipes

**GET** `/teams`

Récupérer toutes les équipes.

**Réponse 200 (Succès) :**

```json
[
  {
    "id": "number",
    "name": "string",
    "logo": "string (URL) | null",
    "createdAt": "string (ISO 8601)",
    "description": "string"
  }
]
```

### 3.2 Détails d'une équipe

**GET** `/teams/:id`

Récupérer les informations d'une équipe spécifique.

**Réponse 200 (Succès) :**

```json
{
  "id": "number",
  "name": "string",
  "logo": "string (URL) | null",
  "createdAt": "string (ISO 8601)",
  "description": "string"
}
```

### 3.3 Mettre à jour une équipe

**PATCH** `/teams/:id`

Mettre à jour les informations d'une équipe (réservé aux admins).

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Corps de la requête :**

```json
{
  "name": "string",
  "logo": "string (URL)",
  "description": "string"
}
```

---

## 4. Matchs (Matches)

### 4.1 Liste des matchs

**GET** `/matches`

Récupérer tous les matchs.

**Paramètres de requête (optionnels) :**

- `status`: Filtre par statut (ex: `status=upcoming`, `status=finished`)
- `date`: Filtre par date (ex: `date=2025-11-30`)
- `location`: Filtre par lieu (ex: `location=KG5`)
- `type`: Filtre par type (ex: `type=5v5`)
- `createdBy`: Filtre par créateur (ex: `createdBy=1`)

**Réponse 200 (Succès) :**

```json
[
  {
    "id": "string",
    "date": "string (YYYY-MM-DD)",
    "time": "string (HH:mm)",
    "location": "string",
    "type": "string",
    "maxPlayers": number,
    "playersCount": number,
    "status": "string (upcoming | finished | cancelled)",
    "score": {
      "teamA": number,
      "teamB": number
    } | null,
    "teamId": number,
    "createdBy": number,
    "createdAt": "string (ISO 8601)"
  }
]
```

### 4.2 Détails d'un match

**GET** `/matches/:id`

Récupérer les détails d'un match spécifique.

**Réponse 200 (Succès) :**

```json
{
  "id": "string",
  "date": "string",
  "time": "string",
  "location": "string",
  "type": "string",
  "maxPlayers": number,
  "playersCount": number,
  "status": "string",
  "score": {
    "teamA": number,
    "teamB": number
  } | null,
  "teamId": number,
  "createdBy": number,
  "createdAt": "string"
}
```

### 4.3 Créer un match

**POST** `/matches`

Créer un nouveau match.

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Corps de la requête :**

```json
{
  "date": "string (YYYY-MM-DD)",
  "time": "string (HH:mm)",
  "location": "string",
  "type": "string (ex: 5v5, 7v7, 11v11)",
  "maxPlayers": number,
  "teamId": number
}
```

**Réponse 201 (Succès) :**

```json
{
  "id": "string",
  "date": "string",
  "time": "string",
  "location": "string",
  "type": "string",
  "maxPlayers": number,
  "playersCount": 0,
  "status": "upcoming",
  "score": null,
  "teamId": number,
  "createdBy": number,
  "createdAt": "string"
}
```

### 4.4 Mettre à jour un match

**PATCH** `/matches/:id`

Mettre à jour un match (créateur ou admin uniquement).

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Corps de la requête :**

```json
{
  "date": "string",
  "time": "string",
  "location": "string",
  "status": "string",
  "score": {
    "teamA": number,
    "teamB": number
  }
}
```

### 4.5 Supprimer un match

**DELETE** `/matches/:id`

Supprimer un match (créateur ou admin uniquement).

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Réponse 204 (Succès - No Content)**

---

## 5. Présences (Attendances)

### 5.1 Liste des présences

**GET** `/attendances`

Récupérer toutes les présences.

**Paramètres de requête (optionnels) :**

- `matchId`: Filtre par match (ex: `matchId=1`)
- `playerId`: Filtre par joueur (ex: `playerId=1`)
- `status`: Filtre par statut (ex: `status=present`)

**Réponse 200 (Succès) :**

```json
[
  {
    "id": "string",
    "matchId": "string | number",
    "playerId": "string | number",
    "status": "string (present | absent | pending)",
    "updatedAt": "string (ISO 8601)"
  }
]
```

### 5.2 Récupérer les présences d'un match

**GET** `/attendances?matchId=:matchId`

Récupérer toutes les présences pour un match spécifique.

**Réponse 200 (Succès) :**

```json
[
  {
    "id": "string",
    "matchId": "string",
    "playerId": "string",
    "status": "string",
    "updatedAt": "string"
  }
]
```

### 5.3 Créer ou mettre à jour une présence

**POST** `/attendances` ou **PATCH** `/attendances/:id`

Créer ou mettre à jour une présence pour un match.

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Corps de la requête (POST) :**

```json
{
  "matchId": "string | number",
  "playerId": "string | number",
  "status": "string (present | absent | pending)"
}
```

**Corps de la requête (PATCH) :**

```json
{
  "status": "string (present | absent | pending)"
}
```

**Réponse 201/200 (Succès) :**

```json
{
  "id": "string",
  "matchId": "string",
  "playerId": "string",
  "status": "string",
  "updatedAt": "string"
}
```

### 5.4 Supprimer une présence

**DELETE** `/attendances/:id`

Supprimer une présence.

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Réponse 204 (Succès - No Content)**

---

## 6. Statistiques (Statistics)

### 6.1 Liste des statistiques

**GET** `/statistics`

Récupérer toutes les statistiques des joueurs.

**Réponse 200 (Succès) :**

```json
[
  {
    "id": "string",
    "playerId": number,
    "name": "string",
    "photo": "string (URL) | null",
    "matchesPlayed": number,
    "goals": number,
    "assists": number,
    "yellowCards": number,
    "redCards": number,
    "cleanSheets": number,
    "saves": number
  }
]
```

### 6.2 Statistiques d'un joueur

**GET** `/statistics?playerId=:playerId`

Récupérer les statistiques d'un joueur spécifique.

**Réponse 200 (Succès) :**

```json
{
  "id": "string",
  "playerId": number,
  "name": "string",
  "photo": "string | null",
  "matchesPlayed": number,
  "goals": number,
  "assists": number,
  "yellowCards": number,
  "redCards": number,
  "cleanSheets": number,
  "saves": number
}
```

### 6.3 Mettre à jour les statistiques

**PATCH** `/statistics/:id`

Mettre à jour les statistiques d'un joueur (admin uniquement).

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Corps de la requête :**

```json
{
  "matchesPlayed": number,
  "goals": number,
  "assists": number,
  "yellowCards": number,
  "redCards": number,
  "cleanSheets": number,
  "saves": number
}
```

---

## 7. Conversations

> **⚠️ STATUT : Fonctionnalité mise en stand-by**
>
> Les endpoints de conversations et messages ne sont **pas inclus dans le périmètre fonctionnel principal** du projet et ont été mis en stand-by pour se concentrer sur les fonctionnalités core.
>
> Cette fonctionnalité pourra être réactivée dans une phase 2 après validation du MVP.

### 7.1 Liste des conversations

**GET** `/conversations`

Récupérer toutes les conversations de l'utilisateur connecté.

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Réponse 200 (Succès) :**

```json
[
  {
    "id": "string",
    "userId": "string",
    "firstName": "string",
    "lastName": "string",
    "position": "string",
    "lastMessage": "string",
    "lastMessageTime": "string (ISO 8601)",
    "unread": number,
    "photo": "string (URL) | null",
    "isOnline": boolean
  }
]
```

### 7.2 Créer une conversation

**POST** `/conversations`

Créer une nouvelle conversation avec un autre utilisateur.

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Corps de la requête :**

```json
{
  "userId": "string"
}
```

### 7.3 Supprimer une conversation

**DELETE** `/conversations/:id`

Supprimer une conversation.

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Réponse 204 (Succès - No Content)**

---

## 8. Messages

> **⚠️ STATUT : Fonctionnalité mise en stand-by**
>
> Les endpoints de messages sont actuellement en stand-by. Voir section 7 (Conversations) pour plus de détails.

### 8.1 Liste des messages d'une conversation

**GET** `/messages?conversationId=:conversationId`

Récupérer tous les messages d'une conversation.

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Réponse 200 (Succès) :**

```json
[
  {
    "id": "string",
    "conversationId": "string",
    "senderId": "string",
    "text": "string",
    "timestamp": "string (ISO 8601)"
  }
]
```

### 8.2 Envoyer un message

**POST** `/messages`

Envoyer un message dans une conversation.

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Corps de la requête :**

```json
{
  "conversationId": "string",
  "text": "string"
}
```

**Réponse 201 (Succès) :**

```json
{
  "id": "string",
  "conversationId": "string",
  "senderId": "string",
  "text": "string",
  "timestamp": "string"
}
```

### 8.3 Supprimer un message

**DELETE** `/messages/:id`

Supprimer un message (expéditeur uniquement).

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
```

**Réponse 204 (Succès - No Content)**

---

## 9. Codes de statut HTTP

| Code | Signification         | Usage                                                  |
| ---- | --------------------- | ------------------------------------------------------ |
| 200  | OK                    | Requête réussie                                        |
| 201  | Created               | Ressource créée avec succès                            |
| 204  | No Content            | Requête réussie, pas de contenu à retourner            |
| 400  | Bad Request           | Requête invalide (données manquantes ou mal formatées) |
| 401  | Unauthorized          | Authentification requise ou échouée                    |
| 403  | Forbidden             | Accès refusé (permissions insuffisantes)               |
| 404  | Not Found             | Ressource non trouvée                                  |
| 409  | Conflict              | Conflit (ex: email déjà utilisé)                       |
| 500  | Internal Server Error | Erreur serveur                                         |

---

## 10. Gestion des erreurs

Toutes les erreurs suivent le format suivant :

```json
{
  "error": "Message d'erreur descriptif",
  "code": "CODE_ERREUR",
  "details": {} // Optionnel, pour les erreurs de validation
}
```

### Exemples d'erreurs

**Validation échouée (400) :**

```json
{
  "error": "Données de validation invalides",
  "code": "VALIDATION_ERROR",
  "details": {
    "email": "Format d'email invalide",
    "password": "Le mot de passe doit contenir au moins 8 caractères"
  }
}
```

**Ressource non trouvée (404) :**

```json
{
  "error": "Match non trouvé",
  "code": "NOT_FOUND"
}
```

**Accès refusé (403) :**

```json
{
  "error": "Vous n'avez pas les droits pour effectuer cette action",
  "code": "FORBIDDEN"
}
```

---

## 11. Authentification JWT

Toutes les routes protégées nécessitent un header d'autorisation :

```
Authorization: Bearer <JWT_TOKEN>
```

Le token JWT doit être obtenu via les endpoints `/auth/login` ou `/auth/register`.

Le token contient :

- `id` : ID de l'utilisateur
- `email` : Email de l'utilisateur
- `isAdmin` : Statut administrateur
- `iat` : Date d'émission
- `exp` : Date d'expiration

---

## 12. Pagination (à implémenter)

Pour les listes longues, la pagination sera implémentée avec les paramètres suivants :

- `page` : Numéro de la page (défaut: 1)
- `limit` : Nombre d'éléments par page (défaut: 20)

**Réponse avec pagination :**

```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

---

## 13. Upload de fichiers

### 13.1 Upload de photo de profil

**POST** `/upload/avatar`

Uploader une photo de profil pour un utilisateur.

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Corps de la requête :**

- `file`: Fichier image (JPEG, PNG, max 5MB)

**Réponse 200 (Succès) :**

```json
{
  "url": "https://api.teamup.com/uploads/avatars/user123.jpg"
}
```

### 13.2 Upload de logo d'équipe

**POST** `/upload/team-logo`

Uploader un logo pour une équipe.

**Headers requis :**

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: multipart/form-data
```

**Corps de la requête :**

- `file`: Fichier image (JPEG, PNG, max 5MB)
- `teamId`: ID de l'équipe

**Réponse 200 (Succès) :**

```json
{
  "url": "https://api.teamup.com/uploads/logos/team1.png"
}
```

---

## Notes d'implémentation

- **Phase actuelle** : API simulée avec JSON Server
- **Phase future** : Migration vers Express.js avec PostgreSQL
- **Sécurité** : Implémenter la validation des données, la sanitization, et la protection CSRF
- **Performance** : Mettre en cache les requêtes fréquentes, implémenter la pagination
- **Tests** : Créer des tests unitaires et d'intégration pour chaque endpoint
