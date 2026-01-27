// -------- ESTADO DO JOGO --------
let board = Array(9).fill(null); // tabuleiro (0 a 8)
let gameActive = false;          // se o jogo está rolando
let humanName = 'Jogador 1';     // nome do humano
let aiName = 'Computador';       // nome da IA

// -------- ELEMENTOS DO DOM --------
const player1Input = document.getElementById('player1');
const startBtn = document.getElementById('startBtn');
const statusEl = document.getElementById('status');
const restartBtn = document.getElementById('restart');
const cells = document.querySelectorAll('.cell');
const humanLabel = document.getElementById('humanLabel');
const aiLabel = document.getElementById('aiLabel');

// combinações vencedoras
const winningConditions = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // linhas
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // colunas
  [0, 4, 8], [2, 4, 6]             // diagonais
];

// -------- FUNÇÕES PRINCIPAIS --------

// iniciar o jogo
function startGame() {
  humanName = player1Input.value.trim() || 'Jogador 1';
  aiName = 'Computador';

  humanLabel.textContent = `${humanName} (X)`;
  aiLabel.textContent = `${aiName} (O)`;

  resetBoard();
  gameActive = true;

  statusEl.textContent = `🕹️ ${humanName} (X) vs ${aiName} (O)`;
  setTimeout(() => {
    statusEl.textContent = `🕐 Vez de ${humanName}`;
  }, 800);
}

// clique do jogador humano
function handleCellClick(event) {
  const index = parseInt(event.target.dataset.index);

  if (!gameActive || board[index] !== null) return;

  humanMove(index);
}

// jogada do humano
function humanMove(index) {
  makeMove(index, 'X');

  if (checkEndGame('X', humanName)) return;

  gameActive = false;
  statusEl.textContent = `🤖 ${aiName} pensando...`;

  setTimeout(() => {
    aiMove();
  }, 500);
}

// jogada da IA (aleatória simples)
function aiMove() {
  const emptyIndices = board
    .map((value, index) => (value === null ? index : null))
    .filter(index => index !== null);

  if (emptyIndices.length === 0) return;

  const randomIndex = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

  makeMove(randomIndex, 'O');

  if (checkEndGame('O', aiName)) return;

  gameActive = true;
  statusEl.textContent = `🕐 Vez de ${humanName}`;
}

// marca jogada no tabuleiro e na interface
function makeMove(index, symbol) {
  board[index] = symbol;

  const cell = document.querySelector(`.cell[data-index="${index}"]`);
  if (!cell) return;

  cell.textContent = symbol;
  cell.classList.add(symbol.toLowerCase(), 'occupied');
}

// verifica vitória/empate para um símbolo
function checkEndGame(symbol, name) {
  if (checkWinner(symbol)) {
    highlightWinner(symbol);
    statusEl.textContent = `${name} venceu! 🎉`;
    gameActive = false;
    restartBtn.classList.remove('hidden');
    return true;
  }

  if (board.every(cell => cell !== null)) {
    statusEl.textContent = 'Empate! 🤝 Reinicie para jogar novamente.';
    gameActive = false;
    restartBtn.classList.remove('hidden');
    return true;
  }

  return false;
}

// verifica se um símbolo venceu
function checkWinner(symbol) {
  return winningConditions.some(condition =>
    condition.every(index => board[index] === symbol)
  );
}

// destaca as casas vencedoras
function highlightWinner(symbol) {
  winningConditions.forEach(condition => {
    if (condition.every(index => board[index] === symbol)) {
      condition.forEach(index => {
        cells[index].classList.add('winner');
      });
    }
  });
}

// limpa o tabuleiro visual e o estado
function resetBoard() {
  board = Array(9).fill(null);
  cells.forEach(cell => {
    cell.textContent = '';
    cell.classList.remove('x', 'o', 'occupied', 'winner');
  });
  restartBtn.classList.add('hidden');
}

// reiniciar jogo (mantendo nomes)
function restartGame() {
  resetBoard();
  gameActive = true;
  statusEl.textContent = `🕐 Vez de ${humanName}`;
}

// -------- EVENT LISTENERS --------
startBtn.addEventListener('click', startGame);
restartBtn.addEventListener('click', restartGame);
cells.forEach(cell => cell.addEventListener('click', handleCellClick));

player1Input.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') startGame();
});
