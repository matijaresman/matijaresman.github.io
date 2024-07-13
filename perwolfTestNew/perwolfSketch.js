let font;
let fSize = 144;
let outline = 1;
let msg = 'Your text here';
let fontPath;
let noiseScale = 0.25;
let noiseStrength = 50;

function setup() {
    let canvas = createCanvas(800, 500, SVG);
    canvas.parent('canvas-container');
    loadDefaultFont();
}

function loadDefaultFont(){
    opentype.load('./Fanwood.otf', function (err, f) {
        if (err) {
            alert('Font could not be loaded: ' + err);
        } else {
            font = f;
            console.log('font ready');
            let x = fSize;
            let y = fSize;
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
    let nx = x + (noise(x * noiseScale, y * noiseScale) - 0.5) * noiseStrength;
    let ny = y + (noise(x * noiseScale + 10000, y * noiseScale + 
                      10000) - 0.5) * noiseStrength;
    return { x: nx, y: ny };
}

function updateText() {    
    updateFontPath();
    redraw();
}

function updateFontPath() {    
    if (font) {
        let x = fSize / 3;
        let y = fSize / 1;
        fontPath = font.getPath(msg, x, y, fSize);

        // Calculate bounding box
        const bbox = fontPath.getBoundingBox();
        const newWidth = bbox.x2 - bbox.x1 + fSize / 2; // Adding some padding
        const newHeight = bbox.y2 - bbox.y1 + fSize / 2; // Adding some padding

        // Resize canvas based on bounding box
        resizeCanvas(newWidth, newHeight);

        console.log(fontPath.commands);
      }
}

function saveIMG() {
  save('perwolf.svg');
}

function handleFile(file) {
  if (file.type === 'font/otf' || file.name.endsWith('.otf')) {
    let reader = new FileReader();
    reader.onload = function (e) {
      let arrayBuffer = e.target.result;
      opentype.parse(arrayBuffer, function (err, f) {
        if (err) {
          alert('Font could not be loaded: ' + err);
        } else {
          font = f;
          console.log('uploaded font ready');
          updateText();
        }
      });
    };
    reader.readAsArrayBuffer(file.file);
  } else {
    alert('Please upload a valid OTF file.');
  }
}

document.addEventListener("DOMContentLoaded", function() {
    const form = document.getElementById("myForm");

    const fUInput = document.getElementById("fU");
    const txInput = document.getElementById("tx");
    const fSInput = document.getElementById("fS");
    const sTInput = document.getElementById("sT");
    const nScInput = document.getElementById("nSc");
    const nStInput = document.getElementById("nSt");
    const sBButton = document.getElementById("sB");

    const output = document.getElementById("output");

    form.addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        msg = txInput.value;
        fSize = fSInput.value;
        outline = sTInput.value;
        noiseScale = nScInput.value;
        noiseStrength = nStInput.value;

        updateText();

        output.textContent = The font size is: ${fSize}, the stroke thickness is: ${outline}, the noise scale: ${noiseScale}, the noise strength: ${noiseStrength}, the text is: ${msg};
    });
    
    sBButton.addEventListener("click", function (event) {
        event.preventDefault();
        saveIMG();
    });
    
    
    fUInput.addEventListener("change", function (event) {
        const file = event.target.files[0];
        console.log(file);
        
        if (file) {
            const reader = new FileReader();
            console.log(reader);
            reader.addEventListener("load", function (event) {
                opentype.load(event.target.result, function (err, f) {
                    if (err) {
                        alert('Font could not be loaded: ' + err);
                    } else {
                        font = f;
                        console.log('font ready');
                        updateText();
                    }
                });
            });
            reader.readAsDataURL(file);
        }
        
    });
});