# Modèle Logique de Données (MLD) - Team Up

## Base de données : PostgreSQL

Le Modèle Logique de Données décrit la structure des tables, leurs colonnes, types de données, clés primaires, clés étrangères et contraintes pour PostgreSQL.

---

## 1. Schéma de la Base de Données

### 1.1 Table : `teams`

**Description :** Stocke les informations des équipes.

| Colonne       | Type         | Contraintes             | Description                    |
| ------------- | ------------ | ----------------------- | ------------------------------ |
| `id`          | SERIAL       | PRIMARY KEY, NOT NULL   | Identifiant unique de l'équipe |
| `name`        | VARCHAR(100) | NOT NULL, UNIQUE        | Nom de l'équipe                |
| `logo`        | VARCHAR(500) | NULL                    | URL du logo de l'équipe        |
| `description` | TEXT         | NULL                    | Description de l'équipe        |
| `created_at`  | TIMESTAMP    | NOT NULL, DEFAULT NOW() | Date de création de l'équipe   |
| `updated_at`  | TIMESTAMP    | NULL, DEFAULT NOW()     | Date de dernière mise à jour   |

**Index :**

- Index unique sur `name`
- Index sur `created_at`

**Contraintes :**

- `name` doit être unique
- `created_at` ne peut pas être dans le futur

---

### 1.2 Table : `players`

**Description :** Stocke les informations des joueurs.

| Colonne         | Type         | Contraintes                      | Description                   |
| --------------- | ------------ | -------------------------------- | ----------------------------- |
| `id`            | SERIAL       | PRIMARY KEY, NOT NULL            | Identifiant unique du joueur  |
| `team_id`       | INTEGER      | NOT NULL, FOREIGN KEY (teams.id) | Référence vers l'équipe       |
| `first_name`    | VARCHAR(50)  | NOT NULL                         | Prénom du joueur              |
| `last_name`     | VARCHAR(50)  | NOT NULL                         | Nom de famille                |
| `email`         | VARCHAR(255) | NOT NULL, UNIQUE                 | Adresse email                 |
| `password_hash` | VARCHAR(255) | NOT NULL                         | Hash du mot de passe (bcrypt) |
| `phone`         | VARCHAR(20)  | NULL                             | Numéro de téléphone           |
| `date_of_birth` | DATE         | NULL                             | Date de naissance             |
| `photo`         | VARCHAR(500) | NULL                             | URL de la photo de profil     |
| `position`      | VARCHAR(50)  | NULL                             | Position sur le terrain       |
| `jersey_number` | INTEGER      | NULL                             | Numéro de maillot             |
| `role`          | VARCHAR(20)  | NOT NULL, DEFAULT 'Joueur'       | Rôle dans l'équipe            |
| `is_admin`      | BOOLEAN      | NOT NULL, DEFAULT FALSE          | Statut administrateur         |
| `created_at`    | TIMESTAMP    | NOT NULL, DEFAULT NOW()          | Date de création              |
| `updated_at`    | TIMESTAMP    | NULL, DEFAULT NOW()              | Date de dernière mise à jour  |

**Index :**

- Index unique sur `email`
- Index sur `team_id`
- Index sur `role`
- Index sur `is_admin`

**Contraintes :**

- `email` doit être unique et au format email valide
- `team_id` doit référencer une équipe existante
- `position` doit être dans : 'Gardien', 'Défenseur', 'Milieu de terrain', 'Attaquant'
- `role` doit être dans : 'Joueur', 'Capitaine', 'Admin'
- `jersey_number` doit être positif ou NULL
- `date_of_birth` ne peut pas être dans le futur

**Clé étrangère :**

- `team_id` → `teams(id)` ON DELETE RESTRICT

---

### 1.3 Table : `matches`

**Description :** Stocke les informations des matchs.

