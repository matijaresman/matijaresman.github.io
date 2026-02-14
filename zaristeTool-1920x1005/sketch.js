let starRad1 = 10;
let bgStar1Rad1 = 10;
let armNrBg1 = 4;
let bgStars1 = [];

let bgStarsBuffer;
let bgStarsBufferDirty = true;

let bgStarProb = 0.25;
let bgStarNoiseScale = 0.15;
let bgStarNoiseZ = 0;
let bgStarNoiseMode = "perlin";

let bgStarSplit1 = 0.33;

let starCol = '#FF48FF';
let gridCol = '#000000';

let bgColor1 = '#d5ed00'; // default color 1
let bgColor2 = '#0049ff'; // default color 2

let showGrid = false;
let animateBackground = false;
let gridCheckbox;

let scaleBackground = false;

const CANVAS_W = 1920;
const CANVAS_H = 1005;

let vidWidth = CANVAS_W;
let vidHeight = CANVAS_H;

let colNum = 55;
let rowNum = 69;

let backgroundStyle = 1;
let bgDropdown;

var colWidth = vidWidth / colNum;
var rowHeight = vidHeight / rowNum;

const bgColors = [
  "#FF0000",
  "#D6ED00",
  "#0049FF",
  "#FF48FF",
  "#241F20"
];

// Star function
function star(x, y, radius, npoints) {
  let angle = TWO_PI / npoints;

  for (let a = 0; a < TWO_PI; a += angle) {
    // bring circles closer to the center
    let cx = x + cos(a) * (radius);
    let cy = y + sin(a) * (radius);

    ellipse(cx, cy, radius * 2, radius * 2);
  }
}

function getStarRotation(armNr) {
  if (armNr % 2 === 0) {
    return -HALF_PI;
  } else {
    return -HALF_PI + PI / armNr + PI;
  }
}

function drawBackground() {
  let barW;
  let barH;

  if (backgroundStyle === 1) {
    barW = width / 7.0;
    barH = height / 101.0;
  
    for(let i = 0; i < 101; i++) {
      for(let j = 0; j < 7; j++) {
          if(j % 2 == 0) {
              if(i % 2 == 0) {
                  fill(bgColor1);
              } else {
                  fill(bgColor2);
              }
          } else {
              if(i % 2 == 0) {
                  fill(bgColor2);
              } else {
                  fill(bgColor1);
              }
          }
          noStroke();
          rect(j * barW, i * barH, barW, barH);
      }
    }
  } else if (backgroundStyle === 2) {
    barW = width / 120.0;
    barH = height;

    for (let i = 0; i < 120; i++) {
      if(i % 2 == 0) {
        fill(bgColor2);
      } else {
        fill(bgColor1);
      }
      rect(i * barW, 0, barW, barH);
    }
  } else if (backgroundStyle === 3) {
    barW = 15;
    barH = 15;

    for(let i = 0; i < 128; i++) {
      for(let j = 0; j < 67; j++) {
          if(j % 2 == 0) {
              if(i % 2 == 0) {
                  fill(bgColor1);
              } else {
                  fill(bgColor2);
              }
          } else {
              if(i % 2 == 0) {
                  fill(bgColor2);
              } else {
                  fill(bgColor1);
              }
          }
          noStroke();
          rect(i * barW, j * barH, barW, barH);
      }
    }

  }
} 

function generateBgStars() {
  bgStars1 = [];

  const rotation1 = getStarRotation(armNrBg1);

  for (let i = 0; i < colNum; i++) {
    for (let j = 0; j < rowNum; j++) {

      const xPx = i * colWidth + colWidth;
      const yPx = j * rowHeight + rowHeight;

      // Optional: keep margins
      if (
        xPx < - 40 ||
        xPx > width + 40 ||
        yPx < -40 ||
        yPx > height + 40
      ) continue;

      let v = (bgStarNoiseMode === "perlin") 
              ? noise(i * bgStarNoiseScale, j * bgStarNoiseScale, bgStarNoiseZ)
              : random();

      if (v < bgStarSplit1) {
        bgStars1.push({ x: i * colWidth + colWidth / 2, y: yPx, rot: rotation1 });
      }
    }
  }
}

function drawBgStarsLive() {
  push();
  fill(starCol);
  noStroke();

  for (let s of bgStars1) {
    push();
    translate(s.x, s.y);
    rotate(s.rot);
    star(0, 0, bgStar1Rad1, armNrBg1);
    pop();
  }


  pop();
}

function regenerateBgStarsFrame() {
  bgStarNoiseZ = random(1000); // new noise
  generateBgStars();
  bgStarsBufferDirty = true;
}

function setArmNr(target, value) {
  value = int(value);
  value = constrain(value, 3, 38);

  switch (target) {
    case 'bg1':
      armNrBg1 = value;
      bgStarsBufferDirty = true;
      break;
  }
}

function setArmNrUI(value) {
  value = int(value);
  value = constrain(value, 3, 38);
  armNrBg1 = value;

  // sync UI
  armSliderBg1.value(value);
  armInputBg1.value(value);

  bgStarsBufferDirty = true;
  generateBgStars();
}

