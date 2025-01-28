const canvas = document.getElementById("snakeGame");
const ctx = canvas.getContext("2d");

const scale = 25; // Increased scale for larger grid pixels
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let apple;
let score = 0;
let level = 1;
let gameSpeed = 100;  // Initial game speed (in ms)
let gameInterval;
let highScore = localStorage.getItem("highScore") || 0;

document.getElementById("highScore").innerText = highScore;

const snakeHeadImage = new Image();
snakeHeadImage.src = 'Snake.jpg'; // Path to the snake head image

const appleImage = new Image();
appleImage.src = 'Apple.png'; // Path to the apple image

(function setup() {
    snake = new Snake();
    apple = new Apple();
    gameInterval = window.setInterval(gameLoop, gameSpeed);
})();

function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBackground();
    snake.move();
    snake.draw();
    apple.draw();

    if (snake.eat(apple)) {
        apple.randomize();
        score++;
        document.getElementById("score").innerText = score;

        // Increase speed and level every 5 apples
        if (score % 5 === 0) {
            level++;
            document.getElementById("level").innerText = level;
            gameSpeed -= 10;  // Increase speed by reducing game loop delay
            clearInterval(gameInterval);
            gameInterval = window.setInterval(gameLoop, gameSpeed);
        }
    }

    if (snake.collideWithWall()) {
        gameOver();
    }
}

function drawBackground() {
    // Improved grid background
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "#2e2e2e";
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < columns; j++) {
            ctx.strokeRect(i * scale, j * scale, scale, scale);
        }
    }
}

function Snake() {
    this.body = [{ x: 10, y: 10 }];
    this.direction = "RIGHT";
    this.nextDirection = this.direction;

    this.draw = function () {
        this.body.forEach(function (part, index) {
            if (index === 0) {
                ctx.drawImage(snakeHeadImage, part.x * scale, part.y * scale, scale, scale);
            } else {
                ctx.fillStyle = "green";
                ctx.beginPath();
                ctx.arc(part.x * scale + scale / 2, part.y * scale + scale / 2, scale / 2, 0, 2 * Math.PI);
                ctx.fill();
                ctx.strokeStyle = "darkgreen";
                ctx.stroke();
            }
        });
    };

    this.move = function () {
        const head = { ...this.body[0] };

        if (this.nextDirection === "UP") head.y--;
        if (this.nextDirection === "DOWN") head.y++;
        if (this.nextDirection === "LEFT") head.x--;
        if (this.nextDirection === "RIGHT") head.x++;

        this.direction = this.nextDirection;
        this.body.unshift(head);
        this.body.pop();
    };

    this.changeDirection = function (event) {
        if (event.keyCode === 37 && this.direction !== "RIGHT") {
            this.nextDirection = "LEFT";
        }
        if (event.keyCode === 38 && this.direction !== "DOWN") {
            this.nextDirection = "UP";
        }
        if (event.keyCode === 39 && this.direction !== "LEFT") {
            this.nextDirection = "RIGHT";
        }
        if (event.keyCode === 40 && this.direction !== "UP") {
            this.nextDirection = "DOWN";
        }
    };

    this.eat = function (apple) {
        if (this.body[0].x === apple.x && this.body[0].y === apple.y) {
            this.body.push({ x: apple.x, y: apple.y });
            return true;
        }
        return false;
    };

    this.collideWithWall = function () {
        const head = this.body[0];
        if (head.x < 0 || head.x >= columns || head.y < 0 || head.y >= rows) {
            return true;
        }
        return false;
    };

    this.collideWithSelf = function () {
        const head = this.body[0];
        for (let i = 1; i < this.body.length; i++) {
            if (this.body[i].x === head.x && this.body[i].y === head.y) {
                return true;
            }
        }
        return false;
    };
}

function Apple() {
    this.randomize = function () {
        this.x = Math.floor(Math.random() * columns);
        this.y = Math.floor(Math.random() * rows);
    };

    this.draw = function () {
        ctx.drawImage(appleImage, this.x * scale, this.y * scale, scale, scale);
    };

    this.randomize();
}

function gameOver() {
    document.getElementById("gameOverMessage").style.display = "block";
    clearInterval(gameInterval);

    if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore);
        document.getElementById("highScore").innerText = highScore;
    }
}

function restartGame() {
    score = 0;
    level = 1;
    gameSpeed = 200;
    document.getElementById("score").innerText = score;
    document.getElementById("level").innerText = level;
    document.getElementById("gameOverMessage").style.display = "none";

    snake = new Snake();
    apple = new Apple();
    gameInterval = window.setInterval(gameLoop, gameSpeed);
}

window.addEventListener("keydown", function (event) {
    snake.changeDirection(event);
});
