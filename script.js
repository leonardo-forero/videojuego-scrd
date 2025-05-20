const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const personajeImg = new Image();
personajeImg.src = "personaje.png";

const bolardoImg = new Image();
bolardoImg.src = "bolardo.png";

const avionImg = new Image();
avionImg.src = "avion.png";

let player = {
  x: 80,
  y: canvas.height - 150,
  width: 60,
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
let scoreInterval;

function drawPlayer() {
  ctx.drawImage(personajeImg, player.x, player.y, player.width, player.height);
}

function drawObstacle(ob) {
  const img = ob.type === "bolardo" ? bolardoImg : avionImg;
  ctx.drawImage(img, ob.x, ob.y, ob.width, ob.height);
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
  let y = type === "bolardo" ? canvas.height - 150 : canvas.height - 200;
  obstacles.push({
    x: canvas.width,
    y,
    width: 50,
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
  clearInterval(scoreInterval);
}

function resumeGame() {
  messageBox.classList.add("hidden");
  gameRunning = true;
  scoreInterval = setInterval(() => score++, 1000);
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  lives = 3;
  score = 0;
  obstacles = [];
  player.y = canvas.height - 150;
  drawHearts();
  resumeGame();
}

function gameLoop() {
  if (!gameRunning) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawPlayer();
  drawScore();
  drawHearts();

  updatePlayer();
  checkCollisions();

  for (let i = 0; i < obstacles.length; i++) {
    obstacles[i].x -= gameSpeed;
    drawObstacle(obstacles[i]);
  }

  obstacles = obstacles.filter(ob => ob.x + ob.width > 0);

  if (Math.random() < 0.02) spawnObstacle();

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  if ((e.code === "Space" || e.code === "ArrowUp") && !player.isJumping) {
    player.isJumping = true;
    player.velocityY = player.jumpPower;
  }
});

// Iniciar corazones y puntaje
drawHearts();
scoreInterval = setInterval(() => score++, 1000);

// Iniciar juego
gameLoop();