function setRad(target, value) {
  value = constrain(value, 1, 100);

  switch (target) {
    case 'bg1Rad1':
      bgStar1Rad1 = value; break;
  }

  bgStarsBufferDirty = true;
  generateBgStars();
}

function setBgRatio(value) {
  bgStarProb = constrain(value, 0.00, 1.00);
  bgStarsBufferDirty = true;
  generateBgStars();
}

function setBgSplit1(value) {
  value = constrain(value, 0, 1);
  bgStarSplit1 = value;

  // sync UI
  bgSplit1Slider.value(value);
  bgSplit1Input.value(value.toFixed(2));

  bgStarsBufferDirty = true;
  generateBgStars();
}

function setNoiseMode(mode) {
  bgStarNoiseMode = mode;

  if (bgStarNoiseMode === "random") {
    animateBackground = false;
    backgroundCheckbox.checked(false);
  }

  bgStarsBufferDirty = true;
  generateBgStars();
}

function updateSplit1(v) {
  bgStarSplit1 = v;
  generateBgStars();
}

function updateStarSize() {
  starRad1 = starRad1Slider.value();
}

function createUIGroup(title, parent) {
  const group = createDiv().class('ui-group').parent(parent);
  createDiv(title).class('ui-group-title').parent(group); return group;
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

function setStarSize(value) {
  value = constrain(value, 1, 100);
  bgStar1Rad1 = value;
  bgStar1Rad2 = value * 1.5; // radius2 = 1.5 * radius1

  // sync UI
  bgStar1Rad1Slider.value(value);
  bgStar1Rad1Input.value(value);

  bgStarsBufferDirty = true;
  generateBgStars();
}

function setRad(target, value) {
  value = constrain(value, 1, 100);

  switch (target) {
    case 'bg1Rad1':
      bgStar1Rad1 = value;
      // Sync UI
      bgStar1Rad1Slider.value(value);
      bgStar1Rad1Input.value(value);
      break;
  }

  bgStarsBufferDirty = true;
  generateBgStars();
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

  updateCanvasScale();
  regenerateBgStarsFrame();

  /*
  bgStarsBuffer = createGraphics(CANVAS_W, CANVAS_H);
  bgStarsBuffer.pixelDensity(pixelDensity());
*/
  noiseDetail(4, 0.5);

  // UI Menu:

  uiContainer = select('#ui-container');

  // GRID GROUP:  
  const gridGroup = createUIGroup("Grid", uiContainer);

  // Grid select:
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

    // recalc cell sizes
    colWidth = vidWidth / colNum;
    rowHeight = vidHeight / rowNum;

    generateBgStars();
  });
  gridSelect
  .parent(gridGroup)
  .class("ui-label");

  gridCheckbox = createCheckbox("Show", false);
  gridCheckbox.changed(() => showGrid = gridCheckbox.checked());
  gridCheckbox
  .parent(gridGroup)
  .class("ui-label");

  const backgroundGroup = createUIGroup("Background style", uiContainer);

  bgDropdown = createSelect();
  bgDropdown.option('Style 1', '1');
  bgDropdown.option('Style 2', '2');
  bgDropdown.option('Style 3', '3');
  bgDropdown.selected('1');
  bgDropdown.changed(() => {
    backgroundStyle = int(bgDropdown.value());
  });
  bgDropdown
  .parent(backgroundGroup)
  .class("ui-label");

  createP("Background Color 1")
  .parent(backgroundGroup)
  .class("ui-label");

const bgSwatchContainer1 = createDiv();
bgSwatchContainer1.parent(backgroundGroup);
bgSwatchContainer1.style("display", "flex");
bgSwatchContainer1.style("gap", "6px");

bgColors.forEach(c => {
  const btn = createButton("");
  btn.parent(bgSwatchContainer1);
  btn.style("background-color", c);
  btn.style("width", "20px");
  btn.style("height", "20px");
  btn.style("border-radius", "50%");
  btn.style("border", "1px solid #444");
  btn.style("cursor", "pointer");

  btn.mousePressed(() => {
    bgColor1 = c;
    drawBackground(); // immediately redraw background
  });
});

createP("Background Color 2")
  .parent(backgroundGroup)
  .class("ui-label");

const bgSwatchContainer2 = createDiv();
bgSwatchContainer2.parent(backgroundGroup);
bgSwatchContainer2.style("display", "flex");
bgSwatchContainer2.style("gap", "6px");

