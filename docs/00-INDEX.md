# Index de la Documentation - Team Up

Ce dossier contient toute la documentation d'analyse et de spécification du projet Team Up.

---

## 📚 Documents Disponibles

### 1. [Spécification API REST](./01-SPECIFICATION-API-REST.md)

Documentation complète de l'API REST :

- Routes et endpoints
- Méthodes HTTP
- Formats de requêtes et réponses
- Codes de statut
- Gestion des erreurs
- Authentification JWT

### 2. [Dictionnaire des Données](./02-DICTIONNAIRE-DES-DONNEES.md)

Description détaillée de toutes les entités et attributs :

- Players (Joueurs)
- Teams (Équipes)
- Matches (Matchs)
- Attendances (Présences)
- Statistics (Statistiques)
- Conversations ⚠️ _(en stand-by)_
- Messages ⚠️ _(en stand-by)_
- Enums et valeurs possibles
- Relations entre entités

### 3. [Modèle Conceptuel de Données (MCD)](./03-MODELE-CONCEPTUEL-DONNEES.md)

Modélisation conceptuelle des données :

- Entités et attributs
- Relations entre entités
- Cardinalités
- Contraintes d'intégrité
- Règles de gestion métier

### 4. [Modèle Logique de Données (MLD)](./04-MODELE-LOGIQUE-DONNEES.md)

Structure détaillée de la base de données PostgreSQL :

- Schéma des tables
- Types de données
- Clés primaires et étrangères
- Index
- Contraintes
- Script SQL complet
- Triggers et fonctions

### 5. [Spécifications Fonctionnelles et Techniques](./05-SPECIFICATIONS-FONCTIONNELLES-TECHNIQUES.md)

Documentation complète des spécifications :

- Context et objectifs
- Spécifications fonctionnelles détaillées
- Spécifications techniques (stack, architecture)
- Sécurité
- Performance et scalabilité
- Déploiement

### 6. [Diagrammes UML](./06-DIAGRAMMES-UML.md)

Diagrammes de modélisation UML :

- Diagramme de cas d'usage (Use Cases)
- Diagramme des flux (Flowcharts)
- Diagramme de séquences (Sequence Diagrams)

---

## 🗂️ Organisation des Documents

```
docs/
├── 00-INDEX.md                        # Ce fichier
├── 01-SPECIFICATION-API-REST.md       # Spécification API
├── 02-DICTIONNAIRE-DES-DONNEES.md     # Dictionnaire des données
├── 03-MODELE-CONCEPTUEL-DONNEES.md    # MCD
├── 04-MODELE-LOGIQUE-DONNEES.md       # MLD PostgreSQL
├── 05-SPECIFICATIONS-FONCTIONNELLES-TECHNIQUES.md  # Spécifications
└── 06-DIAGRAMMES-UML.md               # Diagrammes UML
```

---

## 📋 Checklist du Rendu (30/11/2025)

- ✅ Frontend React statique avec données simulées
- ⏳ Lien du répertoire public GIT (à compléter dans README.md)
- ✅ README.md complet
- ✅ Spécification de l'API REST
- ✅ Dictionnaire des données
- ✅ Modélisation de la base de données :
  - ✅ Modèle Conceptuel de Données (MCD)
  - ✅ Modèle Logique de Données (MLD) PostgreSQL
- ✅ Spécifications fonctionnelles et techniques
- ✅ Schémas UML :
  - ✅ Use cases
  - ✅ Diagramme des flux
  - ✅ Diagramme de séquences

---

## 🚀 Guide de Navigation

**Pour comprendre l'architecture technique :**

1. Lire les [Spécifications Fonctionnelles et Techniques](./05-SPECIFICATIONS-FONCTIONNELLES-TECHNIQUES.md)
2. Consulter les [Diagrammes UML](./06-DIAGRAMMES-UML.md)

**Pour comprendre les données :**

1. Commencer par le [Dictionnaire des Données](./02-DICTIONNAIRE-DES-DONNEES.md)
2. Consulter le [Modèle Conceptuel de Données (MCD)](./03-MODELE-CONCEPTUEL-DONNEES.md)
3. Passer au [Modèle Logique de Données (MLD)](./04-MODELE-LOGIQUE-DONNEES.md) pour l'implémentation

**Pour comprendre l'API :**

1. Lire la [Spécification API REST](./01-SPECIFICATION-API-REST.md)

**Pour comprendre les processus métier :**

1. Consulter les [Diagrammes UML - Flux](./06-DIAGRAMMES-UML.md#2-diagramme-des-flux)
2. Consulter les [Diagrammes UML - Séquences](./06-DIAGRAMMES-UML.md#3-diagramme-de-séquences)

---

## 📝 Notes

- Tous les documents sont rédigés en français
- Les diagrammes sont fournis en format texte et Mermaid (compatible GitHub)
- Les scripts SQL sont prêts à être exécutés
- La documentation est complète et à jour pour le rendu du 30/11/2025

---

## 🔗 Liens Utiles

- [README Principal](../README.md)
- [Structure du Projet](../README.md#structure-du-projet)
- [Installation](../README.md#installation)

---

**Dernière mise à jour :** 30/11/2025
