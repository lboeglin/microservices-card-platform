# Gacha Game - Projet de Collection de Cartes (catcha)

Ce projet regroupe plusieurs microservices pour une application web de collection de cartes. L'application permet aux utilisateurs de s'inscrire, se connecter, ouvrir des boosters, acheter des boosters, et gérer leur inventaire de cartes. Le système utilise une architecture de **microservices**, chaque service étant responsable d'une fonctionnalité spécifique. 

## Architecture du Projet

Le projet est composé des services suivants :

- **gacha_game** : Application web **one-page** développée avec **React** et **Astro**. Elle permet aux utilisateurs de s’inscrire, se connecter, ouvrir des boosters de cartes gratuits, acheter des boosters de cartes, et gérer leur inventaire de cartes.
- **user_api** : Gère les utilisateurs, leur authentification, l’ouverture des boosters, la gestion des cartes reçues, ainsi que les informations des comptes (par exemple, l’historique des boosters).
- **cards_api** : Gère la logique de génération de cartes aléatoires à partir d'APIs externes comme **Cat API** pour les images et **Randommer.io** pour les noms. Les cartes générées sont stockées dans une base de données MongoDB.
- **api-gateway** : Point d'entrée unique pour les requêtes HTTP. Il centralise le routage des requêtes vers les différents services et gère l'authentification via des jetons JWT.

## Fonctionnalités

- **gacha_game** (Frontend One-page) :
  - **Inscription et connexion des utilisateurs** : Permet aux utilisateurs de créer un compte, se connecter et gérer leurs informations.
  - **Ouverture de boosters gratuits** : Chaque utilisateur dispose de deux boosters gratuits à la création de son compte, et ces boosters sont réinitialisés toutes les 12 heures.
  - **Achat de boosters** : L'utilisateur peut acheter des boosters contenant un certain type de carte (actuellement uniquement des cartes "chat").
  - **Gestion des doublons** : Les cartes en doublon sont automatiquement vendues.
  - **Paramètres de l’utilisateur** (À implémenter prochainement) : L'utilisateur pourra modifier son nom d'utilisateur et son mot de passe, ainsi que supprimer son compte.

- **user_api** (Backend - Gestion des utilisateurs et boosters) :
  - **Création et gestion des comptes utilisateurs**.
  - **Gestion des boosters** : Gère la logique des boosters gratuits, leur réinitialisation toutes les 12 heures, et l'achat de boosters.
  - **Authentification des utilisateurs** via JWT pour sécuriser l'accès aux API.

- **cards_api** (Backend - Gestion des cartes) :
  - **Génération de cartes aléatoires** via **Cat API** pour les images et **Randommer.io** pour les noms.
  - **Stockage des cartes** dans une base de données MongoDB pour les conserver après leur génération.

- **api-gateway** (Passerelle d'API) :
  - **Routage des requêtes** vers les différents microservices.
  - **Authentification via JWT** pour garantir la sécurité des communications entre le frontend et les services.

## Prérequis

Avant de démarrer l'application, assurez-vous que vous avez installé les éléments suivants :

- **Node.js** (version >= 18)
- **MongoDB** (local ou distant)
- **Podman** ou **Docker** pour le déploiement en conteneur

## Installation et Déploiement

### 1. Cloner le dépôt principal

Clonez ce dépôt Git pour obtenir tous les services nécessaires :

```bash
git clone https://gitlab.univ-nantes.fr/pub/but/but2/sae4/sae4_class_grp1_eq4_antunes-samuel_becqart-paul-emile_boeglin-lohan_chauvel-sacha_phan-theo
cd main
```

### 2. Créer un Pod pour les Microservices

Ce projet utilise des conteneurs pour les microservices. Vous devez créer un **pod** pour les trois microservices (**api-gateway**, **user_api**, **cards_api**).

#### Étapes pour créer un Pod et exécuter les services :


1. **Créer un pod et ajouter les services** :
   
   Créez un pod et exécutez les services dans ce pod :

   ```bash
   podman pod create --name sae -p 3939:3939 -p 3940:3940 -p 3941:3941

   ```


## Conclusion

Ce projet fournit une application de collection de cartes où les utilisateurs peuvent interagir avec des boosters, recevoir des cartes aléatoires, et gérer leurs informations. Grâce à l'architecture basée sur des **microservices**, chaque partie du projet peut évoluer indépendamment. Vous pouvez facilement démarrer et tester l'application en créant un pod pour héberger les services via Podman.

