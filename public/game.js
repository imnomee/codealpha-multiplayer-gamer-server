const socket = io();

// Join the game
const userId = Math.floor(Math.random() * 1000); // Mock userId for now
socket.emit('joinGame', userId);

// Handle game start
socket.on('startGame', (data) => {
    document.getElementById('game-status').innerText = data.message;
});

// Handle guesses
document.getElementById('guess-btn').addEventListener('click', () => {
    const guess = document.getElementById('guess-input').value;
    socket.emit('makeGuess', { roomName: `room-${userId}`, guess });
});

// Handle feedback
socket.on('feedback', (data) => {
    document.getElementById('game-status').innerText = data.message;
});

// Handle game end
socket.on('gameEnd', (data) => {
    document.getElementById('game-status').innerText = data.message;
});
