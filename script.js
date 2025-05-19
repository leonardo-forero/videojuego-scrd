const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 300;

// Variables del juego
let isJumping = false;
let playerY = 150;
let playerVelocity = 0;
let gravity = 1;
let obstacles = [];
let gameSpeed = 5;
let score = 0;
let isGameOver = false;
const tips = [
    'Tip 1: Participa activamente en las decisiones que afectan a los jóvenes.',
    'Tip 2: Promueve la participación juvenil en tu comunidad.',
    'Tip 3: Sé un líder positivo para otros jóvenes.',
    'Tip 4: Conoce tus derechos y deberes como consejero.',
    'Tip 5: Inspira a otros jóvenes a ser parte del cambio.'
];

// Cargar sonidos
const gameOverSound = new Audio('mensaje.mp3');

// Imágenes del juego
const playerImg = new Image();
playerImg.src = 'joven.png';
const bolardoImg = new Image();
bolardoImg.src = 'bolardo.png';
const avionImg = new Image();
avionImg.src = 'avion.png';

// Función para dibujar al personaje
function drawPlayer() {
    ctx.drawImage(playerImg, 50, playerY, 50, 50);
}

// Función para crear obstáculos
function createObstacle() {
    const isBolardo = Math.random() < 0.7; // Más probabilidad de bolardo que avión
    if (isBolardo) {
        obstacles.push({ type: 'bolardo', x: canvas.width, y: canvas.height - 70, width: 40, height: 70 });
    } else {
        obstacles.push({ type: 'avion', x: canvas.width, y: 50, width: 60, height: 40 });
    }
}

// Función para dibujar obstáculos
function drawObstacles() {
    for (const obstacle of obstacles) {
        if (obstacle.type === 'bolardo') {
            ctx.drawImage(bolardoImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        } else {
            ctx.drawImage(avionImg, obstacle.x, obstacle.y, obstacle.width, obstacle.height);
        }
        obstacle.x -= gameSpeed;
    }
    obstacles = obstacles.filter(obstacle => obstacle.x + obstacle.width > 0);
}

// Función para detectar colisiones
function checkCollisions() {
    for (const obstacle of obstacles) {
        if (
            50 < obstacle.x + obstacle.width &&
            50 + 50 > obstacle.x &&
            playerY < obstacle.y + obstacle.height &&
            playerY + 50 > obstacle.y
        ) {
            isGameOver = true;
            gameOverSound.play();
            showTip();
        }
    }
}

// Función para mostrar tip aleatorio
function showTip() {
    const tipElement = document.getElementById('tip');
    tipElement.querySelector('p').textContent = tips[Math.floor(Math.random() * tips.length)];
    tipElement.style.display = 'block';
    gameSpeed = 0;
}

// Función para continuar el juego
function resumeGame() {
    const tipElement = document.getElementById('tip');
    tipElement.style.display = 'none';
    gameSpeed = 5;
    isGameOver = false;
}

// Función principal del juego
function gameLoop() {
    if (!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawObstacles();
        checkCollisions();
        playerVelocity += gravity;
        playerY += playerVelocity;
        if (playerY > 150) {
            playerY = 150;
            isJumping = false;
        }
        if (Math.random() < 0.02) createObstacle();
        requestAnimationFrame(gameLoop);
    }
}

gameLoop();

document.addEventListener('keydown', (e) => {
    if (e.code === 'Space' || e.code === 'ArrowUp') {
        if (!isJumping && !isGameOver) {
            playerVelocity = -15;
            isJumping = true;
        }
    }
});
