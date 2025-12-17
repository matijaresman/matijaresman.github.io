let textInput = "iskra";

let starRad1 = 5;
let starRad2 = 15;
let armNr = 4;

let animate = false;
let phase = 0;
let animatedRad1, animatedRad2;

//Canvas size
let vidWidth = 1080;
let vidHeight = 1350;

//Grid size
let colNum = 73;
let rowNum = 91;

var colWidth = vidWidth / colNum;
var rowHeight = vidHeight / rowNum;

//Grid 2.5 px
var gridLine = 2.5;

let showGrid = false;
let gridCheckbox;

let kerning = 1;
let lineSpacing = 2;
let letterHeight = 12;

const letters = {
  a: [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 9],
    [3, 3], [3, 8],
    [4, 3], [4, 6], [4, 7], [4, 8],
    [5, 4], [5, 5], [5, 9],
    [6, 3]
  ],

  b : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 2], [2, 3], [2, 9],
    [3, 0], [3, 1], [3, 3], [3, 9],
    [4, 3], [4, 7], [4, 8],
    [5, 4], [5, 5], [5, 6]
  ],

  c : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 9],
    [3, 3],[3, 9],
    [4, 3], [4, 8],
    [5, 4], [5, 5]
  ],

  d : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 9],
    [3, 3], [3, 8],
    [4, 3], [4, 6], [4, 7], [4, 8],
    [5, 4], [5, 5], [5, 9],
    [6, 2], [6, 3],
    [7, 0], [7, 1]
  ],

  e : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 6], [1, 9],
    [2, 3],[2, 6], [2, 9],
    [3, 3],[3, 6], [3, 9],
    [4, 3],[4, 6], [4, 8],
    [5, 4], [5, 5]
  ],

  f : [
    [0, 8], [0, 9],
    [1, 5], [1, 6], [1, 7], [1, 3],
    [2, 1], [2, 2], [2, 3], [2, 4],
    [3, 0], [3, 3],
    [4, 0], [4, 3],
    [5, 1]
  ],

  g : [
    [0, 11],
    [1, 6], [1, 7], [1, 8], [1, 12],
    [2, 4], [2, 5], [2, 9], [2, 12],
    [3, 3], [3, 9], [3, 12],
    [4, 3], [4, 9], [4, 10], [4, 11],
    [5, 3], [5, 7], [5, 8],
    [6, 4], [6, 5], [6, 6],
    [7, 3]
  ],

  h : [
    [0, 8], [0, 9],
    [1, 5], [1, 6], [1, 7],
    [2, 2], [2, 3], [2, 4],
    [3, 0], [3, 1], [3, 4],
    [4, 3], [4, 8], [4, 9],
    [5, 3], [5, 5], [5, 6], [5, 7],
    [6, 4]
  ],

  i : [
    [0, 3], [0, 8], [0, 9],
    [1, 3], [1, 5], [1, 6], [1, 7],
    [2, 3], [2, 4],
    [3, 0], [3, 1]
  ],

  j : [
    [0, 11],
    [1, 12],
    [2, 12],
    [3, 11],
    [4, 3], [4, 8], [4, 9], [4, 10],
    [5, 3], [5, 5], [5, 6], [5, 7],
    [6, 3], [6, 4],
    [7, 0], [7, 1]
  ],

  k : [
    [0, 8], [0, 9],
    [1, 5], [1, 6], [1, 7],
    [2, 2], [2, 3], [2, 4], [2, 6],
    [3, 0], [3, 1], [3, 6], [3, 7],
    [4, 5], [4, 8],
    [5, 4], [5, 9],
    [6, 3]
  ],

  l : [
    [0, 8], [0, 9],
    [1, 5], [1, 6], [1, 7],
    [2, 2], [2, 3], [2, 4],  
    [3, 0], [3, 1]
  ],

  m : [
    [0, 8], [0, 9],
    [1, 3], [1, 5], [1, 6], [1, 7],
    [2, 4],  
    [3, 3], [3, 8], [3, 9],
    [4, 3], [4, 5], [4, 6], [4, 7],
    [5, 4],
    [6, 3], [6, 8], [6, 9],
    [7, 3], [7, 5], [7, 6], [7, 7],
    [8, 4]
  ],

  n : [
    [0, 8], [0, 9],
    [1, 3], [1, 5], [1, 6], [1, 7],
    [2, 4],
    [3, 3],
    [4, 3], [4, 8], [4, 9],
    [5, 3], [5, 5], [5, 6], [5, 7],
    [6, 4]
  ],

  o : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 9],
    [3, 3],[3, 9],
    [4, 3], [4, 7], [4, 8],
    [5, 4], [5, 5], [5, 6]
  ],

  p : [
    [0, 11], [0, 12],
    [1, 9], [1, 10],
    [2, 3], [2, 6], [2, 7], [2, 8],
    [3, 4], [3, 5], [3, 9],
    [4, 3], [4, 9],
    [5, 3], [5, 9],
    [6, 3], [6, 7], [6, 8],
    [7, 4], [7, 5], [7, 6]
  ],

  q : [
    [1, 6], [1, 7], [1, 8],
    [2, 4], [2, 5], [2, 9],
    [3, 3], [3, 9], [3, 11], [3, 12],
    [4, 3], [4, 9], [4, 10],
    [5, 3], [5, 7], [5, 8],
    [6, 4], [6, 5], [6, 6],
    [7, 3]
  ],

  r : [
    [0, 8], [0, 9],
    [1, 3], [1, 5], [1, 6], [1, 7],
    [2, 4],
    [3, 3],
    [4, 3],
    [5, 4]
  ],

  s : [
    [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 6], [2, 9],
    [3, 3], [3, 6], [3, 9],
    [4, 3], [4, 7], [4, 8],
    [5, 4]
  ],

  t : [
    [0, 7], [0, 8],
    [1, 3], [1, 5], [1, 6], [1, 9],
    [2, 3], [2, 4], [2, 9],
    [3, 1], [3, 2], [3, 3], [3, 8],
    [4, 3]
  ],

  u : [
    [0, 7], [0, 8],
    [1, 5], [1, 6], [1, 9],
    [2, 3], [2, 4], [2, 9],
    [3, 8],
    [4, 7], [4, 8],
    [5, 5], [5, 6], [5, 9],
    [6, 3], [6, 4]
  ],

  v : [
    [0, 5], [0, 6], [0, 7], [0, 8],
    [1, 3], [1, 4], [1, 9],
    [2, 8],
    [3, 7],
    [4, 6],
    [5, 3], [5, 4], [5, 5]
  ],

  w : [
    [0, 7], [0, 8],
    [1, 5], [1, 6], [1, 9],
    [2, 3], [2, 4], [2, 9],
    [3, 7], [3, 8],
    [4, 5], [4, 6], [4, 9],
    [5, 3], [5, 4], [5, 9],
    [6, 7], [6, 8],
    [7, 5], [7, 6],
    [8, 3], [8, 4]
  ],

  x : [
    [0, 8],
    [1, 9], [1, 4],
    [2, 3], [2, 9],
    [3, 3], [3, 7], [3, 8],
    [4, 4], [4, 5], [4, 6], [4, 9],
    [5, 9], [5, 3],
    [6, 8], [6, 3],
    [7, 4]
  ],

  y : [
    [0, 12],
    [1, 5], [1, 6], [1, 7], [1, 8], [1, 11],
    [2, 3], [2, 4], [2, 9], [2, 10],
    [3, 8],
    [4, 7],
    [5, 6],
    [6, 3], [6, 4], [6, 5]
  ],

  z : [
    [0, 8], [0, 9],
    [1, 3], [1, 7], [1, 9],
    [2, 3], [2, 6], [2, 9],
    [3, 3], [3, 5], [3, 9],
    [4, 3], [4, 4]
  ],
};

