let textInput = "KLINIKA DENISA KATAN    ECA";
let textDateInput = "01.01.2026.";
let textEventInput = "koncert";
let textIskra = "ISKRA";

let logo1;
let logo2;

let starRad1 = 5;
let starRad2 = 15;
let bgStarRad1 = 5;
let bgStarRad2 = 15;
let armNr = 4;

let bgStars = [];

let animate = false;
let scaleBackground = false;
let phase = 0;
let animatedRad1, animatedRad2;
let animatedBgStarRad1, animatedBgStarRad2;

const CANVAS_W = 1080;
const CANVAS_H = 1350;

//Canvas size
let vidWidth = CANVAS_W;
let vidHeight = CANVAS_H;

//Grid size
let colNum = 55;
let rowNum = 69;

var colWidth = vidWidth / colNum;
var rowHeight = vidHeight / rowNum;

//Grid 2.5 px
var gridLine = 2.5;

let showGrid = false;
let showbgStars = false;
let animateBackground = false;
let showText = true;
let gridCheckbox;

let kerning = -1;
let lineSpacing = -2;
let letterHeight = 12;

let textOffsetX = 2;
let textOffsetY = 0;

let bgStarsBuffer;
let bgStarsBufferDirty = true; // tracks when static buffer needs redraw

let bgStarProb = 0.25;
let addStyling = true;

const letters = {
  a : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 9],
    [3, 3], [3, 8],
    [4, 3], [4, 6], [4, 7], [4, 8],
    [5, 4], [5, 5], [5, 9],
    [6, 3]
  ],

  A : [
    [-1, 9],
    [0, 8],
    [1, 7],
    [2, 5], [2, 6],
    [3, 4], [3, 6],
    [4, 3], [4, 6],
    [5, 2], [5, 6],
    [6, 2], [6, 3], [6, 4], [6, 5], [6, 6], [6, 7], [6, 8], [6, 9]
  ],

  b : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 2], [2, 3], [2, 9],
    [3, 0], [3, 1], [3, 3], [3, 9],
    [4, 3], [4, 7], [4, 8],
    [5, 4], [5, 5], [5, 6]
  ],

  B : [
    [0, 8], [0, 9],
    [1, 6], [1, 7], [1, 9],
    [2, 4], [2, 5], [2, 9],
    [3, 2], [3, 3], [3, 5], [3, 9],
    [4, 2], [4, 5], [4, 9],
    [5, 2], [5, 5], [5, 8],
    [6, 2], [6, 5], [6, 6], [6, 7],
    [7, 3], [7, 4]
  ],

  c : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 9],
    [3, 3],[3, 9],
    [4, 3], [4, 8],
    [5, 4], [5, 5]
  ],

  C : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 9],
    [3, 2], [3, 9],
    [4, 2], [4, 8],
    [5, 2], [5, 7],
    [6, 3], [6, 4]
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

  D : [
    [0, 8], [0, 9],
    [1, 6], [1, 7], [1, 9],
    [2, 4], [2, 5], [2, 9],
    [3, 2], [3, 3], [3, 9],
    [4, 2], [4, 9],
    [5, 2], [5, 8],
    [6, 2], [6, 6], [6, 7],
    [7, 3], [7, 4], [7, 5]
  ],

  e : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 6], [1, 9],
    [2, 3], [2, 6], [2, 9],
    [3, 3], [3, 6], [3, 9],
    [4, 3], [4, 6], [4, 8],
    [5, 4], [5, 5]
  ],

  E : [
    [0, 8], [0, 9],
    [1, 6], [1, 7], [1, 9],
    [2, 4], [2, 5], [2, 9],
    [3, 2], [3, 3], [3, 5], [3, 9],
    [4, 2], [4, 5], [4, 9],
    [5, 2], [5, 5],
    [6, 2],
    [7, 2]
  ],

  f : [
    [0, 8], [0, 9],
    [1, 5], [1, 6], [1, 7], [1, 3],
    [2, 1], [2, 2], [2, 3], [2, 4],
    [3, 0], [3, 3],
    [4, 0], [4, 3],
    [5, 1]
  ],

  F : [
    [0, 8], [0, 9],
    [1, 6], [1, 7],
    [2, 4], [2, 5],
    [3, 2], [3, 3], [3, 5],
    [4, 2], [4, 5],
    [5, 2], [5, 5],
    [6, 2],
    [7, 2],
  ],

  g : [
    [-1, 11],
    [0, 6], [0, 7], [0, 8], [0, 12],
    [1, 4], [1, 5], [1, 9], [1, 12],
    [2, 3], [2, 9], [2, 12],
    [3, 3], [3, 9], [3, 10], [3, 11],
    [4, 3], [4, 7], [4, 8],
    [5, 4], [5, 5], [5, 6],
    [6, 3]
  ],

  G : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 9],
    [3, 2], [3, 6], [3, 9],
    [4, 2], [4, 6], [4, 9],
    [5, 2], [5, 6], [5, 8],
    [6, 2], [6, 6], [6, 7],
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

  H : [
    [0, 8], [0, 9],
    [1, 6], [1, 7],
    [2, 4], [2, 5],
    [3, 2], [3, 3], [3, 5],
    [4, 5],
    [5, 5], [5, 8], [5, 9],
    [6, 5], [6, 6], [6, 7],
    [7, 4], [7, 5],
    [8, 2], [8, 3]
  ],

  i : [
    [0, 3], [0, 8], [0, 9],
    [1, 3], [1, 5], [1, 6], [1, 7],
    [2, 3], [2, 4],
    [3, 0], [3, 1]
  ],

  I : [
    [0, 9],
    [1, 9],
    [2, 8], [2, 9],
    [3, 2], [3, 6], [3, 7], [3, 9],
    [4, 2], [4, 4], [4, 5], [4, 9],
    [5, 2], [5, 3],
    [6, 2],
    [7, 2]
  ],

  j : [
    [-1, 11],
    [0, 12],
    [1, 12],
    [2, 11],
    [3, 3], [3, 8], [3, 9], [3, 10],
    [4, 3], [4, 5], [4, 6], [4, 7],
    [5, 3], [5, 4],
    [6, 0], [6, 1]
  ],

  J : [
    [0, 7], [0, 8],
    [1, 9],
    [2, 9],
    [3, 8],
    [4, 6], [4, 7],
    [5, 4], [5, 5],
    [6, 2], [6, 3]
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

  K : [
    [0, 8], [0, 9],
    [1, 6], [1, 7],
    [2, 4], [2, 5],
    [3, 2], [3, 3], [3, 5],
    [4, 5], [4, 6],
    [5, 4], [5, 7], [5, 8],
    [6, 3], [6, 9],
    [7, 2]
  ],

  l : [
    [0, 8], [0, 9],
    [1, 5], [1, 6], [1, 7],
    [2, 2], [2, 3], [2, 4],  
    [3, 0], [3, 1]
  ],

  L : [
    [0, 8], [0, 9],
    [1, 6], [1, 7], [1, 9],
    [2, 4], [2, 5], [2, 9],
    [3, 2], [3, 3], [3, 9],
    [4, 9]
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

  M : [
    [0, 8], [0, 9],
    [1, 6], [1, 7],
    [2, 4], [2, 5],
    [3, 2], [3, 3],
    [4, 3], [4, 4],
    [5, 5],
    [6, 4],
    [7, 3],
    [8, 2], [8, 3], [8, 4], [8, 5], [8, 6], [8, 7], [8, 8], [8, 9]
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

  N : [
    [0, 8], [0, 9],
    [1, 6], [1, 7],
    [2, 4], [2, 5],
    [3, 2], [3, 3],
    [4, 4], [4, 5],
    [5, 6], [5, 7],
    [6, 8], [6, 9],
    [7, 6], [7, 7],
    [8, 4], [8, 5],
    [9, 2], [9, 3]
  ],

  o : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 9],
    [3, 3],[3, 9],
    [4, 3], [4, 7], [4, 8],
    [5, 4], [5, 5], [5, 6]
  ],

  O : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 9],
    [3, 2], [3, 9],
    [4, 2], [4, 8],
    [5, 2], [5, 6], [5, 7],
    [6, 3], [6, 4], [6, 5],
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

  P : [
    [0, 8], [0, 9],
    [1, 6], [1, 7],
    [2, 4], [2, 5], [2, 6],
    [3, 2], [3, 3], [3, 6],
    [4, 2], [4, 6],
    [5, 2], [5, 6],
    [6, 2], [6, 5],
    [7, 3], [7, 4]
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

  Q : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 9],
    [3, 2], [3, 7], [3, 9],
    [4, 2], [4, 8],
    [5, 2], [5, 6], [5, 7], [5, 9],
    [6, 3], [6, 4], [6, 5],
  ],

  r : [
    [0, 8], [0, 9],
    [1, 3], [1, 5], [1, 6], [1, 7],
    [2, 4],
    [3, 3],
    [4, 3],
    [5, 4]
  ],

  R : [
    [0, 8], [0, 9],
    [1, 6], [1, 7],
    [2, 4], [2, 5], [2, 6],
    [3, 2], [3, 3], [3, 6],
    [4, 2], [4, 6], [4, 7],
    [5, 2], [5, 6], [5, 8],
    [6, 2], [6, 5], [6, 9],
    [7, 3], [7, 4]
  ],

  s : [
    [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 3], [2, 6], [2, 9],
    [3, 3], [3, 6], [3, 9],
    [4, 3], [4, 7], [4, 8],
    [5, 4]
  ],

  S : [
    [0, 8],
    [1, 9],
    [2, 3], [2, 4], [2, 9],
    [3, 2], [3, 5], [3, 9],
    [4, 2], [4, 6], [4, 9],
    [5, 2], [5, 7], [5, 8],
    [6, 2],
    [7, 3]
  ],

  t : [
    [0, 7], [0, 8],
    [1, 3], [1, 5], [1, 6], [1, 9],
    [2, 3], [2, 4], [2, 9],
    [3, 1], [3, 2], [3, 3], [3, 8],
    [4, 3]
  ],

  T : [
    [1, 2], [1, 8], [1, 9],
    [2, 2], [2, 6], [2, 7],
    [3, 2], [3, 4], [3, 5],
    [4, 2], [4, 3],
    [5, 2],
    [6, 2],
    [7, 2]
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

  U : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 2], [2, 3], [2, 9],
    [3, 9],
    [4, 8],
    [5, 6], [5, 7],
    [6, 4], [6, 5],
    [7, 2], [7, 3]
  ],

  v : [
    [0, 5], [0, 6], [0, 7], [0, 8],
    [1, 3], [1, 4], [1, 9],
    [2, 8],
    [3, 7],
    [4, 6],
    [5, 3], [5, 4], [5, 5]
  ],

  V : [
    [0, 5], [0, 6], [0, 7], [0, 8], [0, 9],
    [1, 2], [1, 3], [1, 4], [1, 8],
    [2, 7],
    [3, 6],
    [4, 5],
    [5, 4],
    [6, 2], [6, 3]
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

  W : [
    [0, 6], [0, 7], [0, 8],
    [1, 4], [1, 5], [1, 9],
    [2, 2], [2, 3], [2, 9],
    [3, 8],
    [4, 6], [4, 7], [4, 8],
    [5, 4], [5, 5], [5, 9],
    [6, 2], [6, 3], [6, 9],
    [7, 8],
    [8, 6], [8, 7],
    [9, 4], [9, 5],
    [10, 2], [10, 3]
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

  X : [
    [-1, 8],
    [0, 9],
    [1, 3], [1, 9],
    [2, 2], [2, 9],
    [3, 2], [3, 7], [3, 8],
    [4, 2], [4, 5], [4, 6], [4, 9],
    [5, 3], [5, 4], [5, 9],
    [6, 2], [6, 9],
    [7, 2], [7, 8],
    [8, 2],
    [9, 3]
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

  Y : [
    [0, 9],
    [1, 8],
    [2, 2], [2, 3], [2, 4], [2, 5], [2, 6], [2, 7],
    [3, 6],
    [4, 5],
    [5, 4],
    [6, 3],
    [7, 2]
  ],

  z : [
    [0, 8], [0, 9],
    [1, 3], [1, 7], [1, 9],
    [2, 3], [2, 6], [2, 9],
    [3, 3], [3, 5], [3, 9],
    [4, 3], [4, 4]
  ],

  Z : [
    [0, 8], [0, 9],
    [1, 2], [1, 7], [1, 9],
    [2, 2], [2, 6], [2, 9],
    [3, 2], [3, 5], [3, 9],
    [4, 2], [4, 4], [4, 9],
    [5, 2], [5, 3]
  ],
};

const letterWidthMap = {
  a: 6,
  A: 9,
  b: 6,
  B: 9,
  c: 6,
  C: 8,
  d: 6,
  D: 9,
  e: 5,
  E: 8,
  f: 3,
  F: 8,
  g: 7,
  G: 9,
  h: 7,
  H: 9,
  i: 2,
  //Problem!
  I: 7,
  j: 6,
  J: 7,
  k: 6,
  K: 9,
  l: 3,
  L: 7,
  m: 9,
  M: 11,
  n: 7,
  N: 10,
  o: 5,
  O: 8,
  p: 7,
  P: 9,
  //Problem!
  q: 6,
  Q: 8,
  r: 5,
  R: 9,
  s: 5,
  S: 9,
  t: 4,
  T: 7,
  u: 6,
  U: 10,
  v: 5,
  V: 7,
  w: 8,
  W: 11,
  x: 7,
  X: 9,
  y: 6,
  Y: 7,
  z: 4,
  Z: 6
};

let backgroundCol = '#FFFFFF';
let starCol = '#FB68FF';
let gridCol = '#000000';
let textCol = '#000000';

let svgDrawn = false;

/*
var capturer = new CCapture( {
	framerate: 5,
  format: 'webm',
	verbose: true
} );
*/

// Star function:
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
    fill(starCol);
    noStroke();
    star(0, 0, animatedRad1, animatedRad2, armNr);
    pop();
  }
}

