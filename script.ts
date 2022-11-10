const startGame = (): void => {};

startGame();

let canvas: HTMLCanvasElement = document.querySelector("canvas");
let context: CanvasRenderingContext2D = canvas.getContext("2d");

canvas.classList.add("canvas");

let width: number = 300;
let height: number = 300 / 2;
// canvas.style.width = String(width) + "px";
// canvas.style.height = String(height) + "px";

// Define the edges of the canvas
const canvasWidth: number = width;
const canvasHeight: number = height;

// document.body.appendChild(canvas);

let img = document.createElement("img");
img.setAttribute("src", "david.jpg");

let img2 = document.createElement("img");
img2.setAttribute("src", "davidCollide.jpg");

// Set gravitational acceleration
const g: number = 9.81;

// interface GameObjectInterface {
//   context: any;
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
// }

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
    let current_img = img;
    if (this.isColliding) {
      current_img = img2;
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
    // if (this.y + this.vy < 0) {
    //   this.vy = 0;
    // }
    // this.x += this.vx;
    // this.y += this.vy;
  }
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
    let current_img = img;
    if (this.isColliding) {
      current_img = img2;
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
    this.width = Math.floor(Math.random() * 50 + 1);
    this.height = this.width;
  }

  draw() {
    // Draw a simple square
    let current_img = img;
    if (this.isColliding) {
      current_img = img2;
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
    let x = 0;
    let y = 0;
    let xv = Math.floor(Math.random() * 1 + 1);
    let yv = Math.floor(Math.random() * 1 + 1);

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
window.onload = init;

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

    game.score--;
  }
}

function init() {
  // Start the first frame request
  window.requestAnimationFrame(gameLoop);
}

let oldTimeStamp = 0;
let secondsPassed = 0;

function gameLoop(timeStamp: number) {
  secondsPassed = (timeStamp - oldTimeStamp) / 1000;
  oldTimeStamp = timeStamp;

  // Loop over all game objects
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

  context.fillText("Score: " + (game.score + 1), canvasWidth - 50, 20);

  window.requestAnimationFrame(gameLoop);
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

// Set a restitution, a lower value will lose more energy when colliding
const restitution = 1;

function detectEdgeCollisions() {
  let obj: Square;
  for (let i = 0; i < gameObjects.length; i++) {
    obj = gameObjects[i];

    // Check for left and right
    if (obj.x < obj.width) {
      obj.vx = Math.abs(obj.vx) * restitution;
      obj.x = obj.width;
    } else if (obj.x > canvasWidth - obj.width) {
      obj.vx = -Math.abs(obj.vx) * restitution;
      obj.x = canvasWidth - obj.width;
    }

    // Check for bottom and top
    if (obj.y < obj.height) {
      obj.vy = Math.abs(obj.vy) * restitution;
      obj.y = obj.height;
    } else if (obj.y > canvasHeight - obj.height) {
      obj.vy = -Math.abs(obj.vy) * restitution;
      obj.y = canvasHeight - obj.height;
    }
  }
}
