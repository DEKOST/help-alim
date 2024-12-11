document.addEventListener('DOMContentLoaded', function() {
    const tg = window.Telegram.WebApp;
    tg.expand();

    const userId = tg.initDataUnsafe.user.id;
    const username = tg.initDataUnsafe.user.username;

    console.log('User ID:', userId);
    console.log('Username:', username);

    // Отправка данных на сервер
    fetch('./netlify/functions/saveUserData.json', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ userId, username })
    });
    
    const clickButton = document.getElementById('clickButton');
    const upgradeButton = document.getElementById('upgradeButton');
    const upgradeClickButton = document.getElementById('upgradeClickButton');
    const rugPullButton = document.getElementById('rugPullButton');
    const scoreDisplay = document.getElementById('score');
    const hint = document.getElementById('hint');
    const notification = document.getElementById('notification');
    const gameImage = document.getElementById('gameImage');
    const achievementsButton = document.getElementById('achievementsButton');
    const resetButton = document.getElementById('resetButton');
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
    let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
    let add20000ButtonClicked = localStorage.getItem('add20000ButtonClicked') === 'true';
    let achievementsUnlocked = JSON.parse(localStorage.getItem('achievementsUnlocked')) || [];
    let clickUpgradeLevel = localStorage.getItem('clickUpgradeLevel') ? parseInt(localStorage.getItem('clickUpgradeLevel')) : 0;
    let clickUpgradeCost = localStorage.getItem('clickUpgradeCost') ? parseInt(localStorage.getItem('clickUpgradeCost')) : 100;

    scoreDisplay.textContent = `$${score}`;

    function updateScoreDisplay() {
        scoreDisplay.textContent = `$${score}`;
    }

    function updateUpgradeButton() {
        upgradeClickButton.textContent = `Upgrade Click ($${clickUpgradeCost})`;
    }

    function closeUpgradeModal() {
        upgradeModal.style.display = 'none';
    }

    clickButton.addEventListener('click', function() {
        score += 1 + clickUpgradeLevel; // Увеличиваем score в зависимости от уровня прокачки
        updateScoreDisplay();
        localStorage.setItem('score', score);
        checkScore();
        checkAchievements();
        playClickSound();
        showScoreIncrement();
    });

    gameImage.addEventListener('click', function() {
        score += 1 + clickUpgradeLevel; // Увеличиваем score в зависимости от уровня прокачки
        updateScoreDisplay();
        localStorage.setItem('score', score);
        checkScore();
        checkAchievements();
        playClickSound();
        showScoreIncrement();
    });

    achievementsButton.addEventListener('click', function() {
        achievementsModal.style.display = 'block';
    });

    resetButton.addEventListener('click', function() {
        localStorage.clear();
        location.reload();
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
        if (!add20000ButtonClicked) {
            score += 20000;
            updateScoreDisplay();
            localStorage.setItem('score', score);
            add20000ButtonClicked = true;
            localStorage.setItem('add20000ButtonClicked', 'true');
            gameImage.src = '2.png'; // Изменить изображение на 2.png
            addAchievement('rug_pull', '🐔 Петушара. Сделать RUG PULL!');
            showAchievementNotification('🐔 Петушара. Сделать RUG PULL!', 'rug_pull_image.webp');
            achievementSound.play();
            closeUpgradeModal();
        } else {
            closeUpgradeModal();
            showNotification('Ты больше не можешь воспользоваться этой функцией. Тебя изгнали! Иди на хуй! 🖕🖕🖕');
        }
    });

    function checkScore() {
        if (score >= 100) {
            rugPullButton.style.display = 'block';
            if (hint) {
                hint.style.display = 'none';
            }
        }

        if (score >= 20000) {
            gameImage.src = '2.png'; // Изменить изображение на 2.png
        }
    }


    function checkAchievements() {
        if (score >= 10 && !achievementsUnlocked.includes('10')) {
            addAchievement('10', 'Бомж. Заработать $10');
            showAchievementNotification('Разблокирована ачивка: Бомж. Заработать $10');
            achievementSound.play();
        }
        if (score >= 15 && !achievementsUnlocked.includes('15')) {
            addAchievement('15', 'Нищий. Заработать $15');
            showAchievementNotification('Разблокирована ачивка: Нищий. Заработать $15');
            achievementSound.play();
        }
        if (score >= 20 && !achievementsUnlocked.includes('20')) {
            addAchievement('20', 'Бедняк. Заработать $20');
            showAchievementNotification('Разблокирована ачивка: Бедняк. Заработать $20');
            achievementSound.play();
        }
        if (score >= 50 && !achievementsUnlocked.includes('50')) {
            addAchievement('50', 'Рабочий класс. Заработать $50');
            showAchievementNotification('Разблокирована ачивка: Рабочий класс. Заработать $50');
            achievementSound.play();
        }
        if (score >= 100 && !achievementsUnlocked.includes('100')) {
            addAchievement('100', 'Средний класс. Заработать $100. Разблокирована функция - "Rug pull"!');
            showAchievementNotification('Разблокирована ачивка: Средний класс. Заработать $100. Разблокирована функция - "Rug pull"!');
            achievementSound.play();
        }
        if (score >= 20200 && !achievementsUnlocked.includes('20200')) {
            addAchievement('20200', 'Дурачек');
            showAchievementNotification('Разблокирована ачивка: "Дурачек". Хватит тыкать, пиздюй на завод!');
            achievementSound.play();
        }
    }

    function addAchievement(key, text) {
        if (!achievementsUnlocked.includes(key)) {
            const achievementItem = document.createElement('li');
            achievementItem.textContent = text;
            achievementList.appendChild(achievementItem);
            achievementsUnlocked.push(key);
            localStorage.setItem('achievementsUnlocked', JSON.stringify(achievementsUnlocked));
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
            '10': 'Бомж. Заработать $10',
            '15': 'Нищий. Заработать $15',
            '20': 'Бедняк. Заработать $20',
            '50': 'Рабочий класс. Заработать $50',
            '100': 'Средний класс. Заработать $100',
            'rug_pull': '🐔 Петушара. Сделать RUG PULL!',
            '20200': 'Дурачек'
        };
        achievementsUnlocked.forEach(key => {
            if (achievements[key]) {
                const achievementItem = document.createElement('li');
                achievementItem.textContent = achievements[key];
                achievementList.appendChild(achievementItem);
            }
        });
    }

    // Проверка счета при загрузке страницы
    function checkScoreOnLoad() {
        if (score >= 100) {
            rugPullButton.style.display = 'block';
            if (hint) {
                hint.style.display = 'none';
            }
        }

        if (score >= 20000) {
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
            localStorage.setItem('score', score);
            localStorage.setItem('clickUpgradeLevel', clickUpgradeLevel);
            localStorage.setItem('clickUpgradeCost', clickUpgradeCost);
            showNotification(`Клик прокачан до уровня ${clickUpgradeLevel}!`);
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
});