function drawTextGrid(text) {
  let cursorCol = textOffsetX;
  let cursorRow = textOffsetY + 7;

  for (let char of text) {
    if (char === " ") {
      cursorCol += 3 + kerning;
      continue;
    }

    if (!letters[char]) continue;
    
    const glyphWidth = letterWidthMap[char] || 0;

    // wrap line if it won't fit
    if (cursorCol + glyphWidth >= colNum) {
      cursorCol = textOffsetX;
      cursorRow += letterHeight + lineSpacing;
    }

    drawLetter(char, cursorCol, cursorRow);

    cursorCol += glyphWidth + kerning;
  }
}

function getTextBounds(text) {
  let maxCol = 0;
  let cursorCol = textOffsetX;
  let cursorRow = textOffsetY + 7;
  let startRow = cursorRow;

  for (let char of text) {
    if (char === " ") {
      cursorCol += 3 + kerning;
      continue;
    }

    const glyphWidth = letterWidthMap[char] || 0;

    if (cursorCol + glyphWidth >= colNum) {
      maxCol = max(maxCol, cursorCol);
      cursorCol = textOffsetX;
      cursorRow += letterHeight + lineSpacing;
    }

    cursorCol += glyphWidth + kerning;
    maxCol = max(maxCol, cursorCol);
  }

  return {
    colMin: textOffsetX - 1,
    colMax: maxCol - 3,
    rowMin: startRow,
    rowMax: cursorRow + letterHeight - 3
  };
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
    case 7:
      return radians(360 / 7 / 4);
    case 9:
      return -radians(360 / 9 / 4);
    case 10:
      return radians(360 / 10 / 2);
    case 12:
      return radians(360 / 12);
    case 16:
      return 0;
    case 19:
      return radians(360 / 19 / 4);
    case 22:
      return radians(360 / 22 / 2);
    case 25:
      return -radians(360 / 25 / 4);
    case 28:
      return radians(360 / 28 / 8);
    case 38:
      return radians(360 / 38 / 2);
    default:
      return 0;
  }
}

