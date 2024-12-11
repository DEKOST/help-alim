const axios = require('axios');

const BIN_ID = process.env.BIN_ID; // Замените на ваш Bin ID
const SECRET_KEY = process.env.SECRET_KEY; // Замените на ваш Secret Key

// Функция для чтения данных из JSONBin.io
async function readDatabase() {
    const response = await axios.get(`https://api.jsonbin.io/v3/b/${BIN_ID}/latest`, {
        headers: {
            'X-Master-Key': SECRET_KEY
        }
    });
    return response.data.record;
}

// Функция для записи данных в JSONBin.io
async function writeDatabase(data) {
    await axios.put(`https://api.jsonbin.io/v3/b/${BIN_ID}`, data, {
        headers: {
            'Content-Type': 'application/json',
            'X-Master-Key': SECRET_KEY
        }
    });
}

exports.handler = async function(event, context) {
    try {
        const database = await readDatabase();
        const { userId, data } = JSON.parse(event.body);

        // Проверка, существует ли пользователь
        let user = database.users.find(u => u.userId === userId);
        if (!user) {
            // Если пользователь не существует, добавляем его
            user = { userId, data };
            database.users.push(user);
        } else {
            // Если пользователь существует, обновляем его данные
            user.data = data;
        }

        // Записываем обновленные данные в JSONBin.io
        await writeDatabase(database);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: 'User data saved', user })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ errorType: error.name, errorMessage: error.message, trace: error.stack.split('\n') })
        };
    }
};
