function updateCountdown() {
    const targetDate = new Date('April 1, 2025 00:00:00').getTime();
    const now = new Date().getTime();
    const timeLeft = targetDate - now;

    if (timeLeft <= 0) {
        document.getElementById('counter').innerHTML =
            'The discount period has ended!';
        return;
    }

    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
        (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

    document.getElementById('counter').innerHTML = `
        ${days} day${
        days !== 1 ? 's' : ''
    } ${hours} h ${minutes} min ${seconds} s - Until the Special Promotion Ends!
    `;
}

// Update the counter every second
setInterval(updateCountdown, 1000);

// Run it once immediately to prevent delay
updateCountdown();
