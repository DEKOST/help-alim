const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, '/database.json');

// Функция для чтения данных из JSON-файла
function readDatabase() {
    const data = fs.readFileSync(databasePath, 'utf8');
    return JSON.parse(data);
}

// Функция для записи данных в JSON-файл
function writeDatabase(data) {
    fs.writeFileSync(databasePath, JSON.stringify(data, null, 2), 'utf8');
}

exports.handler = async function(event, context) {
    try {
        const database = readDatabase();
        const { userId, username } = JSON.parse(event.body);

        // Проверка, существует ли пользователь
        let user = database.users.find(u => u.userId === userId);
        if (!user) {
            // Если пользователь не существует, добавляем его
            user = { userId, username };
            database.users.push(user);
        } else {
            // Если пользователь существует, обновляем его данные
            user.username = username;
        }

        // Записываем обновленные данные в JSON-файл
        writeDatabase(database);

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
