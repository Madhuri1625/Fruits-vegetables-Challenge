// Data for the game: Combine Fruits and Vegetables (35 Items Total)
const FRUITS_AND_VEGETABLES = [
    // --- FRUITS ---
    { name: "APPLE", emoji: "🍎" },
    { name: "GREEN APPLE", emoji: "🍏" },
    { name: "BANANA", emoji: "🍌" },
    { name: "ORANGE", emoji: "🍊" },
    { name: "KIWI", emoji: "🥝" },
    { name: "GRAPE", emoji: "🍇" },
    { name: "LEMON", emoji: "🍋" },
    { name: "GREEN LEMON", emoji: "🍋‍🟩" }, 
    { name: "WATERMELON", emoji: "🍉" }, 
    { name: "STRAWBERRY", emoji: "🍓" }, 
    { name: "BLUEBERRY", emoji: "🫐" }, 
    { name: "PINEAPPLE", emoji: "🍍" }, 
    { name: "COCONUT", emoji: "🥥" }, 
    { name: "CHERRY", emoji: "🍒" },
    { name: "PEACH", emoji: "🍑" },
    { name: "MANGO", emoji: "🥭" },
    { name: "AVOCADO", emoji: "🥑" },
    { name: "MUSHROOM", emoji: "🍄" },
    { name: "PEA", emoji: "🫛" },
    { name: "RED CHILLI", emoji: "🌶️" },
     
    // --- VEGETABLES & HERBS ---
    { name: "CARROT", emoji: "🥕" },
    { name: "TOMATO", emoji: "🍅" },
    { name: "BROCCOLI", emoji: "🥦" },
    { name: "POTATO", emoji: "🥔" },
    { name: "SWEET POTATO", emoji: "🍠" }, 
    { name: "CORN", emoji: "🌽" },
    { name: "GREEN CHILLI", emoji: "🌶" }, // Hot pepper
    { name: "CAPSICUM", emoji: "🫑" }, // Bell pepper
    { name: "BRINJAL", emoji: "🍆" }, // Eggplant
    { name: "CUCUMBER", emoji: "🥒" }, 
    { name: "BEETROOT", emoji: "🫜" }, 
    { name: "GARLIC", emoji: "🧄" }, 
    { name: "GINGER", emoji: "🫚" }, 
    { name: "ONION", emoji: "🧅" }, 
    { name: "CORIANDER", emoji: "🌿" } 
];

// DOM Elements
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const winScreen = document.getElementById('win-screen');
const startButton = document.getElementById('start-button');
const rulesToggle = document.getElementById('rules-toggle');
const rulesBox = document.getElementById('rules-box');
const fruitNameBox = document.getElementById('fruit-name-box');
const imageButtonsContainer = document.getElementById('image-buttons-container');
const timeDisplay = document.getElementById('time-display');
const messageDisplay = document.getElementById('message');

// NEW DOM Elements 
const pauseButton = document.getElementById('pause-button'); 
const winMessage = document.getElementById('win-message');
const confettiLayer = document.getElementById('confetti-layer'); 
const scoreDisplay = document.getElementById('score-display'); 

// Game State Variables
let allItems = [...FRUITS_AND_VEGETABLES];
let currentFruitIndex = 0;
let score = 0;
let wrongGuesses = 0; 
let timer;
let timeLeft = 0;
const TIME_LIMIT = 100; // 100 seconds for 35 items
let isPaused = false;

// --- Utility Functions ---

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

function updateScoreDisplay() {
    if (scoreDisplay) {
        scoreDisplay.textContent = score;
    }
}

// --- Timer Functions ---

function startTimer() {
    timeLeft = TIME_LIMIT;
    timeDisplay.textContent = timeLeft;
    isPaused = false;
    pauseButton.textContent = "Pause";

    timer = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            timeDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);
                
                // If the player did not complete the game, show loss screen
                if (currentFruitIndex < allItems.length) { 
                    showLossScreen(); 
                }
            }
        }
    }, 1000);
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseButton.textContent = "Resume";
        fruitNameBox.textContent = "PAUSED";
        imageButtonsContainer.querySelectorAll('.fruit-button').forEach(btn => btn.disabled = true);
    } else {
        pauseButton.textContent = "Pause";
        if (currentFruitIndex < allItems.length) {
            fruitNameBox.textContent = allItems[currentFruitIndex].name;
        }
        imageButtonsContainer.querySelectorAll('.fruit-button').forEach(btn => btn.disabled = false);
    }
}

