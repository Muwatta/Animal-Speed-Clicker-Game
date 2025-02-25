let score = 0;
let gameTime = 60; // 60 seconds total
let currentAnimal = '';
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
const generateButton = document.getElementById('generateButton');

// List of animals
const animals = ['lion', 'tiger', 'elephant', 'giraffe', 'Dinosaur'];

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

  // Show the loading overlay inside the game section with an attractive spinner
  const loadingOverlay = document.getElementById('loadingOverlay');
  loadingOverlay.style.display = 'flex';

  // Animate loading for 3 seconds
  setTimeout(() => {
    // Remove the loading overlay and enable the game section
    loadingOverlay.style.display = 'none';
    gameSection.style.opacity = '1';
    gameSection.style.pointerEvents = 'auto';

    // Greet the player and start the countdown
    playerGreeting.textContent = `Good luck, ${playerName}!`;
    updateScoreDisplay();
    updateTimerDisplay();
    startCountdown();
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

// Start a new round when the user clicks the Generate Animal button
function startRound() {
  if (gameTime <= 0) return;
  if (roundActive) return;

  const randomIndex = Math.floor(Math.random() * animals.length);
  currentAnimal = animals[randomIndex];
  showRandomAnimal.textContent = `🫎Random Animal: ${currentAnimal}`;
  feedback.textContent = 'Choose the correct animal:';
  roundActive = true;

  // Enable answer buttons and disable Generate button until round ends
  enableAnimalButtons(true);
  generateButton.disabled = true;
}

function enableAnimalButtons(enable) {
  const buttons = document.querySelectorAll('#animalBtns button');
  buttons.forEach(button => {
    button.disabled = !enable;
  });
}

// When an animal button is clicked, check the answer
function checkAnswer(selectedAnimal) {
  if (!roundActive) return;
  enableAnimalButtons(false);
  roundActive = false;

  if (selectedAnimal.toLowerCase() === currentAnimal.toLowerCase()) {
    feedback.textContent = 'Correct! ✅';
    score++;
  } else {
    feedback.textContent = 'Incorrect! ❌';
    score--;
  }
  updateScoreDisplay();

  // Keep feedback visible for 2 seconds before clearing and re-enabling Generate button
  feedbackTimeout = setTimeout(() => {
    feedback.textContent = '';
    showRandomAnimal.textContent = '🫎Random Animal: ';
    if (gameTime > 0) {
      generateButton.disabled = false;
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
  checkAnswer('Dinosaur');
}

function endGame() {
  clearTimeout(feedbackTimeout);
  generateButton.disabled = true;
  enableAnimalButtons(false);
  clearInterval(countdownInterval);

  // If the player's score is 6/10 or better, celebrate by making the animal buttons dance
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
  // Let the dance go on for 10 seconds before ending the game
  setTimeout(() => {
    animalButtons.forEach(button => {
      button.classList.remove('dance');
    });
    feedback.textContent = `Game Over! ${playerName}, your final score is: ${score}`;
    showRandomAnimal.textContent = 'Game Over!';
    saveRecord(playerName, score);
  }, 10000);
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
