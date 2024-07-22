let font;
let fSize = 200;
let outline = 1;
let msg = 'Welcome :)';
let fontPath;
let noiseScale = 1;
let noiseStrength = 50;

function setup() {
    let cnv = createCanvas(800, 200, SVG);
    cnv.parent('canvas-container');
    loadDefaultFont();
}

function loadDefaultFont(){
    opentype.load('./Fanwood.otf', function (err, f) {
        if (err) {
            alert('Font could not be loaded: ' + err);
        } else {
            font = f;
            console.log('font ready');
            updateFontPath();
            updateCanvasSize();
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
}

function distort(x, y) {
    let nx = x + (noise(x * noiseScale, y * noiseScale) - 0.5) * noiseStrength;
    let ny = y + (noise(x * noiseScale + 10000, y * noiseScale + 10000) - 0.5) * noiseStrength;
    return { x: nx, y: ny };
}

function updateText() {
    updateFontPath();
    updateCanvasSize();
    redraw();
}

function updateFontPath() {
    if (font) {
        let x = fSize / 3;
        let y = fSize / 1;
        fontPath = font.getPath(msg, x, y, fSize);
        console.log(fontPath.commands);
    }
}

function updateCanvasSize() {
    if (fontPath) {
        const bbox = fontPath.getBoundingBox();
        const padding = fSize / 2;

        // Add extra padding for stroke and noise
        const extraPadding = Math.max(outline, noiseStrength) * 2; 
        
        // Calculate new dimensions with padding
        const newWidth = bbox.x2 - bbox.x1 + padding * 2 + extraPadding;
        const newHeight = bbox.y2 - bbox.y1 + padding * 2 + extraPadding;

        // Resize canvas
        resizeCanvas(newWidth, newHeight);
        
        // Adjust position to keep text within bounds
        translate(-bbox.x1 + padding, -bbox.y1 + padding);
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
        reader.readAsArrayBuffer(file);
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

    // Add event listeners to automatically submit the form when an input changes
    const inputs = [txInput, fSInput, sTInput, nScInput, nStInput];
    inputs.forEach(input => {
        input.addEventListener("input", function() {
            form.dispatchEvent(new Event("submit"));
        });
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const openPopupBtn = document.getElementById('openPopupBtn');
    const popup = document.getElementById('popup');
    const closePopupBtn = document.getElementById('closePopupBtn');

    openPopupBtn.addEventListener('click', function() {
        popup.style.display = 'flex';
    });

    closePopupBtn.addEventListener('click', function() {
        popup.style.display = 'none';
    });

    // Close the popup when clicking outside of it
    window.addEventListener('click', function(event) {
        if (event.target === popup) {
            popup.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.getElementById('nSt');
    const output = slider.nextElementSibling;
    
    // Initial value setup
    output.value = slider.value;

    // Waiting time before animation
    setTimeout(() => {
        animateSlider();
    }, 2000);

    function animateSlider() {
        const startValue = 50;
        const endValue = 150;
        const duration = 10000; // Total time for the complete animation
        
        // Animate to end value and back to start value
        animateSliderValue(startValue, endValue, duration / 2);
    }

    function animateSliderValue(start, end, duration) {
        const startTime = performance.now();

        function updateSlider(currentTime) {
            const elapsedTime = currentTime - startTime;
            const progress = Math.min(elapsedTime / duration, 1);
            const newValue = Math.round(start + (end - start) * progress);
            slider.value = newValue;
            output.value = newValue;

            // Update the canvas
            noiseStrength = newValue;
            updateText();

            if (progress < 1) {
                requestAnimationFrame(updateSlider);
            }
        }

        requestAnimationFrame(updateSlider);
    }
});

document.addEventListener('DOMContentLoaded', () => {
            const inputField = document.getElementById('tx');
            const initialText = 'Welcome :)';

            // Handle focus event
            inputField.addEventListener('focus', function() {
                if (inputField.value === initialText) {
                    inputField.value = '';
                }
            });

            // Handle blur event
            inputField.addEventListener('blur', function() {
                if (inputField.value === '') {
                    inputField.value = initialText;
                }
            });
        });