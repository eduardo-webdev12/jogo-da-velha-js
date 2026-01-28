// =============================================
// JOGO DA VELHA - versão bem comentada
// =============================================

let tabuleiro = Array(9).fill(null);
let jogoAtivo = false;
let nomeJogador = "Jogador 1";
let nomePC = "Computador";

// Elementos da tela
const inputNome     = document.getElementById("player1");
const btnIniciar    = document.getElementById("startBtn");
const statusTexto   = document.getElementById("status");
const btnReiniciar  = document.getElementById("restart");
const casas         = document.querySelectorAll(".cell");
const labelJogador  = document.getElementById("humanLabel");
const labelPC       = document.getElementById("aiLabel");

// Combinações vencedoras
const vitorias = [
  [0,1,2], [3,4,5], [6,7,8],   // linhas
  [0,3,6], [1,4,7], [2,5,8],   // colunas
  [0,4,8], [2,4,6]             // diagonais
];

// =============================================
// FUNÇÕES
// =============================================

function iniciarPartida() {
  nomeJogador = inputNome.value.trim() || "Jogador 1";

  labelJogador.textContent = nomeJogador + " (X)";
  labelPC.textContent      = nomePC + " (O)";

  limparTudo();
  jogoAtivo = true;

  statusTexto.textContent = `Partida: ${nomeJogador} × ${nomePC}`;

  setTimeout(() => {
    statusTexto.textContent = `Vez de ${nomeJogador}`;
  }, 700);
}

function clicouNaCasa(e) {
  const casa = e.target;
  const indice = Number(casa.dataset.index);

  if (!jogoAtivo) return;
  if (tabuleiro[indice] !== null) return;

  jogar(indice, "X");

  if (verificarFimDeJogo("X", nomeJogador)) return;

  jogoAtivo = false;
  statusTexto.textContent = `${nomePC} está pensando...`;

  setTimeout(jogadaDoPC, 500);
}

function jogar(pos, simbolo) {
  tabuleiro[pos] = simbolo;

  const celula = document.querySelector(`.cell[data-index="${pos}"]`);
  celula.textContent = simbolo;
  celula.classList.add(simbolo.toLowerCase(), "ocupada");
}

function jogadaDoPC() {
  let vazias = [];
  for (let i = 0; i < 9; i++) {
    if (tabuleiro[i] === null) vazias.push(i);
  }

  if (vazias.length === 0) return;

  const sorteado = Math.floor(Math.random() * vazias.length);
  const posicao = vazias[sorteado];

  jogar(posicao, "O");

  if (verificarFimDeJogo("O", nomePC)) return;

  jogoAtivo = true;
  statusTexto.textContent = `Vez de ${nomeJogador}`;
}

function verificarFimDeJogo(simbolo, nome) {
  if (teveVencedor(simbolo)) {
    pintarVencedor(simbolo);
    statusTexto.textContent = `${nome} ganhou! 🏆`;
    jogoAtivo = false;
    btnReiniciar.classList.remove("hidden");
    return true;
  }

  if (tabuleiro.every(c => c !== null)) {
    statusTexto.textContent = "Deu velha! 😐";
    jogoAtivo = false;
    btnReiniciar.classList.remove("hidden");
    return true;
  }

  return false;
}

function teveVencedor(simbolo) {
  return vitorias.some(combo => 
    combo.every(pos => tabuleiro[pos] === simbolo)
  );
}

function pintarVencedor(simbolo) {
  vitorias.forEach(combo => {
    if (combo.every(pos => tabuleiro[pos] === simbolo)) {
      combo.forEach(pos => {
        casas[pos].classList.add("vencedor");
      });
    }
  });
}

function limparTudo() {
  tabuleiro = Array(9).fill(null);

  casas.forEach(casa => {
    casa.textContent = "";
    casa.classList.remove("x", "o", "ocupada", "vencedor");
  });

  btnReiniciar.classList.add("hidden");
}

function reiniciarJogo() {
  limparTudo();
  jogoAtivo = true;
  statusTexto.textContent = `Vez de ${nomeJogador}`;
}

// =============================================
// Eventos
// =============================================

btnIniciar.addEventListener("click", iniciarPartida);
btnReiniciar.addEventListener("click", reiniciarJogo);

casas.forEach(casa => {
  casa.addEventListener("click", clicouNaCasa);
});

inputNome.addEventListener("keypress", e => {
  if (e.key === "Enter") iniciarPartida();
});
