// Importation des modules nécessaires :
const mqtt = require('mqtt');
const { MongoClient } = require('mongodb');

// Définition des URLs :
const brokerUrl = 'https://test.mosquitto.org/'; // le serveur MQTT
const mongoUrl = 'mongodb+srv://user:Password123@cluster.azmq6uv.mongodb.net/'; // URL de connexion à MongoDB

const messageTimeout = 10000; // Temps en ms avant de remettre un message en queue s'il n'est pas validé

// Connexion au broker MQTT et à MongoDB :
const client = mqtt.connect(brokerUrl);
const clientDB = new MongoClient(mongoUrl);
clientDB.connect();
console.log("Connecté à MongoDB");
const db = clientDB.db('test');
const collection = db.collection('documents');
const topicQueues = {};

// Connexion au broker MQTT et abonnement aux topics :
client.on('connect', () => {
    console.log('Connecté au broker MQTT');
    const topics = ['topic1', 'topic2'];
    topics.forEach(topic => {
        client.subscribe(topic, err => {
            if (err) {
                console.error(`Erreur lors de la souscription au topic ${topic}`, err);
            }
        });
        topicQueues[topic] = [];
    });
});

// Réception des messages MQTT et mise en queue :
client.on('message', (topic, message) => {
    const msg = message.toString();
    console.log('Message reçu:', topic, msg);
    const queue = topicQueues[topic] || (topicQueues[topic] = []);
    queue.push(msg);
    collection.insertOne({ topic, message: msg });
});

function publierMessage(topic, message) {
    client.publish(topic, message);
    console.log('Message publié:', topic, message);
}

function consommerMessage(topic, consumerId) {
    const queue = topicQueues[topic];
    if (queue && queue.length > 0) {
        const message = queue.shift();
        console.log(`Consommateur ${consumerId} a reçu le message:`, message);
        setTimeout(() => {
            // Si le message n'est pas validé dans le temps imparti, le remettre en queue
            if (queue.indexOf(message) === -1) {
                queue.push(message);
                console.log(`Message remis en queue pour le topic ${topic}:`, message);
            }
        }, messageTimeout);
        validerMessage(topic, message)
        return message;
    }
    return null;
}

function validerMessage(topic, message) {
    const queue = topicQueues[topic];
    const index = queue.indexOf(message);
    console.log(index, 'index');
        queue.splice(index, 1);
        collection.deleteOne({ topic, message });
        console.log(`Message validé et supprimé de la queue pour le topic ${topic}:`, message);
}

let i = 0;
// Simulation de publication
setInterval(() => {
publierMessage('topic1', 'topic1 message : ' + i);
publierMessage('topic2', 'topic2 message : ' + i);
i++;
}, 1000);

// LIste des consommateurs : 
// consommateur topic 1 : 

setInterval(() => {
    consommerMessage('topic1', 1);
}, 1000);

// consommateurs topic 2 :

setInterval(() => {
    consommerMessage('topic2', 2);
}, 2000);

setInterval(() => {
    consommerMessage('topic2', 3);
}, 2000);