const letterWidthMap = {
  a: 6,
  b: 6,
  c: 6,
  d: 6,
  e: 5,
  f: 3,
  g: 7,
  h: 7,
  i: 2,
  //Problem!
  j: 6,
  k: 6,
  l: 3,
  m: 9,
  n: 7,
  o: 5,
  p: 7,
  //Problem!
  q: 6,
  r: 5,
  s: 5,
  t: 4,
  u: 6,
  v: 5,
  w: 8,
  x: 7,
  y: 6,
  z: 4
};

let backgroundCol = '#FFFFFF';
let starCol = '#FF00FF';
let gridCol = '#000000';

/*
var capturer = new CCapture( {
	framerate: 5,
  format: 'webm',
	verbose: true
} );
*/

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

function gridToPixel(col, row) {
  return {
    x: col * colWidth + colWidth / 2,
    y: row * rowHeight
  };
}

function drawLetter(char, startCol, startRow) {
  const points = letters[char];
  if (!points) return;

  const rotation = getStarRotation(armNr);

  for (let [x, y] of points) {
    const pos = gridToPixel(startCol + x, startRow + y);

    push();
    translate(pos.x, pos.y);
    rotate(rotation);
    star(0, 0, animatedRad1, animatedRad2, armNr);
    pop();
  }
}

