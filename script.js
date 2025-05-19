const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let player = {
  x: 50,
  y: canvas.height - 150,
  width: 50,
  height: 80,
  velocityY: 0,
  jumpPower: 15,
  gravity: 1,
  isJumping: false
};

let obstacles = [];
let gameSpeed = 6;
let score = 0;
let lives = 3;
let gameRunning = true;
let tips = [
  "Participar activamente en los espacios de decisión.",
  "Representar a las juventudes de tu localidad.",
  "Proponer ideas y proyectos que transformen tu comunidad.",
  "Velar por los derechos de los jóvenes en políticas públicas."
];

const messageBox = document.getElementById("messageBox");
const tipText = document.getElementById("tipText");

let sound = new Audio("mensaje.mp3");

function drawPlayer() {
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, player.width, player.height);
}

function drawObstacle(ob) {
  ctx.fillStyle = ob.type === 'bolardo' ? "#333" : "#555";
  ctx.fillRect(ob.x, ob.y, ob.width, ob.height);
}

function drawScore() {
  document.getElementById("scoreDisplay").textContent = `Puntaje: ${score}`;
}

function drawHearts() {
  const heartsDisplay = document.getElementById("heartsDisplay");
  heartsDisplay.innerHTML = "";
  for (let i = 0; i < 3; i++) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    if (i >= lives) heart.classList.add("lost");
    heartsDisplay.appendChild(heart);
  }
}

function spawnObstacle() {
  const type = Math.random() > 0.5 ? "bolardo" : "avion";
  let height = type === "bolardo" ? 50 : 40;
  let y = type === "bolardo" ? canvas.height - 150 : canvas.height - 250;
  obstacles.push({
    x: canvas.width,
    y,
    width: 40,
    height,
    type
  });
}

function updatePlayer() {
  if (player.isJumping) {
    player.velocityY -= player.gravity;
    player.y -= player.velocityY;
    if (player.y >= canvas.height - 150) {
      player.y = canvas.height - 150;
      player.isJumping = false;
      player.velocityY = 0;
    }
  }
}

function checkCollisions() {
  for (let i = 0; i < obstacles.length; i++) {
    let ob = obstacles[i];
    if (
      player.x < ob.x + ob.width &&
      player.x + player.width > ob.x &&
      player.y < ob.y + ob.height &&
      player.y + player.height > ob.y
    ) {
      lives--;
      sound.play();
      if (lives > 0) {
        showTip();
      } else {
        resetGame();
      }
      obstacles.splice(i, 1);
      break;
    }
  }
}

function showTip() {
  tipText.textContent = tips[Math.floor(Math.random() * tips.length)];
  messageBox.classList.remove("hidden");
  gameRunning = false;
}

function resumeGame() {
  messageBox.classList.add("hidden");
  gameRunning = true;
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  lives = 3;
  score = 0;
  obstacles = [];
  player.y = canvas.height - 150;
  gameRunning = true;
  requestAnimationFrame(gameLoop);
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawHearts();
  drawScore();

  updatePlayer();
  checkCollisions();

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= gameSpeed;
  }
  obstacles = obstacles.filter(ob => ob.x + ob.width > 0);

  if (Math.random() < 0.02) spawnObstacle();

  score++;
  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  if ((e.code === "Space" || e.code === "ArrowUp") && !player.isJumping) {
    player.isJumping = true;
    player.velocityY = player.jumpPower;
  }
});

// Crear contenedores visuales
const scoreDiv = document.createElement("div");
scoreDiv.id = "scoreDisplay";
document.body.appendChild(scoreDiv);

const heartsDiv = document.createElement("div");
heartsDiv.id = "heartsDisplay";
document.body.appendChild(heartsDiv);

// Iniciar juego
gameLoop();
