# API Gateway

Ce dépôt correspond à l’API Gateway (ou proxy) de l’application web de collection de cartes. Cette passerelle sert d’unique point d’entrée pour les clients et centralise l’accès à différents microservices (utilisateur et carte). Elle assure également la sécurité, la gestion des tokens et le routage des requêtes.

## Sommaire

- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Déploiement](#déploiement)
- [Tests](#tests)
- [Problèmes connus](#problèmes-connus)

## Fonctionnalités

- Routage des requêtes vers les microservices (utilisateur, cartes)
- Authentification par JWT et gestion des refresh tokens
- Intégration avec le système de boosters et de collection de cartes
- Communication HTTP avec les services via `fetch`

## Architecture

L'API Gateway repose sur un serveur Express qui interagit avec plusieurs microservices en fonction des routes appelées. Elle centralise :

- Les opérations d'identification/authentification
- Les actions liées aux utilisateurs et cartes (collection, boosters, etc.)
- Les échanges sécurisés avec des jetons JWT

## Installation

### Prérequis

- Node.js >= 18
- Microservices accessibles et configurés
- Fichier `.env` avec les variables nécessaires (ex : `USER_SERVICE_URL`, `JWT_SECRET`, etc.)

### Étapes

```bash
cd api-gateway 
npm install
npm run start & disown
