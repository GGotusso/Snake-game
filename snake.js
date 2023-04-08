const canvas = document.getElementById('snake');
const ctx = canvas.getContext('2d');

const scale = 10;
const rows = canvas.height / scale;
const columns = canvas.width / scale;

let snake;
let fruit;
let score = 0;
let intervalId;
let maze = [];

function generateMaze() {
  maze = [];
  for (let i = 0; i < rows; i++) {
    maze[i] = [];
    for (let j = 0; j < columns; j++) {
      if (i === 0 || i === rows - 1 || j === 0 || j === columns - 1) {
        maze[i][j] = 1;
      } else {
        maze[i][j] = Math.random() < 0.1 ? 1 : 0;
      }
    }
  }
}

function drawMaze() {
  ctx.fillStyle = '#000';
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < columns; j++) {
      if (maze[i][j] === 1) {
        ctx.fillRect(j * scale, i * scale, scale, scale);
      }
    }
  }
}

(function setup() {
  snake = new Snake();
  fruit = new Fruit();

  fruit.pickLocation();

  intervalId = window.setInterval(() => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (score % 10 === 0 && score !== 0) {
      generateMaze();
    }
    drawMaze();
    fruit.draw();
    snake.update();
    snake.checkCollision();
    snake.draw();

    if (snake.eat(fruit)) {
      fruit.pickLocation();
      snake.grow();
      score++;
      document.getElementById('score').textContent = `Score: ${score}`;
      snake.checkCollision();
    }
  }, 100);
}());

function Snake() {
  this.x = 0;
  this.y = 0;
  this.xSpeed = scale * 1;
  this.ySpeed = 0;
  this.tail = [];

  this.draw = function() {
    ctx.fillStyle = '#74E31C';
    for (let i = 0; i < this.tail.length; i++) {
      ctx.fillRect(this.tail[i].x, this.tail[i].y, scale, scale);
    }
    ctx.fillRect(this.x, this.y, scale, scale);
  };

  this.update = function() {
    for (let i = this.tail.length - 1; i >= 0; i--) {
      this.tail[i] = i === 0 ? { x: this.x, y: this.y } : { ...this.tail[i - 1] };
    }

    this.x += this.xSpeed;
    this.y += this.ySpeed;

    if (this.x >= canvas.width || this.x < 0 || this.y >= canvas.height || this.y < 0) {
      this.x = 0;
      this.y = 0;
      this.xSpeed = scale;
      this.ySpeed = 0;
      this.tail = [];
      score = 0;
      document.getElementById('score').textContent = `Score: ${score}`;
      gameOver();
    }
  };

  this.eat = function(fruit) {
    if (this.x === fruit.x && this.y === fruit.y) {
      return true;
    }
    return false;
  };

  this.grow = function() {
    const lastElement = this.tail.length > 0 ? this.tail[this.tail.length - 1] : { x: this.x, y: this.y };
    this.tail.push({
      x: lastElement.x - this.xSpeed,
      y: lastElement.y - this.ySpeed
    });
  };
  

  this.checkCollision = function() {

    // Check collision with maze walls
  if (maze[Math.floor(this.y / scale)][Math.floor(this.x / scale)] === 1) {
    this.x = 0;
    this.y = 0;
    this.xSpeed = scale;
    this.ySpeed = 0;
    this.tail = [];
    score = 0;
    document.getElementById('score').textContent = `Score: ${score}`;
    gameOver();
  }
    // Si la cabeza de la serpiente colisiona con una pared, se reinicia el juego
    if (this.x >= canvas.width || this.x < 0 || this.y >= canvas.height || this.y < 0) {
      this.x = 0;
      this.y = 0;
      this.xSpeed = scale;
      this.ySpeed = 0;
      this.tail = [];
      score = 0;
      document.getElementById('score').textContent = `Score: ${score}`;
      gameOver();

    }
  
    // Si la cabeza de la serpiente colisiona con su cuerpo, se reinicia el juego
    for (let i = 0; i < this.tail.length - 1; i++) {
      if (this.x === this.tail[i].x && this.y === this.tail[i].y) {
        this.x = 0;
        this.y = 0;
        this.xSpeed = scale;
        this.ySpeed = 0;
        this.tail = [];
        score = 0;
        document.getElementById('score').textContent = `Score: ${score}`;
        gameOver();
        break;
      }
    }
  };
  
}

function Fruit() {
  this.x;
  this.y;

  this.pickLocation = function() {
    this.x = (Math.floor(Math.random() * columns)) * scale;
    this.y = (Math.floor(Math.random() * rows)) * scale;
  };

  this.draw = function() {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, scale, scale);
  };
}

window.addEventListener('keydown', ((event) => {
  const direction = event.key.replace('Arrow', '');
  snake.changeDirection(direction);
}));

function gameOver() {
  clearInterval(intervalId);
  document.removeEventListener("keydown", Snake.prototype.changeDirection);
  ctx.fillStyle = "#000";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "25px Arial";
  ctx.textAlign = "center";
  ctx.fillText("Game Over", canvas.width / 2, canvas.height / 2);
  ctx.fillText("Press Enter to Play Again", canvas.width / 2, canvas.height / 2 + 27 );
  document.addEventListener("keydown", (event) => {
    if (event.code === "Enter") {
      location.reload();
    }
  });
}


Snake.prototype.changeDirection = function(direction) {
  switch (direction) {
    case 'Up':
      if (this.ySpeed !== scale) {
        this.xSpeed = 0;
        this.ySpeed = -scale;
      }
      break;
    case 'Down':
      if (this.ySpeed !== -scale) {
        this.xSpeed = 0;
        this.ySpeed = scale;
      }
      break;
    case 'Left':
      if (this.xSpeed !== scale) {
        this.xSpeed = -scale;
        this.ySpeed = 0;
      }
      break;
    case 'Right':
      if (this.xSpeed !== -scale) {
        this.xSpeed = scale;
        this.ySpeed = 0;
      }
      break;
  }
};

