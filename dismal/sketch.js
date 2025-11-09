/**
 * THIS IS THE VERSION WHERE YOU CAN SUCCESSFULLY GENERATE
 * 512x512 SVG FILES OF 64x64 PIXEL LETTERS,
 * HOWEVER THE CANVAS SIZE ONLY WORKS FOR PREDEFINED VALUES,
 * SO YOU CAN'T GENERATE WORDS!
 */

let cnv;

var tree = [];
var walker;
var stick = 0.1;

const stickSlider = document.getElementById("stickSlider");
const stickValueDisplay = document.getElementById("stickValue");

stickValueDisplay.textContent = parseFloat(stickSlider.value).toFixed(2);
stick = parseFloat(stickSlider.value);

stickSlider.addEventListener("input", () => {
  stick = parseFloat(stickSlider.value);
  stickValueDisplay.textContent = stick.toFixed(2);
});

stickSlider.addEventListener("input", () => {
  stick = parseFloat(stickSlider.value);
  stickValueDisplay.textContent = stick.toFixed(2);
});

let textInput = "";

let fillCol = "#000000";
let strokeCol = "#000000";

document.getElementById("fillColor").oninput = function () {
  fillCol = this.value;
};

document.getElementById("strokeColor").oninput = function () {
  strokeCol = this.value;
};

let strokeWidth = 1;

const strokeWidthSlider = document.getElementById("strokeWidthSlider");
const strokeWidthValue = document.getElementById("strokeWidthValue");

strokeWidthValue.textContent = strokeWidth;

strokeWidthSlider.addEventListener("input", () => {
  strokeWidth = parseInt(strokeWidthSlider.value);
  strokeWidthValue.textContent = strokeWidth;
});

// r is the resolution:
var r = 8;

let cols;
let rows;

let font;
let points = [];

let isLooping = true;
let submitted = false;
var currentLength = 0;

document.getElementById("submitButton").onclick = function () {
  textInput = document.getElementById("letterSelect").value;

  fillColor = document.getElementById("fillColor").value;
  strokeColor = document.getElementById("strokeColor").value;

  stick = parseFloat(document.getElementById("stickSlider").value);

  submitted = true;
  tree = [];
  currentLength = 0;

  background(255);

  loop();
  setup();
};

let maxPoints = 1000;

window.addEventListener("DOMContentLoaded", () => {
  const maxPointsSlider = document.getElementById("maxPointsSlider");
  const maxPointsValueDisplay = document.getElementById("maxPointsValue");

  let maxPoints = parseInt(maxPointsSlider.value);
  maxPointsValueDisplay.textContent = maxPoints;

  maxPointsSlider.addEventListener("input", () => {
    maxPoints = parseInt(maxPointsSlider.value);
    maxPointsValueDisplay.textContent = maxPoints;
  });
});

