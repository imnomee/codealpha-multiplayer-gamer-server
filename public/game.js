const socket = io('http://localhost:5001'); // Connect to your Socket.io server

// Join the game when the user clicks the button
document.getElementById('join-game').addEventListener('click', () => {
    const playerId = document.getElementById('player-id').value;
    const gameId = document.getElementById('game-id').value;

    if (!playerId || !gameId) {
        alert('Please enter both Player ID and Game ID.');
        return;
    }

    // Emit a join-game event to the server
    socket.emit('join-game', { gameId, playerId });
});

// Listen for game updates from the server
socket.on('game-updated', (data) => {
    document.getElementById('game-status').textContent = data.message; // Update game status
});

// Listen for game-over event
socket.on('game-over', (data) => {
    document.getElementById(
        'game-status'
    ).textContent = `Game over! Winner: ${data.winner}`; // Display winner
});

// Handle submitting a guess
document.getElementById('submit-guess').addEventListener('click', () => {
    const guess = document.getElementById('guess-input').value;
    const gameId = document.getElementById('game-id').value;
    const playerId = document.getElementById('player-id').value;

    if (!guess) {
        alert('Please enter a guess.');
        return;
    }

    // Emit the make-guess event to the server
    socket.emit('make-guess', { gameId, playerId, guess });
});

// Handle errors from the server
socket.on('error', (message) => {
    alert(message); // Display error message to the user
});
