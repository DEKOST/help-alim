const { MongoClient } = require('mongodb');

const uri = 'MONGODB_URI=mongodb+srv://app_user:Zfd-HtA-3r8-P7N@cluster0.rsdbr.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
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
