# Dictionnaire des Données - Team Up

Ce document décrit en détail toutes les entités et leurs attributs utilisés dans l'application Team Up.

---

## 1. Players (Joueurs)

Représente un joueur membre d'une équipe.

| Attribut | Type | Description | Contraintes | Exemple |
|----------|------|-------------|-------------|---------|
| `id` | String/Number | Identifiant unique du joueur | Clé primaire, requis | `"1"` ou `1` |
| `firstName` | String | Prénom du joueur | Requis, max 50 caractères | `"Ceyhun"` |
| `lastName` | String | Nom de famille du joueur | Requis, max 50 caractères | `"SAPMAZ"` |
| `role` | String | Rôle du joueur dans l'équipe | Valeurs possibles : `"Joueur"`, `"Capitaine"`, `"Admin"` | `"Joueur"` |
| `isAdmin` | Boolean | Indique si le joueur a les droits administrateur | Défaut : `false` | `true` |
| `email` | String | Adresse email du joueur | Requis, format email valide, unique | `"ceyhun.sapmaz@example.com"` |
| `phone` | String | Numéro de téléphone | Optionnel, format libre | `"0769669900"` |
| `dateOfBirth` | String | Date de naissance | Format : `YYYY-MM-DD` (ISO 8601) | `"2004-06-22"` |
| `photo` | String / null | URL de la photo de profil | Optionnel, URL valide ou null | `null` ou `"https://..."` |
| `position` | String | Position sur le terrain | Valeurs possibles : `"Gardien"`, `"Défenseur"`, `"Milieu de terrain"`, `"Attaquant"` | `"Gardien"` |
| `jerseyNumber` | Number | Numéro de maillot | Optionnel, entier positif | `1` |

**Relations :**
- Un joueur appartient à une équipe (via `teamId` dans la relation)
- Un joueur a des statistiques (relation 1:1 avec `statistics`)
- Un joueur peut avoir plusieurs présences (relation 1:N avec `attendances`)
- Un joueur peut créer plusieurs matchs (relation 1:N avec `matches.createdBy`)

**Exemple complet :**
```json
{
  "id": "1",
  "firstName": "Ceyhun",
  "lastName": "SAPMAZ",
  "role": "Joueur",
  "isAdmin": true,
  "email": "ceyhun.sapmaz@example.com",
  "phone": "0769669900",
  "dateOfBirth": "2004-06-22",
  "photo": null,
  "position": "Gardien",
  "jerseyNumber": 1
}
```

---

## 2. Teams (Équipes)

Représente une équipe de football.

| Attribut | Type | Description | Contraintes | Exemple |
|----------|------|-------------|-------------|---------|
| `id` | String/Number | Identifiant unique de l'équipe | Clé primaire, requis | `"1"` ou `1` |
| `name` | String | Nom de l'équipe | Requis, max 100 caractères | `"FC STRASBOURG"` |
| `logo` | String / null | URL du logo de l'équipe | Optionnel, URL valide ou null | `null` ou `"https://..."` |
| `createdAt` | String | Date de création de l'équipe | Format : `YYYY-MM-DDTHH:mm:ss.sssZ` (ISO 8601) | `"2024-01-15T10:00:00Z"` |
| `description` | String | Description de l'équipe | Optionnel, texte libre | `"Équipe de football amateur basée à Strasbourg"` |

**Relations :**
- Une équipe a plusieurs joueurs (relation 1:N avec `players`)
- Une équipe a plusieurs matchs (relation 1:N avec `matches`)

**Exemple complet :**
```json
{
  "id": "1",
  "name": "FC STRASBOURG",
  "logo": null,
  "createdAt": "2024-01-15T10:00:00Z",
  "description": "Équipe de football amateur basée à Strasbourg"
}
```

---

## 3. Matches (Matchs)

Représente un match de football.

