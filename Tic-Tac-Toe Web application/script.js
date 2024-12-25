const board = document.getElementById('board');
const message = document.getElementById('message');
const playWithAI = document.getElementById('playWithAI');
let currentPlayer = 'X';
let gameState = Array(9).fill(null);
let scoreX = 0;
let scoreO = 0;
let isAIEnabled = false;

function createBoard() {
    board.innerHTML = '';
    gameState.forEach((_, index) => {
        const cellDiv = document.createElement('div');
        cellDiv.classList.add('cell');
        cellDiv.dataset.index = index;
        cellDiv.addEventListener('click', handleCellClick);
        board.appendChild(cellDiv);
    });
}

function highlightWinningCombination(combination) {
    combination.forEach(index => {
        const cell = board.children[index];
        cell.classList.add('win');
    });
}

function checkWinner() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
            highlightWinningCombination(combination);
            return true;
        }
    }
    return false;
}

function updateScore() {
    if (currentPlayer === 'X') {
        scoreX++;
        document.getElementById('scoreX').textContent = `Player X: ${scoreX}`;
    } else {
        scoreO++;
        document.getElementById('scoreO').textContent = `Player O: ${scoreO}`;
    }
}

function handleCellClick(event) {
    const cell = event.target;
    const index = cell.dataset.index;

    if (gameState[index] || checkWinner()) {
        return;
    }

    makeMove(index, currentPlayer);

    if (checkWinner()) {
        message.textContent = `Player ${currentPlayer} wins!`;
        updateScore();
        return;
    }

    if (gameState.every(cell => cell)) {
        message.textContent = "It's a draw!";
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player ${currentPlayer}'s turn`;

    if (isAIEnabled && currentPlayer === 'O') {
        setTimeout(makeAIMove, 500);
    }
}

function makeMove(index, player) {
    gameState[index] = player;
    const cell = board.children[index];
    cell.textContent = player;
    cell.classList.add('taken');
}

function makeAIMove() {
    const bestMove = findBestMove();
    if (bestMove !== null) {
        makeMove(bestMove, currentPlayer);
        if (checkWinner()) {
            message.textContent = `Player ${currentPlayer} wins!`;
            updateScore();
            return;
        }
    }

    if (gameState.every(cell => cell)) {
        message.textContent = "It's a draw!";
        return;
    }

    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    message.textContent = `Player ${currentPlayer}'s turn`;
}

function findBestMove() {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
    ];

    for (const combination of winningCombinations) {
        const [a, b, c] = combination;
        if (gameState[a] === currentPlayer && gameState[b] === currentPlayer && !gameState[c]) return c;
        if (gameState[a] === currentPlayer && gameState[c] === currentPlayer && !gameState[b]) return b;
        if (gameState[b] === currentPlayer && gameState[c] === currentPlayer && !gameState[a]) return a;
        if (!gameState[a] && !gameState[b] && !gameState[c]) return c;
    }

    return gameState.findIndex(cell => cell === null);
}

function resetGame() {
    currentPlayer = 'X';
    gameState = Array(9).fill(null);
    message.textContent = `Player ${currentPlayer}'s turn`;
    createBoard();
}

function toggleAI() {
    isAIEnabled = playWithAI.checked;
    resetGame();
}

// Initialize the game
createBoard();