bgColors.forEach(c => {
  const btn = createButton("");
  btn.parent(bgSwatchContainer2);
  btn.style("background-color", c);
  btn.style("width", "20px");
  btn.style("height", "20px");
  btn.style("border-radius", "50%");
  btn.style("border", "1px solid #444");
  btn.style("cursor", "pointer");

  btn.mousePressed(() => {
    bgColor2 = c;
    drawBackground(); // immediately redraw background
  });
});

  const bgStarsGroup = createUIGroup("Background stars", uiContainer);

  createP("noise texture")
  .parent(bgStarsGroup)
  .class("ui-label");
  noiseSelect = createSelect();
  noiseSelect.option("random");
  noiseSelect.option("perlin");
  noiseSelect.value(bgStarNoiseMode); // sync with the variable
  noiseSelect.changed(() => {
      bgStarNoiseMode = noiseSelect.value();
  
      if (bgStarNoiseMode === "random") {
        animateBackground = false;
        backgroundCheckbox.checked(false);
      }
  
      bgStarsBufferDirty = true;
      generateBgStars();
      drawBgStarsLive(); // force redraw immediately
  });
  
  noiseSelect.parent(bgStarsGroup);

  createP("background stars distribution")
  .parent(bgStarsGroup)
  .class("ui-label");

  // ---- Split 1 ----
  const split1Row = createDiv().parent(bgStarsGroup);
  split1Row.style("display", "flex");
  split1Row.style("gap", "8px");
  split1Row.style("align-items", "center");
  
  bgSplit1Slider = createSlider(0, 1, bgStarSplit1, 0.01);
  bgSplit1Slider.parent(split1Row);
  bgSplit1Slider.input(() => setBgSplit1(bgSplit1Slider.value()));
  
  bgSplit1Input = createInput(bgStarSplit1.toFixed(2), "number");
  bgSplit1Input.attribute("min", 0);
  bgSplit1Input.attribute("max", 1);
  bgSplit1Input.attribute("step", 0.01);
  bgSplit1Input.parent(split1Row);
  bgSplit1Input.input(() => setBgSplit1(parseFloat(bgSplit1Input.value())));
  
  const bgRefreshBtn = createButton("Refresh");
  bgRefreshBtn
  .parent(bgStarsGroup);
  bgRefreshBtn.mousePressed(regenerateBgStarsFrame);

  const bgStarsGroup1 = createUIGroup("Pixels", uiContainer);
  // Number of arms BG1:
  createP("arms number")
  .parent(bgStarsGroup1)
  .class("ui-label");
  armSliderBg1 = createSlider(3, 38, 4, 1);
  armSliderBg1.input(() => setArmNrUI(armSliderBg1.value()));
  armSliderBg1.parent(bgStarsGroup1);
  armInputBg1 = createInput('4', 'number');
  armInputBg1.attribute('min', 3);
  armInputBg1.attribute('max', 38);
  armInputBg1.attribute('step', 1);
  armInputBg1.input(() => setArmNrUI(armInputBg1.value()));
  armInputBg1.parent(bgStarsGroup1);  

  createP("size")
  .parent(bgStarsGroup1)
  .class("ui-label");
  bgStar1Rad1Slider = createSlider(1, 100, 10, 0.1);
  bgStar1Rad1Slider.input(() => setStarSize(bgStar1Rad1Slider.value()));
  bgStar1Rad1Slider.parent(bgStarsGroup1);
  bgStar1Rad1Input = createInput('5', 'number');
  bgStar1Rad1Input.attribute('min', 1);
  bgStar1Rad1Input.attribute('max', 100);
  bgStar1Rad1Input.attribute('step', 0.1);
  bgStar1Rad1Input.input(() => setStarSize(parseFloat(bgStar1Rad1Input.value())));
  bgStar1Rad1Input.parent(bgStarsGroup1);

  createP("stars color")
  .parent(bgStarsGroup1)
  .class("ui-label");
  const starColors = [
    "#FF0000",
    "#D6ED00",
    "#0049FF",
    "#FF48FF",
    "#241F20"
  ];
  const swatchContainer1 = createDiv();
  swatchContainer1.parent(bgStarsGroup1);
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

  const animationsGroup = createUIGroup("Animations", uiContainer);

  backgroundCheckbox = createCheckbox("Animate", false);
  backgroundCheckbox.changed(() => animateBackground = backgroundCheckbox.checked());
  backgroundCheckbox
  .parent(animationsGroup)
  .class("ui-label");

  bgStarsScaleCheckbox = createCheckbox("Animate Size", false);
  bgStarsScaleCheckbox
  .parent(animationsGroup)
  .class("ui-label");
  bgStarsScaleCheckbox.changed(() => {
    scaleBackground = bgStarsScaleCheckbox.checked();
  });

  /*

  const saveBtn = createButton("Save PNG");
  saveBtn.parent(uiContainer);
  saveBtn.mousePressed(saveFrameAsPNG);
  */

}

//SETUP FUNCTION END

//=============================================

// DRAW FUNCTION START

function draw() {
  drawBackground();

  if (showGrid) drawGrid();
    
    // --- compute animated radii ---
    if (scaleBackground) {
      animatedBgStar1Rad1 = bgStar1Rad1 * (0.25 + Math.abs(Math.sin(phase * 3)));

    } else {
      animatedBgStar1Rad1 = bgStar1Rad1;

    }
  
    // --- decide redraw strategy ---
    if (animateBackground || scaleBackground || !animateBackground && !scaleBackground) {
  
      // regenerate ONLY if animateBackground is on
      if (animateBackground && bgStarNoiseMode === "perlin") {
        // advance noise space every frame
        bgStarNoiseZ += 0.01;
        generateBgStars();
      } else if (animateBackground && bgStarNoiseMode === "random") {
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

    
}