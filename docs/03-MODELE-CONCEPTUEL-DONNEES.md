# Modèle Conceptuel de Données (MCD) - Team Up

Le Modèle Conceptuel de Données représente les entités et leurs relations de manière conceptuelle, indépendamment de l'implémentation technique.

---

## 1. Entités et Attributs

### 1.1 Entité : PLAYER (Joueur)

**Description :** Représente un joueur membre d'une équipe.

**Attributs :**
- `id` (identifiant)
- `firstName` (prénom)
- `lastName` (nom)
- `email` (email)
- `phone` (téléphone)
- `dateOfBirth` (date de naissance)
- `photo` (photo de profil)
- `position` (position sur le terrain)
- `jerseyNumber` (numéro de maillot)
- `role` (rôle dans l'équipe)
- `isAdmin` (statut administrateur)

**Cardinalités :**
- Un joueur appartient à **une seule** équipe (N:1)
- Un joueur peut créer **plusieurs** matchs (1:N)
- Un joueur a **une seule** statistique (1:1)
- Un joueur peut avoir **plusieurs** présences (1:N)
- Un joueur peut envoyer **plusieurs** messages (1:N)

---

### 1.2 Entité : TEAM (Équipe)

**Description :** Représente une équipe de football.

**Attributs :**
- `id` (identifiant)
- `name` (nom de l'équipe)
- `logo` (logo de l'équipe)
- `description` (description)
- `createdAt` (date de création)

**Cardinalités :**
- Une équipe a **plusieurs** joueurs (1:N)
- Une équipe a **plusieurs** matchs (1:N)

---

### 1.3 Entité : MATCH (Match)

**Description :** Représente un match de football.

**Attributs :**
- `id` (identifiant)
- `date` (date du match)
- `time` (heure du match)
- `location` (lieu)
- `type` (type de match : 5v5, 7v7, 11v11)
- `maxPlayers` (nombre maximum de joueurs)
- `playersCount` (nombre de joueurs inscrits)
- `status` (statut : upcoming, finished, cancelled)
- `score` (score du match)
- `createdAt` (date de création)

**Cardinalités :**
- Un match appartient à **une seule** équipe (N:1)
- Un match est créé par **un seul** joueur (N:1)
- Un match a **plusieurs** présences (1:N)

---

### 1.4 Entité : ATTENDANCE (Présence)

**Description :** Représente la présence d'un joueur à un match.

**Attributs :**
- `id` (identifiant)
- `status` (statut : present, absent, pending)
- `updatedAt` (date de mise à jour)

**Cardinalités :**
- Une présence concerne **un seul** match (N:1)
- Une présence concerne **un seul** joueur (N:1)

**Contrainte :** Un joueur ne peut avoir qu'une seule présence par match (couple unique `matchId` + `playerId`).

---

### 1.5 Entité : STATISTIC (Statistique)

**Description :** Représente les statistiques d'un joueur.

**Attributs :**
- `id` (identifiant)
- `matchesPlayed` (nombre de matchs joués)
- `goals` (nombre de buts)
- `assists` (nombre de passes décisives)
- `yellowCards` (nombre de cartons jaunes)
- `redCards` (nombre de cartons rouges)
- `cleanSheets` (nombre de clean sheets)
- `saves` (nombre d'arrêts)

**Cardinalités :**
- Des statistiques appartiennent à **un seul** joueur (N:1)

**Contrainte :** Relation 1:1 avec PLAYER.

---

### 1.6 Entité : CONVERSATION (Conversation)

**Description :** Représente une conversation entre deux utilisateurs.

**Attributs :**
- `id` (identifiant)
- `lastMessage` (dernier message)
- `lastMessageTime` (date du dernier message)
- `unread` (nombre de messages non lus)
- `createdAt` (date de création)

**Cardinalités :**
- Une conversation implique **deux** joueurs (N:2)
- Une conversation contient **plusieurs** messages (1:N)

**Note :** Dans l'implémentation JSON actuelle, la conversation est vue du point de vue d'un seul utilisateur. En base de données relationnelle, il faudra une table de liaison pour les participants.

---

### 1.7 Entité : MESSAGE (Message)

**Description :** Représente un message dans une conversation.

**Attributs :**
- `id` (identifiant)
- `text` (contenu du message)
- `timestamp` (date et heure d'envoi)

**Cardinalités :**
- Un message appartient à **une seule** conversation (N:1)
- Un message est envoyé par **un seul** joueur (N:1)

---

## 2. Diagramme des Relations

```
┌─────────────────┐
│     TEAM        │
│  (Équipe)       │
├─────────────────┤
│ id              │
│ name            │
│ logo            │
│ description     │
│ createdAt       │
└────────┬────────┘
         │
         │ 1
         │
         │ N
┌────────▼────────┐         ┌─────────────────┐
│    PLAYER       │         │     MATCH       │
│   (Joueur)      │         │    (Match)      │
├─────────────────┤         ├─────────────────┤
│ id              │◄────────┤ id              │
│ firstName       │  N      │ date            │
│ lastName        │  │      │ time            │
│ email           │  │      │ location        │
│ phone           │  │      │ type            │
│ dateOfBirth     │  │      │ maxPlayers      │
│ photo           │  │      │ playersCount    │
│ position        │  │      │ status          │
│ jerseyNumber    │  │      │ score           │
│ role            │  │      │ createdAt       │
│ isAdmin         │  │      └────────┬────────┘
│ teamId          │  │               │
└────────┬────────┘  │               │ 1
         │           │               │
         │ 1         │               │ N
         │           │               │
         │ 1         │      ┌────────▼────────┐
         │           │      │   ATTENDANCE    │
         │           │      │   (Présence)    │
         │           │      ├─────────────────┤
         │           │      │ id              │
         │           │      │ matchId         │
         │           │      │ playerId        │
         │           │      │ status          │
         │           │      │ updatedAt       │
         │           │      └─────────────────┘
         │           │
         │           │
         │           │ 1
         │           │
┌────────▼────────┐ │
│   STATISTIC     │ │
│  (Statistique)  │ │
├─────────────────┤ │
│ id              │ │
│ playerId        │◄┘
│ matchesPlayed   │
│ goals           │
│ assists         │
│ yellowCards     │
│ redCards        │
│ cleanSheets     │
│ saves           │
└─────────────────┘

┌─────────────────┐         ┌─────────────────┐
│  CONVERSATION   │         │    MESSAGE      │
│  (Conversation) │         │   (Message)     │
├─────────────────┤         ├─────────────────┤
│ id              │◄────────┤ id              │
│ lastMessage     │  N      │ conversationId  │
│ lastMessageTime │  │      │ senderId        │
│ unread          │  │      │ text            │
│ createdAt       │  │      │ timestamp       │
└────────┬────────┘  │      └────────┬────────┘
         │           │               │
         │ N         │               │ N
         │           │               │
         │           │               │ 1
         │           │               │
         │           └───────────────┘
         │
         │ N
         │
         │
┌────────▼────────┐
│    PLAYER       │
│   (Joueur)      │
└─────────────────┘
```

---

## 3. Dictionnaire des Relations

### 3.1 Relation : TEAM ↔ PLAYER

**Type :** Association 1:N (Une équipe a plusieurs joueurs)

**Nom :** APPARTIENT_À / CONTIENT

**Description :** Un joueur appartient à une seule équipe, une équipe contient plusieurs joueurs.

**Attribut de liaison :** `teamId` dans PLAYER

**Contraintes :**
- Un joueur doit appartenir à une équipe (obligatoire)
- Un joueur ne peut appartenir qu'à une seule équipe

---

### 3.2 Relation : TEAM ↔ MATCH

**Type :** Association 1:N (Une équipe organise plusieurs matchs)

**Nom :** ORGANISE

**Description :** Une équipe organise plusieurs matchs.

**Attribut de liaison :** `teamId` dans MATCH

**Contraintes :**
- Un match doit être organisé par une équipe (obligatoire)

---

### 3.3 Relation : PLAYER ↔ MATCH

**Type :** Association N:1 (Plusieurs matchs créés par un joueur)

**Nom :** CRÉE

**Description :** Un joueur peut créer plusieurs matchs.

**Attribut de liaison :** `createdBy` dans MATCH

**Contraintes :**
- Un match doit avoir un créateur (obligatoire)

---

### 3.4 Relation : PLAYER ↔ STATISTIC

**Type :** Association 1:1 (Un joueur a une seule statistique)

**Nom :** POSSÈDE

**Description :** Chaque joueur a une seule statistique.

**Attribut de liaison :** `playerId` dans STATISTIC

**Contraintes :**
- Relation 1:1 (un joueur a une seule statistique, une statistique appartient à un seul joueur)
- La statistique peut être créée automatiquement à la création du joueur

---

### 3.5 Relation : MATCH ↔ ATTENDANCE

**Type :** Association 1:N (Un match a plusieurs présences)

**Nom :** CONTIENT

**Description :** Un match contient plusieurs présences de joueurs.

**Attribut de liaison :** `matchId` dans ATTENDANCE

**Contraintes :**
- Une présence doit être liée à un match (obligatoire)

---

### 3.6 Relation : PLAYER ↔ ATTENDANCE

**Type :** Association 1:N (Un joueur a plusieurs présences)

**Nom :** PARTICIPE_À

**Description :** Un joueur peut participer à plusieurs matchs (présences).

**Attribut de liaison :** `playerId` dans ATTENDANCE

**Contraintes :**
- Une présence doit être liée à un joueur (obligatoire)
- Un joueur ne peut avoir qu'une seule présence par match (couple unique `matchId` + `playerId`)

---

### 3.7 Relation : PLAYER ↔ CONVERSATION

**Type :** Association N:N (Plusieurs joueurs dans plusieurs conversations)

**Nom :** PARTICIPE_À

**Description :** Une conversation implique deux joueurs minimum.

**Table de liaison :** `conversation_participants` (à créer en base de données)

**Contraintes :**
- Une conversation doit avoir au moins deux participants
- Un joueur peut avoir plusieurs conversations

---

### 3.8 Relation : CONVERSATION ↔ MESSAGE

**Type :** Association 1:N (Une conversation contient plusieurs messages)

**Nom :** CONTIENT

**Description :** Une conversation contient plusieurs messages.

**Attribut de liaison :** `conversationId` dans MESSAGE

**Contraintes :**
- Un message doit appartenir à une conversation (obligatoire)

---

### 3.9 Relation : PLAYER ↔ MESSAGE

**Type :** Association 1:N (Un joueur envoie plusieurs messages)

**Nom :** ENVOIE

**Description :** Un joueur peut envoyer plusieurs messages.

**Attribut de liaison :** `senderId` dans MESSAGE

**Contraintes :**
- Un message doit avoir un expéditeur (obligatoire)

---

## 4. Contraintes d'Intégrité

### 4.1 Contraintes d'Intégrité Référentielle

- **Suppression en cascade :** Si un joueur est supprimé, ses statistiques et présences doivent être supprimées également (ou archivées).
- **Suppression en cascade :** Si un match est supprimé, toutes les présences liées doivent être supprimées.
- **Suppression en cascade :** Si une conversation est supprimée, tous les messages liés doivent être supprimés.
- **Restriction :** Un match ne peut pas être supprimé s'il a un statut "finished" (archivage obligatoire).

### 4.2 Contraintes de Domaine

- **EMAIL :** Doit être au format email valide et unique.
- **DATE :** Les dates doivent être au format ISO 8601.
- **STATUS MATCH :** Ne peut être que "upcoming", "finished" ou "cancelled".
- **STATUS ATTENDANCE :** Ne peut être que "present", "absent" ou "pending".
- **POSITION :** Ne peut être que "Gardien", "Défenseur", "Milieu de terrain" ou "Attaquant".
- **TYPE MATCH :** Ne peut être que "5v5", "7v7" ou "11v11".

### 4.3 Contraintes Fonctionnelles

- **Unicité :** Un joueur ne peut avoir qu'une seule présence par match.
- **Unicité :** Un joueur ne peut avoir qu'une seule statistique.
- **Unicité :** Un email doit être unique dans la base de données.

---

## 5. Règles de Gestion Métier

1. **Un joueur doit appartenir à une équipe** avant de pouvoir créer ou participer à des matchs.

2. **Un match à venir** ne peut pas être créé avec une date dans le passé.

3. **Le nombre de joueurs inscrits** (`playersCount`) ne peut pas dépasser `maxPlayers` pour un match.

4. **Un match terminé** (`status = "finished"`) doit avoir un score renseigné.

5. **Un joueur ne peut modifier** que ses propres informations, sauf s'il est administrateur.

6. **Seul un administrateur** peut modifier ou supprimer les informations d'autres joueurs.

7. **Seul le créateur d'un match ou un administrateur** peut modifier ou supprimer un match.

8. **Les statistiques sont calculées automatiquement** à partir des matchs joués et des performances.

---

## 6. Notes sur la Modélisation

### Dénormalisation

Certaines données sont dénormalisées pour améliorer les performances :
- Les informations du joueur dans `statistics` (name, photo)
- Les informations du joueur dans `conversations` (firstName, lastName, position, photo)

Dans une base de données relationnelle, ces données seraient normalisées et récupérées via des jointures.

### Relations Implicites

- La relation entre PLAYER et TEAM est gérée via l'attribut `teamId` dans PLAYER.
- La relation entre MATCH et PLAYER (créateur) est gérée via l'attribut `createdBy` dans MATCH.

### Évolutions Futures

- Ajout d'une table `team_members` pour gérer les appartenances multiples (si un joueur peut appartenir à plusieurs équipes).
- Ajout d'une table `match_teams` pour gérer les matchs inter-équipes avec deux équipes.
- Ajout d'une table `conversation_participants` pour gérer proprement les conversations multi-participants.