| Attribut | Type | Description | Contraintes | Exemple |
|----------|------|-------------|-------------|---------|
| `id` | String | Identifiant unique du match | Clé primaire, requis | `"1"` ou `"1c9c"` |
| `date` | String | Date du match | Requis, format : `YYYY-MM-DD` | `"2025-11-30"` |
| `time` | String | Heure du match | Requis, format : `HH:mm` (24h) | `"18:00"` |
| `location` | String | Lieu du match | Requis, max 200 caractères | `"KG5"` |
| `type` | String | Type de match | Valeurs possibles : `"5v5"`, `"7v7"`, `"11v11"` | `"5v5"` |
| `maxPlayers` | Number | Nombre maximum de joueurs | Requis, entier positif | `10` |
| `playersCount` | Number | Nombre actuel de joueurs inscrits | Calculé automatiquement | `5` |
| `status` | String | Statut du match | Valeurs possibles : `"upcoming"`, `"finished"`, `"cancelled"` | `"upcoming"` |
| `score` | Object / null | Score du match | Optionnel, null si match non terminé | `{"teamA": 3, "teamB": 2}` ou `null` |
| `score.teamA` | Number | Score de l'équipe A | Optionnel, entier positif ou 0 | `3` |
| `score.teamB` | Number | Score de l'équipe B | Optionnel, entier positif ou 0 | `2` |
| `teamId` | Number | Identifiant de l'équipe organisatrice | Requis, clé étrangère vers `teams` | `1` |
| `createdBy` | Number | Identifiant du joueur créateur | Requis, clé étrangère vers `players` | `1` |
| `createdAt` | String | Date de création du match | Format : `YYYY-MM-DDTHH:mm:ss.sssZ` | `"2025-11-29T16:48:19.499Z"` |

**Relations :**
- Un match appartient à une équipe (relation N:1 avec `teams`)
- Un match est créé par un joueur (relation N:1 avec `players`)
- Un match a plusieurs présences (relation 1:N avec `attendances`)

**Exemple complet :**
```json
{
  "id": "1c9c",
  "date": "2025-11-30",
  "time": "18:00",
  "location": "KG5",
  "type": "5v5",
  "maxPlayers": 10,
  "playersCount": 0,
  "status": "upcoming",
  "score": null,
  "teamId": 1,
  "createdBy": 1,
  "createdAt": "2025-11-29T16:48:19.499Z"
}
```

---

## 4. Attendances (Présences)

Représente la présence d'un joueur à un match.

| Attribut | Type | Description | Contraintes | Exemple |
|----------|------|-------------|-------------|---------|
| `id` | String | Identifiant unique de la présence | Clé primaire, requis | `"1"` ou `"3a19"` |
| `matchId` | String/Number | Identifiant du match | Requis, clé étrangère vers `matches` | `"1"` ou `1` |
| `playerId` | String/Number | Identifiant du joueur | Requis, clé étrangère vers `players` | `"1"` ou `1` |
| `status` | String | Statut de présence | Valeurs possibles : `"present"`, `"absent"`, `"pending"` | `"present"` |
| `updatedAt` | String | Date de dernière mise à jour | Format : `YYYY-MM-DDTHH:mm:ss.sssZ` | `"2025-11-27T14:09:47.048Z"` |

**Relations :**
- Une présence appartient à un match (relation N:1 avec `matches`)
- Une présence appartient à un joueur (relation N:1 avec `players`)

**Contraintes :**
- Un joueur ne peut avoir qu'une seule présence par match (couple `matchId` + `playerId` unique)

**Exemple complet :**
```json
{
  "id": "3a19",
  "matchId": "1",
  "playerId": "1",
  "status": "pending",
  "updatedAt": "2025-11-27T14:09:47.048Z"
}
```

---

## 5. Statistics (Statistiques)

Représente les statistiques d'un joueur.

