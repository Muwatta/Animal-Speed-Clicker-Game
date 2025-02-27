let score = 0;
let gameTime = 45;
let currentAnimal = null;
let roundActive = false;
let countdownInterval;
let feedbackTimeout;
let playerName = '';
let gamePaused = false;

const displayScore = document.getElementById('displayScore');
const displayTimer = document.getElementById('displayTimer');
const showRandomAnimal = document.getElementById('showRandomAnimal');
const feedback = document.getElementById('feedback');
const playerGreeting = document.getElementById('playerGreeting');
const pauseBtn = document.getElementById('pauseBtn');

const animals = [
  { name: 'lion', emoji: '🦁' },
  { name: 'tiger', emoji: '🐯' },
  { name: 'elephant', emoji: '🐘' },
  { name: 'giraffe', emoji: '🦒' },
  { name: 'dinosaur', emoji: '🦖' },
  { name: 'monkey', emoji: '🐒' },
  { name: 'zebra', emoji: '🦓' },
  { name: 'penguin', emoji: '🐧' },
  { name: 'koala', emoji: '🐨' },
  { name: 'dog', emoji: '🐶' },
];

function startGame() {
  playerName = document.getElementById('playerName').value.trim();
  if (!playerName) {
    alert('Please enter your name.');
    return;
  }

  document.getElementById('startScreen').style.display = 'none';

  const gameSection = document.getElementById('gameSection');
  gameSection.style.display = 'block';
  gameSection.style.opacity = '0.5';
  gameSection.style.pointerEvents = 'none';

  const loadingOverlay = document.getElementById('loadingOverlay');
  loadingOverlay.style.display = 'flex';

  setTimeout(() => {
    loadingOverlay.style.display = 'none';
    gameSection.style.opacity = '1';
    gameSection.style.pointerEvents = 'auto';
    document.getElementById('bgSound').play();
    playerGreeting.textContent = `Good luck, ${playerName}!`;
    updateScoreDisplay();
    updateTimerDisplay();
    startCountdown();
    startRound();
  }, 3000);
}

function startCountdown() {
  countdownInterval = setInterval(() => {
    gameTime--;
    updateTimerDisplay();
    if (gameTime <= 0) {
      clearInterval(countdownInterval);
      endGame();
    }
  }, 1000);
}

function updateScoreDisplay() {
  displayScore.textContent = `🥅: ${score}`;
}

function updateTimerDisplay() {
  displayTimer.textContent = `⏲️: ${gameTime}s`;
}

function startRound() {
  if (gameTime <= 0 || roundActive) return;

  const randomIndex = Math.floor(Math.random() * animals.length);
  currentAnimal = animals[randomIndex];
  showRandomAnimal.innerHTML = `🫎Random Animal: ${currentAnimal.name}`;
  feedback.textContent = 'Choose the correct animal:';
  roundActive = true;

  enableAnimalButtons(true);
}

function enableAnimalButtons(enable) {
  const buttons = document.querySelectorAll('#animalBtns button');
  buttons.forEach(button => {
    button.disabled = !enable;
  });
}

function checkAnswer(selectedAnimalName) {
  if (!roundActive || gamePaused) return;
  enableAnimalButtons(false);
  roundActive = false;

  if (selectedAnimalName.toLowerCase() === currentAnimal.name.toLowerCase()) {
    feedback.textContent = 'Correct! ✅';
    score++;
  } else {
    feedback.textContent = 'Incorrect! ❌ -1';
    score = Math.max(0, score - 1);
  }
  updateScoreDisplay();

  feedbackTimeout = setTimeout(() => {
    feedback.textContent = '';
    showRandomAnimal.textContent = '🫎Random Animal: ';
    shuffleAnimalButtons();
    if (gameTime > 0) {
      startRound();
    }
  }, 2000);
}

function Lion() {
  checkAnswer('lion');
}
function Tiger() {
  checkAnswer('tiger');
}
function Elephant() {
  checkAnswer('elephant');
}
function Giraffe() {
  checkAnswer('giraffe');
}
function Dinosaur() {
  checkAnswer('dinosaur');
}
function Monkey() {
  checkAnswer('monkey');
}
function Zebra() {
  checkAnswer('zebra');
}
function Penguin() {
  checkAnswer('penguin');
}
function Koala() {
  checkAnswer('koala');
}
function Dog() {
  checkAnswer('dog');
}

