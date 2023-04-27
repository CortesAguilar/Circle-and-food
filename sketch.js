var gameObjects;
var gameOver;
var highScore = 0;

function setup() {
  createCanvas(800, 800);
  gameOver = false;
  gameObjects = [];
  gameObjects.push(new Circle(createVector(width / 2, height / 2)));
  gameObjects.push(new Food(createVector(100, 100)));
}

function draw() {
  if (gameOver) {
    calculateHighScore();
    gameOverScreen();
    if (mouseIsPressed) setup();
  } else {
    gameScreen();
    playGame();
  }
}

function calculateHighScore() {
  if (gameObjects[0].ballsEaten > highScore)
    highScore = gameObjects[0].ballsEaten;
}

function gameOverScreen() {
  background("black");
  fill(0, 102, 153);
  textSize(32);
  text("You just lost the easiest game ever", width / 6, height / 2);
  text("Your score: " + gameObjects[0].ballsEaten, width / 6, height * 0.9);
  text("High score: " + highScore, width * 0.55, height * 0.9);
  text("Click anywhere to retry", width * 0.27, height * 0.55);
}

function gameScreen() {
  background(220);
  textSize(20);
  fill("black");
  text("Score : " + gameObjects[0].ballsEaten, width * 0.75, height * 0.1);
}

function playGame() {
  gameObjects.forEach(function (value, index) {
    value.display();
    if (index == 0) value.update(gameObjects[1]);
    else value.update(gameObjects[0]);
  });
}

class GameObject {
  constructor(position) {
    if (this.constructor === GameObject)
      throw new TypeError("Cannot create GameObject objects directly");
    this.position = position;
  }

  display() {
    fill(this.colour);
    circle(this.position.x, this.position.y, this.size);
  }

  isInColission(gameObject) {
    let distance = dist(
      this.position.x,
      this.position.y,
      gameObject.position.x,
      gameObject.position.y
    );
    let margin;

    if (gameObject instanceof Food) margin = this.size / 2;
    else margin = gameObject.size / 2;

    if (distance <= margin) return true;

    return false;
  }
}

class Circle extends GameObject {
  constructor(position) {
    super(position);
    this.colour = "green";
    this.size = 20;
    this.ballsEaten = 0;
  }

  update(foodObject) {
    this.position = createVector(mouseX, mouseY);

    if (this.isInColission(foodObject)) this.grow();

    if (this.isOutOfScreen()) gameOver = true;
  }

  grow() {
    this.size += 5;
    this.ballsEaten++;
  }

  isOutOfScreen() {
    if (
      this.position.x + this.size / 2 >= width ||
      this.position.x - this.size / 2 <= 0 ||
      this.position.y + this.size / 2 >= height ||
      this.position.y - this.size / 2 <= 0
    )
      return true;
    return false;
  }
}

class Food extends GameObject {
  constructor(position) {
    super(position);
    this.colour = "white";
    this.size = 10;
  }

  update(circleObject) {
    if (this.isInColission(circleObject))
      this.position = createVector(
        random(10, width - this.size),
        random(10, height - this.size)
      );
  }
}