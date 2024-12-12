//saveUserDate
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;
const mongoClient = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000
});
const clientPromise = mongoClient.connect();

async function ensureDatabaseAndCollection() {
    try {
        const client = await clientPromise;
        const database = client.db(dbName);
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
        await ensureDatabaseAndCollection();

        if (!event.body) {
            throw new Error("No data provided in request body");
        }

        const { userId, username, data } = JSON.parse(event.body);

        if (!userId || !username) {
            throw new Error("Missing userId or username");
        }

        const client = await clientPromise;
        const database = client.db(dbName);
        const collection = database.collection('app');

        const result = await collection.updateOne(
            { userId },
            { $set: { username, data, updatedAt: new Date() } },
            { upsert: true }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User data and localStorage saved', result })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};

