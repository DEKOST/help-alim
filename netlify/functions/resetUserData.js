//resetUserData
const { MongoClient } = require('mongodb');

const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASS;
const ip = process.env.MONGODB_IP;
const dbName = process.env.MONGODB_DBNAME;
const uri = `mongodb://${username}:${password}@${ip}`;
const mongoClient = new MongoClient(uri);
const clientPromise = mongoClient.connect();

exports.handler = async function(event, context) {
    try {
        const { userId } = JSON.parse(event.body);

        if (!userId) {
            throw new Error("Missing userId");
        }

        const client = await clientPromise;
        const database = client.db(dbName);
        const collection = database.collection('app');

        const result = await collection.deleteOne({ userId: userId.toString() });

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User data reset', result })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
