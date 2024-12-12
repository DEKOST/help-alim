//loadUserDate
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
        const { userId } = event.queryStringParameters;

        if (!userId) {
            throw new Error("Missing userId");
        }

        const client = await clientPromise;
        const database = client.db(dbName);
        const collection = database.collection('app');

        const userData = await collection.findOne({ userId });

        return {
            statusCode: 200,
            body: JSON.stringify({ data: userData?.data || {} })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message })
        };
    }
};