function endGame() {
  clearTimeout(feedbackTimeout);
  enableAnimalButtons(false);
  clearInterval(countdownInterval);

  const bgSound = document.getElementById('bgSound');
  bgSound.pause();
  bgSound.currentTime = 0;

  if (score >= 6) {
    celebrateVictory();
  } else {
    feedback.textContent = `Game Over! ${playerName}, your final score is: ${score}`;
    showRandomAnimal.textContent = 'Game Over!';
    saveRecord(playerName, score);
  }
}

function celebrateVictory() {
  feedback.textContent = `Congratulations, ${playerName}! You scored ${score}! Enjoy the dance!`;
  const animalButtons = document.querySelectorAll('#animalBtns button');
  animalButtons.forEach(button => {
    button.classList.add('dance');
  });
  setTimeout(() => {
    animalButtons.forEach(button => {
      button.classList.remove('dance');
    });
    feedback.textContent = `Game Over! ${playerName}, your final score is: ${score}`;
    showRandomAnimal.textContent = 'Game Over!';
    saveRecord(playerName, score);
  }, 10000);
}

function resetGame() {
  clearInterval(countdownInterval);
  clearTimeout(feedbackTimeout);

  score = 0;
  gameTime = 45;
  currentAnimal = null;
  roundActive = false;

  updateScoreDisplay();
  updateTimerDisplay();
  feedback.textContent = '';
  showRandomAnimal.textContent = '🫎Random Animal: ';

  const bgSound = document.getElementById('bgSound');
  bgSound.currentTime = 0;
  bgSound.play();
  gamePaused = false;

  startCountdown();
  startRound();
}

function showLeaderboard() {
  const leaderboardOverlay = document.getElementById('leaderboardOverlay');
  const leaderboardList = document.getElementById('leaderboardList');

  let records = JSON.parse(localStorage.getItem('gameRecords')) || [];
  records.sort((a, b) => b.score - a.score);
  records = records.slice(0, 5);

  leaderboardList.innerHTML = '';

  if (records.length === 0) {
    leaderboardList.innerHTML = '<li>No records yet.</li>';
  } else {
    records.forEach((record, index) => {
      const li = document.createElement('li');
      li.textContent = `${index + 1}. ${record.name} - ${record.score} (${
        record.date
      })`;
      leaderboardList.appendChild(li);
    });
  }

  leaderboardOverlay.style.display = 'flex';
}

function closeLeaderboard() {
  document.getElementById('leaderboardOverlay').style.display = 'none';
}

function showGuide() {
  document.getElementById('guideOverlay').style.display = 'flex';
}

function closeGuide() {
  document.getElementById('guideOverlay').style.display = 'none';
}

function showAbout() {
  document.getElementById('aboutOverlay').style.display = 'flex';
}

function closeAbout() {
  document.getElementById('aboutOverlay').style.display = 'none';
}

function goHome() {
  closeGuide();
  closeAbout();
  closeLeaderboard();
}

function saveRecord(name, score) {
  const record = {
    name: name,
    score: score,
    date: new Date().toLocaleString(),
  };
  let records = JSON.parse(localStorage.getItem('gameRecords')) || [];
  records.push(record);
  localStorage.setItem('gameRecords', JSON.stringify(records));
  console.log('Record saved:', record);
}
function shuffleAnimalButtons() {
  const container = document.getElementById('animalBtns');
  const buttons = Array.from(container.children);
  buttons.sort(() => Math.random() - 0.5);
  buttons.forEach(button => container.appendChild(button));
}

function togglePause() {
  gamePaused = !gamePaused;

  if (gamePaused) {
    clearInterval(countdownInterval);
    document.getElementById('bgSound').pause();
    pauseBtn.textContent = '⏸️';
    enableAnimalButtons(false);
  } else {
    startCountdown();
    document.getElementById('bgSound').play();
    pauseBtn.textContent = '⏸️';
    enableAnimalButtons(true);
  }
}
pauseBtn.addEventListener('click', togglePause);