| Colonne         | Type         | Contraintes                        | Description                       |
| --------------- | ------------ | ---------------------------------- | --------------------------------- |
| `id`            | SERIAL       | PRIMARY KEY, NOT NULL              | Identifiant unique du match       |
| `team_id`       | INTEGER      | NOT NULL, FOREIGN KEY (teams.id)   | Référence vers l'équipe           |
| `created_by`    | INTEGER      | NOT NULL, FOREIGN KEY (players.id) | Référence vers le créateur        |
| `date`          | DATE         | NOT NULL                           | Date du match                     |
| `time`          | TIME         | NOT NULL                           | Heure du match                    |
| `location`      | VARCHAR(200) | NOT NULL                           | Lieu du match                     |
| `type`          | VARCHAR(10)  | NOT NULL                           | Type de match (5v5, 7v7, 11v11)   |
| `max_players`   | INTEGER      | NOT NULL                           | Nombre maximum de joueurs         |
| `players_count` | INTEGER      | NOT NULL, DEFAULT 0                | Nombre actuel de joueurs inscrits |
| `status`        | VARCHAR(20)  | NOT NULL, DEFAULT 'upcoming'       | Statut du match                   |
| `score_team_a`  | INTEGER      | NULL                               | Score de l'équipe A               |
| `score_team_b`  | INTEGER      | NULL                               | Score de l'équipe B               |
| `created_at`    | TIMESTAMP    | NOT NULL, DEFAULT NOW()            | Date de création                  |
| `updated_at`    | TIMESTAMP    | NULL, DEFAULT NOW()                | Date de dernière mise à jour      |

**Index :**

- Index sur `team_id`
- Index sur `created_by`
- Index sur `date`
- Index sur `status`
- Index composite sur `(date, status)`

**Contraintes :**

- `type` doit être dans : '5v5', '7v7', '11v11'
- `status` doit être dans : 'upcoming', 'finished', 'cancelled'
- `max_players` doit être positif
- `players_count` doit être entre 0 et `max_players`
- Si `status = 'finished'`, alors `score_team_a` et `score_team_b` ne peuvent pas être NULL
- `date` ne peut pas être dans le passé (pour les nouveaux matchs)

**Clés étrangères :**

- `team_id` → `teams(id)` ON DELETE RESTRICT
- `created_by` → `players(id)` ON DELETE RESTRICT

---

### 1.4 Table : `attendances`

**Description :** Stocke les présences des joueurs aux matchs.

| Colonne      | Type        | Contraintes                        | Description                       |
| ------------ | ----------- | ---------------------------------- | --------------------------------- |
| `id`         | SERIAL      | PRIMARY KEY, NOT NULL              | Identifiant unique de la présence |
| `match_id`   | INTEGER     | NOT NULL, FOREIGN KEY (matches.id) | Référence vers le match           |
| `player_id`  | INTEGER     | NOT NULL, FOREIGN KEY (players.id) | Référence vers le joueur          |
| `status`     | VARCHAR(20) | NOT NULL, DEFAULT 'pending'        | Statut de présence                |
| `created_at` | TIMESTAMP   | NOT NULL, DEFAULT NOW()            | Date de création                  |
| `updated_at` | TIMESTAMP   | NULL, DEFAULT NOW()                | Date de dernière mise à jour      |

**Index :**

- Index sur `match_id`
- Index sur `player_id`
- Index composite unique sur `(match_id, player_id)`

**Contraintes :**

- `status` doit être dans : 'present', 'absent', 'pending'
- Un joueur ne peut avoir qu'une seule présence par match (couple unique `match_id` + `player_id`)

**Clés étrangères :**

- `match_id` → `matches(id)` ON DELETE CASCADE
- `player_id` → `players(id)` ON DELETE CASCADE

---

### 1.5 Table : `statistics`

**Description :** Stocke les statistiques des joueurs.

| Colonne          | Type      | Contraintes                                | Description                          |
| ---------------- | --------- | ------------------------------------------ | ------------------------------------ |
| `id`             | SERIAL    | PRIMARY KEY, NOT NULL                      | Identifiant unique de la statistique |
| `player_id`      | INTEGER   | NOT NULL, UNIQUE, FOREIGN KEY (players.id) | Référence vers le joueur             |
| `matches_played` | INTEGER   | NOT NULL, DEFAULT 0                        | Nombre de matchs joués               |
| `goals`          | INTEGER   | NOT NULL, DEFAULT 0                        | Nombre de buts marqués               |
| `assists`        | INTEGER   | NOT NULL, DEFAULT 0                        | Nombre de passes décisives           |
| `yellow_cards`   | INTEGER   | NOT NULL, DEFAULT 0                        | Nombre de cartons jaunes             |
| `red_cards`      | INTEGER   | NOT NULL, DEFAULT 0                        | Nombre de cartons rouges             |
| `clean_sheets`   | INTEGER   | NOT NULL, DEFAULT 0                        | Nombre de clean sheets               |
| `saves`          | INTEGER   | NOT NULL, DEFAULT 0                        | Nombre d'arrêts                      |
| `created_at`     | TIMESTAMP | NOT NULL, DEFAULT NOW()                    | Date de création                     |
| `updated_at`     | TIMESTAMP | NULL, DEFAULT NOW()                        | Date de dernière mise à jour         |

