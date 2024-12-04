const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

let snake = [{ x: 200, y: 200 }];
let direction = { x: 0, y: -20 };
let food = { x: 100, y: 100 };
let score = 0;
let interval = null;
let playerName = "";

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

  // Ha a kígyó megette az ételt
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


  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, 20, 20);

  
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
