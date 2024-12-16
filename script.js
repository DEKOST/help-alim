document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.expand();

    const userId = tg.initDataUnsafe?.user?.id;
    const username = tg.initDataUnsafe?.user?.username;

    if (!userId || !username) {
        console.error('Unable to retrieve user data');
        return;
    }

    console.log('User ID:', userId);
    console.log('Username:', username);

    let score = 0;
    let addRugPullClicked = false;
    let achievementsUnlocked = [];
    let clickUpgradeLevel = 0;
    let clickUpgradeCost = 100;
    let clickCount = 0;

    // Функция для отправки всех данных на сервер
    function saveUserData() {
        const data = {
            score,
            addRugPullClicked,
            achievementsUnlocked,
            clickUpgradeLevel,
            clickUpgradeCost
        };

        fetch('/.netlify/functions/saveUserData', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, username, data })
        })
            .then(response => response.json())
            .then(data => {
                console.log('Server response:', data);
            })
            .catch(error => {
                console.error('Error sending data to server:', error);
            });
    }

    // Функция для загрузки данных с сервера
    function loadUserData() {
        fetch(`/.netlify/functions/loadUserData?userId=${userId}`)
            .then(response => response.json())
            .then(data => {
                const storedData = data.data;
                console.log('Data loaded from server:', storedData);
                if (storedData) {
                    score = storedData.score !== undefined ? storedData.score : 0;
                    addRugPullClicked = storedData.addRugPullClicked !== undefined ? storedData.addRugPullClicked : false;
                    achievementsUnlocked = storedData.achievementsUnlocked !== undefined ? storedData.achievementsUnlocked : [];
                    clickUpgradeLevel = storedData.clickUpgradeLevel !== undefined ? storedData.clickUpgradeLevel : 0;
                    clickUpgradeCost = storedData.clickUpgradeCost !== undefined ? storedData.clickUpgradeCost : 100;
                    console.log('Data applied from server');
                    updateScoreDisplay();
                    updateUpgradeButton();
                    loadAchievements();
                    checkScoreOnLoad();
                }
            })
            .catch(error => {
                console.error('Error loading data from server:', error);
            });
    }

    const clickButton = document.getElementById('clickButton');
    const upgradeButton = document.getElementById('upgradeButton');
    const upgradeClickButton = document.getElementById('upgradeClickButton');
    const rugPullButton = document.getElementById('rugPullButton');
    const hookahButton = document.getElementById('hookahButton');
    const amaButton = document.getElementById('amaButton');
    const sadButton = document.getElementById('sadButton');
    const scoreDisplay = document.getElementById('score');
    const hint = document.getElementById('hint');
    const notification = document.getElementById('notification');
    const gameImage = document.getElementById('gameImage');
    const achievementsButton = document.getElementById('achievementsButton');
    const resetButton = document.getElementById('resetButton');
    const resetButtonText = document.getElementById('resetButtonText');
    const addToHomeScreenButton = document.getElementById('addToHomeScreenButton');
    const achievementsModal = document.getElementById('achievementsModal');
    const achievementList = document.getElementById('achievementList');
    const achievementNotificationModal = document.getElementById('achievementNotificationModal');
    const achievementNotificationText = document.getElementById('achievementNotificationText');
    const achievementImage = document.getElementById('achievementImage');
    const hintNotificationModal = document.getElementById('hintNotificationModal');
    const hintNotificationText = document.getElementById('hintNotificationText');
    const notificationModal = document.getElementById('notificationModal');
    const notificationText = document.getElementById('notificationText');
    const upgradeModal = document.getElementById('upgradeModal');
    const clickSound = document.getElementById('clickSound');
    const achievementSound = document.getElementById('achievementSound');

    scoreDisplay.textContent = `$${score}`;

    function updateScoreDisplay() {
        scoreDisplay.textContent = `$${score}`;
    }

    function updateUpgradeButton() {
        upgradeClickButton.textContent = `Больше 💵 за клик ($${clickUpgradeCost})`;
        // hookahButton.textContent = `💩 Забить кальян ($${clickUpgradeCost})`;
        // amaButton.textContent = `🤡 Провести AMA сессию ($${clickUpgradeCost})`;
        // sadButton.textContent = `☹️ Погрустить ($${clickUpgradeCost})`;
    }

    function closeUpgradeModal() {
        upgradeModal.style.display = 'none';
    }

    clickButton.addEventListener('click', function() {
        score += 1 + clickUpgradeLevel; // Увеличиваем score в зависимости от уровня прокачки
        updateScoreDisplay();
        clickCount++;
        if (clickCount >= 10) {
            saveUserData();
            clickCount = 0;
        }
        checkScore();
        checkAchievements();
        playClickSound();
        showScoreIncrement();
    });

    gameImage.addEventListener('click', function() {
        score += 1 + clickUpgradeLevel; // Увеличиваем score в зависимости от уровня прокачки
        updateScoreDisplay();
        clickCount++;
        if (clickCount >= 10) {
            saveUserData();
            clickCount = 0;
        }
        checkScore();
        checkAchievements();
        playClickSound();
        showScoreIncrement();
    });

    achievementsButton.addEventListener('click', function() {
        achievementsModal.style.display = 'block';
    });

    resetButton.addEventListener('click', function() {
        if (score >= 10) {
            score = Math.round(score * 0.1); // Отнимаем 90% очков
            updateScoreDisplay();
            addAchievement('reset', 'Создал новую монету!');
            showAchievementNotification('Разблокирована ачивка: Создал новую монету!');
            achievementSound.play();
            addRugPullClicked = false;
            resetButton.style.display = 'none'; // Скрыть кнопку resetButton
            resetButtonText.style.display = 'none'; // Скрыть кнопку resetButtonText
            saveUserData();
        } else {
            showNotification('Недостаточно очков для сброса прогресса!');
        }
    });

    addToHomeScreenButton.addEventListener('click', function() {
        if (window.Telegram.WebApp.initDataUnsafe) {
            const tg = window.Telegram.WebApp;
            tg.addToHomeScreen();
        }
    });

    upgradeButton.addEventListener('click', function() {
        upgradeModal.style.display = 'block';
    });

    upgradeClickButton.addEventListener('click', function() {
        upgradeClick();
        closeUpgradeModal();
    });

    rugPullButton.addEventListener('click', function() {
        if (!addRugPullClicked) {
            score += 100000; // Увеличиваем стоимость Rug Pull до 100000
            updateScoreDisplay();
            addRugPullClicked = true;
            gameImage.src = '2.png'; // Изменить изображение на 2.png
            addAchievement('rug_pull', '🐔 Поступок петушары. Сделать RUG PULL!');
            showAchievementNotification('🐔 Поступок петушары. Сделать RUG PULL!', 'rug_pull_image.webp');
            achievementSound.play();
            closeUpgradeModal();
            saveUserData();
            resetButton.style.display = 'inline'; // Показать кнопку resetButton
            resetButtonText.style.display = 'block'; // Показать кнопку resetButtonText
        } else {
            closeUpgradeModal();
            showNotification('Ты больше не можешь сделать RUG PULL в этой монете. Тебя изгнали! Иди на хуй! 🖕🖕🖕');
            showNotification('Создавай новую монету что бы сделать RUG PULL еще раз');
        }
    });

    function getRandomEffect() {
        const randomValue = Math.random();
        if (randomValue < 0.25) {
            // 25% chance for a positive effect
            return Math.floor(Math.random() * 10001); // Random value between 0 and 10000
        } else {
            // 75% chance for a negative effect
            return -Math.floor(Math.random() * 5001); // Random value between -10000 and 0
        }
    }

    hookahButton.addEventListener('click', function() {
        const effect = getRandomEffect();
        score += effect;
        updateScoreDisplay();
        showNotification(`Ты забил кальян и расслабился. ${effect >= 0 ? '+' : ''}${effect} $!`);
        saveUserData();
    });

    amaButton.addEventListener('click', function() {
        const effect = getRandomEffect();
        score += effect;
        updateScoreDisplay();
        showNotification(`Ты провел AMA сессию и ${effect >= 0 ? 'получил' : 'потерял'} ${effect >= 0 ? '+' : ''}${effect} $!`);
        saveUserData();
    });

    sadButton.addEventListener('click', function() {
        const effect = getRandomEffect();
        score += effect;
        updateScoreDisplay();
        showNotification(`Ты погрустил и ${effect >= 0 ? 'получил' : 'потерял'} мотивацию. ${effect >= 0 ? '+' : ''}${effect} $!`);
        saveUserData();
    });

    function checkScore() {
        if (score >= 100000) { // Увеличиваем порог для появления кнопки Rug Pull
            rugPullButton.style.display = 'block';
            if (hint) {
                hint.style.display = 'none';
            }
        }
        else {
            rugPullButton.style.display = 'none';
        }

        if (score >= 200000) { // Увеличиваем порог для изменения изображения
            gameImage.src = '2.png'; // Изменить изображение на 2.png
        }
    }

    function checkAchievements() {
        if (score >= 1000 && !achievementsUnlocked.includes('1000')) {
            addAchievement('1000', 'Бомж. Заработать $1000');
            showAchievementNotification('Разблокирована ачивка: Бомж. Заработать $1000');
            achievementSound.play();
        }
        if (score >= 5000 && !achievementsUnlocked.includes('5000')) {
            addAchievement('5000', 'Нищий. Заработать $5000');
            showAchievementNotification('Разблокирована ачивка: Нищий. Заработать $5000');
            achievementSound.play();
        }
        if (score >= 10000 && !achievementsUnlocked.includes('10000')) {
            addAchievement('10000', 'Бедняк. Заработать $10000');
            showAchievementNotification('Разблокирована ачивка: Бедняк. Заработать $10000');
            achievementSound.play();
        }
        if (score >= 50000 && !achievementsUnlocked.includes('50000')) {
            addAchievement('50000', 'Рабочий класс. Заработать $50000');
            showAchievementNotification('Разблокирована ачивка: Рабочий класс. Заработать $50000');
            achievementSound.play();
        }
        if (score >= 100000 && !achievementsUnlocked.includes('100000')) {
            addAchievement('100000', 'Средний класс. Заработать $100000. Разблокирована функция - "Rug pull"!');
            showAchievementNotification('Разблокирована ачивка: Средний класс. Заработать $100000. Разблокирована функция - "Rug pull"!');
            achievementSound.play();
        }
        if (score >= 2000000 && !achievementsUnlocked.includes('2000000')) {
            addAchievement('2000000', 'Дурачек');
            showAchievementNotification('Разблокирована ачивка: "Дурачек". Хватит тыкать, пиздуй на завод!');
            achievementSound.play();
        }
    }

    function addAchievement(key, text) {
        if (!achievementsUnlocked.includes(key)) {
            const achievementItem = document.createElement('li');
            achievementItem.textContent = text;
            achievementList.appendChild(achievementItem);
            achievementsUnlocked.push(key);
            saveUserData();
        }
    }

    function showAchievementNotification(text, imageSrc = '') {
        achievementNotificationText.textContent = text;
        if (imageSrc) {
            achievementImage.src = imageSrc;
            achievementImage.style.display = 'block';
        } else {
            achievementImage.style.display = 'none';
        }
        achievementNotificationModal.style.display = 'block';
    }

    function showHintNotification(text) {
        hintNotificationText.textContent = text;
        hintNotificationModal.style.display = 'block';
    }

    function showNotification(text) {
        notificationText.textContent = text;
        notificationModal.style.display = 'block';
    }

    function playClickSound() {
        clickSound.pause();
        clickSound.currentTime = 0;
        clickSound.play();
    }

    function showScoreIncrement() {
        const scoreIncrement = document.createElement('span');
        scoreIncrement.textContent = `+${1 + clickUpgradeLevel}💵`;
        scoreIncrement.style.marginLeft = '10px';
        scoreIncrement.style.position = 'absolute';
        scoreIncrement.style.fontSize = '20px';
        scoreIncrement.style.color = 'green';
        scoreIncrement.style.transition = 'opacity 0.5s, transform 0.5s';
        scoreIncrement.style.opacity = '0';
        scoreIncrement.style.transform = 'translateY(-20px)';
        scoreDisplay.appendChild(scoreIncrement);

        setTimeout(() => {
            scoreIncrement.style.opacity = '1';
            scoreIncrement.style.transform = 'translateY(0)';
        }, 10);

        setTimeout(() => {
            scoreIncrement.style.opacity = '0';
            scoreIncrement.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                if (scoreDisplay.contains(scoreIncrement)) {
                    scoreDisplay.removeChild(scoreIncrement);
                }
            }, 500);
        }, 1000);
    }

    // Загрузить уже разблокированные ачивки
    function loadAchievements() {
        const achievements = {
            '1000': 'Бомж. Заработать $10',
            '5000': 'Нищий. Заработать $500',
            '10000': 'Бедняк. Заработать $1000',
            '50000': 'Рабочий класс. Заработать $5000',
            '100000': 'Средний класс. Заработать $10000',
            'rug_pull': '🐔 Поступок петушары. Сделать RUG PULL!',
            '2000000': 'Дурачек'
        };
        if (achievementsUnlocked && Array.isArray(achievementsUnlocked)) {
            achievementsUnlocked.forEach(key => {
                if (achievements[key]) {
                    const achievementItem = document.createElement('li');
                    achievementItem.textContent = achievements[key];
                    achievementList.appendChild(achievementItem);
                }
            });
        }
    }

    // Проверка счета при загрузке страницы
    function checkScoreOnLoad() {
        if (score >= 100000) {
            rugPullButton.style.display = 'block';
            if (hint) {
                hint.style.display = 'none';
            }
        }
        else {
            rugPullButton.style.display = 'none';
        }

        if (score >= 200000) {
            gameImage.src = '2.png'; // Изменить изображение на 2.png
        }
    }

    // Функция для прокачки клика
    function upgradeClick() {
        if (score >= clickUpgradeCost) {
            score -= clickUpgradeCost;
            clickUpgradeLevel++;
            clickUpgradeCost = Math.round(clickUpgradeCost * 1.25); // Увеличиваем стоимость прокачки на 1.25
            updateScoreDisplay();
            updateUpgradeButton();
            showNotification(`Клик прокачан до уровня ${clickUpgradeLevel}!`);
            saveUserData();
        } else {
            showNotification('Недостаточно денег для прокачки клика!');
        }
    }

    loadAchievements();
    checkScoreOnLoad();
    updateUpgradeButton();

    // Close the modal when the user clicks on <span> (x)
    document.querySelectorAll('.close').forEach(closeButton => {
        closeButton.addEventListener('click', function() {
            this.parentElement.parentElement.style.display = 'none';
        });
    });

    // Сохранение данных при изменении
    window.addEventListener('beforeunload', saveUserData);

    // Загрузка данных при запуске
    loadUserData();
});
