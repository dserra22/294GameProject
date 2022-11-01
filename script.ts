let canvas: HTMLCanvasElement = document.createElement("canvas");
console.log(canvas);
canvas.classList.add("canvas");

let ctx = canvas.getContext("2d");
ctx.fillText("D", 10, 40);
ctx.fillStyle = "orange";
ctx.fillRect(30, 30, 10, 10);

document.body.appendChild(canvas);
