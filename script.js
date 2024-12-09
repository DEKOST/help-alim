document.addEventListener('DOMContentLoaded', function() {
    const clickButton = document.getElementById('clickButton');
    const secretButton = document.getElementById('secretButton');
    const scoreDisplay = document.getElementById('score');
    const hint = document.getElementById('hint');
    const notification = document.getElementById('notification');
    const gameImage = document.getElementById('gameImage');
    let score = 0;
    let add20000ButtonClicked = false;

    clickButton.addEventListener('click', function() {
        score++;
        scoreDisplay.textContent = `Score: ${score}`;
        checkScore();
    });

    secretButton.addEventListener('click', function() {
        if (score < 5) {
            hint.style.display = 'block';
        }
    });

    function checkScore() {
        if (score >= 5 && !add20000ButtonClicked) {
            secretButton.textContent = 'Add 20000 Points';
            secretButton.removeEventListener('click', secretButton.click);
            secretButton.addEventListener('click', function() {
                if (!add20000ButtonClicked) {
                    score += 20000;
                    scoreDisplay.textContent = `Score: ${score}`;
                    //secretButton.disabled = true;
                    add20000ButtonClicked = true;
                    gameImage.src = '2.png'; // Изменить изображение на 2.png
                } else {
                    notification.style.display = 'block';
                    setTimeout(() => {
                        notification.style.display = 'none';
                    }, 3000); // Скрыть уведомление через 3 секунды
                }
            });
            hint.style.display = 'none';
        }
    }
});
