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

  // Escalar jugador proporcional al tamaño del canvas
  player.width = canvas.width * 0.1;
  player.height = canvas.height * 0.4;
  player.jumpPower = canvas.height * 0.05;
  player.y = canvas.height - player.height - 20;

  // Reajustar obstáculos ya existentes
  obstacles.forEach(ob => {
    ob.width = canvas.width * 0.05;
    ob.height = canvas.height * 0.2;
    ob.y = ob.type === "bolardo"
      ? canvas.height - ob.height - 20
      : canvas.height - ob.height - 60;
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

let backgroundImage = new Image();
backgroundImage.src = "bogota_fondo.jpg";

let player = {
  x: 50,
  y: 0, // se ajustará después del resize
  width: 0,
  height: 0,
  velocityY: 0,
  jumpPower: 0,
  gravity: 0.7,
  isJumping: false
};

let obstacles = [];
let gameSpeed = 3;
let score = 0;
let lives = 3;
let gameRunning = false;
let scoreInterval;

let tips = [
  "Participa activamente en la Mesa!",
  "Representas a niñas, niños y adolescentes de tu localidad.",
  "Propón ideas que transformen tu vida y la de los demás.",
  "Se guardián y guardiana de los derechos culturales en Bogotá."
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
    const heartImg = document.createElement("img");
    heartImg.src = i < lives ? "corazon.png" : "corazon_gris.png"; // Usa gris si no tienes vida
    heartImg.alt = "vida";
    heartImg.classList.add("heart-img");
    heartsDisplay.appendChild(heartImg);
  }
}

function spawnObstacle() {
  const lastObstacle = obstacles[obstacles.length - 1];

  // Si hay un obstáculo y aún está muy cerca del borde derecho, no se genera otro
  if (lastObstacle && lastObstacle.x > canvas.width - 300) return;

  const type = Math.random() > 0.5 ? "bolardo" : "avion";
  let height = canvas.height * 0.2;
  let width = canvas.width * 0.05;
  let y = type === "bolardo"
    ? canvas.height - height - 20
    : canvas.height - height - 30;

  obstacles.push({ x: canvas.width, y, width, height, type });
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

  // Dibuja la imagen de fondo antes de cualquier otra cosa
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);

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

// Función para iniciar el juego
function startGame() {
  const gameCanvas = document.getElementById("gameCanvas");
  gameCanvas.classList.add("active");  // Mostrar el canvas

  const startButton = document.getElementById("startButton");
  startButton.style.display = "none";

  lives = 3;
  score = 0;
  obstacles = [];
  player.y = gameCanvas.height - player.height - 20;

  drawHearts();
  drawScore();

  gameRunning = true;
  scoreInterval = setInterval(() => {
    score++;
    drawScore();
  }, 1000);
  gameLoop();
}

// Eventos para iniciar el juego con click o toque
const startButton = document.getElementById("startButton");

startButton.addEventListener("click", () => {
  startGame();
});

startButton.addEventListener('touchstart', (e) => {
  e.preventDefault();
  startGame();
}, { passive: false });

// Listener global para salto con toque (touchstart) en el canvas o cualquier parte (excepto el botón)
document.addEventListener('touchstart', function(e) {
  if (e.target.id === 'startButton') return; // Ignora el botón para no interferir
  e.preventDefault();
  if (!player.isJumping && gameRunning) {
    player.velocityY = player.jumpPower;
    player.isJumping = true;
  }
}, { passive: false });

// Control de teclado para salto y reinicio
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
[playerImage, bolardoImage, avionImage, backgroundImage].forEach(img => {
  img.onload = () => {
    imagesLoaded++;
    if (imagesLoaded === 4) {
      resizeCanvas();
      drawHearts();
      drawScore();
      // Esperar a que el usuario haga clic en "Jugar"
    }
  };
});