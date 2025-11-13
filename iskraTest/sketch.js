let video;
let starRad1 = 10;
let starRad2 = 30;

let backgroundCol = '#FF8939';
let starCol = '#FF3B32';
let textCol = '#BD2EFF';

let saveBtn;

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
  // Create canvas and center it using CSS
  let cnv = createCanvas(1920, 1080);
  cnv.parent('canvas-container'); // attach canvas to our HTML div
  frameRate(fps);

  video = createVideo('/assets/iskra_test.mp4', () => {
    video.hide();
  });

  // Create a centered "Save" button below the canvas
  saveBtn = createButton('💾 Save Current Frame');
  saveBtn.parent('canvas-container');
  saveBtn.mousePressed(() => {
    saveCanvas('frame_' + nf(frameCount, 3), 'png');
  });
}

function draw() {
  frameRate(10);
  background(backgroundCol);

  let w = width / video.width;
  let h = height / video.height;

  video.loadPixels();

  for (let i = 0; i < video.width; i++) {
    for (let j = 0; j < video.height; j++) {
      //The original array of indexes
      let pixelIndex = (i + j * video.width) * 4;
      let arrayIndex = (i + j * video.width);
      //console.log(arrayIndex);
      let avg = [];
      let avgNew = [];
      let r = video.pixels[pixelIndex + 0];
      let g = video.pixels[pixelIndex + 1];
      let b = video.pixels[pixelIndex + 2];
      //The avg values are not saved into an array!
      //But rather used immediately
      
      //The pixels are now in the avg array!
      avg[arrayIndex] = (r + g + b) / 3;
      let arrayIndexNew = arrayIndex;
      avgNew[arrayIndex] = avg[arrayIndexNew];
      push();
      translate(-starRad2/2, 0);
      if(j % 2 == 1) {
        translate(starRad2, 0);
      }
      if(avgNew[arrayIndex] < 155) {
        fill(starCol);
        //stroke(0.5 * sin(frameCount * 0.1));
        star(i * w + starRad2, j * h + starRad2, starRad1 * (sin(frameCount * 0.15) + 0.25), starRad2 * (sin(frameCount * 0.15) + 0.25), 4);
      } else if (avgNew[arrayIndex] > 155 && avgNew[arrayIndex] < 200){
        fill(textCol);
        //stroke(1 * sin(frameCount * 0.05));
        star(i * w + starRad2, j * h + starRad2, 2 * starRad1 * sin(frameCount * 0.05), 2 * starRad2 * sin(frameCount * 0.05), 9);
      }
      pop();
      noStroke();
      //Save all the avg values into an array, together with the coordinates
      //Create new array for saving the "randomized" rectangles
      //You need a separate function for drawing gradients!
      
      //image(video, 0, 0);
      
    }
  }
}


function keyPressed() {
  if (key === 's' || key === 'S') {
    saveCanvas('video_frame', 'png');
  }
}