**Index :**

- Index unique sur `player_id`
- Index sur `goals` (pour le classement)
- Index sur `assists` (pour le classement)

**Contraintes :**

- Tous les champs numériques doivent être >= 0
- Relation 1:1 avec `players` (via `player_id` UNIQUE)

**Clé étrangère :**

- `player_id` → `players(id)` ON DELETE CASCADE

---

### 1.6 Table : `conversations`

> **⚠️ STATUT : Fonctionnalité mise en stand-by**
>
> La table `conversations` et les tables associées (`conversation_participants`, `messages`) ne sont **pas incluses dans le périmètre fonctionnel principal** du projet et ont été mises en stand-by pour se concentrer sur les fonctionnalités core.
>
> Cette fonctionnalité pourra être réactivée dans une phase 2 après validation du MVP.

**Description :** Stocke les conversations entre utilisateurs.

| Colonne             | Type      | Contraintes             | Description                           |
| ------------------- | --------- | ----------------------- | ------------------------------------- |
| `id`                | SERIAL    | PRIMARY KEY, NOT NULL   | Identifiant unique de la conversation |
| `last_message`      | TEXT      | NULL                    | Dernier message échangé               |
| `last_message_time` | TIMESTAMP | NULL                    | Date du dernier message               |
| `created_at`        | TIMESTAMP | NOT NULL, DEFAULT NOW() | Date de création                      |
| `updated_at`        | TIMESTAMP | NULL, DEFAULT NOW()     | Date de dernière mise à jour          |

**Index :**

- Index sur `last_message_time` (pour trier par dernière activité)

**Note :** Les participants sont gérés dans la table `conversation_participants`.

---

### 1.7 Table : `conversation_participants`

> **⚠️ STATUT : Fonctionnalité mise en stand-by**
>
> Voir section 1.6 (conversations) pour plus de détails.

**Description :** Table de liaison entre conversations et joueurs.

| Colonne           | Type      | Contraintes                              | Description                    |
| ----------------- | --------- | ---------------------------------------- | ------------------------------ |
| `id`              | SERIAL    | PRIMARY KEY, NOT NULL                    | Identifiant unique             |
| `conversation_id` | INTEGER   | NOT NULL, FOREIGN KEY (conversations.id) | Référence vers la conversation |
| `player_id`       | INTEGER   | NOT NULL, FOREIGN KEY (players.id)       | Référence vers le joueur       |
| `unread_count`    | INTEGER   | NOT NULL, DEFAULT 0                      | Nombre de messages non lus     |
| `is_online`       | BOOLEAN   | NOT NULL, DEFAULT FALSE                  | Statut en ligne                |
| `joined_at`       | TIMESTAMP | NOT NULL, DEFAULT NOW()                  | Date d'ajout à la conversation |

**Index :**

- Index sur `conversation_id`
- Index sur `player_id`
- Index composite unique sur `(conversation_id, player_id)`

**Contraintes :**

- `unread_count` doit être >= 0
- Un joueur ne peut être qu'une seule fois dans une conversation

**Clés étrangères :**

- `conversation_id` → `conversations(id)` ON DELETE CASCADE
- `player_id` → `players(id)` ON DELETE CASCADE

---

### 1.8 Table : `messages`

> **⚠️ STATUT : Fonctionnalité mise en stand-by**
>
> Voir section 1.6 (conversations) pour plus de détails.

**Description :** Stocke les messages des conversations.

