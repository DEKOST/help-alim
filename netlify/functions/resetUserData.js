//resetUserData
const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DBNAME;
const mongoClient = new MongoClient(uri, {
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    connectTimeoutMS: 30000
});
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

        const result = await collection.deleteOne({ userId });

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
