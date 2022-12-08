let startBtn: HTMLButtonElement;

let canvas: HTMLCanvasElement = document.querySelector("canvas");
let context: CanvasRenderingContext2D = canvas.getContext("2d");

canvas.classList.add("canvas");

let width: number = 300;
let height: number = 300 / 2;
// Define the edges of the canvas
const canvasWidth: number = width;
const canvasHeight: number = height;

// document.body.appendChild(canvas);

let reverseSear = document.createElement("img");
reverseSear.setAttribute("src", "reverseSear.jpg");
let tofu = document.createElement("img");
tofu.setAttribute("src", "tofu.jpg");
let playerImg = document.createElement("img");
playerImg.setAttribute("src", "you.png");
let playerImgHit = document.createElement("img");
playerImgHit.setAttribute("src", "youMad.png");

// Set gravitational acceleration
const g: number = 9.81;

let hasGameEnded = false;

function startGame(): void {
  startBtn = document.querySelector(".start-game");
  startBtn.addEventListener("click", function () {
    if (!startBtn.classList.contains("again")) startBtn.classList.add("again");
    hasGameEnded = false;
    init();
    startBtn.classList.toggle("none");
  });
}
startGame();

class Game {
  score: number;
  constructor() {
    this.score = 0;
  }
}

class GameObject {
  context: any;
  x: number;
  y: number;
  vx: number;
  vy: number;
  isColliding: boolean;

  constructor(context: any, x: number, y: number, vx: number, vy: number) {
    this.context = context;
    this.x = x;
    this.y = y;
    this.vx = vx;
    this.vy = vy;

    this.isColliding = false;
  }
}

const moveRandomly = (bounds: number): number => {
  return Math.floor(Math.random() * bounds) + 1;
};
class Player extends GameObject {
  width: number;
  height: number;
  speed: number;
  constructor(context: any, x: number, y: number, vx: number, vy: number) {
    super(context, x, y, vx, vy);

    // Set default width and height
    this.width = 20;
    this.height = this.width;
    this.speed = 3;
  }