| Colonne           | Type      | Contraintes                              | Description                    |
| ----------------- | --------- | ---------------------------------------- | ------------------------------ |
| `id`              | SERIAL    | PRIMARY KEY, NOT NULL                    | Identifiant unique du message  |
| `conversation_id` | INTEGER   | NOT NULL, FOREIGN KEY (conversations.id) | Référence vers la conversation |
| `sender_id`       | INTEGER   | NOT NULL, FOREIGN KEY (players.id)       | Référence vers l'expéditeur    |
| `text`            | TEXT      | NOT NULL                                 | Contenu du message             |
| `created_at`      | TIMESTAMP | NOT NULL, DEFAULT NOW()                  | Date et heure d'envoi          |

**Index :**

- Index sur `conversation_id`
- Index sur `sender_id`
- Index composite sur `(conversation_id, created_at)` (pour trier les messages)

**Contraintes :**

- `text` ne peut pas être vide
- `created_at` ne peut pas être dans le futur

**Clés étrangères :**

- `conversation_id` → `conversations(id)` ON DELETE CASCADE
- `sender_id` → `players(id)` ON DELETE RESTRICT

---

## 2. Script SQL de Création

```sql
-- ============================================
-- Script de création de la base de données
-- Team Up - PostgreSQL
-- ============================================

-- Suppression des tables si elles existent (dans l'ordre inverse des dépendances)
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS conversation_participants CASCADE;
DROP TABLE IF EXISTS conversations CASCADE;
DROP TABLE IF EXISTS statistics CASCADE;
DROP TABLE IF EXISTS attendances CASCADE;
DROP TABLE IF EXISTS matches CASCADE;
DROP TABLE IF EXISTS players CASCADE;
DROP TABLE IF EXISTS teams CASCADE;

-- Extension pour UUID (optionnel)
-- CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- Table : teams
-- ============================================
CREATE TABLE teams (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    logo VARCHAR(500) NULL,
    description TEXT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL DEFAULT NOW(),
    CONSTRAINT chk_teams_created_at CHECK (created_at <= NOW())
);

CREATE INDEX idx_teams_name ON teams(name);
CREATE INDEX idx_teams_created_at ON teams(created_at);

-- ============================================
-- Table : players
-- ============================================
CREATE TABLE players (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    phone VARCHAR(20) NULL,
    date_of_birth DATE NULL,
    photo VARCHAR(500) NULL,
    position VARCHAR(50) NULL,
    jersey_number INTEGER NULL,
    role VARCHAR(20) NOT NULL DEFAULT 'Joueur',
    is_admin BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL DEFAULT NOW(),
    CONSTRAINT fk_players_team FOREIGN KEY (team_id)
        REFERENCES teams(id) ON DELETE RESTRICT,
    CONSTRAINT chk_players_email_format CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT chk_players_position CHECK (position IN ('Gardien', 'Défenseur', 'Milieu de terrain', 'Attaquant') OR position IS NULL),
    CONSTRAINT chk_players_role CHECK (role IN ('Joueur', 'Capitaine', 'Admin')),
    CONSTRAINT chk_players_jersey_number CHECK (jersey_number > 0 OR jersey_number IS NULL),
    CONSTRAINT chk_players_date_of_birth CHECK (date_of_birth <= CURRENT_DATE)
);

CREATE UNIQUE INDEX idx_players_email ON players(email);
CREATE INDEX idx_players_team_id ON players(team_id);
CREATE INDEX idx_players_role ON players(role);
CREATE INDEX idx_players_is_admin ON players(is_admin);

-- ============================================
-- Table : matches
-- ============================================
CREATE TABLE matches (
    id SERIAL PRIMARY KEY,
    team_id INTEGER NOT NULL,
    created_by INTEGER NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    location VARCHAR(200) NOT NULL,
    type VARCHAR(10) NOT NULL,
    max_players INTEGER NOT NULL,
    players_count INTEGER NOT NULL DEFAULT 0,
    status VARCHAR(20) NOT NULL DEFAULT 'upcoming',
    score_team_a INTEGER NULL,
    score_team_b INTEGER NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL DEFAULT NOW(),
    CONSTRAINT fk_matches_team FOREIGN KEY (team_id)
        REFERENCES teams(id) ON DELETE RESTRICT,
    CONSTRAINT fk_matches_created_by FOREIGN KEY (created_by)
        REFERENCES players(id) ON DELETE RESTRICT,
    CONSTRAINT chk_matches_type CHECK (type IN ('5v5', '7v7', '11v11')),
    CONSTRAINT chk_matches_status CHECK (status IN ('upcoming', 'finished', 'cancelled')),
    CONSTRAINT chk_matches_max_players CHECK (max_players > 0),
    CONSTRAINT chk_matches_players_count CHECK (players_count >= 0 AND players_count <= max_players),
    CONSTRAINT chk_matches_score_finished CHECK (
        (status = 'finished' AND score_team_a IS NOT NULL AND score_team_b IS NOT NULL)
        OR (status != 'finished')
    )
);

CREATE INDEX idx_matches_team_id ON matches(team_id);
CREATE INDEX idx_matches_created_by ON matches(created_by);
CREATE INDEX idx_matches_date ON matches(date);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_date_status ON matches(date, status);

-- ============================================
-- Table : attendances
-- ============================================
CREATE TABLE attendances (
    id SERIAL PRIMARY KEY,
    match_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL DEFAULT NOW(),
    CONSTRAINT fk_attendances_match FOREIGN KEY (match_id)
        REFERENCES matches(id) ON DELETE CASCADE,
    CONSTRAINT fk_attendances_player FOREIGN KEY (player_id)
        REFERENCES players(id) ON DELETE CASCADE,
    CONSTRAINT chk_attendances_status CHECK (status IN ('present', 'absent', 'pending')),
    CONSTRAINT uk_attendances_match_player UNIQUE (match_id, player_id)
);

CREATE INDEX idx_attendances_match_id ON attendances(match_id);
CREATE INDEX idx_attendances_player_id ON attendances(player_id);

-- ============================================
-- Table : statistics
-- ============================================
CREATE TABLE statistics (
    id SERIAL PRIMARY KEY,
    player_id INTEGER NOT NULL UNIQUE,
    matches_played INTEGER NOT NULL DEFAULT 0,
    goals INTEGER NOT NULL DEFAULT 0,
    assists INTEGER NOT NULL DEFAULT 0,
    yellow_cards INTEGER NOT NULL DEFAULT 0,
    red_cards INTEGER NOT NULL DEFAULT 0,
    clean_sheets INTEGER NOT NULL DEFAULT 0,
    saves INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL DEFAULT NOW(),
    CONSTRAINT fk_statistics_player FOREIGN KEY (player_id)
        REFERENCES players(id) ON DELETE CASCADE,
    CONSTRAINT chk_statistics_matches_played CHECK (matches_played >= 0),
    CONSTRAINT chk_statistics_goals CHECK (goals >= 0),
    CONSTRAINT chk_statistics_assists CHECK (assists >= 0),
    CONSTRAINT chk_statistics_yellow_cards CHECK (yellow_cards >= 0),
    CONSTRAINT chk_statistics_red_cards CHECK (red_cards >= 0),
    CONSTRAINT chk_statistics_clean_sheets CHECK (clean_sheets >= 0),
    CONSTRAINT chk_statistics_saves CHECK (saves >= 0)
);

CREATE UNIQUE INDEX idx_statistics_player_id ON statistics(player_id);
CREATE INDEX idx_statistics_goals ON statistics(goals DESC);
CREATE INDEX idx_statistics_assists ON statistics(assists DESC);

-- ============================================
-- Table : conversations
-- ============================================
CREATE TABLE conversations (
    id SERIAL PRIMARY KEY,
    last_message TEXT NULL,
    last_message_time TIMESTAMP NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP NULL DEFAULT NOW()
);

CREATE INDEX idx_conversations_last_message_time ON conversations(last_message_time DESC);

-- ============================================
-- Table : conversation_participants
-- ============================================
CREATE TABLE conversation_participants (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL,
    player_id INTEGER NOT NULL,
    unread_count INTEGER NOT NULL DEFAULT 0,
    is_online BOOLEAN NOT NULL DEFAULT FALSE,
    joined_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_conv_part_conversation FOREIGN KEY (conversation_id)
        REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_conv_part_player FOREIGN KEY (player_id)
        REFERENCES players(id) ON DELETE CASCADE,
    CONSTRAINT chk_conv_part_unread_count CHECK (unread_count >= 0),
    CONSTRAINT uk_conv_part_conversation_player UNIQUE (conversation_id, player_id)
);

CREATE INDEX idx_conv_part_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX idx_conv_part_player_id ON conversation_participants(player_id);

-- ============================================
-- Table : messages
-- ============================================
CREATE TABLE messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER NOT NULL,
    sender_id INTEGER NOT NULL,
    text TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    CONSTRAINT fk_messages_conversation FOREIGN KEY (conversation_id)
        REFERENCES conversations(id) ON DELETE CASCADE,
    CONSTRAINT fk_messages_sender FOREIGN KEY (sender_id)
        REFERENCES players(id) ON DELETE RESTRICT,
    CONSTRAINT chk_messages_text_not_empty CHECK (LENGTH(TRIM(text)) > 0),
    CONSTRAINT chk_messages_created_at CHECK (created_at <= NOW())
);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_conversation_created ON messages(conversation_id, created_at);

-- ============================================
-- Fonction pour mettre à jour updated_at automatiquement
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers pour updated_at
CREATE TRIGGER update_teams_updated_at BEFORE UPDATE ON teams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_players_updated_at BEFORE UPDATE ON players
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_matches_updated_at BEFORE UPDATE ON matches
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_attendances_updated_at BEFORE UPDATE ON attendances
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_statistics_updated_at BEFORE UPDATE ON statistics
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- Fonction pour mettre à jour players_count dans matches
-- ============================================
CREATE OR REPLACE FUNCTION update_match_players_count()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        UPDATE matches
        SET players_count = (
            SELECT COUNT(*)
            FROM attendances
            WHERE match_id = NEW.match_id AND status = 'present'
        )
        WHERE id = NEW.match_id;
        RETURN NEW;
    ELSIF TG_OP = 'UPDATE' THEN
        UPDATE matches
        SET players_count = (
            SELECT COUNT(*)
            FROM attendances
            WHERE match_id = NEW.match_id AND status = 'present'
        )
        WHERE id = NEW.match_id;
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE matches
        SET players_count = (
            SELECT COUNT(*)
            FROM attendances
            WHERE match_id = OLD.match_id AND status = 'present'
        )
        WHERE id = OLD.match_id;
        RETURN OLD;
    END IF;
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER trigger_update_match_players_count
    AFTER INSERT OR UPDATE OR DELETE ON attendances
    FOR EACH ROW EXECUTE FUNCTION update_match_players_count();

-- ============================================
-- Données de test (optionnel)
-- ============================================
-- INSERT INTO teams (name, description) VALUES
--     ('FC STRASBOURG', 'Équipe de football amateur basée à Strasbourg');

COMMIT;
```

