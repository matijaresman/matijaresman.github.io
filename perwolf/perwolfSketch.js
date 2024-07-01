let font;
let fSize;
let msg;
let fontPath;

function setup() {
  let canvas = createCanvas(800, 400);
  canvas.parent('canvas-container');

  opentype.load('./Fanwood.otf', function (err, f) {
    if (err) {
      alert('Font could not be loaded: ' + err);
    } else {
      font = f;
      console.log('font ready');
      fSize = 144;
      msg = 'PERWOLF';
      let x = 50;
      let y = 160;
      fontPath = font.getPath(msg, x, y, fSize);
      console.log(fontPath.commands);
    }
  });
}

function draw() {
  clear();
  if (!font) return;
  background(255);
  noFill();
  stroke(0);
  strokeWeight(2);

  for (let cmd of fontPath.commands) {
    if (cmd.type === 'M') {
      beginShape();
      let pt = distort(cmd.x, cmd.y);
      vertex(pt.x, pt.y);
    } else if (cmd.type === 'L') {
      let pt = distort(cmd.x, cmd.y);
      vertex(pt.x, pt.y);
    } else if (cmd.type === 'C') {
      let pt1 = distort(cmd.x1, cmd.y1);
      let pt2 = distort(cmd.x2, cmd.y2);
      let pt3 = distort(cmd.x, cmd.y);
      bezierVertex(pt1.x, pt1.y, pt2.x, pt2.y, pt3.x, pt3.y);
    } else if (cmd.type === 'Q') {
      let pt1 = distort(cmd.x1, cmd.y1);
      let pt2 = distort(cmd.x, cmd.y);
      quadraticVertex(pt1.x, pt1.y, pt2.x, pt2.y);
    } else if (cmd.type === 'Z') {
      endShape(CLOSE);
    }
  }
  noLoop();
}

function distort(x, y) {
  let noiseScale = 0.25;
  let noiseStrength = 50;
  let nx = x + (noise(x * noiseScale, y * noiseScale) - 0.5) * noiseStrength;
  let ny = y + (noise(x * noiseScale + 10000, y * noiseScale + 
                      10000) - 0.5) * noiseStrength;
  return { x: nx, y: ny };
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
