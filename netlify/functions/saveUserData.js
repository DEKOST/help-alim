const { MongoClient } = require('mongodb');

const username = process.env.MONGODB_USER;
const password = process.env.MONGODB_PASS;
const encodedPassword = encodeURIComponent(password);
const ip = encodeURIComponent(password);
const dbName = process.env.MONGODB_DBNAME;
const uri = `mongodb://${username}:${encodedPassword}@${ip}`;
const mongoClient = new MongoClient(uri);
const clientPromise = mongoClient.connect();

async function createDatabaseAndCollection() {
    try {
        const client = await clientPromise;
        const database = client.db(dbName);

        // Создание коллекции, если она еще не существует
        await database.createCollection('test');

        console.log('Database and collection created successfully');
    } catch (error) {
        console.error('Error creating database and collection:', error);
    }
}

createDatabaseAndCollection();