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
let ballSpeedX = 5;
let ballSpeedY = 5;

let playerScore = 0;
let computerScore = 0;

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

function moveBall() {
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballY - ballRadius < 0 || ballY + ballRadius > canvasHeight) {
        ballSpeedY = -ballSpeedY;
    }

    if (ballX - ballRadius < paddleWidth) {
        if (ballY > playerPaddleY && ballY < playerPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            computerScore++;
            resetBall();
        }
    }

    if (ballX + ballRadius > canvasWidth - paddleWidth) {
        if (ballY > computerPaddleY && ballY < computerPaddleY + paddleHeight) {
            ballSpeedX = -ballSpeedX;
        } else {
            playerScore++;
            resetBall();
        }
    }

    if (ballX - ballRadius < 0 || ballX + ballRadius > canvasWidth) {
        ballSpeedX = -ballSpeedX;
    }
}

canvas.addEventListener('mousemove', (event) => {
    const rect = canvas.getBoundingClientRect();
    const root = document.documentElement;
    const mouseY = event.clientY - rect.top - root.scrollTop;
    playerPaddleY = mouseY - paddleHeight / 2;
});

function moveComputerPaddle() {
    const paddleCenter = computerPaddleY + paddleHeight / 2;
    if (paddleCenter < ballY - 35) {
        computerPaddleY += 4 + Math.random() * 2;
    } else if (paddleCenter > ballY + 35) {
        computerPaddleY -= 4 + Math.random() * 2;
    }
}


function gameLoop() {
    moveBall();
    moveComputerPaddle();
    draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