function getLetterBoundingBoxes(text) {
  let boxes = [];
  let cursorCol = textOffsetX;
  let cursorRow = textOffsetY + 7;

  for (let char of text) {
    if (char === " ") {
      cursorCol += 3 + kerning;
      continue;
    }

    const points = letters[char];
    const glyphWidth = letterWidthMap[char] || 0;

    if (!points) {
      cursorCol += glyphWidth + kerning;
      continue;
    }

    // wrap line if it won't fit
    if (cursorCol + glyphWidth >= colNum) {
      cursorCol = textOffsetX;
      cursorRow += letterHeight + lineSpacing;
    }

    // compute min/max for this letter
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;

    for (let [x, y] of points) {
      const cellCol = cursorCol + x;
      const cellRow = cursorRow + y;

      if (cellCol < minX) minX = cellCol;
      if (cellCol > maxX) maxX = cellCol;
      if (cellRow < minY) minY = cellRow;
      if (cellRow > maxY) maxY = cellRow;
    }
    // add 1-cell margin
    boxes.push({ 
      colMin: minX - 1, 
      colMax: maxX + 1, 
      rowMin: minY - 2, 
      rowMax: maxY 
    });

    cursorCol += glyphWidth + kerning;
  }

  return boxes;
}

function updateStarSize() {
  starRad1 = starRad1Slider.value();
  starRad2 = starRad2Slider.value();
}

function bgAnim() {
  const letterBoxes = getLetterBoundingBoxes(textInput);

  for (let i = 0; i < colNum; i++) {
    for (let j = 0; j < rowNum; j++) {

      const xPx = i * colWidth + colWidth;
      const yPx = j * rowHeight + rowHeight;

      // Exclude top/bottom margins
      if (
        xPx < 40 ||
        xPx > width - 40 ||
        yPx < 140 ||
        yPx > height - 300
      ) continue;

      // Skip stars inside any letter box
      let insideLetter = false;
      for (let box of letterBoxes) {
        if (i >= box.colMin && i <= box.colMax &&
            j >= box.rowMin && j <= box.rowMax) {
          insideLetter = true;
          break;
        }
      }
      if (insideLetter) continue;

      // Random star density
      if (random() < bgStarProb) {
        const x = i * colWidth + colWidth / 2;
        const y = yPx;

        push();
        translate(x, y);
        fill(starCol);
        noStroke();
        star(0, 0, animatedBgStarRad1, animatedBgStarRad2, armNr);
        pop();
      }
    }
  }
}

function generateBgStars() {
  bgStars = [];

  const letterBoxes = getLetterBoundingBoxes(textInput);
  const rotation = getStarRotation(armNr);
  for (let i = 0; i < colNum; i++) {
    for (let j = 0; j < rowNum; j++) {

      const xPx = i * colWidth + colWidth;
      const yPx = j * rowHeight + rowHeight;

      // Exclude margins
      if (
        xPx < 40 ||
        xPx > width - 40 ||
        yPx < 140 ||
        yPx > height - 300
      ) continue;

      // Exclude letters
      let insideLetter = false;
      for (let box of letterBoxes) {
        if (i >= box.colMin && i <= box.colMax &&
            j >= box.rowMin && j <= box.rowMax) {
          insideLetter = true;
          break;
        }
      }
      if (insideLetter) continue;

      // Random density (ONCE)
      if (random() < bgStarProb) {
        bgStars.push({
          x: i * colWidth + colWidth / 2,
          y: yPx,
          rot: rotation
        });
      }
    }
  }
}

function drawBgStarsLive() {
  push();
  fill(starCol);
  noStroke();

  for (let s of bgStars) {
    push();
    translate(s.x, s.y);
    rotate(s.rot);
    star(0, 0, animatedBgStarRad1, animatedBgStarRad2, armNr);
    pop();
  }

  pop();
}

function regenerateBgStarsFrame() {
  generateBgStars();   // re-randomize stars
}

function drawBgStarsToBuffer() {
  bgStarsBuffer.push();
  bgStarsBuffer.fill(starCol);
  bgStarsBuffer.noStroke();

  for (let s of bgStars) {
    bgStarsBuffer.push();
    bgStarsBuffer.translate(s.x, s.y);
    bgStarsBuffer.rotate(s.rot);
    drawStarOnBuffer(
      bgStarsBuffer,
      0, 0,
      starRad1,
      starRad2,
      armNr
    );
    bgStarsBuffer.pop();
  }

  bgStarsBuffer.pop();
}

function drawStarOnBuffer(buf, x, y, r1, r2, npoints) {
  let angle = TWO_PI / npoints;
  let halfAngle = angle / 2.0;
  buf.beginShape();
  for (let a = 0; a < TWO_PI; a += angle) {
    let sx = x + cos(a) * r2;
    let sy = y + sin(a) * r2;
    buf.vertex(sx, sy);
    sx = x + cos(a + halfAngle) * r1;
    sy = y + sin(a + halfAngle) * r1;
    buf.vertex(sx, sy);
  }
  buf.endShape(CLOSE);
}

function onTextOrGridChange() {
  bgStarsBufferDirty = true;
  generateBgStars();
}

// Fonts preload:
function preload() {
  simplexFont = loadFont('./assets/MillingSimplexTrialVAR0,5mm-wght100.ttf');
  triplexFont = loadFont('./assets/MillingTriplexTrialVAR4mm-wght300.ttf');
}

function windowResized() {
  updateCanvasScale();
}

function updateCanvasScale() {
  const container = document.getElementById('canvas-container');
  const wrapper = document.getElementById('canvas-wrapper');

  const availableW = container.clientWidth;
  const availableH = container.clientHeight;

  const scale = Math.min(
    availableW / CANVAS_W,
    availableH / CANVAS_H
  );

  wrapper.style.transform = `scale(${scale})`;
}

