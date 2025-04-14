
# API Gateway

Ce dossier correspond à l’API Gateway (ou proxy) de l’application web de collection de cartes. Cette passerelle sert d’unique point d’entrée pour les clients et centralise l’accès à différents microservices (utilisateur et carte). Elle assure également la sécurité, la gestion des tokens et le routage des requêtes.

## Fonctionnalités

- **Routage des requêtes vers les microservices** : Gère l'acheminement des requêtes vers les microservices utilisateur et carte.
- **Authentification par JWT et gestion des refresh tokens** : Assure la validation et la gestion des tokens d'authentification et de rafraîchissement pour sécuriser les accès aux microservices.
- **Intégration avec le système de boosters et de collection de cartes** : Permet aux utilisateurs d'interagir avec les cartes et leurs collections via des requêtes centralisées.
- **Communication HTTP avec les services via `fetch`** : Effectue des appels HTTP sécurisés vers les services backend pour récupérer ou envoyer des données.

## Architecture

L'API Gateway repose sur un serveur **Express** qui interagit avec plusieurs microservices en fonction des routes appelées. Elle centralise :

- **Les opérations d'identification/authentification** : Le serveur valide les tokens JWT et gère les demandes d'accès.
- **Les actions liées aux utilisateurs et cartes** : Par exemple, la gestion des collections de cartes, la génération de boosters, etc.
- **Les échanges sécurisés avec des jetons JWT** : Toutes les communications entre l'API Gateway et les microservices sont protégées par des tokens JWT, garantissant ainsi la sécurité des données.

Technologies utilisées :

- **Node.js** avec **Express**
- **JWT** pour la gestion de l'authentification et des tokens
- **fetch** pour les appels HTTP aux microservices

## Installation

### Prérequis

- **Node.js >= 18**
- Les 2 autres microservices **accessibles et configurés**
- Fichier `.env` avec les variables nécessaires (par exemple `USER_SERVICE_URL`, `JWT_SECRET`, etc.)

### Étapes d’installation

1. Cloner le dépôt :
   ```bash
   git clone https://gitlab.univ-nantes.fr/pub/but/but2/sae4/sae4_class_grp1_eq4_antunes-samuel_becqart-paul-emile_boeglin-lohan_chauvel-sacha_phan-theo
   cd api-gateway
   ```

2. Installer les dépendances :
   ```bash
   npm install
   ```

3. Lancer l'API Gateway :
   ```bash
   npm run start
   ```

Cela démarrera le serveur et le rendra accessible sur le port par défaut.

## Tests

Des tests d'intégration sont mis en place pour garantir que l'API Gateway fonctionne correctement et interagit comme prévu avec les microservices. Ces tests couvrent les différents composants et les interactions HTTP.

### Mise en œuvre des tests

Les tests sont divisés en plusieurs catégories :

- **Tests d'intégration du routage** : Vérification que les requêtes sont correctement redirigées vers les microservices appropriés (par exemple, redirection des requêtes utilisateur vers le microservice utilisateur, et des requêtes de cartes vers le microservice carte).
- **Tests d'authentification** : Validation de la gestion des tokens JWT et des refresh tokens. Assure que les utilisateurs peuvent s'authentifier correctement et que les tokens expirés ou invalides sont gérés de manière appropriée.
- **Tests de la sécurité** : Vérification que seules les requêtes validées par un token JWT sont autorisées à accéder aux microservices. Cela inclut des tests pour s'assurer que les données sensibles ne sont pas exposées par des requêtes non authentifiées.
- **Tests de communication HTTP** : Vérification que les appels HTTP effectués avec `fetch` vers les microservices répondent comme prévu (par exemple, vérification de la gestion des erreurs et des réponses appropriées).

### Lancer les tests

Pour exécuter tous les tests d'intégration, utilisez la commande suivante :

```bash
npm test
```

Cela exécutera l'ensemble des tests et affichera les résultats dans la console.

### Tests avec couverture

Pour obtenir un rapport de couverture des tests, vous pouvez utiliser la commande suivante :

```bash
npm run test:coverage
```

Cela générera un rapport détaillant la couverture de code et les portions de code qui ne sont pas couvertes par les tests.

Les tests permettent de garantir que l'API Gateway gère correctement le routage, l'authentification, la sécurité et les communications avec les microservices. Ils assurent également que toutes les fonctionnalités critiques de la passerelle sont correctement testées et fonctionnent de manière fiable.

## Déploiement avec Podman

L'API Gateway peut être facilement déployée dans un conteneur **Podman** à l'aide du fichier `Containerfile` fourni.

### Étapes de déploiement avec Podman

1. **Construire l'image du conteneur** :
   Utilisez le `Containerfile` pour construire l'image Docker (ou Podman). Dans le répertoire racine de votre projet, exécutez la commande suivante :
   ```bash
   podman build -t api-gateway .
   ```

2. **Lancer le conteneur** :
   Une fois l'image construite, Vous pouvez lancer le conteneur avec la commande suivante :
   ```bash
   podman run -d -p 3940:3940 --pod sae api-gateway 
   ```

   Cette commande démarre le conteneur en arrière-plan et expose le port 3940 pour accéder à l'API Gateway.

3. **Accéder à l'API Gateway** :
   L'API Gateway sera accessible via `http://localhost:3940`, et Vous pourrez tester les différentes fonctionnalités de l'API.
