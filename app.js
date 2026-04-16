let timeLeft = 25 * 60; // 25 minutes in seconds
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
        lastTimestamp = Date.now(); // Record the last known "active" second
    } else {
        addStar();
        timeLeft = 25 * 60; // Reset for next star
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

// THE KEY FEATURE: Visibility Detection
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // User switched apps or locked screen - Pause the interval
        clearInterval(timerId);
        statusDisplay.textContent = "Paused - Stay on the page!";
    } else {
        // User returned - Check how much time passed
        if (isRunning) {
            const now = Date.now();
            const gapInSeconds = Math.floor((now - lastTimestamp) / 1000);
            
            // Re-sync the timer by subtracting the time the phone was off/idle
            timeLeft -= gapInSeconds;
            
            if (timeLeft < 0) {
                // If they were away long enough to earn a star
                addStar();
                timeLeft = (25 * 60) + timeLeft; // Handle overflow
            }
            
            updateDisplay();
            timerId = setInterval(tick, 1000);
            statusDisplay.textContent = "Focusing...";
        }
    }
});

startBtn.addEventListener('click', startTimer);
