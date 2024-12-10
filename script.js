document.addEventListener('DOMContentLoaded', function() {
    const clickButton = document.getElementById('clickButton');
    const secretButton = document.getElementById('secretButton');
    const scoreDisplay = document.getElementById('score');
    const hint = document.getElementById('hint');
    const notification = document.getElementById('notification');
    const gameImage = document.getElementById('gameImage');
    const achievementsButton = document.getElementById('achievementsButton');
    const resetButton = document.getElementById('resetButton');
    const achievementsModal = document.getElementById('achievementsModal');
    const achievementList = document.getElementById('achievementList');
    const achievementNotificationModal = document.getElementById('achievementNotificationModal');
    const achievementNotificationText = document.getElementById('achievementNotificationText');
    const achievementImage = document.getElementById('achievementImage');
    const hintNotificationModal = document.getElementById('hintNotificationModal');
    const hintNotificationText = document.getElementById('hintNotificationText');
    const notificationModal = document.getElementById('notificationModal');
    const notificationText = document.getElementById('notificationText');
    const clickSound = document.getElementById('clickSound');
    const achievementSound = document.getElementById('achievementSound');
    let score = localStorage.getItem('score') ? parseInt(localStorage.getItem('score')) : 0;
    let add20000ButtonClicked = localStorage.getItem('add20000ButtonClicked') === 'true';
    let achievementsUnlocked = JSON.parse(localStorage.getItem('achievementsUnlocked')) || [];

    scoreDisplay.textContent = `$${score}`;

    clickButton.addEventListener('click', function() {
        score++;
        scoreDisplay.textContent = `$${score}`;
        localStorage.setItem('score', score);
        checkScore();
        checkAchievements();
        playClickSound();
        showScoreIncrement();
    });

    gameImage.addEventListener('click', function() {
        score++;
        scoreDisplay.textContent = `$${score}`;
        localStorage.setItem('score', score);
        checkScore();
        checkAchievements();
        playClickSound();
        showScoreIncrement();
    });

    secretButton.addEventListener('click', function() {
        if (score < 100) {
            showHintNotification('Для активации новой функции тебе нужно заработать $100');
        }
    });

    achievementsButton.addEventListener('click', function() {
        achievementsModal.style.display = 'block';
    });

    resetButton.addEventListener('click', function() {
        localStorage.clear();
        location.reload();
    });

    function checkScore() {
        if (score >= 100) {
            secretButton.textContent = '📉 !!! RUG PULL !!! 📉';
            secretButton.style.backgroundColor = 'red';
            secretButton.removeEventListener('click', secretButton.click);
            secretButton.addEventListener('click', function() {
                if (!add20000ButtonClicked) {
                    score += 20000;
                    scoreDisplay.textContent = `$${score}`;
                    localStorage.setItem('score', score);
                    add20000ButtonClicked = true;
                    localStorage.setItem('add20000ButtonClicked', 'true');
                    gameImage.src = '2.png'; // Изменить изображение на 2.png
                    addAchievement('rug_pull', '🐔 Петушара. Сделать RUG PULL!');
                    showAchievementNotification('Разблокирована ачивка: 🐔 Петушара. Сделать RUG PULL!', 'rug_pull_image.webp');
                    achievementSound.play();
                } else {
                    showNotification('Ты больше не можешь воспользоваться этой функцией. Тебя изгнали! Иди на хуй! 🖕🖕🖕');
                }
            });
            hint.style.display = 'none';
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
        scoreIncrement.textContent = `+1💵`;
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
                scoreDisplay.removeChild(scoreIncrement);
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
            secretButton.textContent = '📉 !!! RUG PULL !!! 📉';
            secretButton.style.backgroundColor = 'red';
            secretButton.removeEventListener('click', secretButton.click);
            secretButton.addEventListener('click', function() {
                if (!add20000ButtonClicked) {
                    score += 20000;
                    scoreDisplay.textContent = `$${score}`;
                    localStorage.setItem('score', score);
                    add20000ButtonClicked = true;
                    localStorage.setItem('add20000ButtonClicked', 'true');
                    gameImage.src = '2.png'; // Изменить изображение на 2.png
                    addAchievement('rug_pull', '🐔 Петушара. Сделать RUG PULL!');
                    showAchievementNotification('🐔 Петушара. Сделать RUG PULL!', 'rug_pull_image.webp');
                    achievementSound.play();
                } else {
                    showNotification('Ты больше не можешь воспользоваться этой функцией. Тебя изгнали! Иди на хуй! 🖕🖕🖕');
                }
            });
            hint.style.display = 'none';
        }

        if (score >= 20000) {
            gameImage.src = '2.png'; // Изменить изображение на 2.png
        }
    }

    loadAchievements();
    checkScoreOnLoad();

    // Close the modal when the user clicks on <span> (x)
    document.querySelectorAll('.close').forEach(closeButton => {
        closeButton.addEventListener('click', function() {
            this.parentElement.parentElement.style.display = 'none';
        });
    });

    // Close the modal when the user clicks anywhere outside of the modal
    window.addEventListener('click', function(event) {
        if (event.target === achievementsModal) {
            achievementsModal.style.display = 'none';
        }
        if (event.target === achievementNotificationModal) {
            achievementNotificationModal.style.display = 'none';
        }
        if (event.target === hintNotificationModal) {
            hintNotificationModal.style.display = 'none';
        }
        if (event.target === notificationModal) {
            notificationModal.style.display = 'none';
        }
    });

    // Initialize Telegram WebApp
    if (window.Telegram.WebApp.initDataUnsafe) {
        const tg = window.Telegram.WebApp;
        tg.expand();

        tg.MainButton.text = "Помоги Алиму!";
        tg.MainButton.show();
        tg.MainButton.onClick(function() {
            score += 100;
            scoreDisplay.textContent = `$${score}`;
            localStorage.setItem('score', score);
            checkScore();
            checkAchievements();
            playClickSound();
            showScoreIncrement();
        });

        tg.onEvent('mainButtonClicked', function() {
            score += 100;
            scoreDisplay.textContent = `$${score}`;
            localStorage.setItem('score', score);
            checkScore();
            checkAchievements();
            playClickSound();
            showScoreIncrement();
        });

        // Add to Home Screen
        const addToHomeScreenButton = document.createElement('button');
        addToHomeScreenButton.textContent = 'Добавить на главный экран';
        addToHomeScreenButton.style.backgroundColor = 'green';
        addToHomeScreenButton.style.color = 'white';
        addToHomeScreenButton.style.padding = '10px';
        addToHomeScreenButton.style.border = 'none';
        addToHomeScreenButton.style.borderRadius = '5px';
        addToHomeScreenButton.style.cursor = 'pointer';
        addToHomeScreenButton.style.marginTop = '10px';
        document.querySelector('.container').appendChild(addToHomeScreenButton);

        addToHomeScreenButton.addEventListener('click', function() {
            tg.addToHomeScreen();
        });

        // Check Home Screen Status
        tg.checkHomeScreenStatus(function(status) {
            if (status) {
                console.log('App is on the home screen');
            } else {
                console.log('App is not on the home screen');
            }
        });
    }
});
