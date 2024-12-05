const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: -20 };
let food = { x: 100, y: 100 };
let score = 0;
let interval = null;
let playerName = "";
let appleImage = new Image();
appleImage.src = 'alma.png'; // Alma képe

const scoreList = [];
const form = document.getElementById("player-form");
const nameInput = document.getElementById("player-name");
const scoreListElement = document.getElementById("score-list");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  playerName = nameInput.value;
  resetGame();
  startGame();
});

function startGame() {
  interval = setInterval(update, 150);
}

function resetGame() {
  snake = [{ x: 200, y: 200 }];
  direction = { x: 0, y: -20 };
  score = 0;
  food = { x: Math.floor(Math.random() * 20) * 20, y: Math.floor(Math.random() * 20) * 20 };
}

function update() {
  const head = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };

  if (
    head.x < 0 || head.x >= canvas.width ||
    head.y < 0 || head.y >= canvas.height ||
    snake.some(segment => segment.x === head.x && segment.y === head.y)
  ) {
    gameOver();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    food = {
      x: Math.floor(Math.random() * 20) * 20,
      y: Math.floor(Math.random() * 20) * 20,
    };
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Alma kirajzolása
  ctx.drawImage(appleImage, food.x, food.y, 20, 20);  // Alma kép

  // Kígyó kirajzolása
  ctx.fillStyle = "lime";
  snake.forEach(segment => ctx.fillRect(segment.x, segment.y, 20, 20));
}

function gameOver() {
  clearInterval(interval);
  alert(`${playerName}, a pontszámod: ${score}`);

  updateScoreList(playerName, score);
  resetGame();
}

function updateScoreList(name, score) {
  scoreList.push({ name, score });
  scoreList.sort((a, b) => b.score - a.score);
  renderScoreList();
}

function renderScoreList() {
  scoreListElement.innerHTML = scoreList
     .map((entry) => `<li>${entry.name}: ${entry.score}</li>`)
    .join("");
}

// Billentyűzetes irányítás
window.addEventListener("keydown", (e) => {
  switch (e.key) {
    case "ArrowUp":
      if (direction.y === 0) direction = { x: 0, y: -20 };
      break;
    case "ArrowDown":
      if (direction.y === 0) direction = { x: 0, y: 20 };
      break;
    case "ArrowLeft":
      if (direction.x === 0) direction = { x: -20, y: 0 };
      break;
    case "ArrowRight":
      if (direction.x === 0) direction = { x: 20, y: 0 };
      break;
  }
});

// Érintőképernyős vezérlés
document.addEventListener('touchstart', handleTouchStart, false);
document.addEventListener('touchmove', handleTouchMove, false);

let touchStartX = 0;
let touchStartY = 0;

function handleTouchStart(event) {
  const touch = event.touches[0];
  touchStartX = touch.pageX;
  touchStartY = touch.pageY;
}

function handleTouchMove(event) {
  const touch = event.touches[0];
  const deltaX = touch.pageX - touchStartX;
  const deltaY = touch.pageY - touchStartY;

  if (Math.abs(deltaX) > Math.abs(deltaY)) {
    if (deltaX > 0 && direction.x !== -20) {
      direction = { x: 20, y: 0 }; // Jobbra
    } else if (deltaX < 0 && direction.x !== 20) {
      direction = { x: -20, y: 0 }; // Balra
    }
  } else {
    if (deltaY > 0 && direction.y !== -20) {
      direction = { x: 0, y: 20 }; // Le
    } else if (deltaY < 0 && direction.y !== 20) {
      direction = { x: 0, y: -20 }; // Fel
    }
  }

  touchStartX = touch.pageX;
  touchStartY = touch.pageY;
}
