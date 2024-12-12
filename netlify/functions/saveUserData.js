const { MongoClient } = require('mongodb');

// Инициализация MongoDB клиента один раз
const client = new MongoClient(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Подключение один раз и использование `clientPromise`
const clientPromise = client.connect();

exports.handler = async function(event, context) {
    try {
        if (!event.body) {
            throw new Error("No data provided in request body");
        }

        const { userId, username } = JSON.parse(event.body);

        if (!userId || !username) {
            throw new Error("Missing userId or username");
        }

        // Используем подключение из `clientPromise`
        const database = (await clientPromise).db(process.env.MONGODB_DBNAME);
        const collection = database.collection('app');

        const result = await collection.updateOne(
            { userId },
            { $set: { username } },
            { upsert: true }
        );

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User data saved', result }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message }),
        };
    }
};
