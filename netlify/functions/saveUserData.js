const { MongoClient } = require('mongodb');

const uri = 'your_mongodb_connection_string';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

exports.handler = async function(event, context) {
    await client.connect();
    const database = client.db('your_database_name');
    const collection = database.collection('users');

    const { userId, username } = JSON.parse(event.body);

    const result = await collection.updateOne(
        { userId },
        { $set: { username } },
        { upsert: true }
    );

    return {
        statusCode: 200,
        body: JSON.stringify({ message: 'User data saved', result })
    };
};
