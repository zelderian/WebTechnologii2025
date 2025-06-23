document.addEventListener("DOMContentLoaded", () => {

const startBtn = document.getElementById('start');
const resetBtn = document.getElementById('reset');
const restartBtn = document.getElementById('restart');
const board = document.getElementById('game-board');
const movesEl = document.getElementById('moves');
const timerEl = document.getElementById('timer');
const currentPlayerEl = document.getElementById('current-player');
const resultsEl = document.getElementById('results');

let cards = [], flipped = [], moves = 0, timer, seconds = 0;
let players = [], scores = [], currentPlayer = 0, totalRounds = 1, currentRound = 1;
let countdown, gameDifficulty = 'easy';

const difficulties = {
  easy: 180,
  normal: 120,
  hard: 60
};

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function createCards() {
  const icons = ['😀','😎','🐱','🎉','🍕','🌟','🚀','🏀'];
  let neededPairs = 8;
  const selected = icons.slice(0, neededPairs);
  const pairIcons = shuffle([...selected, ...selected]);
  return pairIcons.map((icon, id) => ({ id, icon, flipped: false, matched: false }));
}

function render() {
  board.innerHTML = '';
  cards.forEach((card, index) => {
    const cardEl = document.createElement('div');
    cardEl.className = 'card' + (card.flipped || card.matched ? ' flipped' : '');
    cardEl.innerText = card.flipped || card.matched ? card.icon : '';
    cardEl.onclick = () => flipCard(index);
    board.appendChild(cardEl);
  });
}

function flipCard(index) {
  if (flipped.length < 2 && !cards[index].flipped && !cards[index].matched) {
    cards[index].flipped = true;
    flipped.push(index);
    render();

    if (flipped.length === 2) {
      setTimeout(checkMatch, 800);
    }
  }
}

function checkMatch() {
  const [first, second] = flipped;
  if (cards[first].icon === cards[second].icon) {
    cards[first].matched = true;
    cards[second].matched = true;
    scores[currentPlayer]++;
  } else {
    cards[first].flipped = false;
    cards[second].flipped = false;
  }
  moves++;
  flipped = [];
  currentPlayer = 1 - currentPlayer;
  updateUI();
  render();
  checkEnd();
}

function checkEnd() {
  if (cards.every(card => card.matched)) {
    clearInterval(countdown);
    resultsEl.innerHTML += `<p>Раунд ${currentRound}: ${players[0]}: ${scores[0]} пар, ${players[1]}: ${scores[1]} пар</p>`;
    currentRound++;
    if (currentRound <= totalRounds) {
      initGame();
    } else {
      let winner = scores[0] > scores[1] ? players[0] : players[1];
      if (scores[0] === scores[1]) winner = 'Нічия';
      resultsEl.innerHTML += `<h2>Переможець: ${winner}</h2>`;
    }
  }
}

function updateUI() {
  movesEl.innerText = `Ходи: ${moves}`;
  currentPlayerEl.innerText = `Гравець: ${players[currentPlayer]}`;
}

function startTimer(secondsLeft) {
  clearInterval(countdown);
  countdown = setInterval(() => {
    if (secondsLeft <= 0) {
      clearInterval(countdown);
      checkEnd();
    } else {
      secondsLeft--;
      let min = Math.floor(secondsLeft / 60);
      let sec = secondsLeft % 60;
      timerEl.innerText = `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    }
  }, 1000);
}

function initGame() {
  players = [
    document.getElementById('player1').value || 'Гравець 1',
    document.getElementById('player2').value || 'Гравець 2'
  ];
  scores = [0, 0];
  moves = 0;
  currentPlayer = 0;
  gameDifficulty = document.getElementById('difficulty').value;
  totalRounds = parseInt(document.getElementById('rounds').value) || 1;
  cards = createCards();
  updateUI();
  render();
  startTimer(difficulties[gameDifficulty]);
}

startBtn.onclick = () => {
  currentRound = 1;
  resultsEl.innerHTML = '';
  initGame();
};

resetBtn.onclick = () => {
  document.getElementById('player1').value = '';
  document.getElementById('player2').value = '';
  document.getElementById('rounds').value = '1';
  document.getElementById('difficulty').value = 'easy';
};

restartBtn.onclick = initGame;
});