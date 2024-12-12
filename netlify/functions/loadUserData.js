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

exports.handler = async function(event, context) {
    try {
        const database = await readDatabase();
        const { userId } = JSON.parse(event.body);

        // Проверка, существует ли пользователь
        const user = database.users.find(u => u.userId === userId);

        return {
            statusCode: 200,
            body: JSON.stringify({ user })
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({ errorType: error.name, errorMessage: error.message, trace: error.stack.split('\n') })
        };
    }
};