---

## 3. Schéma Visuel des Tables

```
┌─────────────────────┐
│      teams          │
├─────────────────────┤
│ id (PK)             │
│ name (UNIQUE)       │
│ logo                │
│ description         │
│ created_at          │
│ updated_at          │
└──────────┬──────────┘
           │
           │ 1
           │
           │ N
┌──────────▼──────────┐
│     players         │
├─────────────────────┤
│ id (PK)             │
│ team_id (FK)        │──┐
│ first_name          │  │
│ last_name           │  │
│ email (UNIQUE)      │  │
│ password_hash       │  │
│ phone               │  │
│ date_of_birth       │  │
│ photo               │  │
│ position            │  │
│ jersey_number       │  │
│ role                │  │
│ is_admin            │  │
│ created_at          │  │
│ updated_at          │  │
└──────────┬──────────┘  │
           │             │
           │ 1           │
           │             │
┌──────────▼──────────┐  │
│   statistics        │  │
├─────────────────────┤  │
│ id (PK)             │  │
│ player_id (FK,UNIQ) │◄─┘
│ matches_played      │
│ goals               │
│ assists             │
│ yellow_cards        │
│ red_cards           │
│ clean_sheets        │
│ saves               │
│ created_at          │
│ updated_at          │
└─────────────────────┘

┌─────────────────────┐
│      matches        │
├─────────────────────┤
│ id (PK)             │
│ team_id (FK)        │──┐
│ created_by (FK)     │──┤
│ date                │  │
│ time                │  │
│ location            │  │
│ type                │  │
│ max_players         │  │
│ players_count       │  │
│ status              │  │
│ score_team_a        │  │
│ score_team_b        │  │
│ created_at          │  │
│ updated_at          │  │
└──────────┬──────────┘  │
           │             │
           │ 1           │
           │             │
           │ N           │
┌──────────▼──────────┐  │
│   attendances       │  │
├─────────────────────┤  │
│ id (PK)             │  │
│ match_id (FK)       │◄─┘
│ player_id (FK)      │──┐
│ status              │  │
│ created_at          │  │
│ updated_at          │  │
└─────────────────────┘  │
         (UK:match+player)│
                          │
                          │
┌─────────────────────┐   │
│  conversations      │   │
├─────────────────────┤   │
│ id (PK)             │   │
│ last_message        │   │
│ last_message_time   │   │
│ created_at          │   │
│ updated_at          │   │
└──────────┬──────────┘   │
           │              │
           │ 1            │
           │              │
           │ N            │
┌──────────▼──────────┐   │
│conv_participants    │   │
├─────────────────────┤   │
│ id (PK)             │   │
│ conversation_id(FK) │◄──┘
│ player_id (FK)      │──┐
│ unread_count        │  │
│ is_online           │  │
│ joined_at           │  │
└─────────────────────┘  │
         (UK:conv+player)│
                         │
                         │
┌─────────────────────┐  │
│     messages        │  │
├─────────────────────┤  │
│ id (PK)             │  │
│ conversation_id(FK) │──┘
│ sender_id (FK)      │──┐
│ text                │  │
│ created_at          │  │
└─────────────────────┘  │
                         │
                         │
                         └───┐
                             │
                             └─── Référence vers players
```

