# Gacha Game - Application de Collection de Cartes

Cette application est une **application web à une seule page** (one-page) permettant aux utilisateurs de se connecter, créer un compte, ouvrir des boosters de cartes et acheter des boosters contenant des cartes aléatoires. Actuellement, les cartes sont basées sur des images de **chats** récupérées via une API externe (Cat API). Cette application utilise **Node.js** pour le backend et **React avec Astro** pour le frontend.

Le projet est un jeu de collection de cartes où les utilisateurs peuvent gagner des cartes de manière aléatoire, collecter des cartes de type "chat", et gérer leur inventaire.

## Fonctionnalités

L'application offre les fonctionnalités suivantes :

1. **Création de compte et connexion** :
   - Inscription avec un **nom d'utilisateur** et un **mot de passe**.
   - Connexion à l'application avec ces informations.

2. **Boosters gratuits et achetés** :
   - **2 boosters gratuits** sont attribués lors de la création du compte.
   - Les boosters gratuits sont réinitialisés toutes les **12 heures** après leur utilisation.
   - Les utilisateurs peuvent acheter des boosters contenant des cartes aléatoires (actuellement uniquement des cartes de type "chat").

3. **Gestion des doublons** :
   - Si une carte obtenue via un booster est déjà présente dans l'inventaire de l'utilisateur, elle sera **automatiquement vendue**.

4. **Paramètres de compte** :
   - L'utilisateur peut **supprimer son compte**.
   - L'option de mise à jour du mot de passe et du nom d'utilisateur est prévue mais non encore implémentée.

## Architecture

L'architecture de l'application repose sur les éléments suivants :

- **Frontend (SPA)** : Développé en **React** et **Astro** pour créer une application à une seule page.
- **Backend (API)** : Développé avec **Node.js** et **Express** pour la gestion des utilisateurs, des boosters, des cartes, et de l'authentification.
- **Microservices** :
  - **Card API** : Génère des cartes à partir d'API externes (Cat API pour les images, Randommer.io pour les noms).
  - **User API** : Gère la création de compte, la connexion et les paramètres des utilisateurs.
  - **API Gateway** : Sert de point d'entrée pour toutes les requêtes HTTP, gère l'authentification et l'acheminement des requêtes vers les services appropriés.
- **Services externes** :
  - **Cat API** : Fournit des images de chats aléatoires pour les cartes.
  - **Randommer.io** : Génère des noms de cartes aléatoires.

## Installation

### Prérequis

Assurez-vous d'avoir les outils suivants installés sur votre machine :

- **Node.js** (version >= 18)
- **Apache** (facultatif, pour déploiement sur un serveur Apache)

### Étapes d'installation

1. **Cloner le dépôt GitLab** :

   Clonez le dépôt en utilisant la commande suivante :
   ```bash
   git clone https://gitlab.univ-nantes.fr/pub/but/but2/sae4/sae4_class_grp1_eq4_antunes-samuel_becqart-paul-emile_boeglin-lohan_chauvel-sacha_phan-theo
   cd gacha_game
   ```

2. **Installer les dépendances du projet** :

   Dans le dossier **gacha_game**, exécutez la commande suivante pour installer les dépendances :
   ```bash
   npm install
   ```

3. **Démarrer l'application** :

   Une fois les dépendances installées, vous pouvez démarrer le backend et le frontend de l'application :

   - Pour démarrer le serveur backend :
     ```bash
     npm run start
     ```

   - Pour démarrer le frontend (si nécessaire) :
     ```bash
     npm start
     ```

   Le backend sera disponible sur le port `3939` et le frontend sera disponible sur le port `3000` par défaut.

## Déploiement

### Mode 1 : Déploiement avec Node.js

1. **Construire l'application** :
   
   Exécutez la commande suivante pour créer une version de production du projet :
   ```bash
   npm run build
   ```

2. **Démarrer le serveur de production** :

   Après avoir construit l'application, vous pouvez démarrer le serveur Node.js pour servir l'application :
   ```bash
   node ./dist/server/entry.mjs
   ```

### Mode 2 : Déploiement sur Apache

Si vous souhaitez déployer l'application sur un serveur Apache, suivez ces étapes :

1. **Préparer le build du frontend** :
   
   Exécutez la commande suivante pour créer les fichiers de production du frontend :
   ```bash
   npm run build
   ```

   Cela génère un dossier `dist` contenant tous les fichiers statiques nécessaires à l'exécution de l'application frontend.

2. **Déployer les fichiers de l'application** :

   Copiez le contenu du dossier `dist` dans le répertoire public de votre serveur Apache (par exemple, `/var/www/html`).

3. **Configurer Apache pour rediriger vers Node.js** :

   - Assurez-vous que **mod_proxy** et **mod_proxy_http** sont activés dans Apache pour rediriger les requêtes HTTP vers le serveur Node.js.
   - Ajoutez la configuration nécessaire dans le fichier `site-available` pour rediriger les requêtes vers le backend qui tourne sur le port `3939`.

4. **Redémarrer Apache** :
   ```bash
   sudo service apache2 restart
   ```

L'application sera maintenant accessible via le serveur Apache.