function drawTextGrid(text) {
  let cursorCol = 1;
  let cursorRow = 1;

  for (let char of text.toLowerCase()) {
    if (char === " ") {
      cursorCol += 3 + kerning;
      continue;
    }

    if (!letters[char]) continue;
    
    const glyphWidth = letterWidthMap[char] || 0;

    // wrap line if it won't fit
    if (cursorCol + glyphWidth >= colNum) {
      cursorCol = 1;
      cursorRow += letterHeight + lineSpacing;
    }

    drawLetter(char, cursorCol, cursorRow);

    cursorCol += glyphWidth + kerning;
  }
}

function drawGrid() {
  for (let i = 0; i < colNum; i++) {
    for (let j = 0; j < rowNum; j++) {
      strokeWeight(1.875);
      //Vertical lines:
      line(i * colWidth - gridLine/2, rowHeight/2, i * colWidth - gridLine/2, vidHeight - rowHeight/2);
      //Horizontal lines:
      line(0, j * rowHeight + rowHeight/2, vidWidth, j * rowHeight + rowHeight/2);
    }
  }
}

function updateGridMetrics() {
  colWidth = vidWidth / colNum;
  rowHeight = vidHeight / rowNum;
}

function getStarRotation(armNr) {
  switch (armNr) {
    case 4:
      return 0;
    case 5:
      return -HALF_PI;
    case 12:
      return radians(30);
    case 38:
      return radians(360 / 38 / 2);
    default:
      return 0;
  }
}

function setup() {
  let cnv = createCanvas(1080, 1350);
  cnv.parent('canvas-container');
  //frameRate(5);

  updateGridMetrics();

  uiContainer = createDiv();
  uiContainer.parent('container');
  uiContainer.id('ui-container');

  textField = createInput(textInput);
  textField.parent(uiContainer);
  textField.input(() => textInput = textField.value());
  
  createP("Select grid").parent(uiContainer);
  gridSelect = createSelect();
  gridSelect.option("33x41");
  gridSelect.option("73x91");
  gridSelect.selected("73x91");
  gridSelect.changed(() => {
    if (gridSelect.value() === "33x41") {
      colNum = 33;
      rowNum = 41;
    } else {
      colNum = 73;
      rowNum = 91;
    }

    updateGridMetrics();
  });
  gridSelect.parent(uiContainer);

  createP("Kerning").parent(uiContainer);
  kerningSlider = createSlider(1, 5, 1, 1);
  kerningSlider.input(() => kerning = kerningSlider.value());
  kerningSlider.parent(uiContainer);

  createP("Line spacing").parent(uiContainer);
  lineSpacingSlider = createSlider(0, 10, 1, 1);
  lineSpacingSlider.input(() => lineSpacing = lineSpacingSlider.value());
  lineSpacingSlider.parent(uiContainer);

  createP("Star color").parent(uiContainer);
  starColorPicker = createColorPicker(starCol);
  starColorPicker.input(() => starCol = starColorPicker.value());
  starColorPicker.parent(uiContainer);

  createP("Background color").parent(uiContainer);
  bgColorPicker = createColorPicker(backgroundCol);
  bgColorPicker.input(() => backgroundCol = bgColorPicker.value());
  bgColorPicker.parent(uiContainer);

  createP("Number of arms").parent(uiContainer);
  armSelect = createSelect();
  [4, 5, 12, 38].forEach(v => armSelect.option(v));
  armSelect.selected("4");
  armSelect.changed(() => armNr = int(armSelect.value()));
  armSelect.parent(uiContainer);

  createP("Small radius").parent(uiContainer);
  starRad1Slider = createSlider(1, 50, 5, 1);
  starRad1Slider.input(() => starRad1 = starRad1Slider.value());
  starRad1Slider.parent(uiContainer);

  createP("Big radius").parent(uiContainer);
  starRad2Slider = createSlider(5, 100, 15, 1);
  starRad2Slider.input(() => starRad2 = starRad2Slider.value());
  starRad2Slider.parent(uiContainer);

  gridCheckbox = createCheckbox("Show grid", false);
  gridCheckbox.changed(() => showGrid = gridCheckbox.checked());
  gridCheckbox.parent(uiContainer);

  animateCheckbox = createCheckbox("Animate", false);
  animateCheckbox.parent(uiContainer);
  animateCheckbox.changed(() => animate = animateCheckbox.checked());
  
}

function draw() {
  background(backgroundCol);

  if(showGrid) {
    stroke(0);
    drawGrid();
  }

  if (animate) {
    phase += 0.03;
  }

  if (animate) {
    animatedRad1 = starRad1 * (1 + 2 * Math.abs(Math.sin(phase)));
    animatedRad2 = starRad2 * (1 + Math.abs(Math.sin(phase)));
  } else {
    animatedRad1 = starRad1;
    animatedRad2 = starRad2;
  }

  stroke(starCol);
  fill(starCol);
  drawTextGrid(textInput);
}