// --- Game Flow Functions ---

function startGame() {
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');

    currentFruitIndex = 0;
    score = 0;
    wrongGuesses = 0; 
    updateScoreDisplay(); 
    shuffleArray(allItems); 

    startTimer();
    displayNextFruit();
}

function displayNextFruit() {
    if (currentFruitIndex >= allItems.length) {
        clearInterval(timer);
        gameScreen.classList.add('hidden');
        showWinScreen(); // WIN CONDITION
        return;
    }

    const targetItem = allItems[currentFruitIndex];
    
    fruitNameBox.textContent = targetItem.name;
    messageDisplay.textContent = '';

    setupImageButtons(targetItem);
}

function setupImageButtons(targetItem) {
    imageButtonsContainer.innerHTML = ''; 

    // Get a list of up to 5 random options that are NOT the target item
    let options = allItems.filter(i => i.name !== targetItem.name);
    shuffleArray(options);
    
    // Create the final list of 6 display options (target + 5 random others)
    let displayOptions = [targetItem, ...options.slice(0, 5)];
    shuffleArray(displayOptions);

    displayOptions.forEach(item => {
        const button = document.createElement('button');
        button.className = 'fruit-button';
        button.innerHTML = item.emoji;
        button.dataset.name = item.name; 
        button.onclick = handleGuess; 
        imageButtonsContainer.appendChild(button);
    });
}

function handleGuess(event) {
    if (isPaused) return; 

    const guessedName = event.target.dataset.name;
    const targetName = allItems[currentFruitIndex].name;

    if (guessedName === targetName) {
        messageDisplay.textContent = "Correct! ✅";
        messageDisplay.style.color = "green";
        score++;
        updateScoreDisplay(); 
        currentFruitIndex++; 
        
        // Wait briefly before showing the next item
        setTimeout(displayNextFruit, 500); 

    } else {
        messageDisplay.textContent = "Wrong, try again! ❌";
        messageDisplay.style.color = "red";
        wrongGuesses++; 
    }
}

function showWinScreen() {
    winScreen.classList.remove('hidden');
    
    const timeTaken = TIME_LIMIT - timeLeft;
    
    let rating = "";
    // Grading logic based on time per item and wrong guesses
    if (timeTaken <= allItems.length * 2.5 && wrongGuesses <= 5) { 
        rating = "Wow Excellent! ⭐⭐⭐";
    } else if (timeTaken <= allItems.length * 4) { 
        rating = "Very Good! ⭐⭐";
    } else {
        rating = "Good! ⭐";
    }

    // Displays the Congratulations message and rating
    winMessage.innerHTML = `
        <h1>CONGRATULATIONS! 🏆</h1>
        <h2>${rating}</h2>
        <p>Time Taken: ${timeTaken} seconds.</p>
        <p>Correct Matches: <span style="color: green; font-weight: bold;">${score}</span></p>
        <p>Incorrect Attempts: <span style="color: red; font-weight: bold;">${wrongGuesses}</span></p>
    `;

    // Triggers full-page ribbons/confetti
    if (confettiLayer) {
        confettiLayer.style.display = 'block'; 
        setTimeout(() => {
             confettiLayer.style.display = 'none';
        }, 5000); 
    }
}

function showLossScreen() {
    gameScreen.classList.add('hidden');
    winScreen.classList.remove('hidden'); 
    
    // Ensure confetti is not shown on loss
    if (confettiLayer) {
        confettiLayer.style.display = 'none';
    }

    // Displays the "Time Up" loss message
    winMessage.innerHTML = `
        <h1>Time's Up! ⏱</h1>
        <h2>Don't give up! Please try again.</h2>
        <p>You scored ${score} out of ${allItems.length} matches.</p>
        <p>Incorrect Attempts: ${wrongGuesses}</p>
    `;
}


// --- Event Listeners Initialization ---

startButton.addEventListener('click', startGame);
pauseButton.addEventListener('click', togglePause); 

rulesToggle.addEventListener('click', () => {
    rulesBox.classList.toggle('hidden');
});

// Initial Setup: Hide game and win screens when the page loads
document.addEventListener('DOMContentLoaded', () => {
    winScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});