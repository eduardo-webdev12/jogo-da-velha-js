// JOGO DA VELHA - IA IMBATÍVEL COM MINIMAX
// ========================================

let tabuleiro = Array(9).fill(null);
let jogoAtivo = false;
let nomeJogador = "Jogador 1";
let simboloJogador = 'X';
let simboloIA = 'O';

// Elementos
const entrada = document.getElementById("entrada");
const inputNome = document.getElementById("player1");
const btnIniciar = document.getElementById("startBtn");
const statusTexto = document.getElementById("status");
const btnReiniciar = document.getElementById("restart");
const casas = document.querySelectorAll(".cell");
const labelJogador = document.getElementById("humanLabel");
const labelIA = document.getElementById("aiLabel");

// Combinações vencedoras
const vitorias = [
  [0,1,2], [3,4,5], [6,7,8],
  [0,3,6], [1,4,7], [2,5,8],
  [0,4,8], [2,4,6]
];

// =============================================
// FUNÇÕES BÁSICAS
// =============================================

function iniciarPartida() {
  nomeJogador = inputNome.value.trim() || "Jogador 1";

  labelJogador.textContent = nomeJogador + " (X)";
  labelIA.textContent = "IA" + " (O)";

  // Esconde entrada
  entrada.classList.add("hidden");

  limparTudo();
  jogoAtivo = true;

  statusTexto.textContent = `Vez de ${nomeJogador} (X)`;

  // Se quiser que a IA comece primeiro, descomente abaixo:
  // setTimeout(jogadaDaIA, 600);
}

function clicouNaCasa(e) {
  const indice = Number(e.target.dataset.index);

  if (!jogoAtivo) return;
  if (tabuleiro[indice] !== null) return;

  fazerJogada(indice, simboloJogador);

  if (verificarFimDeJogo(simboloJogador, nomeJogador)) return;

  jogoAtivo = false;
  statusTexto.textContent = "IA pensando...";

  // Pequeno delay para parecer que está "pensando"
  setTimeout(jogadaDaIA, 400);
}

function fazerJogada(pos, simbolo) {
  tabuleiro[pos] = simbolo;

  const celula = casas[pos];
  celula.textContent = simbolo;
  celula.classList.add(simbolo.toLowerCase(), "ocupada");
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
  return vitorias.some(combo => combo.every(i => tabuleiro[i] === simbolo));
}

function pintarVencedor(simbolo) {
  vitorias.forEach(combo => {
    if (combo.every(i => tabuleiro[i] === simbolo)) {
      combo.forEach(i => casas[i].classList.add("vencedor"));
    }
  });
}

function limparTudo() {
  tabuleiro.fill(null);
  casas.forEach(c => {
    c.textContent = "";
    c.classList.remove("x", "o", "ocupada", "vencedor");
  });
  btnReiniciar.classList.add("hidden");
}

function reiniciarJogo() {
  limparTudo();
  entrada.classList.remove("hidden");  // Mostra novamente o input
  statusTexto.textContent = "Digite seu nome e clique em Iniciar";
  jogoAtivo = false;
}

// =============================================
// IA IMBATÍVEL - ALGORITMO MINIMAX
// =============================================

function jogadaDaIA() {
  const melhorMovimento = minimax(tabuleiro, simboloIA).index;
  fazerJogada(melhorMovimento, simboloIA);

  verificarFimDeJogo(simboloIA, "IA");

  jogoAtivo = true;
  statusTexto.textContent = `Vez de ${nomeJogador}`;
}

// Função principal do Minimax (recursiva)
function minimax(novoTabuleiro, jogador) {
  // Encontra posições vazias
  const posicoesVazias = novoTabuleiro.reduce((acc, val, idx) => 
    val === null ? acc.concat(idx) : acc, []);

  // Casos terminais
  if (teveVencedor(simboloJogador)) return { score: -10 };
  if (teveVencedor(simboloIA))     return { score: +10 };
  if (posicoesVazias.length === 0) return { score: 0 };

  // Coleta todos os movimentos possíveis + scores
  const movimentos = [];

  for (let i = 0; i < posicoesVazias.length; i++) {
    const indice = posicoesVazias[i];

    // Simula a jogada
    novoTabuleiro[indice] = jogador;

    let resultado;
    if (jogador === simboloIA) {
      resultado = minimax(novoTabuleiro, simboloJogador);
      movimentos.push({ index: indice, score: resultado.score });
    } else {
      resultado = minimax(novoTabuleiro, simboloIA);
      movimentos.push({ index: indice, score: resultado.score });
    }

    // Desfaz a jogada (backtrack)
    novoTabuleiro[indice] = null;
  }

  let melhorMovimento;

  // MAX (IA) quer o maior score
  if (jogador === simboloIA) {
    let melhorScore = -Infinity;
    for (let i = 0; i < movimentos.length; i++) {
      if (movimentos[i].score > melhorScore) {
        melhorScore = movimentos[i].score;
        melhorMovimento = i;
      }
    }
  } 
  // MIN (jogador humano) quer o menor score
  else {
    let melhorScore = +Infinity;
    for (let i = 0; i < movimentos.length; i++) {
      if (movimentos[i].score < melhorScore) {
        melhorScore = movimentos[i].score;
        melhorMovimento = i;
      }
    }
  }

  return movimentos[melhorMovimento];
}

// =============================================
// Eventos
// =============================================

btnIniciar.addEventListener("click", iniciarPartida);
btnReiniciar.addEventListener("click", reiniciarJogo);

casas.forEach(casa => casa.addEventListener("click", clicouNaCasa));

inputNome.addEventListener("keypress", e => {
  if (e.key === "Enter") iniciarPartida();
});