| Attribut | Type | Description | Contraintes | Exemple |
|----------|------|-------------|-------------|---------|
| `id` | String/Number | Identifiant unique de la statistique | Clé primaire, requis | `"1"` ou `1` |
| `playerId` | Number | Identifiant du joueur | Requis, clé étrangère vers `players`, unique | `1` |
| `name` | String | Nom complet du joueur (dénormalisé) | Requis, max 100 caractères | `"Ceyhun SAPMAZ"` |
| `photo` | String / null | URL de la photo du joueur (dénormalisé) | Optionnel | `null` |
| `matchesPlayed` | Number | Nombre de matchs joués | Requis, entier positif ou 0 | `18` |
| `goals` | Number | Nombre de buts marqués | Requis, entier positif ou 0 | `0` |
| `assists` | Number | Nombre de passes décisives | Requis, entier positif ou 0 | `0` |
| `yellowCards` | Number | Nombre de cartons jaunes | Requis, entier positif ou 0 | `1` |
| `redCards` | Number | Nombre de cartons rouges | Requis, entier positif ou 0 | `0` |
| `cleanSheets` | Number | Nombre de clean sheets (pour gardiens) | Requis, entier positif ou 0 | `9` |
| `saves` | Number | Nombre d'arrêts (pour gardiens) | Requis, entier positif ou 0 | `52` |

**Relations :**
- Des statistiques appartiennent à un joueur (relation 1:1 avec `players`)

**Note :** Les champs `name` et `photo` sont dénormalisés pour améliorer les performances d'affichage. Ils devraient être synchronisés avec les données du joueur.

**Exemple complet :**
```json
{
  "id": "1",
  "playerId": 1,
  "name": "Ceyhun SAPMAZ",
  "photo": null,
  "matchesPlayed": 18,
  "goals": 0,
  "assists": 0,
  "yellowCards": 1,
  "redCards": 0,
  "cleanSheets": 9,
  "saves": 52
}
```

---

## 6. Conversations

Représente une conversation entre utilisateurs.

| Attribut | Type | Description | Contraintes | Exemple |
|----------|------|-------------|-------------|---------|
| `id` | String | Identifiant unique de la conversation | Clé primaire, requis | `"conv1"` ou `"f4a6"` |
| `userId` | String | Identifiant de l'utilisateur avec qui on converse | Requis, clé étrangère vers `players` | `"2"` |
| `firstName` | String | Prénom de l'utilisateur (dénormalisé) | Requis | `"Kenan"` |
| `lastName` | String | Nom de l'utilisateur (dénormalisé) | Requis | `"TEKBAS"` |
| `position` | String | Position du joueur (dénormalisé) | Optionnel | `"Milieu de terrain"` |
| `lastMessage` | String | Dernier message échangé | Optionnel, texte libre | `"Salut"` |
| `lastMessageTime` | String | Date du dernier message | Format : `YYYY-MM-DDTHH:mm:ss.sssZ` | `"2025-11-28T15:36:00.010Z"` |
| `unread` | Number | Nombre de messages non lus | Requis, entier positif ou 0 | `1` |
| `photo` | String / null | Photo de l'utilisateur (dénormalisé) | Optionnel | `null` |
| `isOnline` | Boolean | Indique si l'utilisateur est en ligne | Défaut : `false` | `false` |

**Relations :**
- Une conversation référence un utilisateur (relation N:1 avec `players`)
- Une conversation a plusieurs messages (relation 1:N avec `messages`)

**Note :** Cette structure est dénormalisée pour optimiser l'affichage de la liste des conversations. Dans une base de données relationnelle, une table `conversations` devrait contenir deux `userId` (expéditeur et destinataire).

**Exemple complet :**
```json
{
  "id": "conv1",
  "userId": "2",
  "firstName": "Kenan",
  "lastName": "TEKBAS",
  "position": "Milieu de terrain",
  "lastMessage": "Salut",
  "lastMessageTime": "2025-11-28T15:36:00.010Z",
  "unread": 1,
  "photo": null,
  "isOnline": false
}
```

---

## 7. Messages

Représente un message dans une conversation.