function setup() {
  frameRate(120);
  tree = [];
  currentLength = 0;

    if (!cnv) {
      cnv = createCanvas(512, 512, SVG);
      cnv.parent("canvasContainer");
    }
  
    background(255);

  for (let i = 0; i < textInput.length; i++) {
    var spacing = i * 512/2;
    let char = textInput[i];
    print(char);

    var A = [
      createVector(244 + spacing, 172),
      createVector(236 + spacing, 180),
      createVector(220 + spacing, 204),
      createVector(196 + spacing, 244),
      createVector(204 + spacing, 236),
      createVector(204 + spacing, 228),
      createVector(196 + spacing, 260),
      createVector(188 + spacing, 268),
      createVector(172 + spacing, 300),
      createVector(164 + spacing, 324),
      createVector(140 + spacing, 356),
      createVector(148 + spacing, 340),
      createVector(252 + spacing, 180),
      createVector(260 + spacing, 188),
      createVector(276 + spacing, 212),
      createVector(284 + spacing, 236),
      createVector(292 + spacing, 252),
      createVector(308 + spacing, 276),
      createVector(308 + spacing, 300),
      createVector(316 + spacing, 308),
      createVector(324 + spacing, 324),
      createVector(324 + spacing, 324),
      createVector(332 + spacing, 340),
      createVector(340 + spacing, 348),
      createVector(340 + spacing, 356),
      createVector(308 + spacing, 300),
      createVector(292 + spacing, 300),
      createVector(284 + spacing, 300),
      createVector(268 + spacing, 308),
      createVector(260 + spacing, 308),
      createVector(244 + spacing, 308),
      createVector(236 + spacing, 300),
      createVector(220 + spacing, 300),
      createVector(212 + spacing, 308),
      createVector(204 + spacing, 308),
      createVector(196 + spacing, 308),
      createVector(180 + spacing, 308),
      createVector(172 + spacing, 308)
    ];

    if (char == "A") {
      console.log("A");
      for(let j = 0; j < A.length; j++) {
        tree.push(A[j]);
      }
    };

    var B = [
      createVector(188 + spacing, 164), 
      createVector(188 + spacing, 180), 
      createVector(188 + spacing, 204), 
      createVector(188 + spacing, 220), 
      createVector(188 + spacing, 244), 
      createVector(188 + spacing, 260), 
      createVector(188 + spacing, 284), 
      createVector(188 + spacing, 300), 
      createVector(188 + spacing, 316), 
      createVector(188 + spacing, 332), 
      createVector(188 + spacing, 348), 
      createVector(180 + spacing, 156), 
      createVector(204 + spacing, 148), 
      createVector(244 + spacing, 156), 
      createVector(268 + spacing, 164), 
      createVector(316 + spacing, 172), 
      createVector(340 + spacing, 188), 
      createVector(348 + spacing, 220), 
      createVector(340 + spacing, 236), 
      createVector(332 + spacing, 244), 
      createVector(308 + spacing, 252), 
      createVector(284 + spacing, 252), 
      createVector(260 + spacing, 252), 
      createVector(244 + spacing, 252), 
      createVector(228 + spacing, 252), 
      createVector(212 + spacing, 252), 
      createVector(196 + spacing, 252), 
      createVector(316 + spacing, 252), 
      createVector(340 + spacing, 260), 
      createVector(356 + spacing, 268), 
      createVector(364 + spacing, 284), 
      createVector(372 + spacing, 300), 
      createVector(372 + spacing, 316), 
      createVector(372 + spacing, 332), 
      createVector(356 + spacing, 348), 
      createVector(332 + spacing, 356), 
      createVector(308 + spacing, 364), 
      createVector(276 + spacing, 364), 
      createVector(244 + spacing, 364), 
      createVector(212 + spacing, 364), 
      createVector(196 + spacing, 364), 
      createVector(172 + spacing, 364), 
      createVector(188 + spacing, 356)
    ];

    if (char == "B") {
      console.log("B");
      for(let j = 0; j < B.length; j++) {
        tree.push(B[j]);
      }
    }

    var C = [
      createVector(356 + spacing, 196),
      createVector(340 + spacing, 188),
      createVector(316 + spacing, 180),
      createVector(308 + spacing, 180),
      createVector(276 + spacing, 180),
      createVector(292 + spacing, 180),
      createVector(284 + spacing, 180),
      createVector(268 + spacing, 188),
      createVector(260 + spacing, 180),
      createVector(244 + spacing, 188),
      createVector(228 + spacing, 188),
      createVector(204 + spacing, 204),
      createVector(204 + spacing, 204),
      createVector(188 + spacing, 220),
      createVector(180 + spacing, 228),
      createVector(172 + spacing, 244),
      createVector(172 + spacing, 268),
      createVector(164 + spacing, 276),
      createVector(164 + spacing, 300),
      createVector(164 + spacing, 308),
      createVector(180 + spacing, 332),
      createVector(188 + spacing, 340),
      createVector(204 + spacing, 348),
      createVector(220 + spacing, 356),
      createVector(268 + spacing, 364),
      createVector(292 + spacing, 364),
      createVector(300 + spacing, 364),
      createVector(308 + spacing, 364),
      createVector(316 + spacing, 364),
      createVector(324 + spacing, 364),
      createVector(332 + spacing, 364),
      createVector(348 + spacing, 356),
      createVector(364 + spacing, 356),
      createVector(372 + spacing, 356),
      createVector(284 + spacing, 372),
      createVector(268 + spacing, 372),
      createVector(252 + spacing, 364),
      createVector(244 + spacing, 364),
      createVector(228 + spacing, 364),
      createVector(164 + spacing, 316),
      createVector(172 + spacing, 236)
    ];

    if (char == "C") {
      console.log("C");
      for(let j = 0; j < C.length; j++) {
        tree.push(C[j]);
      }
    };

    var D = [
      createVector(164 + spacing, 156), 
      createVector(164 + spacing, 172), 
      createVector(164 + spacing, 188), 
      createVector(164 + spacing, 204), 
      createVector(164 + spacing, 220), 
      createVector(164 + spacing, 228), 
      createVector(164 + spacing, 244), 
      createVector(164 + spacing, 260), 
      createVector(164 + spacing, 276), 
      createVector(164 + spacing, 292), 
      createVector(164 + spacing, 308), 
      createVector(164 + spacing, 324), 
      createVector(164 + spacing, 340), 
      createVector(164 + spacing, 356), 
      createVector(164 + spacing, 372), 
      createVector(156 + spacing, 148), 
      createVector(172 + spacing, 148), 
      createVector(156 + spacing, 380), 
      createVector(172 + spacing, 380), 
      createVector(372 + spacing, 260), 
      createVector(364 + spacing, 276), 
      createVector(364 + spacing, 292), 
      createVector(356 + spacing, 300), 
      createVector(348 + spacing, 324), 
      createVector(340 + spacing, 340), 
      createVector(332 + spacing, 348), 
      createVector(316 + spacing, 356), 
      createVector(292 + spacing, 364), 
      createVector(268 + spacing, 364), 
      createVector(244 + spacing, 372), 
      createVector(220 + spacing, 372), 
      createVector(204 + spacing, 372), 
      createVector(188 + spacing, 380), 
      createVector(188 + spacing, 148), 
      createVector(204 + spacing, 148), 
      createVector(228 + spacing, 148), 
      createVector(244 + spacing, 156), 
      createVector(268 + spacing, 156), 
      createVector(300 + spacing, 172), 
      createVector(316 + spacing, 180), 
      createVector(332 + spacing, 188), 
      createVector(348 + spacing, 204), 
      createVector(356 + spacing, 228), 
      createVector(364 + spacing, 244)
    ];

    if (char == "D") {
      console.log("D");
      for(let j = 0; j < D.length; j++) {
        tree.push(D[j]);
      }
    };

    var E = [
      createVector(332 + spacing, 140), 
      createVector(316 + spacing, 140), 
      createVector(300 + spacing, 148), 
      createVector(284 + spacing, 148), 
      createVector(252 + spacing, 148), 
      createVector(228 + spacing, 156), 
      createVector(196 + spacing, 156), 
      createVector(172 + spacing, 156), 
      createVector(140 + spacing, 156), 
      createVector(132 + spacing, 164), 
      createVector(124 + spacing, 172), 
      createVector(124 + spacing, 188), 
      createVector(124 + spacing, 220), 
      createVector(116 + spacing, 252), 
      createVector(124 + spacing, 236), 
      createVector(116 + spacing, 260), 
      createVector(116 + spacing, 276), 
      createVector(116 + spacing, 292), 
      createVector(108 + spacing, 308), 
      createVector(100 + spacing, 332), 
      createVector(100 + spacing, 348), 
      createVector(108 + spacing, 356), 
      createVector(132 + spacing, 356), 
      createVector(148 + spacing, 356), 
      createVector(156 + spacing, 356), 
      createVector(172 + spacing, 356), 
      createVector(196 + spacing, 348), 
      createVector(228 + spacing, 340), 
      createVector(252 + spacing, 340), 
      createVector(268 + spacing, 332), 
      createVector(284 + spacing, 332), 
      createVector(308 + spacing, 332), 
      createVector(124 + spacing, 260), 
      createVector(132 + spacing, 268), 
      createVector(148 + spacing, 260), 
      createVector(164 + spacing, 260), 
      createVector(180 + spacing, 252), 
      createVector(188 + spacing, 252), 
      createVector(196 + spacing, 252), 
      createVector(124 + spacing, 268), 
      createVector(204 + spacing, 252), 
      createVector(180 + spacing, 260), 
      createVector(220 + spacing, 244), 
      createVector(228 + spacing, 244), 
      createVector(124 + spacing, 276)
    ];

    if (char == "E") {
      console.log("E");
      for(let j = 0; j < E.length; j++) {
        tree.push(E[j]);
      }
    };

    var F = [
      createVector(148 + spacing, 364), 
      createVector(156 + spacing, 348), 
      createVector(156 + spacing, 324), 
      createVector(156 + spacing, 292), 
      createVector(156 + spacing, 268), 
      createVector(156 + spacing, 252), 
      createVector(156 + spacing, 228), 
      createVector(156 + spacing, 212), 
      createVector(156 + spacing, 180), 
      createVector(156 + spacing, 156), 
      createVector(172 + spacing, 148), 
      createVector(188 + spacing, 148), 
      createVector(196 + spacing, 148), 
      createVector(212 + spacing, 148), 
      createVector(236 + spacing, 140), 
      createVector(260 + spacing, 140), 
      createVector(284 + spacing, 140), 
      createVector(300 + spacing, 140), 
      createVector(156 + spacing, 252), 
      createVector(180 + spacing, 252), 
      createVector(188 + spacing, 244), 
      createVector(204 + spacing, 244), 
      createVector(212 + spacing, 244), 
      createVector(220 + spacing, 244)
    ];

    if (char == "F") {
      console.log("F");
      for(let j = 0; j < F.length; j++) {
        tree.push(F[j]);
      }
    };

    var G = [
      createVector(372 + spacing, 372), 
      createVector(372 + spacing, 356), 
      createVector(372 + spacing, 340), 
      createVector(372 + spacing, 324), 
      createVector(372 + spacing, 308), 
      createVector(372 + spacing, 292), 
      createVector(372 + spacing, 284), 
      createVector(364 + spacing, 284), 
      createVector(356 + spacing, 284), 
      createVector(340 + spacing, 284), 
      createVector(324 + spacing, 284), 
      createVector(308 + spacing, 284), 
      createVector(364 + spacing, 380), 
      createVector(348 + spacing, 388), 
      createVector(324 + spacing, 388), 
      createVector(300 + spacing, 396), 
      createVector(276 + spacing, 396), 
      createVector(252 + spacing, 388), 
      createVector(236 + spacing, 380), 
      createVector(220 + spacing, 380), 
      createVector(204 + spacing, 364), 
      createVector(180 + spacing, 348), 
      createVector(172 + spacing, 324), 
      createVector(164 + spacing, 308), 
      createVector(164 + spacing, 284), 
      createVector(164 + spacing, 260), 
      createVector(172 + spacing, 236), 
      createVector(188 + spacing, 220), 
      createVector(204 + spacing, 196), 
      createVector(220 + spacing, 180), 
      createVector(236 + spacing, 172), 
      createVector(268 + spacing, 164), 
      createVector(292 + spacing, 164), 
      createVector(308 + spacing, 164), 
      createVector(324 + spacing, 164), 
      createVector(340 + spacing, 164), 
      createVector(348 + spacing, 172), 
      createVector(364 + spacing, 180)
    ];

    if (char == "G") {
      console.log("G");
      for(let j = 0; j < G.length; j++) {
        tree.push(G[j]);
      }
    };

    var H = [
      createVector(324 + spacing, 172), 
      createVector(332 + spacing, 188), 
      createVector(332 + spacing, 196), 
      createVector(332 + spacing, 212), 
      createVector(332 + spacing, 236), 
      createVector(332 + spacing, 260), 
      createVector(324 + spacing, 276), 
      createVector(324 + spacing, 300), 
      createVector(324 + spacing, 316), 
      createVector(324 + spacing, 332), 
      createVector(332 + spacing, 348), 
      createVector(180 + spacing, 172), 
      createVector(180 + spacing, 188), 
      createVector(180 + spacing, 204), 
      createVector(172 + spacing, 220), 
      createVector(172 + spacing, 236), 
      createVector(164 + spacing, 252), 
      createVector(164 + spacing, 276), 
      createVector(172 + spacing, 300), 
      createVector(156 + spacing, 316), 
      createVector(156 + spacing, 332), 
      createVector(148 + spacing, 356), 
      createVector(156 + spacing, 372), 
      createVector(164 + spacing, 396), 
      createVector(172 + spacing, 268), 
      createVector(188 + spacing, 260), 
      createVector(204 + spacing, 252), 
      createVector(220 + spacing, 252), 
      createVector(252 + spacing, 252), 
      createVector(276 + spacing, 252), 
      createVector(300 + spacing, 260), 
      createVector(316 + spacing, 268)
    ];

    if (char == "H") {
      console.log("H");
      for(let j = 0; j < H.length; j++) {
        tree.push(H[j]);
      }
    };

    var I = [
      createVector(244 + spacing, 196), 
      createVector(252 + spacing, 212), 
      createVector(244 + spacing, 228), 
      createVector(252 + spacing, 260), 
      createVector(252 + spacing, 284), 
      createVector(252 + spacing, 308), 
      createVector(252 + spacing, 324), 
      createVector(252 + spacing, 348), 
      createVector(260 + spacing, 364), 
      createVector(252 + spacing, 372), 
      createVector(244 + spacing, 372), 
      createVector(260 + spacing, 188), 
      createVector(268 + spacing, 188), 
      createVector(236 + spacing, 188), 
      createVector(252 + spacing, 236)
    ];

    if (char == "I") {
      console.log("I");
      for(let j = 0; j < I.length; j++) {
        tree.push(I[j]);
      }
    };

    var J = [
      createVector(284 + spacing, 164), 
      createVector(300 + spacing, 156), 
      createVector(316 + spacing, 156), 
      createVector(316 + spacing, 180), 
      createVector(316 + spacing, 212), 
      createVector(316 + spacing, 228), 
      createVector(316 + spacing, 244), 
      createVector(316 + spacing, 260), 
      createVector(316 + spacing, 268), 
      createVector(316 + spacing, 292), 
      createVector(308 + spacing, 300), 
      createVector(300 + spacing, 324), 
      createVector(292 + spacing, 332), 
      createVector(260 + spacing, 340), 
      createVector(228 + spacing, 340), 
      createVector(220 + spacing, 340), 
      createVector(204 + spacing, 340), 
      createVector(172 + spacing, 332), 
      createVector(156 + spacing, 324), 
      createVector(140 + spacing, 324)
    ];

    if (char == "J") {
      console.log("J");
      for(let j = 0; j < J.length; j++) {
        tree.push(J[j]);
      }
    };

    var K = [
      createVector(172 + spacing, 148), 
      createVector(172 + spacing, 164), 
      createVector(172 + spacing, 180), 
      createVector(172 + spacing, 196), 
      createVector(172 + spacing, 212), 
      createVector(164 + spacing, 228), 
      createVector(164 + spacing, 244), 
      createVector(164 + spacing, 260), 
      createVector(156 + spacing, 276), 
      createVector(156 + spacing, 292), 
      createVector(148 + spacing, 316), 
      createVector(140 + spacing, 332), 
      createVector(140 + spacing, 340), 
      createVector(140 + spacing, 356), 
      createVector(172 + spacing, 252), 
      createVector(188 + spacing, 252), 
      createVector(204 + spacing, 244), 
      createVector(220 + spacing, 244), 
      createVector(236 + spacing, 236), 
      createVector(260 + spacing, 228), 
      createVector(292 + spacing, 204), 
      createVector(308 + spacing, 188), 
      createVector(324 + spacing, 164), 
      createVector(332 + spacing, 156), 
      createVector(340 + spacing, 148), 
      createVector(164 + spacing, 260),
      createVector(172 + spacing, 260), 
      createVector(180 + spacing, 268), 
      createVector(196 + spacing, 276), 
      createVector(212 + spacing, 284), 
      createVector(228 + spacing, 292), 
      createVector(252 + spacing, 292), 
      createVector(276 + spacing, 300), 
      createVector(300 + spacing, 308), 
      createVector(316 + spacing, 324), 
      createVector(332 + spacing, 332), 
      createVector(348 + spacing, 340), 
      createVector(356 + spacing, 356)
    ];

    if (char == "K") {
      console.log("K");
      for(let j = 0; j < K.length; j++) {
        tree.push(K[j]);
      }
    };

    var L = [
      createVector(164 + spacing, 164), 
      createVector(164 + spacing, 172), 
      createVector(164 + spacing, 196), 
      createVector(156 + spacing, 228), 
      createVector(156 + spacing, 252), 
      createVector(156 + spacing, 268), 
      createVector(156 + spacing, 284), 
      createVector(148 + spacing, 308), 
      createVector(140 + spacing, 332), 
      createVector(148 + spacing, 332), 
      createVector(172 + spacing, 332), 
      createVector(188 + spacing, 332), 
      createVector(212 + spacing, 332), 
      createVector(244 + spacing, 324), 
      createVector(268 + spacing, 324), 
      createVector(292 + spacing, 316), 
      createVector(316 + spacing, 316), 
      createVector(332 + spacing, 316), 
      createVector(348 + spacing, 316)
    ];

    if (char == "L") {
      console.log("L");
      for(let j = 0; j < L.length; j++) {
        tree.push(L[j]);
      }
    };

    var M = [
      createVector(340 + spacing, 308), 
      createVector(332 + spacing, 300), 
      createVector(332 + spacing, 284), 
      createVector(332 + spacing, 268), 
      createVector(332 + spacing, 236), 
      createVector(324 + spacing, 220), 
      createVector(324 + spacing, 204), 
      createVector(324 + spacing, 180), 
      createVector(316 + spacing, 156), 
      createVector(300 + spacing, 164), 
      createVector(292 + spacing, 172), 
      createVector(276 + spacing, 188), 
      createVector(268 + spacing, 204), 
      createVector(260 + spacing, 220), 
      createVector(244 + spacing, 228), 
      createVector(236 + spacing, 236), 
      createVector(220 + spacing, 228), 
      createVector(220 + spacing, 212), 
      createVector(212 + spacing, 204), 
      createVector(204 + spacing, 196), 
      createVector(196 + spacing, 180), 
      createVector(180 + spacing, 164), 
      createVector(172 + spacing, 156), 
      createVector(156 + spacing, 172), 
      createVector(148 + spacing, 220), 
      createVector(140 + spacing, 244), 
      createVector(124 + spacing, 276), 
      createVector(124 + spacing, 308), 
      createVector(116 + spacing, 332), 
      createVector(148 + spacing, 204), 
      createVector(148 + spacing, 188), 
      createVector(308 + spacing, 156), 
      createVector(212 + spacing, 188), 
      createVector(228 + spacing, 236)
    ];

    if (char == "M") {
      console.log("M");
      for(let j = 0; j < M.length; j++) {
        tree.push(M[j]);
      }
    };

    var N = [
      createVector(348 + spacing, 172), 
      createVector(340 + spacing, 188), 
      createVector(340 + spacing, 204), 
      createVector(340 + spacing, 212), 
      createVector(332 + spacing, 236), 
      createVector(332 + spacing, 252), 
      createVector(332 + spacing, 276), 
      createVector(188 + spacing, 348), 
      createVector(188 + spacing, 332), 
      createVector(188 + spacing, 324),
      createVector(188 + spacing, 316), 
      createVector(180 + spacing, 308), 
      createVector(180 + spacing, 292), 
      createVector(180 + spacing, 284), 
      createVector(180 + spacing, 276), 
      createVector(180 + spacing, 260), 
      createVector(180 + spacing, 244), 
      createVector(180 + spacing, 228), 
      createVector(180 + spacing, 204), 
      createVector(188 + spacing, 188), 
      createVector(188 + spacing, 156), 
      createVector(212 + spacing, 188), 
      createVector(236 + spacing, 204), 
      createVector(236 + spacing, 212), 
      createVector(236 + spacing, 220), 
      createVector(244 + spacing, 228), 
      createVector(260 + spacing, 244), 
      createVector(276 + spacing, 252), 
      createVector(284 + spacing, 252), 
      createVector(284 + spacing, 268), 
      createVector(316 + spacing, 276),
      createVector(316 + spacing, 284),
      createVector(324 + spacing, 284), 
      createVector(332 + spacing, 292)
    ];

    if (char == "N") {
      console.log("N");
      for(let j = 0; j < N.length; j++) {
        tree.push(N[j]);
      }
    };

    var O = [
      createVector(308 + spacing, 156), 
      createVector(300 + spacing, 164), 
      createVector(284 + spacing, 172), 
      createVector(260 + spacing, 172), 
      createVector(228 + spacing, 164), 
      createVector(212 + spacing, 156), 
      createVector(204 + spacing, 156), 
      createVector(196 + spacing, 164), 
      createVector(196 + spacing, 180), 
      createVector(188 + spacing, 196), 
      createVector(180 + spacing, 228), 
      createVector(180 + spacing, 244), 
      createVector(180 + spacing, 276), 
      createVector(188 + spacing, 308), 
      createVector(204 + spacing, 332), 
      createVector(212 + spacing, 356), 
      createVector(316 + spacing, 172), 
      createVector(332 + spacing, 188), 
      createVector(332 + spacing, 204), 
      createVector(332 + spacing, 220), 
      createVector(332 + spacing, 252), 
      createVector(324 + spacing, 276), 
      createVector(324 + spacing, 308), 
      createVector(316 + spacing, 332), 
      createVector(308 + spacing, 340), 
      createVector(300 + spacing, 356), 
      createVector(284 + spacing, 372), 
      createVector(268 + spacing, 372), 
      createVector(252 + spacing, 372), 
      createVector(244 + spacing, 372), 
      createVector(228 + spacing, 372), 
      createVector(212 + spacing, 364)
    ];

    if (char == "O") {
      console.log("O");
      for(let j = 0; j < O.length; j++) {
        tree.push(O[j]);
      }
    };

    var P = [
      createVector(212 + spacing, 252), 
      createVector(212 + spacing, 260), 
      createVector(220 + spacing, 252), 
      createVector(212 + spacing, 244), 
      createVector(212 + spacing, 236), 
      createVector(204 + spacing, 220), 
      createVector(204 + spacing, 196), 
      createVector(204 + spacing, 172), 
      createVector(220 + spacing, 164), 
      createVector(236 + spacing, 156), 
      createVector(252 + spacing, 148), 
      createVector(268 + spacing, 148), 
      createVector(292 + spacing, 148), 
      createVector(316 + spacing, 164), 
      createVector(332 + spacing, 180), 
      createVector(348 + spacing, 196), 
      createVector(364 + spacing, 212), 
      createVector(364 + spacing, 228), 
      createVector(356 + spacing, 244), 
      createVector(340 + spacing, 260), 
      createVector(324 + spacing, 268), 
      createVector(308 + spacing, 268), 
      createVector(268 + spacing, 260), 
      createVector(292 + spacing, 260), 
      createVector(244 + spacing, 252), 
      createVector(212 + spacing, 268), 
      createVector(204 + spacing, 284), 
      createVector(204 + spacing, 308), 
      createVector(204 + spacing, 340), 
      createVector(196 + spacing, 356), 
      createVector(188 + spacing, 380), 
      createVector(188 + spacing, 396), 
      createVector(228 + spacing, 252), 
      createVector(220 + spacing, 244), 
      createVector(220 + spacing, 260)
    ];
    
    if (char == "P") {
      console.log("P");
      for(let j = 0; j < P.length; j++) {
        tree.push(P[j]);
      }
    };

    var Q = [
      createVector(252 + spacing, 380), 
      createVector(148 + spacing, 268), 
      createVector(252 + spacing, 156), 
      createVector(276 + spacing, 156), 
      createVector(292 + spacing, 172), 
      createVector(324 + spacing, 188), 
      createVector(340 + spacing, 212), 
      createVector(348 + spacing, 228), 
      createVector(356 + spacing, 244), 
      createVector(228 + spacing, 164), 
      createVector(196 + spacing, 180), 
      createVector(172 + spacing, 196), 
      createVector(156 + spacing, 220), 
      createVector(156 + spacing, 236), 
      createVector(148 + spacing, 284), 
      createVector(164 + spacing, 316), 
      createVector(180 + spacing, 348), 
      createVector(204 + spacing, 364), 
      createVector(228 + spacing, 380), 
      createVector(356 + spacing, 292), 
      createVector(356 + spacing, 316), 
      createVector(356 + spacing, 340), 
      createVector(348 + spacing, 364), 
      createVector(332 + spacing, 372), 
      createVector(308 + spacing, 380), 
      createVector(284 + spacing, 380), 
      createVector(340 + spacing, 332), 
      createVector(340 + spacing, 348), 
      createVector(332 + spacing, 356), 
      createVector(316 + spacing, 356), 
      createVector(324 + spacing, 348), 
      createVector(340 + spacing, 324), 
      createVector(348 + spacing, 308), 
      createVector(332 + spacing, 324), 
      createVector(316 + spacing, 340), 
      createVector(300 + spacing, 356), 
      createVector(356 + spacing, 356), 
      createVector(364 + spacing, 364), 
      createVector(356 + spacing, 372), 
      createVector(340 + spacing, 372), 
      createVector(364 + spacing, 348), 
      createVector(324 + spacing, 324), 
      createVector(372 + spacing, 372), 
      createVector(308 + spacing, 340)
    ];

    if (char == "Q") {
      console.log("Q");
      for(let j = 0; j < Q.length; j++) {
        tree.push(Q[j]);
      }
    };

    var R = [
      createVector(156 + spacing, 172), 
      createVector(156 + spacing, 196), 
      createVector(156 + spacing, 212), 
      createVector(156 + spacing, 244), 
      createVector(156 + spacing, 268), 
      createVector(156 + spacing, 284), 
      createVector(148 + spacing, 300), 
      createVector(148 + spacing, 324), 
      createVector(140 + spacing, 348), 
      createVector(148 + spacing, 364), 
      createVector(140 + spacing, 380), 
      createVector(172 + spacing, 172), 
      createVector(196 + spacing, 172), 
      createVector(220 + spacing, 164), 
      createVector(252 + spacing, 164), 
      createVector(284 + spacing, 164), 
      createVector(316 + spacing, 172), 
      createVector(332 + spacing, 180), 
      createVector(348 + spacing, 204), 
      createVector(348 + spacing, 228), 
      createVector(340 + spacing, 252), 
      createVector(316 + spacing, 268), 
      createVector(284 + spacing, 276), 
      createVector(260 + spacing, 284), 
      createVector(228 + spacing, 284), 
      createVector(204 + spacing, 284), 
      createVector(196 + spacing, 284), 
      createVector(180 + spacing, 284), 
      createVector(164 + spacing, 284), 
      createVector(316 + spacing, 276), 
      createVector(324 + spacing, 284), 
      createVector(332 + spacing, 300), 
      createVector(340 + spacing, 316), 
      createVector(340 + spacing, 340), 
      createVector(348 + spacing, 356), 
      createVector(356 + spacing, 372)
    ];

    if (char == "R") {
      console.log("R");
      for(let j = 0; j < R.length; j++) {
        tree.push(R[j]);
      }
    };

    var S = [
      createVector(372 + spacing, 156), 
      createVector(356 + spacing, 156), 
      createVector(340 + spacing, 156), 
      createVector(324 + spacing, 164), 
      createVector(308 + spacing, 164), 
      createVector(284 + spacing, 164), 
      createVector(268 + spacing, 164), 
      createVector(244 + spacing, 172), 
      createVector(220 + spacing, 172), 
      createVector(188 + spacing, 180), 
      createVector(172 + spacing, 180), 
      createVector(164 + spacing, 188), 
      createVector(172 + spacing, 196), 
      createVector(188 + spacing, 204), 
      createVector(212 + spacing, 204), 
      createVector(220 + spacing, 220), 
      createVector(252 + spacing, 236), 
      createVector(268 + spacing, 244), 
      createVector(284 + spacing, 244), 
      createVector(300 + spacing, 252), 
      createVector(316 + spacing, 276), 
      createVector(340 + spacing, 292), 
      createVector(364 + spacing, 316), 
      createVector(372 + spacing, 324), 
      createVector(388 + spacing, 348), 
      createVector(396 + spacing, 364), 
      createVector(388 + spacing, 356), 
      createVector(388 + spacing, 372), 
      createVector(380 + spacing, 380), 
      createVector(364 + spacing, 380), 
      createVector(348 + spacing, 388), 
      createVector(324 + spacing, 388), 
      createVector(308 + spacing, 388), 
      createVector(300 + spacing, 388), 
      createVector(276 + spacing, 396), 
      createVector(260 + spacing, 396), 
      createVector(236 + spacing, 396), 
      createVector(220 + spacing, 396), 
      createVector(180 + spacing, 404), 
      createVector(204 + spacing, 404), 
      createVector(172 + spacing, 412)
    ];

    if (char == "S") {
      console.log("S");
      for(let j = 0; j < S.length; j++) {
        tree.push(S[j]);
      }
    };

    var T = [
      createVector(156 + spacing, 172), 
      createVector(172 + spacing, 180), 
      createVector(188 + spacing, 172), 
      createVector(212 + spacing, 180), 
      createVector(244 + spacing, 180), 
      createVector(276 + spacing, 188), 
      createVector(292 + spacing, 188), 
      createVector(324 + spacing, 180), 
      createVector(332 + spacing, 188), 
      createVector(348 + spacing, 196), 
      createVector(356 + spacing, 204), 
      createVector(260 + spacing, 196), 
      createVector(260 + spacing, 204), 
      createVector(260 + spacing, 220), 
      createVector(252 + spacing, 236), 
      createVector(260 + spacing, 244), 
      createVector(260 + spacing, 252), 
      createVector(268 + spacing, 284), 
      createVector(260 + spacing, 268), 
      createVector(260 + spacing, 292), 
      createVector(260 + spacing, 316), 
      createVector(252 + spacing, 340), 
      createVector(252 + spacing, 348), 
      createVector(244 + spacing, 364), 
      createVector(244 + spacing, 372)
    ];

    if (char == "T") {
      console.log("T");
      for(let j = 0; j < T.length; j++) {
        tree.push(T[j]);
      }
    };

    var U = [
      createVector(172 + spacing, 180), 
      createVector(172 + spacing, 196), 
      createVector(164 + spacing, 212), 
      createVector(156 + spacing, 236), 
      createVector(156 + spacing, 260), 
      createVector(148 + spacing, 300), 
      createVector(140 + spacing, 316), 
      createVector(156 + spacing, 348), 
      createVector(188 + spacing, 356), 
      createVector(228 + spacing, 356), 
      createVector(268 + spacing, 356), 
      createVector(292 + spacing, 348), 
      createVector(308 + spacing, 340), 
      createVector(324 + spacing, 316), 
      createVector(332 + spacing, 284), 
      createVector(332 + spacing, 252), 
      createVector(332 + spacing, 220), 
      createVector(332 + spacing, 204), 
      createVector(340 + spacing, 188), 
      createVector(356 + spacing, 172), 
      createVector(172 + spacing, 164)
    ];

    if (char == "U") {
      console.log("U");
      for(let j = 0; j < U.length; j++) {
        tree.push(U[j]);
      }
    };

    var V = [
      createVector(212 + spacing, 196),
      createVector(220 + spacing, 212),
      createVector(220 + spacing, 236),
      createVector(220 + spacing, 252),
      createVector(220 + spacing, 268),
      createVector(228 + spacing, 292),
      createVector(236 + spacing, 316),
      createVector(236 + spacing, 332),
      createVector(244 + spacing, 340),
      createVector(252 + spacing, 356),
      createVector(260 + spacing, 348),
      createVector(268 + spacing, 332),
      createVector(276 + spacing, 324),
      createVector(284 + spacing, 300),
      createVector(300 + spacing, 276),
      createVector(308 + spacing, 244),
      createVector(316 + spacing, 212),
      createVector(316 + spacing, 188),
      createVector(332 + spacing, 188)
     ];

    if (char == "V") {
      console.log("V");
      for(let j = 0; j < V.length; j++) {
        tree.push(V[j]);
      }
    };

    var W = [
      createVector(116 + spacing, 172), 
      createVector(124 + spacing, 196), 
      createVector(132 + spacing, 220), 
      createVector(140 + spacing, 244), 
      createVector(140 + spacing, 276), 
      createVector(148 + spacing, 300), 
      createVector(156 + spacing, 324), 
      createVector(164 + spacing, 348), 
      createVector(172 + spacing, 364), 
      createVector(180 + spacing, 380), 
      createVector(188 + spacing, 372), 
      createVector(188 + spacing, 340), 
      createVector(204 + spacing, 316), 
      createVector(212 + spacing, 268), 
      createVector(220 + spacing, 244), 
      createVector(236 + spacing, 228), 
      createVector(252 + spacing, 244), 
      createVector(260 + spacing, 276), 
      createVector(260 + spacing, 308), 
      createVector(268 + spacing, 348), 
      createVector(276 + spacing, 372), 
      createVector(292 + spacing, 396), 
      createVector(300 + spacing, 380), 
      createVector(308 + spacing, 356), 
      createVector(324 + spacing, 324), 
      createVector(332 + spacing, 284), 
      createVector(332 + spacing, 252), 
      createVector(332 + spacing, 212), 
      createVector(348 + spacing, 188), 
      createVector(356 + spacing, 172)
    ];

    if (char == "W") {
      console.log("W");
      for(let j = 0; j < W.length; j++) {
        tree.push(W[j]);
      }
    };

    var X = [
      createVector(252 + spacing, 260), 
      createVector(124 + spacing, 396), 
      createVector(420 + spacing, 412), 
      createVector(436 + spacing, 108), 
      createVector(108 + spacing, 100), 
      createVector(228 + spacing, 252), 
      createVector(220 + spacing, 228), 
      createVector(196 + spacing, 212), 
      createVector(172 + spacing, 180), 
      createVector(156 + spacing, 156), 
      createVector(140 + spacing, 140), 
      createVector(124 + spacing, 124), 
      createVector(268 + spacing, 252), 
      createVector(300 + spacing, 228), 
      createVector(332 + spacing, 212), 
      createVector(356 + spacing, 188), 
      createVector(372 + spacing, 172), 
      createVector(388 + spacing, 156), 
      createVector(404 + spacing, 140), 
      createVector(420 + spacing, 132), 
      createVector(236 + spacing, 276), 
      createVector(220 + spacing, 292), 
      createVector(204 + spacing, 300), 
      createVector(196 + spacing, 316), 
      createVector(180 + spacing, 332), 
      createVector(164 + spacing, 348), 
      createVector(148 + spacing, 372), 
      createVector(140 + spacing, 388), 
      createVector(116 + spacing, 412), 
      createVector(268 + spacing, 276), 
      createVector(300 + spacing, 300), 
      createVector(324 + spacing, 316), 
      createVector(340 + spacing, 332), 
      createVector(364 + spacing, 348), 
      createVector(388 + spacing, 372), 
      createVector(404 + spacing, 396)
    ];

    if (char == "X") {
      console.log("X");
      for(let j = 0; j < X.length; j++) {
        tree.push(X[j]);
      }
    };

    var Y = [
      createVector(260 + spacing, 244), 
      createVector(260 + spacing, 260), 
      createVector(260 + spacing, 276), 
      createVector(260 + spacing, 292), 
      createVector(260 + spacing, 308), 
      createVector(260 + spacing, 324), 
      createVector(260 + spacing, 340), 
      createVector(260 + spacing, 356), 
      createVector(260 + spacing, 372), 
      createVector(260 + spacing, 388), 
      createVector(268 + spacing, 236), 
      createVector(252 + spacing, 236), 
      createVector(276 + spacing, 228), 
      createVector(292 + spacing, 212), 
      createVector(388 + spacing, 124), 
      createVector(140 + spacing, 116), 
      createVector(236 + spacing, 228), 
      createVector(220 + spacing, 212), 
      createVector(204 + spacing, 196), 
      createVector(188 + spacing, 180), 
      createVector(172 + spacing, 164), 
      createVector(164 + spacing, 148), 
      createVector(156 + spacing, 132), 
      createVector(308 + spacing, 204), 
      createVector(324 + spacing, 196), 
      createVector(340 + spacing, 172), 
      createVector(356 + spacing, 156), 
      createVector(372 + spacing, 140), 
      createVector(332 + spacing, 188)
    ];

    if (char == "Y") {
      console.log("Y");
      for(let j = 0; j < Y.length; j++) {
        tree.push(Y[j]);
      }
    };

    var Z = [
      createVector(340 + spacing, 172), 
      createVector(332 + spacing, 188), 
      createVector(316 + spacing, 204), 
      createVector(308 + spacing, 212), 
      createVector(292 + spacing, 236), 
      createVector(260 + spacing, 260), 
      createVector(252 + spacing, 276), 
      createVector(244 + spacing, 284), 
      createVector(228 + spacing, 300), 
      createVector(212 + spacing, 316), 
      createVector(188 + spacing, 340), 
      createVector(172 + spacing, 364), 
      createVector(188 + spacing, 364), 
      createVector(212 + spacing, 364), 
      createVector(244 + spacing, 364), 
      createVector(268 + spacing, 364), 
      createVector(292 + spacing, 364), 
      createVector(316 + spacing, 364), 
      createVector(332 + spacing, 372), 
      createVector(348 + spacing, 372), 
      createVector(332 + spacing, 164), 
      createVector(316 + spacing, 164), 
      createVector(292 + spacing, 164), 
      createVector(276 + spacing, 164), 
      createVector(252 + spacing, 164), 
      createVector(228 + spacing, 156), 
      createVector(212 + spacing, 156), 
      createVector(188 + spacing, 148), 
      createVector(164 + spacing, 148), 
      createVector(172 + spacing, 356), 
      createVector(340 + spacing, 180), 
      createVector(180 + spacing, 372)
    ];

    if (char == "Z") {
      console.log("Z");
      for(let j = 0; j < Z.length; j++) {
        tree.push(Z[j]);
      }
    };
  }

  currentLength = tree.length;
}

