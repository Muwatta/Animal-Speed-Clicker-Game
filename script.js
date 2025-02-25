let score = 0;
let gameTime = 60; // 60 seconds total
let currentAnimal = null;
let roundActive = false;
let countdownInterval;
let feedbackTimeout;
let playerName = '';

// DOM element references
const displayScore = document.getElementById('displayScore');
const displayTimer = document.getElementById('displayTimer');
const showRandomAnimal = document.getElementById('showRandomAnimal');
const feedback = document.getElementById('feedback');
const playerGreeting = document.getElementById('playerGreeting');

// Define 10 animals with name and emoji
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

// Start the game (triggered via onclick on the Start Game button)
function startGame() {
  playerName = document.getElementById('playerName').value.trim();
  if (!playerName) {
    alert('Please enter your name.');
    return;
  }
  // Hide the start screen
  document.getElementById('startScreen').style.display = 'none';

  // Show the game section immediately but faded and disabled
  const gameSection = document.getElementById('gameSection');
  gameSection.style.display = 'block';
  gameSection.style.opacity = '0.5';
  gameSection.style.pointerEvents = 'none';

  // Show the loading overlay inside the game section
  const loadingOverlay = document.getElementById('loadingOverlay');
  loadingOverlay.style.display = 'flex';

  // Animate loading for 3 seconds
  setTimeout(() => {
    loadingOverlay.style.display = 'none';
    gameSection.style.opacity = '1';
    gameSection.style.pointerEvents = 'auto';

    playerGreeting.textContent = `Good luck, ${playerName}!`;
    updateScoreDisplay();
    updateTimerDisplay();
    startCountdown();
    // Automatically start the first round
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
  displayScore.textContent = `🥅Score: ${score}`;
}

function updateTimerDisplay() {
  displayTimer.textContent = `⏲️Timer: ${gameTime}s`;
}

// Start a new round automatically
function startRound() {
  if (gameTime <= 0 || roundActive) return;

  const randomIndex = Math.floor(Math.random() * animals.length);
  currentAnimal = animals[randomIndex];
  // Display the animal image (emoji) instead of its name
  showRandomAnimal.innerHTML = `🫎Random Animal: <span class="animalEmoji">${currentAnimal.emoji}</span>`;
  feedback.textContent = 'Choose the correct animal:';
  roundActive = true;

  // Enable answer buttons
  enableAnimalButtons(true);
}

function enableAnimalButtons(enable) {
  const buttons = document.querySelectorAll('#animalBtns button');
  buttons.forEach(button => {
    button.disabled = !enable;
  });
}

// Check the player's answer based on animal name
function checkAnswer(selectedAnimalName) {
  if (!roundActive) return;
  enableAnimalButtons(false);
  roundActive = false;

  if (selectedAnimalName.toLowerCase() === currentAnimal.name.toLowerCase()) {
    feedback.textContent = 'Correct! ✅';
    score++;
  } else {
    feedback.textContent = 'Incorrect! ❌';
    score--;
  }
  updateScoreDisplay();

  // Keep feedback visible for 2 seconds then automatically start the next round
  feedbackTimeout = setTimeout(() => {
    feedback.textContent = '';
    showRandomAnimal.textContent = '🫎Random Animal: ';
    if (gameTime > 0) {
      startRound();
    }
  }, 2000);
}

// Animal button functions
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

  // If player's score is winning (e.g., >=6), celebrate with a dance animation
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
  // Let the dance continue for 10 seconds, then end the game
  setTimeout(() => {
    animalButtons.forEach(button => {
      button.classList.remove('dance');
    });
    feedback.textContent = `Game Over! ${playerName}, your final score is: ${score}`;
    showRandomAnimal.textContent = 'Game Over!';
    saveRecord(playerName, score);
  }, 10000);
}

// Reset the game without reloading the page
function resetGame() {
  clearInterval(countdownInterval);
  clearTimeout(feedbackTimeout);

  score = 0;
  gameTime = 60;
  currentAnimal = null;
  roundActive = false;

  updateScoreDisplay();
  updateTimerDisplay();
  feedback.textContent = '';
  showRandomAnimal.textContent = '🫎Random Animal: ';

  // Restart countdown and start the first round automatically
  startCountdown();
  startRound();
}

// Show the leaderboard overlay (top 5 highest scores)
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

// GUIDE OVERLAY FUNCTIONS
function showGuide() {
  document.getElementById('guideOverlay').style.display = 'flex';
}

function closeGuide() {
  document.getElementById('guideOverlay').style.display = 'none';
}

// ABOUT OVERLAY FUNCTIONS
function showAbout() {
  document.getElementById('aboutOverlay').style.display = 'flex';
}

function closeAbout() {
  document.getElementById('aboutOverlay').style.display = 'none';
}

// HOME NAV: Closes all overlays and shows the start screen if needed.
function goHome() {
  // Close any open overlay
  closeGuide();
  closeAbout();
  closeLeaderboard();
  // Optionally, you might scroll to top or refresh the view.
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
