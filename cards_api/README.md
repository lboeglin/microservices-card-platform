# Microservice - Card API

Ce microservice est responsable de la gestion des cartes dans votre application de collection. Il fournit une API permettant de récupérer des cartes, de générer de nouvelles cartes à partir de noms et d’images issus d'API externes, ainsi que de gérer leur persistance dans une base de données. Ce service est capable de récupérer des cartes déjà existantes ou d’en générer de nouvelles à la demande.

## Fonctionnalités

Ce microservice offre les fonctionnalités suivantes :

- **Récupération des cartes depuis la base de données** : Vous pouvez récupérer toutes les cartes ou une carte spécifique par son identifiant.
- **Génération de cartes aléatoires** : De nouvelles cartes sont créées à partir de données obtenues via des API externes (nom, image), avec une rareté et un type attribués aléatoirement.
- **Attribution des types selon la source des images** : Le type de chaque carte est déterminé selon la provenance de son image.
- **Persistance des cartes** : Les cartes générées sont stockées dans la base de données pour un usage futur.
- **Gestion de la rareté** : Chaque carte obtient une rareté choisie de manière aléatoire.

## Architecture

Ce service repose sur une architecture de microservices. Il interagit avec :

- **API externe pour les images** : Pour récupérer des visuels aléatoires (par exemple via Unsplash ou une autre source d’images).
- **API externe pour les noms** : Pour générer les noms des cartes.
- **Base de données** : MongoDB est utilisée pour stocker les cartes.
- **API Gateway** : Le microservice est intégré à une passerelle API qui centralise l'accès aux différents services et assure la gestion des requêtes et de l’authentification.

Technologies utilisées :

- **Node.js** avec **Express**
- **MongoDB** pour la base de données
- **Mongoose** pour l’accès aux données

## APIs externes utilisées

Pour générer dynamiquement les noms et les images des cartes, ce microservice s’appuie sur deux APIs tierces :

- **Cat API** (https://thecatapi.com/) : Fournit aléatoirement des images de chats, utilisées comme illustrations pour certaines cartes. Cette API permet également de varier les sources, ce qui est utile pour attribuer un type à la carte en fonction de la provenance de l’image.
  
- **Randommer.io** (https://randommer.io/) : Fournit des noms aléatoires. Le service est utilisé pour générer dynamiquement des noms uniques ou originaux pour chaque nouvelle carte.

Ces APIs sont appelées directement lors de la génération d’une carte via l’endpoint `POST /cards/random`.

## Installation

1. **Cloner le dépôt** :
   ```bash
   git clone https://gitlab.univ-nantes.fr/pub/but/but2/sae4/sae4_class_grp1_eq4_antunes-samuel_becqart-paul-emile_boeglin-lohan_chauvel-sacha_phan-theo
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

L’application sera alors accessible sur le port `3939` via `http://localhost:3939`.

## Déploiement avec Podman

Vous pouvez déployer ce microservice dans un conteneur **Podman**, en utilisant le fichier `Containerfile` déjà présent dans le projet.

1. **Construire l’image** :
   Dans le dossier du projet, exécutez la commande suivante :
   ```bash
   podman build -t card-api .
   ```

2. **Lancer le conteneur** :
   Une fois l’image créée, lancez le conteneur avec :
   ```bash
   podman run -p 3939:3939 --pod sae card-api
   ```

L’API sera alors disponible à l’adresse `http://localhost:3939`.

## Tests

Des tests d’intégration ont été mis en place pour assurer le bon fonctionnement de l’application dans son ensemble. Ces tests couvrent les composants suivants : modèle, DAO, contrôleur et routes.

### Mise en œuvre des tests

- **Modèle** : Les tests vérifient que la structure des objets en base de données est correcte et respecte les règles définies (validation, schéma, etc.).
- **DAO (Data Access Object)** : Ces tests s’assurent que les opérations sur la base de données (création, mise à jour, suppression, recherche) fonctionnent comme prévu.
- **Contrôleur** : Les tests portent sur la logique métier — gestion des erreurs, validation des entrées et coordination des appels aux différents composants.
- **Routes** : Ils vérifient que les requêtes HTTP vers l’API sont correctement traitées, que les réponses sont conformes, et que les intégrations avec les autres couches fonctionnent.

### Exécuter les tests

Pour lancer les tests d’intégration, utilisez simplement :

```bash
npm test
```

Cette commande exécutera tous les tests définis et affichera les résultats dans la console.

### Obtenir un rapport de couverture

Pour visualiser la couverture des tests (parties du code testées ou non), utilisez :

```bash
npm run test:coverage
```

Un rapport détaillé sera généré, vous permettant d’évaluer l’efficacité des tests.

Ces tests assurent que tous les composants du service fonctionnent de manière fiable et cohérente, et qu’ils répondent correctement aux différentes requêtes de l’application.
