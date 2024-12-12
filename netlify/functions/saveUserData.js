const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI;
console.log('Connecting to MongoDB with URI:', uri);
const dbName = process.env.MONGODB_DBNAME;
console.log('Connecting to MongoDB with URI:', dbName);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async function(event, context) {
    try {
        if (!event.body) {
            throw new Error("No data provided in request body");
        }

        const { userId, username } = JSON.parse(event.body);

        if (!userId || !username) {
            throw new Error("Missing userId or username");
        }

        await client.connect();
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
    } finally {
        await client.close();
    }
};
