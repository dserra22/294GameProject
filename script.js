var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var startGame = function () { };
startGame();
var canvas = document.querySelector("canvas");
var context = canvas.getContext("2d");
canvas.classList.add("canvas");
var width = 300;
var height = 300 / 2;
// canvas.style.width = String(width) + "px";
// canvas.style.height = String(height) + "px";
// Define the edges of the canvas
var canvasWidth = width;
var canvasHeight = height;
// document.body.appendChild(canvas);
var img = document.createElement("img");
img.setAttribute("src", "david.jpg");
var img2 = document.createElement("img");
img2.setAttribute("src", "davidCollide.jpg");
// Set gravitational acceleration
var g = 9.81;
// interface GameObjectInterface {
//   context: any;
//   x: number;
//   y: number;
//   vx: number;
//   vy: number;
// }
var GameObject = /** @class */ (function () {
    function GameObject(context, x, y, vx, vy) {
        this.context = context;
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.isColliding = false;
    }
    return GameObject;
}());
var moveRandomly = function (bounds) {
    return Math.floor(Math.random() * bounds) + 1;
};
var Player = /** @class */ (function (_super) {
    __extends(Player, _super);
    function Player(context, x, y, vx, vy) {
        var _this = _super.call(this, context, x, y, vx, vy) || this;
        // Set default width and height
        _this.width = 20;
        _this.height = _this.width;
        _this.speed = 3;
        return _this;
    }
    Player.prototype.draw = function () {
        // Draw a simple square
        var current_img = img;
        if (this.isColliding) {
            current_img = img2;
        }
        this.context.drawImage(current_img, this.x, this.y, this.width, this.height);
    };
    Player.prototype.update = function (secondsPassed) {
        // if (this.y + this.vy < 0) {
        //   this.vy = 0;
        // }
        // this.x += this.vx;
        // this.y += this.vy;
    };
    return Player;
}(GameObject));
var Token = /** @class */ (function (_super) {
    __extends(Token, _super);
    function Token(context, x, y, vx, vy) {
        var _this = _super.call(this, context, x, y, vx, vy) || this;
        // Set default width and height
        _this.width = 20;
        _this.height = _this.width;
        return _this;
    }
    Token.prototype.draw = function () {
        // Draw a simple square
        var current_img = img;
        if (this.isColliding) {
            current_img = img2;
        }
        this.context.drawImage(current_img, this.x, this.y, this.width, this.height);
    };
    Token.prototype.update = function (secondsPassed) {
        if (moveRandomly(1000) <= 1) {
            this.x = moveRandomly(canvasWidth);
            this.y = moveRandomly(canvasHeight);
        }
    };
    return Token;
}(GameObject));
var Square = /** @class */ (function (_super) {
    __extends(Square, _super);
    function Square(context, x, y, vx, vy) {
        var _this = _super.call(this, context, x, y, vx, vy) || this;
        // Set default width and height
        _this.width = Math.floor(Math.random() * (50 - 20 + 1) + 10);
        _this.height = _this.width;
        return _this;
    }
    Square.prototype.draw = function () {
        // Draw a simple square
        var current_img = img;
        if (this.isColliding) {
            current_img = img2;
        }
        this.context.drawImage(current_img, this.x, this.y, this.width, this.height);
    };
    Square.prototype.update = function (secondsPassed) {
        // Apply acceleration
        // this.vy += g * secondsPassed;
        // Move with set velocity
        if (player.y - player.speed > 0) {
            player.vy -= player.speed;
        }
        else if (player.y + player.speed < canvasHeight) {
            player.vy += player.speed;
        }
        else {
            player.vy = 0;
        }
        this.x += this.vx;
        this.y += this.vy;
    };
    return Square;
}(GameObject));
var player;
var gameObjects = [];
var token;
document.addEventListener("keydown", function (e) {
    var key = e.key;
    if (key === "ArrowUp" && player.y > 0) {
        player.y -= player.speed;
    }
    if (key === "ArrowDown" && player.y + player.height < canvasHeight) {
        player.y += player.speed;
    }
    if (key === "ArrowRight" && player.x + player.width < canvasWidth) {
        player.x += player.speed;
    }
    if (key === "ArrowLeft" && player.x > 0) {
        player.x -= player.speed;
    }
});
function createWorld() {
    var max = Math.floor(Math.random() * (20 - 10 + 1) + 10);
    max = 1;
    for (var i = 0; i < max; i++) {
        var x = 0;
        var y = 0;
        var xv = Math.floor(Math.random() * (100 - -100 + 1) + 2);
        var yv = Math.floor(Math.random() * (100 - 10 + 1) + 1);
        gameObjects.push(new Square(context, x, y, xv, yv));
    }
    player = new Player(context, 10, 10, 0, 0);
    token = new Token(context, moveRandomly(canvasWidth), moveRandomly(canvasHeight), 0, 0);
}
createWorld();
window.onload = init;
function detectCollide() {
    if (rectIntersect(player.x, player.y, player.width, player.height, token.x, token.y, token.width, token.height)) {
        console.log("LOL");
    }
}
function init() {
    // Start the first frame request
    window.requestAnimationFrame(gameLoop);
}
var oldTimeStamp = 0;
var secondsPassed = 0;
function gameLoop(timeStamp) {
    secondsPassed = (timeStamp - oldTimeStamp) / 1000;
    oldTimeStamp = timeStamp;
    // Loop over all game objects
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].update(secondsPassed);
        player.update(secondsPassed);
        token.update(secondsPassed);
    }
    context.clearRect(0, 0, width, height);
    detectCollisions();
    detectCollide();
    // Do the same to draw
    for (var i = 0; i < gameObjects.length; i++) {
        detectEdgeCollisions();
        gameObjects[i].draw();
        player.draw();
        token.draw();
    }
    window.requestAnimationFrame(gameLoop);
}
function rectIntersect(x1, y1, w1, h1, x2, y2, w2, h2) {
    // Check x and y for overlap
    if (x2 > w1 + x1 || x1 > w2 + x2 || y2 > h1 + y1 || y1 > h2 + y2) {
        return false;
    }
    return true;
}
function detectCollisions() {
    var obj1;
    var obj2;
    // Reset collision state of all objects
    for (var i = 0; i < gameObjects.length; i++) {
        gameObjects[i].isColliding = false;
    }
    // Start checking for collisions
    for (var i = 0; i < gameObjects.length; i++) {
        obj1 = gameObjects[i];
        for (var j = i + 1; j < gameObjects.length; j++) {
            obj2 = gameObjects[j];
            // Compare object1 with object2
            if (rectIntersect(obj1.x, obj1.y, obj1.width, obj1.height, obj2.x, obj2.y, obj2.width, obj2.height)) {
                var vCollision = { x: obj2.x - obj1.x, y: obj2.y - obj1.y };
                var distance = Math.sqrt((obj2.x - obj1.x) * (obj2.x - obj1.x) +
                    (obj2.y - obj1.y) * (obj2.y - obj1.y));
                var vCollisionNorm = {
                    x: vCollision.x / distance,
                    y: vCollision.y / distance
                };
                var vRelativeVelocity = { x: obj1.vx - obj2.vx, y: obj1.vy - obj2.vy };
                var speed = vRelativeVelocity.x * vCollisionNorm.x +
                    vRelativeVelocity.y * vCollisionNorm.y;
                if (speed < 0) {
                    break;
                }
                else {
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
var restitution = 0.9;
function detectEdgeCollisions() {
    var obj;
    for (var i = 0; i < gameObjects.length; i++) {
        obj = gameObjects[i];
        // Check for left and right
        if (obj.x < obj.width) {
            obj.vx = Math.abs(obj.vx) * restitution;
            obj.x = obj.width;
        }
        else if (obj.x > canvasWidth - obj.width) {
            obj.vx = -Math.abs(obj.vx) * restitution;
            obj.x = canvasWidth - obj.width;
        }
        // Check for bottom and top
        if (obj.y < obj.height) {
            obj.vy = Math.abs(obj.vy) * restitution;
            obj.y = obj.height;
        }
        else if (obj.y > canvasHeight - obj.height) {
            obj.vy = -Math.abs(obj.vy) * restitution;
            obj.y = canvasHeight - obj.height;
        }
    }
}
