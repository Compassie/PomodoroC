let timeLeft = 25 * 60; 
let timerId = null;
let lastTimestamp = null;
let isRunning = false;

const timerDisplay = document.getElementById('timer');
const startBtn = document.getElementById('startBtn');
const starsDisplay = document.getElementById('stars');
const statusDisplay = document.getElementById('status');

function updateDisplay() {
    const mins = Math.floor(timeLeft / 60);
    const secs = timeLeft % 60;
    timerDisplay.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs}`;
}

function addStar() {
    starsDisplay.textContent += '⭐';
}

function tick() {
    if (timeLeft > 0) {
        timeLeft--;
        updateDisplay();
        lastTimestamp = Date.now(); 
    } else {
        addStar();
        timeLeft = 25 * 60; 
        updateDisplay();
    }
}

function startTimer() {
    if (isRunning) return;
    isRunning = true;
    lastTimestamp = Date.now();
    timerId = setInterval(tick, 1000);
    startBtn.disabled = true;
    statusDisplay.textContent = "Focusing...";
}

// Logic for screen-off and tab-switching
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // App is in background or screen is off
        clearInterval(timerId);
    } else {
        // User returned to the app
        if (isRunning) {
            const now = Date.now();
            const gapInSeconds = Math.floor((now - lastTimestamp) / 1000);
            
            // Subtract the time that passed while the screen was off
            timeLeft -= gapInSeconds;
            
            // Logic if they earned a star while the screen was off
            while (timeLeft <= 0) {
                addStar();
                timeLeft += (25 * 60);
            }
            
            updateDisplay();
            lastTimestamp = Date.now();
            timerId = setInterval(tick, 1000);
            statusDisplay.textContent = "Focusing...";
        }
    }
});

startBtn.addEventListener('click', startTimer);