| Attribut | Type | Description | Contraintes | Exemple |
|----------|------|-------------|-------------|---------|
| `id` | String | Identifiant unique du message | Clé primaire, requis | `"msg1"` ou `"b7d3"` |
| `conversationId` | String | Identifiant de la conversation | Requis, clé étrangère vers `conversations` | `"conv1"` |
| `senderId` | String | Identifiant de l'expéditeur | Requis, clé étrangère vers `players` | `"1"` |
| `text` | String | Contenu du message | Requis, texte libre | `"Salut ! Ça te dit un match samedi ?"` |
| `timestamp` | String | Date et heure d'envoi du message | Format : `YYYY-MM-DDTHH:mm:ss.sssZ` | `"2024-12-01T14:00:00Z"` |

**Relations :**
- Un message appartient à une conversation (relation N:1 avec `conversations`)
- Un message est envoyé par un joueur (relation N:1 avec `players`)

**Exemple complet :**
```json
{
  "id": "msg1",
  "conversationId": "conv1",
  "senderId": "2",
  "text": "Salut ! Ça te dit un match samedi ?",
  "timestamp": "2024-12-01T14:00:00Z"
}
```

---

## 8. Enums et Valeurs Possibles

### 8.1 Status des matchs
- `"upcoming"` : Match à venir
- `"finished"` : Match terminé
- `"cancelled"` : Match annulé

### 8.2 Status des présences
- `"present"` : Présent
- `"absent"` : Absent
- `"pending"` : En attente de réponse

### 8.3 Positions des joueurs
- `"Gardien"` : Gardien de but
- `"Défenseur"` : Défenseur
- `"Milieu de terrain"` : Milieu de terrain
- `"Attaquant"` : Attaquant

### 8.4 Types de matchs
- `"5v5"` : Match 5 contre 5
- `"7v7"` : Match 7 contre 7
- `"11v11"` : Match 11 contre 11

### 8.5 Rôles des joueurs
- `"Joueur"` : Joueur standard
- `"Capitaine"` : Capitaine de l'équipe
- `"Admin"` : Administrateur

---

## 9. Relations entre Entités

```
Teams (1) ────────────< (N) Players
                            │
                            │ (1)
                            │
                            ├──> (N) Matches (createdBy)
                            │
                            │ (1)
                            │
                            ├──> (1) Statistics
                            │
                            │ (1)
                            │
                            ├──> (N) Attendances
                            │
                            │ (1)
                            │
                            └──> (N) Messages (senderId)

Matches (1) ────────────< (N) Attendances

Conversations (1) ─────< (N) Messages
```

---

## 10. Notes sur la Modélisation

### Dénormalisation
Certaines données sont dénormalisées pour améliorer les performances :
- `statistics.name` et `statistics.photo` : Copiés depuis `players`
- `conversations.firstName`, `conversations.lastName`, etc. : Copiés depuis `players`

### Identifiants
- Dans JSON Server, les identifiants peuvent être des strings ou des numbers
- Dans PostgreSQL, ils seront des entiers (SERIAL/BIGSERIAL) ou UUIDs

### Dates et Heures
- Tous les formats de date suivent la norme ISO 8601
- Les dates simples : `YYYY-MM-DD`
- Les dates avec heure : `YYYY-MM-DDTHH:mm:ss.sssZ` (UTC)

### Valeurs Nullables
- Les champs marqués comme `String / null` peuvent être `null`
- Dans PostgreSQL, cela correspond à `NULL`
- Les champs optionnels peuvent être omis dans les requêtes POST/PATCH

---

## 11. Contraintes Métier

1. **Un joueur ne peut avoir qu'une seule présence par match** : La combinaison `(matchId, playerId)` doit être unique dans la table `attendances`.

2. **Un joueur ne peut avoir qu'une seule statistique** : Relation 1:1 entre `players` et `statistics`.

3. **Le nombre de joueurs inscrits ne peut pas dépasser maxPlayers** : Contrainte à vérifier côté application.

4. **Un match terminé doit avoir un score** : Si `status = "finished"`, alors `score` ne peut pas être `null`.

5. **La date d'un match à venir doit être dans le futur** : Contrainte de validation.


