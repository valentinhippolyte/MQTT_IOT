# Application MQTT-MongoDB

Le but de cette application est de gérer à la manière de RabbitMQ, un système de « queueing » des messages 
avec une rétention en base de données mongoDb des messages en attente d’être délivrés. 

## Fonctionnalités

1. **Publication de Messages :**
   - Les messages sont publiés sur les topics MQTT `topic1` et `topic2` à intervalles réguliers.

2. **Consommation de Messages :**
   - Les messages reçus via MQTT sont mis en queue dans une collection MongoDB.
   - Différents consommateurs peuvent récupérer et valider ces messages.

3. **Validation de Messages :**
   - Les messages sont validés en supprimant les messages consommés de la queue et de la collection MongoDB.

4. **Gestion du Timeout :**
   - Si un message n'est pas validé dans un délai spécifié (`messageTimeout`), il est remis en queue pour réessayer.

## Protocoles d'Échanges

### MQTT (Message Queuing Telemetry Transport)

MQTT est un protocole de messagerie léger basé sur un modèle de publication/abonnement (publish-subscribe). Dans cette application :

- **Broker MQTT :**
  C'est le serveur qui gère la communication entre les clients MQTT. Il gère les messages entrants et sortants. 

- **Clients MQTT :**
  C'est les équipements qui souhaitent publier/récupérer les données.  

### MongoDB

MongoDB est utilisé comme base de données NoSQL qui stocke ses données (documents) sous format JSON dans des tables (collections).

- **Connexion à MongoDB :**
  - Utilisation de `mongodb+srv` pour la connexion sécurisée à MongoDB Atlas.
  - Stockage des messages reçus via MQTT dans la collection `documents`.

- **Opérations de Lecture/Écriture :**
  - Insertion des messages dans MongoDB lorsqu'ils sont reçus.
  - Suppression des messages validés après la consommation.

## Installation et Utilisation

1. **Prérequis :**
   - Node.js installé localement.
   - Accès à un serveur MQTT (comme `test.mosquitto.org`).
   - Accès à une base de données MongoDB (comme MongoDB Atlas).

2. **Installation des Dépendances :**
   ```bash
   npm install mqtt mongodb
   ```
3. **Configuration :**
   - Modifier les URLs de brokerUrl et mongoUrl dans le fichier selon votre configuration MQTT et MongoDB.
  
  4. **Démarrage de l'Application :**
```bash
   node code.js
   ```
5. **Test :**
   - Aller dans la section test en fin de fichier et jouer avec les setTimeout.  
