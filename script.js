const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Fijo tamaño para que quede en recuadro (podemos ajustar después)
canvas.width = 800;
canvas.height = 400;

let playerImage = new Image();
playerImage.src = "joven.png";

let bolardoImage = new Image();
bolardoImage.src = "bolardo.png";

let avionImage = new Image();
avionImage.src = "avion.png";

let player = {
  x: 50,
  y: canvas.height - 180,  // ajuste para el nuevo tamaño
  width: 120,  // aumentado tamaño
  height: 160,
  velocityY: 0,
  jumpPower: 15,
  gravity: 1,
  isJumping: false
};

let obstacles = [];
let gameSpeed = 3; // disminuimos la velocidad
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
  let height = type === "bolardo" ? 80 : 80; // aumentado tamaño
  let y = type === "bolardo" ? canvas.height - 180 : canvas.height - 220;
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
    if (player.y >= canvas.height - 180) {
      player.y = canvas.height - 180;
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
  player.y = canvas.height - 180;
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
  // Presionar Enter para cerrar mensaje y continuar
  if (e.code === "Enter" && !gameRunning && !messageBox.classList.contains("hidden")) {
    resumeGame();
  }
});

// Crear contenedores visuales
const scoreDiv = document.createElement("div");
scoreDiv.id = "scoreDisplay";
document.body.appendChild(scoreDiv);

const heartsDiv = document.createElement("div");
heartsDiv.id = "heartsDisplay";
document.body.appendChild(heartsDiv);

// Esperar a que se carguen las imágenes
let imagesLoaded = 0;
[playerImage, bolardoImage, avionImage].forEach(img => {
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 3) {
      drawHearts();
      drawScore();
      resumeGame();
    }
  };
});