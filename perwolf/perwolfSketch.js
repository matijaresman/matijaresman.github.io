var x = 75, y = 0;
var vx = 3, vy = 3;
var r = 0, g = 0, b = 0;
var diameter = 50;

function setup() {
  let canvas = createCanvas(400, 400);
  canvas.parent('canvas-container');
}

function draw() {
  background(220);
  fill(r, g, b);
  circle(x, y, diameter);
  
  if (x > width || x < 0) {
    vx *= -1;
    changeColor();
  }
  
  if (y > height || y < 0) {
    vy *= -1;
    changeColor();
  }
  
  x += vx;
  y += vy;
}

function changeColor() {
  r = random(255);
  g = random(255);
  b = random(255);
}

document.addEventListener("DOMContentLoaded", function() {
  const form = document.getElementById("myForm");
  const quantityInput = document.getElementById("quantity");
  const output = document.getElementById("output");

  form.addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
    diameter = quantityInput.value;
    output.textContent = `The circle diameter is now: ${diameter}`;
  });
});
