const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Redimensiona el canvas de forma responsive
function resizeCanvas() {
  let maxWidth = 800;
  let maxHeight = 400;
  let ratio = maxWidth / maxHeight;

  let width = window.innerWidth > maxWidth ? maxWidth : window.innerWidth * 0.95;
  let height = width / ratio;

  canvas.width = width;
  canvas.height = height;

  // Reajustar posición inicial del jugador tras resize
  player.y = canvas.height - player.height - 20;

  // Reposicionar obstáculos ya existentes
  obstacles.forEach(ob => {
    ob.y = ob.type === "bolardo" ? canvas.height - ob.height - 20 : canvas.height - ob.height - 60;
  });
}

window.addEventListener("resize", resizeCanvas);

// Carga imágenes
let playerImage = new Image();
playerImage.src = "joven.png";

let bolardoImage = new Image();
bolardoImage.src = "bolardo.png";

let avionImage = new Image();
avionImage.src = "avion.png";

let player = {
  x: 50,
  y: 0,  // se ajusta en resizeCanvas
  width: 100,
  height: 140,
  velocityY: 0,
  jumpPower: 15,
  gravity: 1,
  isJumping: false
};

let obstacles = [];
let gameSpeed = 3;
let score = 0;
let lives = 3;
let gameRunning = false;
let scoreInterval;

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
  ctx.drawImage(playerImage, player.x, player.y, player.width, player.height);
}

function drawObstacle(ob) {
  const img = ob.type === 'bolardo' ? bolardoImage : avionImage;
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
  let height = 80;
  let y = type === "bolardo"
    ? canvas.height - height - 20
    : canvas.height - height - 60;
  obstacles.push({
    x: canvas.width,
    y,
    width: 80,
    height,
    type
  });
}

function updatePlayer() {
  if (player.isJumping) {
    player.velocityY -= player.gravity;
    player.y -= player.velocityY;
    if (player.y >= canvas.height - player.height - 20) {
      player.y = canvas.height - player.height - 20;
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
  scoreInterval = setInterval(() => {
    score++;
    drawScore();
  }, 1000);
  requestAnimationFrame(gameLoop);
}

function resetGame() {
  lives = 3;
  score = 0;
  obstacles = [];
  player.y = canvas.height - player.height - 20;
  drawHearts();
  drawScore();
  resumeGame();
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
    drawObstacle(obstacles[i]);
  }

  obstacles = obstacles.filter(ob => ob.x + ob.width > 0);

  if (Math.random() < 0.01) spawnObstacle();

  requestAnimationFrame(gameLoop);
}

document.addEventListener("keydown", e => {
  if ((e.code === "Space" || e.code === "ArrowUp") && !player.isJumping && gameRunning) {
    player.isJumping = true;
    player.velocityY = player.jumpPower;
  }
  if (e.code === "Enter" && !gameRunning && !messageBox.classList.contains("hidden")) {
    resumeGame();
  }
});

// Esperar carga de imágenes
let imagesLoaded = 0;
[playerImage, bolardoImage, avionImage].forEach(img => {
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 3) {
      resizeCanvas();
      drawHearts();
      drawScore();
      resumeGame();
    }
  };
});