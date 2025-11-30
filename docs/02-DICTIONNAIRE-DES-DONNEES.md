# Dictionnaire des Données - Team Up

Ce document décrit les entités et leurs attributs utilisés dans l'application Team Up, avec des exemples JSON concrets.

---

## 1. Players (Joueurs)

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

**Attributs principaux :**

- `id` : Identifiant unique (String/Number)
- `firstName`, `lastName` : Prénom et nom (String, requis)
- `email` : Email unique (String, requis, format valide)
- `role` : Rôle dans l'équipe (voir enums)
- `isAdmin` : Statut administrateur (Boolean)
- `position` : Position sur le terrain (voir enums)
- `jerseyNumber` : Numéro de maillot (Number, optionnel)

---

## 2. Teams (Équipes)

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

**Attributs principaux :**

- `id` : Identifiant unique (String/Number)
- `name` : Nom de l'équipe (String, requis, max 100 caractères)
- `logo` : URL du logo (String/null, optionnel)
- `description` : Description de l'équipe (String, optionnel)

---

## 3. Matches (Matchs)

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

**Attributs principaux :**

- `id` : Identifiant unique (String)
- `date` : Date du match (String, format YYYY-MM-DD)
- `time` : Heure du match (String, format HH:mm)
- `location` : Lieu du match (String, requis)
- `type` : Type de match (voir enums)
- `maxPlayers` : Nombre maximum de joueurs (Number)
- `playersCount` : Nombre actuel de joueurs inscrits (Number, calculé)
- `status` : Statut du match (voir enums)
- `score` : Score du match (Object/null) - `{"teamA": 3, "teamB": 2}` ou `null`

---

## 4. Attendances (Présences)

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

**Attributs principaux :**

- `id` : Identifiant unique (String)
- `matchId` : Identifiant du match (String/Number)
- `playerId` : Identifiant du joueur (String/Number)
- `status` : Statut de présence (voir enums)
- `updatedAt` : Date de dernière mise à jour (String, ISO 8601)

**Contrainte :** Un joueur ne peut avoir qu'une seule présence par match (couple `matchId` + `playerId` unique).

---

## 5. Statistics (Statistiques)

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

**Attributs principaux :**

- `id` : Identifiant unique (String/Number)
- `playerId` : Identifiant du joueur (Number, unique)
- `name` : Nom complet du joueur (dénormalisé)
- `photo` : URL de la photo (dénormalisé)
- `matchesPlayed`, `goals`, `assists` : Statistiques de base (Number)
- `yellowCards`, `redCards` : Cartons (Number)
- `cleanSheets`, `saves` : Statistiques pour gardiens (Number)

**Note :** Les champs `name` et `photo` sont dénormalisés pour améliorer les performances d'affichage.

---

## 6. Conversations

> **⚠️ STATUT : Fonctionnalité mise en stand-by**
>
> Les entités Conversations et Messages ne sont **pas incluses dans le périmètre fonctionnel principal** du projet et ont été mises en stand-by pour se concentrer sur les fonctionnalités core.
>
> Cette fonctionnalité pourra être réactivée dans une phase 2 après validation du MVP.

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

**Attributs principaux :**

- `id` : Identifiant unique (String)
- `userId` : Identifiant de l'utilisateur avec qui on converse (String)
- `firstName`, `lastName`, `position`, `photo` : Données dénormalisées du joueur
- `lastMessage` : Dernier message échangé (String)
- `lastMessageTime` : Date du dernier message (String, ISO 8601)
- `unread` : Nombre de messages non lus (Number)
- `isOnline` : Statut en ligne (Boolean)

**Note :** Structure dénormalisée pour optimiser l'affichage. En base de données relationnelle, utiliser une table de liaison pour les participants.

---

## 7. Messages

> **⚠️ STATUT : Fonctionnalité mise en stand-by**
>
> Voir section 6 (Conversations) pour plus de détails.

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

**Attributs principaux :**

- `id` : Identifiant unique (String)
- `conversationId` : Identifiant de la conversation (String)
- `senderId` : Identifiant de l'expéditeur (String)
- `text` : Contenu du message (String, requis)
- `timestamp` : Date et heure d'envoi (String, ISO 8601)

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