// Draw SVG to canvas function:
function drawSVGToCanvas(x, y, w, h) {
  const svg = document.querySelector('#logo-npk svg');
  const serializer = new XMLSerializer();
  const source = serializer.serializeToString(svg);

  const img = new Image();
  const blob = new Blob([source], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  img.onload = () => {
    image(img, x, y, w, h);
    URL.revokeObjectURL(url);
  };

  img.src = url;
}


// Save frame function:
function saveFrameAsPNG() {
  const timestamp =
    year() + "-" +
    nf(month(), 2) + "-" +
    nf(day(), 2) + "_" +
    nf(hour(), 2) + "-" +
    nf(minute(), 2) + "-" +
    nf(second(), 2);

  saveCanvas(`iskra-${timestamp}`, 'png');
}

//=============================================

// SETUP FUNCTION START:
function setup() {
  const container = document.getElementById('canvas-container');
  const w = container.clientWidth;
  const h = container.clientHeight;

  const cnv = createCanvas(CANVAS_W, CANVAS_H);
  cnv.parent('canvas-wrapper');
  frameRate(10);

  updateGridMetrics();
  updateCanvasScale();

  bgStarsBuffer = createGraphics(CANVAS_W, CANVAS_H);
  bgStarsBuffer.pixelDensity(pixelDensity());

  // UI Menu:

  uiContainer = select('#ui-container');

  textField = createInput(textInput);
  textField.parent(uiContainer);
  textField.input(() => {
    textInput = textField.value();
    onTextOrGridChange();
    generateBgStars();
  });
  
  textDateField = createInput(textDateInput);
  textDateField.parent(uiContainer);
  textDateField.input(() => textDateInput = textDateField.value());

  textEventField = createInput(textEventInput);
  textEventField.parent(uiContainer);
  textEventField.input(() => textEventInput = textEventField.value());
  
  createP("Select grid").parent(uiContainer);
  gridSelect = createSelect();
  gridSelect.option("33x41");
  gridSelect.option("39x49");
  gridSelect.option("41x51");
  gridSelect.option("49x61");
  gridSelect.option("55x69");
  gridSelect.option("63x79");
  gridSelect.option("73x91");
  gridSelect.selected("55x69");
  gridSelect.changed(() => {
    if (gridSelect.value() === "33x41") {
      colNum = 33;
      rowNum = 41;
    } else if (gridSelect.value() === "39x49") {
      colNum = 39;
      rowNum = 49;
    } else if (gridSelect.value() === "41x51") {
      colNum = 41;
      rowNum = 51;
    } else if (gridSelect.value() === "49x61") {
      colNum = 49;
      rowNum = 61;
    } else if (gridSelect.value() === "55x69") {
      colNum = 55;
      rowNum = 69;
    }  else if (gridSelect.value() === "63x79") {
      colNum = 63;
      rowNum = 79;
    }
    
    else {
      colNum = 73;
      rowNum = 91;
    }

    updateGridMetrics();
    onTextOrGridChange();
    generateBgStars();
  });
  gridSelect.parent(uiContainer);

  createP("Kerning").parent(uiContainer);
  kerningSlider = createSlider(-2, 5, -1, 1);
  kerningSlider.input(() => {
    kerning = kerningSlider.value();
    onTextOrGridChange();
  });
  kerningSlider.parent(uiContainer);

  createP("Line spacing").parent(uiContainer);
  lineSpacingSlider = createSlider(-4, 10, -2, 1);
  lineSpacingSlider.input(() => {
    lineSpacing = lineSpacingSlider.value();
    onTextOrGridChange();
  });
  lineSpacingSlider.parent(uiContainer);

  createP("Text box X").parent(uiContainer);
  textOffsetXSlider = createSlider(0, 73, 1, 1);
  textOffsetXSlider.parent(uiContainer);
  textOffsetXSlider.input(() => {
    textOffsetX = textOffsetXSlider.value();
    onTextOrGridChange();
  });

  createP("Text box Y").parent(uiContainer);
  textOffsetYSlider = createSlider(-20, 91, 0, 1);
  textOffsetYSlider.parent(uiContainer);
  textOffsetYSlider.input(() => {
    textOffsetY = textOffsetYSlider.value();
    onTextOrGridChange();
  });

  //Star color:
  createP("Star color").parent(uiContainer);

  const starColors = [
    "#340924",
    "#FB68FF",
    "#875EFF",
    "#FE2C35",
    "#F14C03",
    "#E3FFAB",
    "#C3B8A6"
  ];
  
  const swatchContainer1 = createDiv();
  swatchContainer1.parent(uiContainer);
  swatchContainer1.style("display", "flex");
  swatchContainer1.style("gap", "6px");
  
  starColors.forEach(c => {
    const btn = createButton("");
    btn.parent(swatchContainer1);
    btn.style("background-color", c);
    btn.style("width", "20px");
    btn.style("height", "20px");
    btn.style("border-radius", "50%");
    btn.style("border", "1px solid #444");
    btn.style("cursor", "pointer");
  
    btn.mousePressed(() => {
      starCol = color(c);
      if (!scaleBackground && !animateBackground) {
        drawBgStarsLive(); // redraw background stars once with new color
      }
    });
  });
  

  //Background color:
  createP("Background color").parent(uiContainer);

  const backgroundColors = [
    "#340924",
    "#FB68FF",
    "#875EFF",
    "#FE2C35",
    "#F14C03",
    "#E3FFAB",
    "#C3B8A6"
  ];
  
  const swatchContainer2 = createDiv();
  swatchContainer2.parent(uiContainer);
  swatchContainer2.style("display", "flex");
  swatchContainer2.style("gap", "6px");
  
  backgroundColors.forEach(c => {
    const btn = createButton("");
    btn.parent(swatchContainer2);
    btn.style("background-color", c);
    btn.style("width", "20px");
    btn.style("height", "20px");
    btn.style("border-radius", "50%");
    btn.style("border", "1px solid #444");
    btn.style("cursor", "pointer");
  
    btn.mousePressed(() => {
      backgroundCol = color(c);
    });
  });

  // Additional text color:
  createP("Info text color").parent(uiContainer);

  const infoColors = [
    "#340924",
    "#FB68FF",
    "#875EFF",
    "#FE2C35",
    "#F14C03",
    "#E3FFAB",
    "#C3B8A6"
  ];
  
  const swatchContainer3 = createDiv();
  swatchContainer3.parent(uiContainer);
  swatchContainer3.style("display", "flex");
  swatchContainer3.style("gap", "6px");
  
  infoColors.forEach(c => {
    const btn = createButton("");
    btn.parent(swatchContainer3);
    btn.style("background-color", c);
    btn.style("width", "20px");
    btn.style("height", "20px");
    btn.style("border-radius", "50%");
    btn.style("border", "1px solid #444");
    btn.style("cursor", "pointer");
  
    btn.mousePressed(() => {
      textCol = color(c);
    });
  });

  // Number of arms:
  createP("Number of arms").parent(uiContainer);
  armSelect = createSelect();
  [4, 5, 7, 9, 10, 12, 16, 19, 22, 25, 28, 38].forEach(v => armSelect.option(v));
  armSelect.selected("4");
  armSelect.changed(() => {
    armNr = int(armSelect.value());
    bgStarsBufferDirty = true;
    generateBgStars();
  });
  armSelect.parent(uiContainer);

  createP("Small radius").parent(uiContainer);
  starRad1Slider = createSlider(1, 50, 5, 1);
  starRad1Slider.input(() => {
    starRad1 = starRad1Slider.value();
    bgStarsBufferDirty = true;
    generateBgStars();
  });
  starRad1Slider.parent(uiContainer);

  createP("Big radius").parent(uiContainer);
  starRad2Slider = createSlider(5, 100, 15, 1);
  starRad2Slider.input(() => {
    starRad2 = starRad2Slider.value();
    bgStarsBufferDirty = true;
    generateBgStars();
  });
  starRad2Slider.parent(uiContainer);

  createP("Number of background stars").parent(uiContainer);
  bgStarProbSlider = createSlider(0.05, 1.0, 0.25, 0.05);
  bgStarProbSlider.input(() => {
    bgStarProb = bgStarProbSlider.value();
    bgStarsBufferDirty = true;
    generateBgStars();
  });
  bgStarProbSlider.parent(uiContainer);

  createP("Additional text styling").parent(uiContainer);
  addStylingSelect = createSelect();
  addStylingSelect.option("Bottom text + Logo");
  addStylingSelect.option("Top text");
  addStylingSelect.changed(() => {
    if (addStylingSelect.value() === "Bottom text + Logo") {
      addStyling = true;
    } else if (addStylingSelect.value() === "Top text") {
      addStyling = false;
    }
  });
  addStylingSelect.parent(uiContainer);

  gridCheckbox = createCheckbox("Grid", false);
  gridCheckbox.changed(() => showGrid = gridCheckbox.checked());
  gridCheckbox.parent(uiContainer);

  bgStarsCheckbox = createCheckbox("Background stars", false);
  bgStarsCheckbox.changed(() => {
    showbgStars = bgStarsCheckbox.checked();
    generateBgStars();
  });
  
  bgStarsCheckbox.parent(uiContainer);

  textCheckbox = createCheckbox("Text", true);
  textCheckbox.changed(() => showText = textCheckbox.checked());
  textCheckbox.parent(uiContainer);

  backgroundCheckbox = createCheckbox("Animate stars", false);
  backgroundCheckbox.changed(() => animateBackground = backgroundCheckbox.checked());
  backgroundCheckbox.parent(uiContainer);

  bgStarsScaleCheckbox = createCheckbox("Star size animation", false);
  bgStarsScaleCheckbox.parent(uiContainer);
  bgStarsScaleCheckbox.changed(() => {
    scaleBackground = bgStarsScaleCheckbox.checked();
  });

  animateCheckbox = createCheckbox("Animate text", false);
  animateCheckbox.parent(uiContainer);
  animateCheckbox.changed(() => animate = animateCheckbox.checked());

  const saveBtn = createButton("Save PNG");
  saveBtn.parent(uiContainer);
  saveBtn.mousePressed(saveFrameAsPNG);

  // SVG Logos (styling/positioning in CSS):
  select('#logo-npk').html(`
    <?xml version="1.0" encoding="UTF-8"?>
    <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 168.94 88.02" fill="currentColor">
      <g id="Layer_1-2" data-name="Layer 1">
        <g>
          <polygon class="cls-1" points="0 .47 5.96 .47 15.43 22.17 15.68 22.17 15.68 .47 19.19 .47 19.19 25.67 13.15 25.67 3.82 3.96 3.58 3.96 3.58 25.67 0 25.67 0 .47"/>
          <polygon class="cls-1" points="57.99 .47 61.81 .47 68.86 22.17 69.14 22.17 76.33 .47 80.29 .47 71.53 25.67 66.55 25.67 57.99 .47"/>
          <polygon class="cls-1" points="82.12 22.39 85.7 22.39 85.7 3.74 82.12 3.74 82.12 .47 92.82 .47 92.82 3.74 89.24 3.74 89.24 22.39 92.82 22.39 92.82 25.66 82.12 25.66 82.12 22.39"/>
          <g>
            <path class="cls-1" d="M0,31.41h8.28c4.59,0,7.75,3.06,7.75,7.74s-3.3,7.81-7.75,7.81H3.58v9.65H0v-25.2ZM8.07,43.65c2.63,0,4.31-1.94,4.31-4.5s-1.68-4.39-4.31-4.39H3.58v8.89h4.49Z"/>
            <path class="cls-1" d="M18.64,31.41h8c5.05,0,8.21,3.03,8.21,7.52,0,3.64-1.89,6.51-5.47,7.42l6.35,10.26h-4.28l-5.72-9.86h-3.51v9.86h-3.58v-25.2ZM26.64,43.47c2.6,0,4.52-1.55,4.52-4.5,0-2.34-1.54-4.21-4.7-4.21h-4.25s0,8.71,0,8.71h4.42Z"/>
            <path class="cls-1" d="M37.37,44.01c0-7.42,5.44-13.07,12.63-13.07s12.59,5.72,12.59,13.07-5.44,13.07-12.63,13.07-12.59-5.61-12.59-13.07M58.91,44.01c0-5.47-3.86-9.58-8.91-9.58s-8.91,4.1-8.91,9.58,3.82,9.58,8.91,9.58,8.91-4.03,8.91-9.58"/>
            <path class="cls-1" d="M64.25,48.8h3.58c0,2.77,2.18,4.82,5.51,4.82,2.91,0,4.95-1.44,4.95-3.74,0-7.02-13.22-1.87-13.22-11.98,0-3.71,2.95-6.95,8.07-6.95,3.89,0,8.28,2.16,8.28,7.63h-3.61c0-2.59-1.72-4.28-4.7-4.28s-4.46,1.76-4.46,3.6c0,6.22,13.26,1.69,13.26,11.88,0,4.03-3.19,7.31-8.7,7.31-4.98,0-8.94-3.38-8.94-8.28"/>
          </g>
          <polygon class="cls-1" points="90.04 34.8 83.06 34.8 83.06 31.41 100.57 31.41 100.57 34.8 93.59 34.8 93.59 56.61 90.04 56.61 90.04 34.8"/>
          <path class="cls-1" d="M138.56,31.41h8c5.05,0,8.21,3.03,8.21,7.52,0,3.64-1.9,6.51-5.47,7.42l6.35,10.26h-4.28l-5.72-9.86h-3.51v9.86h-3.58v-25.2ZM146.55,43.47c2.6,0,4.52-1.55,4.52-4.5,0-2.34-1.54-4.21-4.7-4.21h-4.24v8.71s4.42,0,4.42,0Z"/>
          <polygon class="cls-1" points="158.25 31.41 158.25 34.69 161.82 34.69 161.82 53.33 158.25 53.33 158.25 56.61 168.94 56.61 168.94 53.33 165.37 53.33 165.37 34.69 168.94 34.69 168.94 31.41 158.25 31.41"/>
          <polygon class="cls-1" points="13.5 62.36 6.67 72.83 3.58 72.83 3.58 62.36 0 62.36 0 87.56 3.58 87.56 3.58 76.22 6.67 76.22 13.82 87.56 18.21 87.56 9.65 74.45 17.78 62.36 13.5 62.36"/>
          <polygon class="cls-1" points="52.19 62.36 52.19 87.56 66.08 87.56 66.08 84.21 55.77 84.21 55.77 62.36 52.19 62.36"/>
          <polygon class="cls-1" points="61.98 62.36 61.98 65.74 68.96 65.74 68.96 87.55 72.5 87.55 72.5 65.74 79.48 65.74 79.48 62.36 61.98 62.36"/>
          <g>
            <path class="cls-1" d="M82.08,78.38v-16.02h3.54v15.98c0,3.78,2,6.23,5.75,6.23s5.79-2.45,5.79-6.26v-15.95h3.54v15.98c0,5.72-3.4,9.68-9.33,9.68s-9.29-3.89-9.29-9.65"/>
            <path class="cls-1" d="M103.79,62.36h8c5.05,0,8.21,3.02,8.21,7.52,0,3.64-1.9,6.52-5.47,7.42l6.35,10.26h-4.28l-5.72-9.86h-3.51v9.86h-3.58v-25.2ZM111.79,74.42c2.6,0,4.52-1.55,4.52-4.5,0-2.34-1.54-4.21-4.7-4.21h-4.25v8.71h4.42Z"/>
          </g>
          <polygon class="cls-1" points="123 62.36 123 87.56 137.8 87.56 137.8 84.17 126.57 84.17 126.57 76.4 135.94 76.4 135.94 73.05 126.57 73.05 126.57 65.74 137.45 65.74 137.45 62.36 123 62.36"/>
          <g>
            <path class="cls-1" d="M45.62,0h-11.04c-7.18,0-12.61,5.66-12.61,13.07s5.4,13.07,12.59,13.07h11.08c7.19,0,12.59-5.62,12.59-13.07S52.8,0,45.62,0M45.62,22.64h0s-11.04,0-11.04,0h0c-5.08,0-8.89-4.03-8.89-9.57s3.82-9.57,8.89-9.57h0s11.04,0,11.04,0h0c5.08,0,8.89,4.1,8.89,9.57s-3.81,9.56-8.89,9.57"/>
            <path class="cls-1" d="M123.54,31.41h-11.04c-7.18,0-12.61,5.66-12.61,13.07s5.4,13.07,12.59,13.07h11.08c7.19,0,12.59-5.62,12.59-13.07s-5.43-13.06-12.61-13.07M123.54,54.05h0s-11.04,0-11.04,0h0c-5.08,0-8.89-4.03-8.89-9.57s3.82-9.56,8.89-9.57h0s11.04,0,11.04,0h0c5.08,0,8.89,4.1,8.89,9.57s-3.81,9.57-8.89,9.57"/>
            <path class="cls-1" d="M45.57,62.36v15.98c0,3.78-2,6.23-5.75,6.23h-.02v-.04h-11.04v.02c-3.49-.17-5.36-2.57-5.36-6.21v-15.98h-3.54v16.02c0,5.63,3.16,9.46,8.9,9.63v.02h11.04s.01,0,.02,0c6,0,9.3-3.89,9.3-9.65v-16.02h-3.54Z"/>
          </g>
        </g>
      </g>
    </svg>
  `);

  select('#logo-zg').html(`
    <svg id="Layer_2" data-name="Layer 2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 62.13 87.42" fill="currentColor">
      <g id="Layer_1-2" data-name="Layer 1">
        <g>
          <path class="cls-1" d="M59.56,82.5c-.23,0-.4.01-.66.04v1.43c1.11-.05,1.4-.43,1.4-.84,0-.48-.24-.62-.75-.62M48.15,82.53c-.15,0-.32.01-.54.02v1.77c1.05-.05,1.69-.4,1.69-.98,0-.53-.28-.82-1.15-.82M8.66,82.53c-.15,0-.32.01-.54.02v1.77c1.05-.05,1.68-.4,1.68-.98,0-.53-.28-.82-1.15-.82M35.23,84.92l1.43-.09-.11-.35-.57-1.82-.61,1.85-.14.41ZM14.07,84.92l1.43-.09-.11-.35-.57-1.82-.61,1.85-.14.41ZM20.11,82.57v3.59h.84c1.43,0,1.84-.72,1.84-1.82,0-1.37-.71-1.8-1.98-1.8-.28,0-.39,0-.71.02M58.9,86.21h1.04c.57,0,.83-.34.83-.73,0-.52-.56-.68-1.08-.71-.33.03-.48.05-.78.07v1.37ZM59.9,87.32h-2.37v-5.82c.23-.02,1.13-.1,1.92-.1,1.84,0,2.23.72,2.23,1.38s-.34,1.1-1.12,1.33c.77.05,1.57.49,1.57,1.45,0,1.08-.78,1.76-2.23,1.76M56.18,81.42v1.15h-2.7v1.22l2.23-.11v1.13l-2.23.09v1.27h2.87v1.16h-4.24v-5.91h4.06ZM36.83,81.38l2.11,5.94h-1.45l-.45-1.37-2.18.14-.4,1.23h-1.4l2.26-5.88,1.52-.06ZM27.85,81.42h4.6v1.01l-2.33,2.78-.91.99,1.33-.04h1.98v1.16h-4.93v-.95l2.44-2.9.89-.95-1.06.05h-2v-1.15ZM18.74,81.46c.72-.03,1.37-.06,2.16-.06,2.36,0,3.28,1.06,3.28,2.83s-.74,3.09-3.27,3.09h-2.17v-5.86ZM15.66,81.38l2.11,5.94h-1.45l-.45-1.37-2.18.14-.4,1.23h-1.4l2.26-5.88,1.52-.06ZM43.57,84.36h1.33v2.44c-.69.44-1.67.61-2.45.61-1.84,0-2.95-.96-2.95-3.07,0-1.62,1.09-3,3.17-3,1.01,0,1.75.3,2.28.75l-.82,1.04c-.32-.37-.82-.65-1.45-.65-1.19,0-1.79.7-1.79,1.87,0,1.41.62,1.9,1.63,1.9.17,0,.81-.05,1.06-.17v-1.72ZM4.07,84.36h1.33v2.44c-.7.44-1.67.61-2.45.61-1.84,0-2.95-.96-2.95-3.07,0-1.62,1.09-3,3.17-3,1.01,0,1.74.3,2.28.75l-.82,1.04c-.32-.37-.82-.65-1.45-.65-1.2,0-1.79.7-1.79,1.87,0,1.41.62,1.9,1.62,1.9.17,0,.82-.05,1.06-.17v-1.72ZM46.26,81.51c.74-.1,1.67-.12,2.12-.12,1.7,0,2.31.87,2.31,1.86,0,.67-.34,1.2-1.03,1.57l1.49,2.5-1.47.1-1.21-2.16c-.27.06-.55.11-.85.15v1.92h-1.35v-5.81ZM6.77,81.51c.73-.1,1.67-.12,2.12-.12,1.7,0,2.31.87,2.31,1.86,0,.67-.34,1.2-1.03,1.57l1.49,2.5-1.48.1-1.21-2.16c-.27.06-.55.11-.85.15v1.92h-1.36v-5.81Z"/>
          <path class="cls-1" d="M30.38,71.96c-20.72-.17-28.68-16.65-28.83-27V0h59.02v44.92c.13,6.79-2.47,13.47-7.15,18.31-5.36,5.56-13.33,8.57-23.05,8.73M2.18.63v44.33c.15,10.1,7.94,26.21,28.2,26.38,9.54-.15,17.35-3.11,22.6-8.54,4.56-4.72,7.1-11.24,6.97-17.87V.63H2.18ZM9.6,14.89l-1.46-4.14-4.44.79,2.97-3.57-2.47-3.01,4.01.47,1.6-4,1.55,4.1,4.27-.59-2.72,3.32,2.43,3.2-4.13-.56-1.61,3.99ZM8.35,10.07l.26.11,1.04,2.93,1.17-2.9,3.12.43-1.81-2.39,2.02-2.46-3.17.44-1.16-3.06-1.18,2.94-2.94-.35,1.81,2.21-2.2,2.65,3.07-.55ZM53.61,13.13c-1.29,0-2.41-.31-2.61-.62l-.08-.13.04-.21c.08-.25.34-.34.86-.52,1.18-.42,3.37-1.19,3.32-3.81-.05-2.7-2.45-3.5-3.6-3.89-.51-.17-.73-.25-.81-.47l-.05-.14.09-.17h0c.22-.35,1.34-.71,2.44-.8,1.68-.15,3.12.36,4.03,1.4l.12.13c.65.74,1.64,1.85,1.64,3.63,0,3.55-1.88,4.86-3.45,5.32-.62.19-1.29.26-1.92.26M51.89,12.3c.78.21,2.63.45,4.16-.3,1.53-.74,2.31-2.24,2.31-4.46,0-1.54-.86-2.51-1.48-3.22l-.12-.14c-.82-.93-1.97-1.17-2.78-1.2-.96-.04-1.83.17-2.32.36.03.01.06.02.08.03,1.19.4,3.97,1.33,4.03,4.47.06,3.07-2.51,3.97-3.74,4.41-.05.02-.1.03-.15.05M51.28,3.53h0s0,0,0,0Z"/>
          <path class="cls-1" d="M44.74,23.08c-.6,0-1.09-.51-1.09-1.15,0-.51.31-.94.75-1.09v-2.6h.62v2.58c.46.13.81.58.81,1.11,0,.64-.49,1.15-1.09,1.15M44.4,21.58c-.08.09-.12.22-.12.35,0,.29.21.52.46.52s.47-.24.47-.52c0-.17-.07-.31-.18-.41v.54h-.62v-.48ZM18.31,22.8c-.6,0-1.09-.52-1.09-1.15,0-.51.32-.94.75-1.09v-2.6h.63v2.58c.46.13.81.58.81,1.11,0,.63-.49,1.15-1.09,1.15M17.98,21.3c-.08.1-.12.22-.12.35,0,.29.21.52.46.52s.47-.23.47-.52c0-.17-.07-.31-.18-.41v.54h-.63v-.48ZM31.4,17.58c-.6,0-1.09-.51-1.09-1.15,0-.51.31-.94.75-1.09v-2.6h.63v2.58c.46.13.81.58.81,1.11,0,.63-.49,1.15-1.09,1.15M31.06,16.08c-.08.09-.12.22-.12.35,0,.29.21.52.47.52s.47-.24.47-.52c0-.17-.07-.32-.18-.41v.54h-.63v-.48Z"/>
          <path class="cls-1" d="M54.19,61c-.12,0-.24-.07-.29-.19l-3.4-8.01-.65-20.19,2.45-2.27.05-3.42h-1.33s.02,2.13.02,2.13h-2.29s-.49-12.47-.49-12.47l1.06-1.23v-2.58s-1.24,0-1.24,0v1.77s-2.58,0-2.58,0l-.04-1.81h-1.46s0,1.8,0,1.8h-2.5s-.04-1.8-.04-1.8h-1.24s.01,2.65.01,2.65l1.01,1.2-.63,12.32-2.48-.05-1.39-18.01,1.22-1.84v-3.16s-1.07,0-1.07,0v2.22s-2.48,0-2.48,0v-2.2h-1.34s0,2.2,0,2.2h-2.91s-.02-2.16-.02-2.16h-1.39s0,2.16,0,2.16h-2.49s-.01-2.2-.01-2.2h-1.29s-.01,3.32-.01,3.32l1.77,1.74-1.5,17.83h-.28c-.84.03-1.24.02-1.89.01l-.91-.02v-.29c-.12-2.36-.19-4.08-.26-5.78-.07-1.81-.15-3.61-.26-6.12v-.13s1.08-1.15,1.08-1.15v-2.6c-.25,0-.43,0-.61,0-.17,0-.35,0-.59,0l-.02,1.92h-2.52v-.33c0-.29,0-.67,0-1.03,0-.18,0-.36,0-.52h-1.32s0,1.86,0,1.86h-2.6v-1.86s-1.23,0-1.23,0v2.42l.9,1.28v.1c-.06,2.07-.12,3.98-.18,5.89-.06,2.02-.13,4.06-.19,6.31v.3s-2.79.07-2.79.07v-2.24s-1.53-.08-1.53-.08l.02,3.19,2.62,2.5v.14s-1.07,19.97-1.07,19.97l-3.11,8.18c-.06.16-.24.24-.4.18-.16-.06-.24-.24-.18-.41l3.1-8.14,1.03-19.68-2.6-2.48-.02-4.12,2.78.14v2.19s1.55-.04,1.55-.04c.05-2.14.11-4.08.18-6.02.06-1.88.12-3.75.17-5.78l-.89-1.27v-3.24h2.49s0,1.86,0,1.86h1.34v-1.86s2.58,0,2.58,0v.31c0,.21,0,.51,0,.83,0,.24,0,.49,0,.72h1.27s.02-1.91.02-1.91h.32c.4,0,.65,0,.88,0,.26,0,.5-.01.93,0h.31s0,3.48,0,3.48l-1.07,1.14c.11,2.45.18,4.21.26,6,.07,1.63.14,3.28.23,5.49h.31c.56.01.93.03,1.58.01l1.43-16.98-1.74-1.72v-4.21s2.55.01,2.55.01v2.19s1.25,0,1.25,0v-2.18s2.64.01,2.64.01l.02,2.17h1.66s0-2.21,0-2.21h2.59v2.21h1.22s0-2.22,0-2.22l2.31.02v3.97s-1.19,1.81-1.19,1.81l1.33,17.23,1.31.03.59-11.46-1-1.18-.02-3.51h2.48s.04,1.82.04,1.82h1.26s.01-1.8.01-1.8h2.7s.04,1.8.04,1.8h1.35s-.01-1.78-.01-1.78h2.5s-.01,3.45-.01,3.45l-1.05,1.22.46,11.62h1.05s-.02-2.13-.02-2.13h2.6s-.07,4.33-.07,4.33l-2.43,2.26.64,19.85,3.35,7.84c.07.16,0,.34-.17.41-.04.02-.08.02-.12.02"/>
          <path class="cls-1" d="M43.04,55.7l-5.85-1.47v-.13h-.08s-6.18-.09-6.18-.09l-6.11.09v.17l-5.83,1.4v-2.94h-7.52v-.63h6.41v-2.4h-6.2v-.63h3.59v-2.23h-3.59v-.63h6.24v-2.24h-5.99v-.63h3.5v-1.99h-3.4v-.63h5.95v-2.4h-5.81v-.63h6.83v-1.05l1.17-.46.34.17c1.16.58,2.06,1.03,2.96,2.21.21-.58.71-1.46,1.48-2.31.24-.26.51-.53.82-.8h-13.5v-.63h5.76v-2.31h-5.78v-.63h16.51v-.02s4.67,0,4.67,0v.02s17.33,0,17.33,0v.63h-6.24v2.31h5.44v.63h-13.37c.25.23.47.46.66.68.7.81,1.18,1.7,1.39,2.32.88-1.1,1.75-1.54,2.88-2.11l.34-.17,1.17.46v1.05h7.22v.63h-5.65v2.4s5.65,0,5.65,0v.63h-3.1v1.99s3.28,0,3.28,0v.63h-5.76v2.24s5.89,0,5.89,0v.63h-3.24l.03,2.16h-.63s-.03-2.16-.03-2.16h-3.65v2.23h7.47v.63h-5.81v2.4s6.03,0,6.03,0v.63h-7.68v2.99ZM42.24,54.85l.17.04-.02-17.82-.18-.07.03,17.85ZM19.61,37.07v17.79s.16-.04.16-.04v-17.82s-.16.07-.16.07ZM37.82,53.74l3.8.96v-4.3s-.71.57-.71.57l.31.45-1.18.65-.73-.74h-1.5v2.41ZM20.4,50.41v4.26s3.78-.91,3.78-.91v-2.44s-1.49,0-1.49,0l-.73.74-1.18-.65.3-.45-.68-.56ZM30.93,53.38l5.87.08v-11.91h-1.27v.84h-.63v-.84h-1.26v.9h-.63v-.9h-1.51v.9h-.63v-.9h-1.55v.88h-.63v-.88h-1.39v.84h-.62v-.84h-1.42v11.91l5.66-.08ZM43.03,52.08h1.01v-2.4s-1.02,0-1.02,0v2.4ZM18.49,52.08h.49v-2.4h-.5v2.4ZM38.34,50.7h1.23l.58.59.16-.09-.24-.36.12-.1c-.34.09-.72-.19-.72-.56,0-.34.31-.6.65-.57l-.09-.07.22-.41-.1-.06-.56.69h-1.19c.13.1.22.26.22.44,0,.2-.11.39-.27.49M21.68,51.2l.16.09.58-.59h1.23c-.16-.1-.27-.29-.27-.49,0-.19.09-.35.22-.45h-1.2s-.56-.68-.56-.68l-.09.05.22.41-.08.07c.34-.07.64.23.64.57,0,.37-.38.64-.72.56l.12.1-.24.36ZM40.58,49.97c.03.07.04.14.04.22,0,.09-.02.18-.06.25l.31-.25-.29-.22ZM21.13,50.2l.31.25c-.04-.08-.06-.16-.06-.25,0-.08.01-.15.04-.21l-.29.22ZM37.98,50.21l.05.05s.05-.02.05-.05h-.1ZM23.91,50.21l.05.05s.05-.02.05-.05h-.1ZM39.99,50.19l.05.05s.05-.02.05-.05h-.1ZM21.9,50.19l.05.05s.05-.02.05-.05h-.1ZM40.83,49.37l.78.6v-5.47s-.7.56-.7.56l.31.45-1.18.66-.73-.75h-1.52v3.7s1.51,0,1.51,0l.71-.85,1.09.6-.26.49ZM20.4,44.51v5.46s.77-.6.77-.6l-.26-.49,1.09-.61.71.85h1.5s.01-3.71.01-3.71h-1.52l-.73.75-1.18-.66.3-.45-.68-.56ZM15.87,49.06h3.1v-2.23h-3.11v2.23ZM43.03,46.2h.99v-2.24s-.99,0-.99,0v2.24ZM18.53,46.2h.45v-2.24h-.46v2.24ZM38.34,44.8h1.23l.58.6.16-.09-.25-.36.11-.09c-.35.08-.72-.19-.72-.56,0-.34.31-.59.65-.57l-.09-.07.22-.41-.1-.05-.56.68h-1.19c.13.1.22.26.22.44,0,.21-.11.39-.27.49M21.68,45.31l.16.09.58-.6h1.23c-.16-.1-.27-.28-.27-.49,0-.18.09-.35.22-.45h-1.19s-.56-.67-.56-.67l-.09.05.22.41-.08.07c.34-.07.64.23.64.57,0,.37-.36.65-.72.56l.11.09-.24.36ZM40.58,44.07c.03.07.04.14.04.22,0,.09-.02.18-.06.26l.31-.25-.29-.22ZM21.13,44.29l.31.25c-.04-.08-.06-.16-.06-.26,0-.08.01-.15.04-.21l-.29.22ZM37.98,44.31l.05.05s.05-.02.05-.05h-.1ZM23.91,44.31l.05.05s.05-.02.05-.05h-.1ZM39.99,44.29l.05.05s.05-.02.05-.05h-.1ZM21.9,44.29l.05.05s.05-.02.05-.05h-.1ZM40.83,43.47l.77.6v-7.05c-1.55.78-2.53,1.35-3.82,4.13v2.08s1.52.01,1.52.01l.71-.86,1.09.61-.26.49ZM20.41,37.02v7.05s.76-.59.76-.59l-.26-.49,1.09-.61.71.86h1.51s0-2.09,0-2.09c-1.29-2.77-2.27-3.35-3.82-4.13M43.02,43.34h3.48v-1.99s-3.48,0-3.48,0v1.99ZM16.04,43.34h2.94v-1.99h-2.95v1.99ZM35.53,40.92h1.27v-.72c0-.12-.13-.63-.46-1.27h-.81v2ZM34.9,38.93h-1.26v1.99h1.26v-1.99ZM33.02,38.93h-1.51v1.99h1.51v-1.99ZM30.88,38.93h-1.55v1.99h1.55v-1.99ZM28.7,38.93h-1.39v1.99h1.39v-1.99ZM25.27,40.92h1.42v-2h-.89c-.37.63-.54,1.14-.53,1.28v.71ZM43.02,40.72h.93v-2.4s-.93,0-.93,0v2.4ZM18.59,40.72h.39v-2.4h-.4v2.4ZM23.81,39.07c.27.41.55.9.84,1.49v-.33c-.03-.39.52-1.82,1.7-3.09.68-.73,1.73-1.57,3.18-1.94l-.21-.91c-3.68.94-5.34,4.25-5.34,4.76h-.16ZM37.42,40.25v.18c.27-.54.53-.99.78-1.38h-.08c0-.19-.41-1.52-1.66-2.81-.73-.76-1.88-1.63-3.55-2l-.2.93c1.16.28,2.2.91,3.06,1.87,1.09,1.21,1.67,2.74,1.63,3.21M35.53,38.3h.45c-.13-.2-.28-.41-.45-.61v.61ZM33.64,38.3h1.26v-1.23h.05c-.41-.38-.84-.69-1.31-.92v2.15ZM31.51,38.3h1.51v-2.41c-.14-.04-.27-.08-.41-.12l-.04.17h-1.06v2.36ZM29.33,38.3h1.55v-2.36h-1.18l-.03-.13c-.12.03-.23.06-.34.1v2.39ZM27.31,38.3h1.39v-2.14c-.49.23-.95.54-1.39.92h0v1.22ZM26.21,38.3h.48v-.6c-.18.2-.34.4-.48.6M33.06,33.62c1.36.3,2.41.91,3.21,1.57v-.35h1.32v-2.31s-4.3,0-4.3,0l-.23,1.1ZM29.92,34.16l.21.91c.34-.05.71-.08,1.07-.07.3-.01.6,0,.9.05l.2-.93c-.33-.04-.69-.07-1.05-.07-.47,0-.91.05-1.33.12M38.22,34.83h5.67v-2.31h-5.67v2.31ZM24.83,34.83h1.74c.72-.48,1.58-.9,2.59-1.15l-.27-1.16h-4.07v2.31ZM24.21,32.52h-5.56v2.31h5.56v-2.31ZM29.54,32.52l.24,1.03c.46-.08.95-.12,1.47-.13.42,0,.81.03,1.18.08l.21-.98h-3.11ZM10.09,30.1h42.4v.63H10.09v-.63ZM46.25,28.97l-3.68-.02v-2.15h-2.17v-.63h3.87v-2.05h-3.63v-.63h1.44v-1.87h-1.29v-.63h3.15c.12-.12.26-.22.43-.28v-1.52h-3.49v-.63h1.2v-1.72h-1.28v-.63l7.86.02v.63h-1.54s0,1.7,0,1.7h1.54v.63h-3.65v1.51c.18.05.35.16.48.29h3.24v.63h-1.53v1.87h1.48v.63h-3.76v2.05h4.13v.63h-2.78v2.17ZM43.19,28.33h2.42s0-1.53,0-1.53h-2.42v1.53ZM42.69,23.49h3.85v-1.87h-.78c0,.06.01.12.01.18,0,.63-.49,1.15-1.09,1.15s-1.08-.52-1.08-1.15c0-.06,0-.12.01-.18h-.92v1.87ZM44.26,21.63c-.02.06-.03.12-.03.18,0,.29.21.52.46.52s.46-.23.46-.52c0-.07-.01-.13-.03-.18h-.14v.31h-.63v-.31h-.09ZM44.98,18.57h1.48v-1.7h-3.77s0,1.7,0,1.7h1.66v-.68h.63v.68ZM20.01,28.96h-3.69v-2.17s-2.16,0-2.16,0v-.63h3.87v-1.94h-3.93v-.63h1.73v-1.98h-1.43v-.63h3.07c.13-.26.35-.46.62-.55v-1.25h-3.56v-.63h1.3v-1.7h-1.26v-.63h7.44v.63h-1.15v1.7h1.15v.63h-3.29v1.23c.29.08.53.29.67.57h2.68v.63h-1.14v1.98h1.56v.63h-3.84v1.94h3.85v.63h-2.51v2.17ZM16.95,28.34h2.43v-1.54h-2.43v1.54ZM16.46,23.6h3.85v-1.98h-.8c-.04.59-.51,1.06-1.08,1.06s-1.04-.47-1.08-1.06h-.89v1.98ZM17.98,21.63c.04.24.23.43.45.43s.41-.19.45-.43h-.17v.04h-.63v-.04h-.11ZM18.72,18.57h1.51v-1.7h-3.78v1.7h1.64v-.71h.63v.71ZM35.91,28.95h-3.3v-2.21h-2.29v2.08s-3.58,0-3.58,0v-2.08s-1.57,0-1.57,0v-.63h2.52v-2.94h-2.19v-.63h5.54v-2.73h-5.12v-.63h1.78v-2.26h-1.7v-.63h4.36c.02-.49.32-.91.74-1.06v-1.28h-4.88v-.63h1.68v-1.99h-1.42v-.63h10.45v.63h-2.08v1.99h2.37v.63h-5.49v1.27c.45.13.79.56.8,1.08h4.99v.63h-2.45v2.26h2.5v.63h-5.89v2.73h6.23v.63h-2.84v2.94s3.19,0,3.19,0v.63h-2.33v2.21ZM33.24,28.32h2.04v-1.59h-2.04v1.59ZM27.37,28.18h2.34v-1.45h-2.33v1.45ZM34.42,23.17h-6.1v2.94h6.1v-2.94ZM28.32,19.19h6.11v-2.26h-2.06c-.19.33-.53.55-.93.55s-.73-.22-.93-.55h-2.19v2.26ZM31.72,16.3h.17c-.01-.15-.07-.29-.17-.37v.37ZM30.98,16.3h.11v-.31c-.07.08-.11.19-.11.31M31.72,13.33h2.5v-1.99h-5.69v1.99h2.57v-.67h.63v.67ZM39.94,15.08h9.52v.63h-9.52v-.63ZM13.66,15.08h9.26v.63h-9.26v-.63ZM24.84,9.12h13.1v.63h-13.1v-.63Z"/>
          <path class="cls-1" d="M54.19,61c-.06,0-.12-.01-.17-.05-10.65-6.64-27.22-12.05-45.67-.09-.14.1-.34.05-.43-.09-.1-.14-.05-.34.09-.43,18.73-12.14,35.54-6.65,46.35.08.15.09.19.28.1.43-.06.09-.16.15-.27.15"/>
        </g>
      </g>
    </svg>
  `);

}

//SETUP FUNCTION END

//=============================================

// DRAW FUNCTION START

function draw() {
  background(backgroundCol);

  if (showGrid) drawGrid();
  
  // Main stars animation:
  if (animate || scaleBackground) {
    phase += 0.05;
  }

  if (animate) {
    animatedRad1 = starRad1 * (1 + Math.abs(Math.sin(phase * 3)));
    animatedRad2 = starRad2 * (1 + Math.abs(Math.sin(phase * 3)));
  } else {
    animatedRad1 = starRad1;
    animatedRad2 = starRad2;
  }

  // The main text:
  if(showText) {
    fill(starCol);
    drawTextGrid(textInput);
  }

  if (showbgStars) {
    
    // --- compute animated radii ---
    if (scaleBackground) {
      animatedBgStarRad1 = starRad1 * (1 + Math.abs(Math.sin(phase)));
      animatedBgStarRad2 = starRad2 * (1 + Math.abs(Math.sin(phase)));
    } else {
      animatedBgStarRad1 = starRad1;
      animatedBgStarRad2 = starRad2;
    }
  
    // --- decide redraw strategy ---
    if (animateBackground || scaleBackground || !animateBackground && !scaleBackground) {
  
      // regenerate ONLY if animateBackground is on
      if (animateBackground) {
        generateBgStars();
      }
  
      // always live-draw when either flag is true
      drawBgStarsLive();
  
    } else {
      // fully static → buffer
      if (bgStarsBufferDirty) {
        bgStarsBuffer.clear();
        bgStarsBuffer.background(0, 0);
        drawBgStarsToBuffer();
        bgStarsBufferDirty = false;
      }
      image(bgStarsBuffer, 0, 0);
    }
  } else {
    bgStarsBufferDirty = true;
  }  

  if(addStyling) {
    // Text bottom right corner (above line):
    fill(textCol);
    noStroke();
    textSize(80);
    textFont(simplexFont);
    textAlign(RIGHT, BOTTOM);
    text(textDateInput, 1038, 1172);

    // Text bottom left corner (above line):
    fill(textCol);
    noStroke();
    textSize(42);
    textFont(triplexFont);
    textAlign(LEFT, BOTTOM);
    text(textEventInput, 42, 1161);

    // Iskra logo top right corner:
    fill(textCol);
    noStroke();
    textSize(42);
    textFont(triplexFont);
    textAlign(RIGHT, TOP);
    text(textIskra, 1038, 29);

  } else {
       // Text bottom right corner (above line):
       fill(textCol);
       noStroke();
       textSize(80);
       textFont(simplexFont);
       textAlign(RIGHT, TOP);
       text(textDateInput, 1038, 21);
   
       // Text bottom left corner (above line):
       fill(textCol);
       noStroke();
       textSize(42);
       textFont(triplexFont);
       textAlign(LEFT, TOP);
       text(textEventInput, 42, 29); 
  }

  // Separation line (bottom):
  stroke(textCol);
  strokeWeight(3);
  line(
    0, 1188,
    width, 1188
  );

  if (!svgDrawn) {
    drawSVGToCanvas(50, 50, 300, 150);
    svgDrawn = true;
  }
  
  // Color of SVG Logos:
  select('#logo-npk').style('color', textCol);
  select('#logo-zg').style('color', textCol);
  
}
