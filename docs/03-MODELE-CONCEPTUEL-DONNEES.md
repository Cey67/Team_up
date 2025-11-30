# Modèle Conceptuel de Données (MCD) - Team Up

Le Modèle Conceptuel de Données représente les entités et leurs relations de manière conceptuelle, indépendamment de l'implémentation technique.

---

## 1. Entités Principales

### PLAYER (Joueur)

- Appartient à une équipe (N:1)
- Crée des matchs (1:N)
- A une statistique (1:1)
- A des présences (1:N)
- Envoie des messages (1:N)

### TEAM (Équipe)

- Contient plusieurs joueurs (1:N)
- Organise plusieurs matchs (1:N)

### MATCH (Match)

- Appartient à une équipe (N:1)
- Est créé par un joueur (N:1)
- Contient plusieurs présences (1:N)

### ATTENDANCE (Présence)

- Concerne un match (N:1)
- Concerne un joueur (N:1)
- **Contrainte :** Un joueur ne peut avoir qu'une seule présence par match

### STATISTIC (Statistique)

- Appartient à un joueur (N:1)
- **Contrainte :** Relation 1:1 avec PLAYER

### CONVERSATION (Conversation)

> **⚠️ STATUT : Fonctionnalité mise en stand-by**
>
> L'entité CONVERSATION n'est **pas incluse dans le périmètre fonctionnel principal** du projet et a été mise en stand-by pour se concentrer sur les fonctionnalités core.

- Implique deux joueurs minimum (N:2)
- Contient plusieurs messages (1:N)

### MESSAGE (Message)

> **⚠️ STATUT : Fonctionnalité mise en stand-by**
>
> L'entité MESSAGE n'est **pas incluse dans le périmètre fonctionnel principal** du projet et a été mise en stand-by pour se concentrer sur les fonctionnalités core.

- Appartient à une conversation (N:1)
- Est envoyé par un joueur (N:1)

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

### TEAM ↔ PLAYER

**Type :** 1:N (Une équipe a plusieurs joueurs)  
**Nom :** APPARTIENT_À / CONTIENT  
**Attribut de liaison :** `teamId` dans PLAYER  
**Contraintes :** Un joueur doit appartenir à une équipe (obligatoire)

### TEAM ↔ MATCH

**Type :** 1:N (Une équipe organise plusieurs matchs)  
**Nom :** ORGANISE  
**Attribut de liaison :** `teamId` dans MATCH

### PLAYER ↔ MATCH

**Type :** N:1 (Plusieurs matchs créés par un joueur)  
**Nom :** CRÉE  
**Attribut de liaison :** `createdBy` dans MATCH

### PLAYER ↔ STATISTIC

**Type :** 1:1 (Un joueur a une seule statistique)  
**Nom :** POSSÈDE  
**Attribut de liaison :** `playerId` dans STATISTIC  
**Contraintes :** Relation 1:1 stricte

### MATCH ↔ ATTENDANCE

**Type :** 1:N (Un match a plusieurs présences)  
**Nom :** CONTIENT  
**Attribut de liaison :** `matchId` dans ATTENDANCE

### PLAYER ↔ ATTENDANCE

**Type :** 1:N (Un joueur a plusieurs présences)  
**Nom :** PARTICIPE_À  
**Attribut de liaison :** `playerId` dans ATTENDANCE  
**Contraintes :** Un joueur ne peut avoir qu'une seule présence par match (couple unique `matchId` + `playerId`)

### PLAYER ↔ CONVERSATION

> **⚠️ STATUT : Fonctionnalité mise en stand-by**

**Type :** N:N (Plusieurs joueurs dans plusieurs conversations)  
**Nom :** PARTICIPE_À  
**Table de liaison :** `conversation_participants` (en base de données)

### CONVERSATION ↔ MESSAGE

> **⚠️ STATUT : Fonctionnalité mise en stand-by**

**Type :** 1:N (Une conversation contient plusieurs messages)  
**Nom :** CONTIENT  
**Attribut de liaison :** `conversationId` dans MESSAGE

### PLAYER ↔ MESSAGE

> **⚠️ STATUT : Fonctionnalité mise en stand-by**

**Type :** 1:N (Un joueur envoie plusieurs messages)  
**Nom :** ENVOIE  
**Attribut de liaison :** `senderId` dans MESSAGE

---

## 4. Contraintes d'Intégrité

### Contraintes d'Intégrité Référentielle

- **Suppression en cascade :** Si un joueur est supprimé, ses statistiques et présences doivent être supprimées également (ou archivées).
- **Suppression en cascade :** Si un match est supprimé, toutes les présences liées doivent être supprimées.
- **Suppression en cascade :** Si une conversation est supprimée, tous les messages liés doivent être supprimés. _(⚠️ Fonctionnalité en stand-by)_
- **Restriction :** Un match ne peut pas être supprimé s'il a un statut "finished" (archivage obligatoire).

### Contraintes de Domaine

- **EMAIL :** Doit être au format email valide et unique.
- **DATE :** Les dates doivent être au format ISO 8601.
- **STATUS MATCH :** Ne peut être que "upcoming", "finished" ou "cancelled".
- **STATUS ATTENDANCE :** Ne peut être que "present", "absent" ou "pending".
- **POSITION :** Ne peut être que "Gardien", "Défenseur", "Milieu de terrain" ou "Attaquant".
- **TYPE MATCH :** Ne peut être que "5v5", "7v7" ou "11v11".

### Contraintes Fonctionnelles

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
