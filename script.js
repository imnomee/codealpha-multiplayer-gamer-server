const cells = document.querySelectorAll('.cell');
const statusDisplay = document.querySelector('#game-status');
const resetButton = document.querySelector('#reset-button');

let currentPlayer = 'X'; // X always goes first
let gameState = ['', '', '', '', '', '', '', '', ''];
let gameActive = true;

const winningConditions = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8], // Rows
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8], // Columns
    [0, 4, 8],
    [2, 4, 6], // Diagonals
];

// Display game status
function displayStatus(message) {
    statusDisplay.textContent = message;
}

// Check if there's a winner
function checkWinner() {
    for (let condition of winningConditions) {
        const [a, b, c] = condition;
        if (
            gameState[a] &&
            gameState[a] === gameState[b] &&
            gameState[a] === gameState[c]
        ) {
            gameActive = false;
            displayStatus(`Player ${currentPlayer} wins!`);
            return;
        }
    }
    if (!gameState.includes('')) {
        gameActive = false;
        displayStatus('Game ends in a draw!');
    }
}

// Handle click event for each cell
function handleCellClick(event) {
    const clickedCell = event.target;
    const clickedIndex = Array.from(cells).indexOf(clickedCell);

    if (gameState[clickedIndex] !== '' || !gameActive) {
        return;
    }

    gameState[clickedIndex] = currentPlayer;
    clickedCell.textContent = currentPlayer;

    checkWinner();

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    displayStatus(`Player ${currentPlayer}'s turn`);
}

// Reset the game
resetButton.addEventListener('click', () => {
    gameState = ['', '', '', '', '', '', '', '', ''];
    gameActive = true;
    currentPlayer = 'X';
    cells.forEach((cell) => (cell.textContent = ''));
    displayStatus(`Player X's turn`);
});

// Add event listeners to each cell
cells.forEach((cell) => cell.addEventListener('click', handleCellClick));

// Initial game status
displayStatus(`Player X's turn`);
