// Estado do jogo
let board = Array(9).fill(null);
let currentPlayer = 'X';
let gameActive = false;
let player1Name = 'Jogador 1';
let player2Name = 'Jogador 2';

// Elementos DOM
const player1Input = document.getElementById('player1');
const player2Input = document.getElementById('player2');
const startBtn = document.getElementById('startBtn');
const statusEl = document.getElementById('status');
const boardEl = document.getElementById('board');
const restartBtn = document.getElementById('restart');
const cells = document.querySelectorAll('.cell');

// Combinações vencedoras
const winningConditions = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
    [0, 4, 8], [2, 4, 6]  // diagonais
];

// Funções do jogo
function startGame() {
    player1Name = player1Input.value.trim() || 'Jogador 1';
    player2Name = player2Input.value.trim() || 'Jogador 2';
    restartGame();
    updateStatus();
}

function handleCellClick(event) {
    const index = parseInt(event.target.dataset.index);
    
    if (board[index] !== null || !gameActive) {
        return;
    }

    // Marca a jogada
    board[index] = currentPlayer;
    event.target.textContent = currentPlayer;
    event.target.classList.add(currentPlayer.toLowerCase(), 'occupied');

    // Verifica vitória
    if (checkWinner()) {
        highlightWinner();
        statusEl.textContent = `${getCurrentPlayerName()} venceu! 🎉`;
        gameActive = false;
        restartBtn.classList.remove('hidden');
        return;
    }

    // Verifica empate
    if (board.every(cell => cell !== null)) {
        statusEl.textContent = 'Empate! 🤝 Reinicie para jogar novamente.';
        gameActive = false;
        restartBtn.classList.remove('hidden');
        return;
    }

    // Troca jogador
    currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    updateStatus();
}

function checkWinner() {
    return winningConditions.some(condition => {
        return condition.every(index => board[index] === currentPlayer);
    });
}

function highlightWinner() {
    winningConditions.forEach(condition => {
        if (condition.every(index => board[index] === currentPlayer)) {
            condition.forEach(index => {
                cells[index].classList.add('winner');
            });
        }
    });
}

function getCurrentPlayerName() {
    return currentPlayer === 'X' ? player1Name : player2Name;
}

function updateStatus() {
    if (gameActive) {
        statusEl.textContent = `🕐 Vez de ${getCurrentPlayerName()}`;
    }
}

function restartGame() {
    board = Array(9).fill(null);
    currentPlayer = 'X';
    gameActive = true;
    
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('x', 'o', 'occupied', 'winner');
    });
    
    restartBtn.classList.add('hidden');
    statusEl.textContent = `🕐 Vez de ${player1Name}`;
}

// Event Listeners
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

// Enter nos inputs inicia jogo
player1Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startGame();
});
player2Input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') startGame();
});
