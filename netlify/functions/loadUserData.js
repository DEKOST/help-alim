// /netlify/functions/loadUserData
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
        const { userId } = event.queryStringParameters;

        if (!userId) {
            throw new Error("Missing userId");
        }

        const client = await clientPromise;
        const database = client.db(dbName);
        const collection = database.collection('app');

        const userData = await collection.findOne({ userId: userId.toString() });

        console.log('Data loaded from database:', userData);

        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*', // Разрешаем все домены
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ data: userData?.data || {} })
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: error.message })
        };
    }
};