**Légende :**

- PK : Primary Key (Clé Primaire)
- FK : Foreign Key (Clé Étrangère)
- UK : Unique Key (Clé Unique)
- N : Plusieurs occurrences
- 1 : Une seule occurrence

---

## 4. Contraintes d'Intégrité

### 4.1 Contraintes de Clés

- **Clés primaires :** Toutes les tables ont une clé primaire auto-incrémentée (`SERIAL`)
- **Clés étrangères :** Toutes les relations sont définies avec des clés étrangères
- **Clés uniques :**
  - `teams.name`
  - `players.email`
  - `statistics.player_id`
  - `attendances(match_id, player_id)`
  - `conversation_participants(conversation_id, player_id)`

### 4.2 Actions sur Suppression

- **ON DELETE RESTRICT :** Empêche la suppression si des enregistrements dépendants existent

  - `players.team_id` → `teams.id`
  - `matches.team_id` → `teams.id`
  - `matches.created_by` → `players.id`
  - `messages.sender_id` → `players.id`

- **ON DELETE CASCADE :** Supprime automatiquement les enregistrements dépendants
  - `attendances` → `matches` et `players`
  - `statistics` → `players`
  - `messages` → `conversations`
  - `conversation_participants` → `conversations` et `players`

### 4.3 Contraintes de Vérification

- Formats de données (email, dates)
- Valeurs dans des listes prédéfinies (status, type, position, role)
- Valeurs numériques positives ou nulles
- Logique métier (score requis si match terminé, etc.)

---

## 5. Optimisations

### 5.1 Index

Des index ont été créés sur :

- Les colonnes fréquemment utilisées dans les clauses WHERE
- Les colonnes utilisées pour les jointures (clés étrangères)
- Les colonnes utilisées pour le tri (created_at, last_message_time)
- Les colonnes utilisées pour les classements (goals, assists)

### 5.2 Triggers

- **update_updated_at_column :** Met à jour automatiquement `updated_at` lors d'une modification
- **update_match_players_count :** Recalcule automatiquement `players_count` dans `matches` lors des changements de présences

---

## 6. Évolutions Futures

- Ajout d'une table `password_reset_tokens` pour la réinitialisation de mot de passe
- Ajout d'une table `notifications` pour les notifications en temps réel
- Ajout d'une table `team_roles` pour gérer les rôles plus finement
- Ajout de l'archivage des données supprimées (soft delete)
- Ajout de la gestion des fichiers (table `files` pour les photos et logos)
