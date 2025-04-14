# Microservice - Card API

Ce microservice est responsable de la gestion des cartes dans l’application de collection. Il fournit une API pour récupérer des cartes, générer de nouvelles cartes avec des noms et images issus d'API externes, et gérer la persistance des cartes dans une base de données. Ce service peut soit récupérer des cartes déjà existantes dans la base de données, soit générer de nouvelles cartes à partir de données externes.

## Fonctionnalités

Ce microservice offre les fonctionnalités suivantes :

- **Récupérer des cartes depuis la base de données** : Permet de récupérer toutes les cartes ou des cartes spécifiques par ID.
- **Générer des cartes aléatoires** : Crée de nouvelles cartes en récupérant des données d'API externes (nom, image) et en leur assignant une rareté et un type.
- **Attribuer des types basés sur les sources d'images** : Le type de la carte dépend de la source de l'image récupérée depuis l'API externe.
- **Persistance des cartes** : Enregistre les cartes générées dans la base de données pour une réutilisation future.
- **Gestion de rareté** : Les cartes générées reçoivent une rareté aléatoire.

## Architecture

Ce service fonctionne sur une architecture de microservices. Il interagit avec :

- **API externe pour les images** : Utilise une API externe pour récupérer des images (par exemple, via Unsplash ou une autre API de cartes ou d'images aléatoires).
- **API externe pour les noms** : Récupère des noms de cartes à partir d'une API externe.
- **Base de données** : Utilise une base de données MongoDB pour stocker les cartes générées.
- **API Gateway** : Ce microservice est intégré à l'API Gateway, qui gère les requêtes et les authentifications.

Technologies utilisées :

- **Node.js** avec **Express**
- **MongoDB** pour la persistance des données
- **Mongoose** pour l'interaction avec MongoDB

## Installation

1. **Cloner le dépôt** :
   ```bash
   git clone https://github.com/votre-dépôt
   cd cards_api
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Démarrer l'application** :
   ```bash
   npm start
   ```

Le serveur sera accessible sur le port `3939` par défaut (`http://localhost:3939`).

## Déploiement avec Podman

Ce microservice peut être déployé à l'aide de **Podman**, un outil de gestion de conteneurs compatible avec Docker.

1. **Construire l'image Podman** :
   Dans le répertoire du projet, exécute la commande suivante pour construire l'image Podman :
   ```bash
   podman build -t card-api .
   ```

2. **Exécuter le conteneur Podman** :
   Une fois l'image construite, tu peux lancer le service dans un conteneur Podman avec la commande suivante :
   ```bash
   podman run -p 3939:3939 card-api
   ```

Cela exposera l'application sur le port `3939` de ta machine locale, et tu pourras y accéder à l'adresse `http://localhost:3939`.

## Tests

Les tests pour ce microservice sont organisés en tests d'intégration couvrant différents niveaux de l'application, notamment le modèle, le DAO, le contrôleur et les routes. Ces tests permettent de s'assurer que chaque composant du système interagit correctement et que les fonctionnalités de l'API répondent comme attendu.

### Mise en œuvre des tests

Les tests sont effectués sur les composants suivants :

- **Modèle** : Vérification de la structure et du comportement du modèle de données, en s'assurant qu'il respecte les attentes (par exemple, la validité des données et la persistance correcte dans la base de données).
- **DAO (Data Access Object)** : Tests de l'interaction avec la base de données, y compris l'insertion, la mise à jour, la suppression et la récupération des cartes. Ces tests vérifient que les requêtes MongoDB fonctionnent correctement.
- **Contrôleur** : Tests de la logique métier. Cela inclut la gestion des erreurs, la validation des entrées, et la coordination entre le modèle, le DAO et les routes de l'API.
- **Routes** : Tests d'intégration des routes HTTP de l'API. Ces tests s'assurent que les routes répondent correctement aux requêtes et que les réponses retournées sont conformes aux spécifications.

### Lancer les tests

Pour exécuter tous les tests d'intégration, utilise la commande suivante dans le terminal :

```bash
npm test
```

Cela exécutera tous les tests du projet et affichera les résultats dans la console.

### Tests avec couverture

Si tu souhaites obtenir un rapport de couverture des tests, qui indique quel pourcentage du code est couvert par les tests, tu peux utiliser la commande suivante :

```bash
npm run test:coverage
```

Cela générera un rapport détaillant la couverture de code et les portions de code qui ne sont pas couvertes par les tests.

Les tests d'intégration permettent de garantir que l'ensemble du système fonctionne comme prévu, du modèle jusqu'aux routes de l'API. Ils assurent également que toutes les interactions entre les composants sont correctes et que le service répond aux requêtes de manière fiable.

---

Ce README explique maintenant l'installation, le déploiement avec **Podman**, ainsi que la mise en œuvre des tests d'intégration sur le modèle, le DAO, le contrôleur et les routes, sans mentionner de variables d'environnement, de mocking ou de détails sur la structure des tests.