let video;
let starRad1 = 10;
let starRad2 = 30;

// Default colors
let backgroundCol = '#FF8939';
let starCol = '#FF3B32';
let textCol = '#BD2EFF';

let saveBtn;
let bgPicker, starPicker, textPicker;

function star(x, y, radius1, radius2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * radius2;
    let sy = y + sin(a) * radius2;
    vertex(sx, sy);
    sx = x + cos(a + halfAngle) * radius1;
    sy = y + sin(a + halfAngle) * radius1;
    vertex(sx, sy);
  }
  endShape(CLOSE);
}

function setup() {
  let cnv = createCanvas(1920, 1080);
  cnv.parent('canvas-container');
  frameRate(10);

  video = createCapture(VIDEO, {flipped: true});
  video.size(32, 16);
  video.hide();

  // Color picker container
  const colorContainer = createDiv();
  colorContainer.parent('canvas-container');
  colorContainer.style('display', 'flex');
  colorContainer.style('justify-content', 'center');
  colorContainer.style('gap', '10px');
  colorContainer.style('margin-top', '10px');

  // Background color
  bgPicker = createColorPicker(backgroundCol);
  bgPicker.parent(colorContainer);
  bgPicker.input(() => backgroundCol = bgPicker.value());

  // Star color
  starPicker = createColorPicker(starCol);
  starPicker.parent(colorContainer);
  starPicker.input(() => starCol = starPicker.value());

  // Text color
  textPicker = createColorPicker(textCol);
  textPicker.parent(colorContainer);
  textPicker.input(() => textCol = textPicker.value());

  // Save button
  saveBtn = createButton('💾 Save Current Frame');
  saveBtn.parent('canvas-container');
  saveBtn.style('margin-top', '10px');
  saveBtn.mousePressed(() => saveCanvas('video_frame', 'png'));
}

function draw() {
  background(backgroundCol);

  let w = width / video.width;
  let h = height / video.height;

  video.loadPixels();

  for (let i = 0; i < video.width; i++) {
    for (let j = 0; j < video.height; j++) {
      let pixelIndex = (i + j * video.width) * 4;
      let r = video.pixels[pixelIndex + 0];
      let g = video.pixels[pixelIndex + 1];
      let b = video.pixels[pixelIndex + 2];
      let avg = (r + g + b) / 3;

      push();
      translate(-starRad2 / 2, 0);
      if (j % 2 == 1) translate(starRad2, 0);

      if (avg < 155) {
        fill(starCol);
        star(
          i * w + starRad2,
          j * h + starRad2,
          starRad1 * (sin(frameCount * 0.15) + 0.25),
          starRad2 * (sin(frameCount * 0.15) + 0.25),
          4
        );
      } else if (avg >= 155 && avg < 200) {
        fill(textCol);
        star(
          i * w + starRad2,
          j * h + starRad2,
          2 * starRad1 * sin(frameCount * 0.05),
          2 * starRad2 * sin(frameCount * 0.05),
          9
        );
      }
      pop();
      noStroke();
    }
  }
}
