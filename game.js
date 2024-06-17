const canvas = document.getElementById('gameCanvas');
const context = canvas.getContext('2d');

const canvasWidth = canvas.width;
const canvasHeight = canvas.height;

const netWidth = 4;
const netHeight = canvasHeight;

const paddleWidth = 10;
const paddleHeight = 100;

const ballRadius = 10;

let playerPaddleY = (canvasHeight - paddleHeight) / 2;
let computerPaddleY = (canvasHeight - paddleHeight) / 2;
let ballX = canvasWidth / 2;
let ballY = canvasHeight / 2;
let ballSpeedX = 6;
let ballSpeedY = 6;

let playerScore = 0;
let computerScore = 0;

const fps = 60;
const timeStep = 1000 / fps;

function drawNet() {
    context.fillStyle = 'white';
    context.fillRect((canvasWidth - netWidth) / 2, 0, netWidth, netHeight);
}

function drawPaddle(x, y, width, height) {
    context.fillStyle = 'white';
    context.fillRect(x, y, width, height);
}

function drawBall(x, y, radius) {
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = '#ccfe00';
    context.fill();
    context.lineWidth = 1.5;
    context.strokeStyle = '#ccfe00';
    context.stroke();
    context.closePath();
}

function draw() {
    context.fillStyle = '#0062EB';
    context.fillRect(0, 0, canvasWidth, canvasHeight);

    drawNet();
    drawPaddle(0, playerPaddleY, paddleWidth, paddleHeight);
    drawPaddle(canvasWidth - paddleWidth, computerPaddleY, paddleWidth, paddleHeight);
    drawBall(ballX, ballY, ballRadius);

    context.fillStyle = 'white';
    context.font = '1rem Space Grotesk';
    context.fillText(`Player: ${playerScore}`, 100, 50);

    context.fillStyle = 'white';
    context.fillText(`Opponent: ${computerScore}`, canvasWidth - 250, 50);
}

function resetBall() {
    ballX = canvasWidth / 2;
    ballY = canvasHeight / 2;
    ballSpeedX = -ballSpeedX;
}

function moveBall(deltaTime) {
    ballX += ballSpeedX * (deltaTime / 16.67);
    ballY += ballSpeedY * (deltaTime / 16.67);

    if (ballY - ballRadius < 0 || ballY + ballRadius > canvasHeight) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX - ballRadius < paddleWidth) {
        if (ballY > playerPaddleY && ballY < playerPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballSpeedX *= 1.1; // Increase speed on hit
            ballSpeedY *= 1.1;
        } else if (ballX - ballRadius < 0) {
            computerScore++;
            resetBall();
        }
    }

    if (ballX + ballRadius > canvasWidth - paddleWidth) {
        if (ballY > computerPaddleY && ballY < computerPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
            ballSpeedX *= 1.1; // Increase speed on hit
            ballSpeedY *= 1.1;
        } else if (ballX + ballRadius > canvasWidth) {
            playerScore++;
            resetBall();
        }
    }
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const mouseY = event.clientY - rect.top - root.scrollTop;
    playerPaddleY = mouseY - paddleHeight / 2;
});

function moveComputerPaddle(deltaTime) {
    const paddleCenter = computerPaddleY + paddleHeight / 2;
    const speedAdjustment = deltaTime / 16.67;
    const maxSpeed = 6 * speedAdjustment;
    if (paddleCenter < ballY - 35) {
        computerPaddleY += Math.min(maxSpeed, (4 + Math.random() * 2) * speedAdjustment);
    } else if (paddleCenter > ballY + 35) {
        computerPaddleY -= Math.min(maxSpeed, (4 + Math.random() * 2) * speedAdjustment);
    }
}

let lastFrameTime = performance.now();

function gameLoop(currentTime) {
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    moveBall(deltaTime);
    moveComputerPaddle(deltaTime);
    draw();
    
    requestAnimationFrame(gameLoop);
}

lastFrameTime = performance.now();
requestAnimationFrame(gameLoop);
