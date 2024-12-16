const express = require('express');
const bodyParser = require('body-parser');
const crypto = require('crypto');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = 3000;

// Секретный ключ для проверки подписи
const TELEGRAM_BOT_TOKEN = 'YOUR_TELEGRAM_BOT_TOKEN';

// Подключение к MongoDB
const uri = 'YOUR_MONGODB_CONNECTION_STRING';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());

// Функция для проверки подписи
function verifyTelegramSignature(hash, data) {
    const secret = crypto.createHmac('sha256', TELEGRAM_BOT_TOKEN).update('webappdata').digest();
    const checkString = Object.keys(data).sort().map(key => `${key}=${data[key]}`).join('\n');
    const hmac = crypto.createHmac('sha256', secret).update(checkString).digest('hex');
    return hmac === hash;
}

app.post('/auth', async (req, res) => {
    const { initData, auth_date, signature } = req.body;

    // Проверка подписи
    if (!verifyTelegramSignature(signature, { initData, auth_date })) {
        return res.status(401).json({ error: 'Invalid signature' });
    }

    // Проверка актуальности данных
    const currentTimestamp = Math.floor(Date.now() / 1000);
    if (currentTimestamp - auth_date > 86400) {
        return res.status(401).json({ error: 'Data is outdated' });
    }

    // Генерация токена доступа
    const accessToken = crypto.randomBytes(16).toString('hex');

    // Сохранение токена и данных пользователя в MongoDB
    try {
        await client.connect();
        const database = client.db('your_database_name');
        const collection = database.collection('users');

        const userData = {
            userId: initData.user.id,
            username: initData.user.username,
            accessToken,
            data: {},
            updatedAt: new Date()
        };

        await collection.updateOne(
            { userId: userData.userId },
            { $set: userData },
            { upsert: true }
        );

        res.json({ accessToken });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.post('/saveUserData', async (req, res) => {
    const { userId, username, data } = req.body;

    if (!userId || !username || !data) {
        return res.status(400).json({ error: 'Missing userId, username, or data' });
    }

    try {
        await client.connect();
        const database = client.db('your_database_name');
        const collection = database.collection('users');

        const result = await collection.updateOne(
            { userId },
            { $set: { username, data, updatedAt: new Date() } },
            { upsert: true }
        );

        res.json({ message: 'User data saved', result });
    } catch (error) {
        console.error('Error saving user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.get('/loadUserData', async (req, res) => {
    const { userId } = req.query;

    if (!userId) {
        return res.status(400).json({ error: 'Missing userId' });
    }

    try {
        await client.connect();
        const database = client.db('your_database_name');
        const collection = database.collection('users');

        const userData = await collection.findOne({ userId });

        if (userData) {
            res.json({ data: userData.data });
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        console.error('Error loading user data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    } finally {
        await client.close();
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