document.getElementById("saveButton").onclick = function () {
  save("dla.svg");
};

function draw() {
  if(submitted == true) {
    background(255);
    colorFade = 0;
  
    var walker = createVector(random(width), random(height));
    var stuck = false;
    var attempts = 0;
  
    while(!stuck) {
      attempts++;
  
      for(var i = 0; i < tree.length; i++) {
        
        var d = p5.Vector.dist(walker, tree[i]);
        
        //For less direction-biased growth, define distance conditions based on the position of the walker!
        
        //Vertically adjecent cells
        if(walker.x < tree[i].x + r/2 &&
           walker.x > tree[i].x - r/2 &&
           d < r &&
           random(1) < stick
          ) {
          stuck = true;
          break;
        }
        
        //Horizontally adjecent cells
        if(walker.y < tree[i].y + r/2 &&
           walker.y > tree[i].y - r/2 &&
           d < r &&
           random(1) < stick
          ) {
          stuck = true;
          break;
        }
        
        //Diagonally adjecent cells:
        
        //1,1-cell
        if(walker.x > tree[i].x + r/2 &&
           walker.y > tree[i].y + r/2 &&
           d < r * 1/Math.sqrt(2) &&
           random(1) < stick
          ) {
          stuck = true;
          break;
        }
        
        //-1,-1-cell
        if(walker.x < tree[i].x - r/2 &&
           walker.y < tree[i].y - r/2 &&
           d < r * 1/Math.sqrt(2) &&
           random(1) < stick
          ) {
          stuck = true;
          break;
        }
        
        //1,-1-cell
        if(walker.x > tree[i].x + r/2 &&
           walker.y < tree[i].y - r/2 &&
           d < r * 1/Math.sqrt(2) &&
           random(1) < stick
          ) {
          stuck = true;
          break;
        }
        
        //-1,1-cell
        if(walker.x < tree[i].x - r/2 &&
           walker.y > tree[i].y + r/2 &&
           d < r * 1/Math.sqrt(2) &&
           random(1) < stick
          ) {
          stuck = true;
          break;
        }
        
      }
  
      walker.x = walker.x + r * random(-1, 1);
      walker.y = walker.y + r * random(-1, 1);
      walker.x = constrain(walker.x, 0, width);
      walker.y = constrain(walker.y, 0, height);
  
      if(attempts > 500000) {
        console.log("Max attempts reached.");
        stuck = true;
      }
    }
    
    tree.push(walker);
    
    for(var i = 0; i < tree.length; i++) {
      var colorFade;

      if(i < currentLength) {
        colorFade = 255;
      } else {
        colorFade = 0;
      }
      fill(fillCol);
      stroke(strokeCol);
      strokeWeight(strokeWidth);
      rectMode(CENTER);

      rect(r*floor(tree[i].x/r) + r/2, r*floor(tree[i].y/r) + r/2, r);

      if (i > maxPoints) {
        print("Growth finished!");
        noLoop();
      }

    }
  }

}