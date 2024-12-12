//saveUserData.js
const { MongoClient } = require('mongodb');

const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASS;
// const encodedPassword = encodeURIComponent(password);
const ip = process.env.MONGODB_IP;
const dbName = process.env.MONGODB_DBNAME;
const uri = `mongodb://${username}:${password}@${ip}`;
const mongoClient = new MongoClient(uri);
const clientPromise = mongoClient.connect();

async function ensureDatabaseAndCollection() {
    try {
        const client = await clientPromise;
        const database = client.db(dbName);

        // Проверка существования коллекции и создание, если она не существует
        const collections = await database.listCollections().toArray();
        const collectionExists = collections.some(col => col.name === 'app');
        if (!collectionExists) {
            await database.createCollection('app');
            console.log('Collection created successfully');
        }
    } catch (error) {
        console.error('Error ensuring database and collection:', error);
    }
}

exports.handler = async function(event, context) {
    try {
        // Убедитесь, что база данных и коллекция существуют
        await ensureDatabaseAndCollection();

        if (!event.body) {
            throw new Error("No data provided in request body");
        }

        const { userId, username } = JSON.parse(event.body);

        if (!userId || !username) {
            throw new Error("Missing userId or username");
        }

        const client = await clientPromise;
        const database = client.db(dbName);
        const collection = database.collection('app');

        const result = await collection.updateOne(
            { userId },
            { $set: { username } },
            { upsert: true }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User data saved', result })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
