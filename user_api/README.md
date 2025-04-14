# Service utilisateur - Documentation technique

Ce document décrit le fonctionnement du service `user`, un composant central de notre application web. Ce service repose sur une architecture RESTful et permet la gestion complète des utilisateurs, incluant l’authentification, l’inscription, la modification des informations personnelles, ainsi que la gestion d’éléments liés à un système de collection de cartes et de boosters.

## Objectifs du service

Le service utilisateur a pour but de fournir une interface sécurisée permettant :

- L’authentification et l’inscription des utilisateurs via JSON Web Tokens (JWT).
- La gestion du profil utilisateur (nom d'utilisateur, mot de passe).
- La consultation et la modification de la collection de cartes de l'utilisateur.
- L'achat et l'utilisation de boosters.
- La persistance des données utilisateurs, y compris les cartes, les boosters et la monnaie virtuelle.

## Technologies utilisées

- **Node.js** avec **Express.js** pour la mise en place du serveur HTTP.
- **JWT** (JSON Web Tokens) pour l’authentification stateless.
- **Swagger** (via des commentaires) pour la documentation des routes.
- **MongoDB** avec Mongoose pour la gestion de la base de données (détaillé dans un autre module).
- **Middleware personnalisé** pour l'extraction des informations utilisateur depuis les tokens.

## Structure générale

Le service expose plusieurs routes, regroupées sous le préfixe `/user`. Ces routes sont définies dans un routeur Express et interagissent avec un contrôleur dédié (`userController`). La majorité des routes nécessitent l'authentification de l'utilisateur via un token JWT fourni dans l'en-tête de la requête.

### Authentification et gestion de compte

- `POST /user/login`  
  Permet à un utilisateur existant de se connecter. Les identifiants (nom d'utilisateur et mot de passe) sont envoyés dans le corps de la requête. Si l'authentification est réussie, un access token et un refresh token sont retournés.

- `POST /user/register`  
  Crée un nouvel utilisateur dans la base de données. Le corps de la requête doit contenir les informations nécessaires (nom d'utilisateur et du mot de passe). Une validation est effectuée pour éviter les doublons.

- `POST /user/refresh-tokens`  
  Permet de renouveler un access token expiré à l’aide d’un refresh token valide. 

- `GET /user`  
  Retourne les informations de l’utilisateur connecté. Le token d’accès est utilisé pour identifier l'utilisateur.

- `PUT /user`  
  Permet de modifier certaines informations du profil utilisateur, comme le nom d'utilisateur.

- `PUT /user/password`  
  Permet de modifier le mot de passe de l’utilisateur. La requête doit contenir l’ancien et le nouveau mot de passe.

- `DELETE /user`  
  Supprime le compte de l’utilisateur et toutes les données associées dans la base de données.

### Gestion de la collection de cartes

- `GET /user/collection`  
  Retourne l’ensemble des ids des cartes possédées par l’utilisateur. Les cartes sont stockées dans un tableau spécifique au sein du document utilisateur.

- `PUT /user/sell-card/:id`  
  Permet de vendre une carte identifiée par son identifiant (`id`). Lors de la vente, la carte est supprimée de la collection de l’utilisateur et une quantité de monnaie virtuelle (coins) est créditée.

- `PUT /addCard`  
  Ajoute une carte à la collection de l’utilisateur. Cette route est utilisée en interne, notamment lors de l’ouverture d’un booster.

### Gestion des boosters

- `PUT /booster`

    Cette route permet à un utilisateur connecté de réclamer un booster gratuit, sous certaines conditions :

    - Un délai minimum de **12 heures** doit s'être écoulé depuis la dernière réclamation de booster gratuit.
    - L'utilisateur ne peut détenir plus de **deux boosters gratuits** à la fois.

    Le système se base sur des **timestamps** stockés dans la base de données pour vérifier l’éligibilité :

    - Si plusieurs timestamps existent dans l'attribut `boosters`, le système prend le **timestamp le plus ancien**.
    - Si aucun timestamp est présent, il utilise l'attribut `lastBooster` pour déterminer le moment de la dernière ouverture d'un booster.

    Les conditions de délai et de nombre de boosters gratuits sont vérifiées. Si elles sont remplies, un booster est ajouté à l'utilisateur.


- `PUT /booster/use`

    Cette route permet à un utilisateur connecté d'ouvrir un booster gratuit. Elle fonctionne comme suit :

    - Le système retire le **timestamp le plus ancien** de l'attribut `boosters`.
    - Si aucun booster gratuit n'est disponible (c'est-à-dire si la liste des timestamps est vide), une **erreur** est retournée.


- `PUT /booster/buy/:price`  
  Permet d’acheter un booster, en déduisant le montant indiqué (`price`) de la monnaie virtuelle de l’utilisateur. Le booster ainsi acheté doit ensuite être ouvert via la route `/booster/use`, sinon elle serait perdu.
  
  >Note : les prices peuvent être négatif pour les tests depuis d'autre service.

## Installation

### Prérequis

- **Node.js >= 18**
- Les 2 autres microservices **accessibles et configurés**
- Fichier `.env` avec les variables nécessaires (par exemple `USER_SERVICE_URL`, `JWT_SECRET`, etc.)

### Étapes d’installation

1. Cloner le dépôt :
   ```bash
   git clone https://gitlab.univ-nantes.fr/pub/but/but2/sae4/sae4_class_grp1_eq4_antunes-samuel_becqart-paul-emile_boeglin-lohan_chauvel-sacha_phan-theo
   cd user_api
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

## Déploiement
### Déploiement en local avec Node.js

1. **Lancer l'application avec Node.js** :
   - Ouvrez un terminal et allez dans le dossier du projet où se trouve le fichier `server.mjs`.
   - Exécutez la commande suivante pour démarrer l'application :
     ```bash
     node user-api/server.mjs
     ```

2. **Détacher le processus de l'écran terminal (optionnel)** :
   - Si vous souhaitez que le serveur continue de tourner même après la fermeture du terminal, vous pouvez détacher le processus en utilisant la commande `disown` :
     ```bash
     node user-api/server.mjs & disown
     ```

---

### Déploiement avec Podman (utilisant un fichier `Containerfile`)

#### 1. **Construire l'image avec Podman à partir du `Containerfile`** :
   - Assurez-vous que le fichier `Containerfile` se trouve dans le répertoire racine de votre projet.
   - Ouvrez un terminal et naviguez jusqu'au répertoire contenant le `Containerfile`.
   - Utilisez la commande suivante pour construire l'image :
     ```bash
     podman build -t user-api .
     ```

#### 2. **Exécuter le conteneur avec Podman** :
   - Une fois l'image construite, vous pouvez exécuter un conteneur avec pour pod (celle créée pour mettre les 3 services ensemble), en utilisant la commande suivante :
     ```bash
     podman run -d -p 3941:3941 --pod [name_pod] --name user-api-container user-api
     ```

#### 3. **Accéder à l'application et à la documentation Swagger** :
   - Une fois le conteneur en fonctionnement, vous pouvez accéder à votre application en ouvrant un navigateur et en utilisant les URLs suivantes :
     - Pour l'API :  
       ```bash
       http://localhost:3941/user-api/
       ```
     - Pour la documentation Swagger :  
       ```bash
       http://localhost:3941/user-api/doc
       ```
## Tests

Des tests d'intégration sont mis en place pour garantir le bon fonctionnement du service. Ces tests couvrent différents aspects de l'application afin d'assurer son bon comportement global.

### Types de tests

Les tests sont organisés en plusieurs catégories, chacune ciblant un aspect spécifique de l'application :

- **Tests d'intégration du routage** :  
  Ces tests vérifient que les routes de l'application fonctionnent comme prévu. Par exemple, ils s'assurent que l'inscription d'un utilisateur (`register`), la récupération des informations utilisateur (`getUserByName`), ainsi que la mise à jour de l'utilisateur (`updateName`, `updatePassword`) se passent sans problème.
  
  Exemple :  
  - Vérification que l'utilisateur peut s'inscrire avec un nom unique et un mot de passe valide.
  - Vérification que la mise à jour du nom d'utilisateur se fait correctement.
  - Vérification que la récupération des informations utilisateur retourne bien les bonnes données.

- **Tests d'authentification** :  
  Ces tests garantissent que les mécanismes d'authentification fonctionnent correctement. Par exemple, la connexion d'un utilisateur avec des identifiants corrects ou incorrects, ainsi que la gestion des erreurs liées à l'authentification (comme un mot de passe incorrect).
  
  Exemple :  
  - Vérification que la connexion avec un nom d'utilisateur et un mot de passe correct fonctionne.
  - Vérification que la connexion échoue avec un mot de passe incorrect.

- **Tests de gestion des utilisateurs** :  
  Ces tests vérifient les différentes fonctionnalités liées à la gestion des utilisateurs, comme la suppression d'un utilisateur (`deleteUser`), l'ajout de cartes à la collection d'un utilisateur (`addCards`), la vente de cartes (`sellCard`), ainsi que l'achat de boosters (`buyBooster`).
  
  Exemple :  
  - Vérification que l'utilisateur peut ajouter des cartes à sa collection.
  - Vérification que la vente d'une carte augmente les coins de l'utilisateur et supprime la carte de la collection.
  - Vérification que l'achat d'un booster réduit le nombre de coins de l'utilisateur.

- **Tests de sécurité** :  
  Ces tests vérifient que l'application gère correctement les cas d'erreur et protège les données sensibles. Par exemple, la tentative de suppression ou de mise à jour des informations utilisateur avec des informations erronées (comme un nom d'utilisateur déjà existant ou un mot de passe incorrect).
  
  Exemple :  
  - Vérification que l'utilisateur ne peut pas modifier son mot de passe avec un mot de passe actuel incorrect.
  - Vérification que la tentative de vente d'une carte que l'utilisateur ne possède pas échoue.

### Lancer les tests

Pour exécuter tous les tests d'intégration, il vous suffit de lancer la commande suivante :

```bash
npm test
```

Cela exécutera tous les tests définis et affichera les résultats dans la console, vous permettant ainsi de valider le bon fonctionnement des différents composants de l'application. Les tests couvrent les fonctionnalités essentielles, comme l'inscription, la connexion, la gestion des utilisateurs, l'ajout de cartes, la vente de cartes, et l'achat de boosters.


Cela correspond désormais à la structure et aux tests que vous avez partagés.