  draw() {
    // Draw a simple square
    let current_img = playerImg;
    if (this.isColliding) {
      current_img = playerImgHit;
      console.log("HIT");
    }

    this.context.drawImage(
      current_img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(secondsPassed: number) {}
}

class Token extends GameObject {
  width: number;
  height: number;
  constructor(context: any, x: number, y: number, vx: number, vy: number) {
    super(context, x, y, vx, vy);

    // Set default width and height
    this.width = 20;
    this.height = this.width;
  }

  draw() {
    // Draw a simple square
    let current_img = reverseSear;
    if (this.isColliding) {
      // current_img = img2;
    }

    this.context.drawImage(
      current_img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(player: Player) {
    let speed = 0.05;

    if (player.x > this.x && this.x >= 0) {
      this.x -= speed;
    }
    if (player.x < this.x && this.x + this.width <= canvasWidth) {
      this.x += speed;
    }
    if (player.y < this.y && this.y + this.height <= canvasHeight) {
      this.y += speed;
    }
    if (player.y > this.y && this.y >= 0) {
      this.y -= speed;
    }

    this.moveToken(false);
  }

  moveToken(moveNow: boolean) {
    if (moveNow) {
      this.x = moveRandomly(canvasWidth - this.width);
      this.y = moveRandomly(canvasHeight - this.height);
    } else {
      if (moveRandomly(1000) <= 1) {
        this.x = moveRandomly(canvasWidth - this.width);
        this.y = moveRandomly(canvasHeight - this.height);
      }
    }
  }
}

class Square extends GameObject {
  width: number;
  height: number;
  constructor(context: any, x: number, y: number, vx: number, vy: number) {
    super(context, x, y, vx, vy);

    // Set default width and height
    this.width = Math.floor(Math.random() * 20 + 10);
    this.height = this.width;
  }

  draw() {
    // Draw a simple square
    let current_img = tofu;
    if (this.isColliding) {
      // current_img = img2;
    }

    this.context.drawImage(
      current_img,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }

  update(secondsPassed: number) {
    // Apply acceleration
    // this.vy += g * secondsPassed;
    this.x += this.vx;
    this.y += this.vy;
  }

  moveToken(moveNow: boolean) {
    if (moveNow) {
      this.x = moveRandomly(canvasWidth - this.width);
      this.y = moveRandomly(canvasHeight - this.height);
    } else {
      if (moveRandomly(1000) <= 1) {
        this.x = moveRandomly(canvasWidth - this.width);
        this.y = moveRandomly(canvasHeight - this.height);
      }
    }
  }
}

let player: Player;
let gameObjects: Square[] = [];
let token: Token;
let game: Game;

let lastVertical = "";
let lastHorizontal = "";

const up = (player: Player) => player.y > 0;
const left = (player: Player) => player.x > 0;
const down = (player: Player) => player.y + player.height < canvasHeight;
const right = (player: Player) => player.x + player.width < canvasWidth;

document.addEventListener("keydown", (e: any) => {
  let key = e.key;

  console.log(e);

  if (up(player) && key == "ArrowUp") {
    if (lastHorizontal === "ArrowLeft" && left(player)) {
      player.y -= player.speed;
      player.x -= player.speed;
      lastVertical = "ArrowUp";
    } else if (lastHorizontal === "ArrowRight" && right(player)) {
      player.y -= player.speed;
      player.x += player.speed;
      lastVertical = "ArrowUp";
    } else {
      player.y -= player.speed;
      lastVertical = "ArrowUp";
    }
  }
  if (down(player) && key === "ArrowDown") {
    if (lastHorizontal === "ArrowLeft" && left(player)) {
      player.y += player.speed;
      player.x -= player.speed;
      lastVertical = "ArrowDown";
    } else if (lastHorizontal === "ArrowRight" && right(player)) {
      player.y += player.speed;
      player.x += player.speed;
      lastVertical = "ArrowDown";
    } else {
      player.y += player.speed;
      lastVertical = "ArrowDown";
    }
  }

  if (left(player) && key === "ArrowLeft") {
    if (lastVertical === "ArrowUp" && up(player)) {
      player.y -= player.speed;
      player.x -= player.speed;
      lastHorizontal = "ArrowLeft";
    } else if (lastVertical === "ArrowDown" && down(player)) {
      player.y += player.speed;
      player.x -= player.speed;
      lastHorizontal = "ArrowLeft";
    } else {
      player.x -= player.speed;
      lastHorizontal = "ArrowLeft";
    }
  }

  if (right(player) && key === "ArrowRight") {
    if (lastVertical === "ArrowUp" && up(player)) {
      player.y -= player.speed;
      player.x += player.speed;
      lastHorizontal = "ArrowRight";
    } else if (lastVertical === "ArrowDown" && down(player)) {
      player.y += player.speed;
      player.x += player.speed;
      lastHorizontal = "ArrowRight";
    } else {
      player.x += player.speed;
      lastHorizontal = "ArrowRight";
    }
  }
});

document.addEventListener("keyup", (e: any) => {
  let key = e.key;

  if (key === "ArrowUp") {
    lastVertical = "";
  }
  if (key === "ArrowDown") {
    lastVertical = "";
  }

  if (key === "ArrowRight") {
    lastHorizontal = "";
  }
  if (key === "ArrowLeft") {
    lastHorizontal = "";
  }
});

function createWorld() {
  let max = Math.floor(Math.random() * (20 - 10 + 1) + 10);

  max = 1;

  for (let i = 0; i < max; i++) {
    let x = 100;
    let y = 100;
    let xv = 0.25;
    let yv = 0.55;

    gameObjects.push(new Square(context, x, y, xv, yv));
  }
  player = new Player(context, 10, 10, 0, 0);
  token = new Token(
    context,
    moveRandomly(canvasWidth),
    moveRandomly(canvasHeight),
    0,
    0
  );
  game = new Game();
}

createWorld();

function detectCollide(): void {
  if (
    rectIntersect(
      player.x,
      player.y,
      player.width,
      player.height,
      token.x,
      token.y,
      token.width,
      token.height
    )
  ) {
    token.moveToken(true);
    game.score++;
  }
  if (
    rectIntersect(
      player.x,
      player.y,
      player.width,
      player.height,
      gameObjects[0].x,
      gameObjects[0].y,
      gameObjects[0].width,
      gameObjects[0].height
    )
  ) {
    gameObjects[0].moveToken(true);
    player.isColliding = true;
    setTimeout(() => {
      player.isColliding = false;
    }, 500);
    if (game.score > 0) game.score--;
  }
}

function endGame(): void {
  if (game.score > 9) {
    hasGameEnded = true;
    startBtn.classList.toggle("none");
  }
}

function init(): void {
  // Start the first frame request
  game.score = 0;
  window.requestAnimationFrame(gameLoop);
}

let oldTimeStamp = 0;
let secondsPassed = 0;

function gameLoop(timeStamp: number) {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].update(secondsPassed);
    player.update(secondsPassed);
    token.update(player);
  }

  context.clearRect(0, 0, width, height);
  detectCollisions();
  detectCollide();

  // Do the same to draw
  for (let i = 0; i < gameObjects.length; i++) {
    detectEdgeCollisions();
    gameObjects[i].draw();
    player.draw();
    token.draw();
  }

  context.fillStyle = "#774400";
  context.fillText("Servings: " + game.score, canvasWidth - 60, 20);

  endGame();
  if (hasGameEnded === false) {
    window.requestAnimationFrame(gameLoop);
  }
}

function rectIntersect(
  x1: number,
  y1: number,
  w1: number,
  h1: number,
  x2: number,
  y2: number,
  w2: number,
  h2: number
) {
  // Check x and y for overlap
  if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
    return false;
  }
  return true;
}

// this is from the tutorial
function detectCollisions() {
  let obj1: Square;
  let obj2: Square;

  // Reset collision state of all objects
  for (let i = 0; i < gameObjects.length; i++) {
    gameObjects[i].isColliding = false;
  }

  // Start checking for collisions
  for (let i = 0; i < gameObjects.length; i++) {
    obj1 = gameObjects[i];
    for (let j = i + 1; j < gameObjects.length; j++) {
      obj2 = gameObjects[j];

      // Compare object1 with object2
      if (
        rectIntersect(
          obj1.x,
          obj1.y,
          obj1.width,
          obj1.height,
          obj2.x,
          obj2.y,
          obj2.width,
          obj2.height
        )
      ) {
        let vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
        let distance = Math.sqrt(
          (obj2.x - obj1.x) * (obj2.x - obj1.x) +
            (obj2.y - obj1.y) * (obj2.y - obj1.y)
        );
        let vCollisionNorm = {
          x: vCollision.x / distance,
          y: vCollision.y / distance,
        };
        let vRelativeVelocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
        let speed =
          vRelativeVelocity.x * vCollisionNorm.x +
          vRelativeVelocity.y * vCollisionNorm.y;

        if (speed < 0) {
          break;
        } else {
          obj1.vx -= speed * vCollisionNorm.x;
          obj1.vy -= speed * vCollisionNorm.y;
          obj2.vx += speed * vCollisionNorm.x;
          obj2.vy += speed * vCollisionNorm.y;
        }

        obj1.isColliding = true;
        obj2.isColliding = true;
      }
    }
  }
}

// Set a , a lower value will lose more energy when colliding

function detectEdgeCollisions() {
  let obj: Square;
  for (let i = 0; i < gameObjects.length; i++) {
    obj = gameObjects[i];

    // Check for left and right
    if (obj.x < 0) {
      obj.vx = 0 - obj.vx;
    } else if (obj.x > canvasWidth - obj.width) {
      obj.vx = 0 - obj.vx;
    }

    // Check for bottom and top
    if (obj.y < 0) {
      obj.vy = 0 - obj.vy;
    } else if (obj.y > canvasHeight - obj.height) {
      obj.vy = 0 - obj.vy;
      // obj.y = canvasHeight - obj.height;
    }
  }
}
