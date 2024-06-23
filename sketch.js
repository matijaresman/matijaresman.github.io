let font;
let fSize;
let msg;
let fontPath;
let input;
let updateButton;
let outline = 1;
let strokeWeightInput;
let noiseScaleInput;
let noiseStrengthInput;
let fontSizeInput;

function setup() {
  // Create the SVG canvas
  createCanvas(800, 200, SVG);

  // Load the font
  opentype.load('./Fanwood.otf', function (err, f) {
    if (err) {
      alert('Font could not be loaded: ' + err);
    } else {
      font = f;
      console.log('font ready');
      fSize = 144;
      msg = 'PERWOLF'; // Initial message
      updateFontPath();
    }
  });

  // Create a paragraph for the inputs
  let inputParagraph = createP('');
  
  // Create input fields and add them to the paragraph
  inputParagraph.child(createSpan('Text: '));
  input = createInput();
  input.parent(inputParagraph);
  inputParagraph.child(createElement('br'));

  inputParagraph.child(createSpan(' Noise Scale: '));
  noiseScaleInput = createInput('0.25', 'number');
  noiseScaleInput.parent(inputParagraph);
  inputParagraph.child(createElement('br'));
  
  inputParagraph.child(createSpan(' Stroke Thickness: '));
  strokeWeightInput = createInput('1', 'number');
  strokeWeightInput.parent(inputParagraph);
  inputParagraph.child(createElement('br'));

  inputParagraph.child(createSpan(' Noise Strength: '));
  noiseStrengthInput = createInput('50', 'number');
  noiseStrengthInput.parent(inputParagraph);
  inputParagraph.child(createElement('br'));

  inputParagraph.child(createSpan(' Font Size: '));
  fontSizeInput = createInput('144', 'number');
  fontSizeInput.parent(inputParagraph);
  inputParagraph.child(createElement('br'));

  // Create update button and add it to the paragraph
  updateButton = createButton('Update Text');
  updateButton.mousePressed(updateText);
  updateButton.parent(inputParagraph);
  inputParagraph.child(createElement('br'));

  // Create a separate paragraph for the save button
  let outputParagraph = createP('');
  let saveButton = createButton('Save as SVG');
  saveButton.mousePressed(saveIMG);
  saveButton.parent(outputParagraph);
}

function draw() {
  clear();
  if (!font) return;
  background(255);
  noFill();
  stroke(0);
  strokeWeight(outline);

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
  let noiseScale = parseFloat(noiseScaleInput.value());
  let noiseStrength = parseFloat(noiseStrengthInput.value());
  let nx = x + (noise(x * noiseScale, y * noiseScale) - 0.5) * noiseStrength;
  let ny = y + (noise(x * noiseScale + 10000, y * noiseScale + 10000) - 0.5) * noiseStrength;
  return { x: nx, y: ny };
}

function saveIMG() {
  save('perwolf.svg');
}

function updateText() {
  msg = input.value();
  fSize = parseFloat(fontSizeInput.value());
  outline = parseFloat(strokeWeightInput.value());
  updateFontPath();
  redraw();
}

function updateFontPath() {
  if (font) {
    let x = fSize / 1.5;
    let y = fSize / 1;
    fontPath = font.getPath(msg, x, y, fSize);

    // Calculate bounding box
    const bbox = fontPath.getBoundingBox();
    const newWidth = bbox.x2 - bbox.x1 + fSize; // Adding some padding
    const newHeight = bbox.y2 - bbox.y1 + fSize; // Adding some padding

    // Resize canvas based on bounding box
    resizeCanvas(newWidth, newHeight);

    console.log(fontPath.commands);
  }
}