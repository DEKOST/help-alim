const { MongoClient } = require('mongodb');

const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASS;
const encodedPassword = encodeURIComponent(password);
const ip = encodeURIComponent(password);
const dbName = process.env.MONGODB_DBNAME;
const uri = `mongodb://${username}:${encodedPassword}@${ip}/${dbName}`;
const mongoClient = new MongoClient(uri);
const clientPromise = mongoClient.connect();

exports.handler = async function(event, context) {
    try {
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
