const CANVAS_W = 1080;
const CANVAS_H = 1440;
const WRAP_RIGHT_PADDING = 40;
const FALLBACK_DURATION = 10;

// Scatter:
const GRID_UNITS = 60;
const BAND_RANGE = 120;
const ADAPT_SPEED = 0.002;

// Color palette:
const PALETTE = [
  { hex: "#FAFF00", name: "Yellow" },
  { hex: "#00CE00", name: "Lime Green" },
  { hex: "#0000AE", name: "True Azure" },
  { hex: "#81E9F2", name: "Electric Aqua" },
  { hex: "#FF00FA", name: "Magenta" },
  { hex: "#870000", name: "Blood Red" },
];

// Font files (NOT baked):
const FONT_FILES = [
  "assets/HARBER.ttf"
];

let HB = null;
const hbReady = import("./libraries/harfbuzz/index.mjs").then((mod) => {
  HB = mod;
  return mod;
});

// Globals:

let p5Canvas;
let panelEl, canvasHolderEl, tabBarEl, boxSettingsEl;
let currentFontPath = FONT_FILES[0];

let hbFace = null;
let fvarAxes = [];

let bgColor = "#870000";
let transparentBg = false;
let zoom = 1;

let playing = false;
let playStartMillis = 0;
let currentT = 0;
let fps = 30;
let wasPlayingBeforeRecord = true;

// PNG sequence export:
const SIM_RATE = 60; // sound smoothing runs at the live draw rate so exports animate like the preview
let exportingFrames = false;
let cancelFrameExport = false;

let statusEl, timeSlider, playButton, scrubValEl;

let overlapMaskCanvas, overlapMaskCtx;

let boxes = [];
let activeBoxIndex = 0;
let nextBoxId = 1;

// Margins and guide lines -- defaults:
const MARGIN_COLOR = "#FF00FA";
const GUIDE_COLOR = "#0000AE";
const GRID_COLOR = "#00CE00";
let margins = { show: false, top: 80, bottom: 80, left: 80, right: 80, color: MARGIN_COLOR };
// Grid:
let grid = { show: false, rows: 2, columns: 6, color: GRID_COLOR };
let guides = [];
let activeGuideIndex = 0;
let nextGuideId = 1;
let guideTabBarEl, guideSettingsEl;
let guidesCanvas, guidesCtx;

// Audio reactivity:
let audioEl;
let audioCtx = null;
let audioSourceNode = null;
let audioBuffer = null;
let envelope = null;
let envelopeRate = 20;
let audioDuration = 0;
let audioLoaded = false;
let audioStatusEl;

// Live frequency analysis:
let analyser = null;
let spectrum = new Uint8Array(1024);
let loudness = 0;
let quietLevel = 1;
let loudLevel = 0;
let soundMeterEl;

// TEXT boxes:

function createBox(overrides) {
  return Object.assign(
    {
      id: 0,
      label: "Text",
      uiText: "MBZ\n34",
      fontSize: 260,
      lineHeight: 300,
      offsetX: 80,
      offsetY: 420,
      kerning: 0,

      strokeColor: "#81E9F2",
      fillColor: "#FF00FA",
      strokeThickness: 2,
      renderMode: "fill-nonzero",
      ringCount: 4,
      ringInterval: 8,
      overlapColor: "#870000",

      axisValues: {},
      axisReactive: {},
      minReactThreshold: 0,
      maxReactThreshold: 100,

      soundCirclesEnabled: true,
      circleMax: 4,
      pointsMax: 4,
      sizeVariationMax: 0.7,
      scatterMin: 0,
      scatterMax: 30,
      contrast: 0.0,
      flicker: 0.3,
      speed: 0.25,
      flickerPhase: 0,
      bands: null,
      bandLoudness: 0,
      chaos: 0,

      hbFont: null,
      hbBuffer: null,
      hbFaceRef: null,

      tabButtonEl: null,
      ui: {},
    },
    overrides
  );
}

function applyDefaultAxesToBox(box) {
  box.axisValues = {};
  box.axisReactive = {};
  fvarAxes.forEach((axis) => {
    box.axisValues[axis.tag] = axis.default;
  });
  const wght = fvarAxes.find((a) => a.tag === "wght");
  if (wght) box.circleMax = Math.min(wght.max, Math.max(wght.min, box.circleMax));
}

function addBox() {
  const b = createBox({
    id: nextBoxId,
    label: `Text ${nextBoxId}`,
  });
  nextBoxId++;
  applyDefaultAxesToBox(b);
  boxes.push(b);
  activeBoxIndex = boxes.length - 1;
  buildTabBar();
  renderBoxSettingsUI();
}

function duplicateBox(index) {
  const src = boxes[index];
  const plain = JSON.parse(
    JSON.stringify({
      ...src,
      hbFont: undefined,
      hbBuffer: undefined,
      hbFaceRef: undefined,
      tabButtonEl: undefined,
      ui: undefined,
    })
  );
  const clone = createBox({
    ...plain,
    id: nextBoxId,
    label: src.label + " copy",
  });
  nextBoxId++;
  boxes.splice(index + 1, 0, clone);
  activeBoxIndex = index + 1;
  buildTabBar();
  renderBoxSettingsUI();
}

function removeBox(index) {
  if (boxes.length <= 1) return;
  boxes.splice(index, 1);
  activeBoxIndex = Math.max(0, Math.min(activeBoxIndex, boxes.length - 1));
  buildTabBar();
  renderBoxSettingsUI();
}

// SETUP FUNCTION:

function setup() {
  canvasHolderEl = select("#canvas-holder");
  panelEl = select("#panel");

  p5Canvas = createCanvas(CANVAS_W, CANVAS_H);
  p5Canvas.parent(canvasHolderEl);
  p5Canvas.elt.style.width = "";
  p5Canvas.elt.style.height = "";

  // Separate canvas on top of the p5 canvas for guides:
  guidesCanvas = document.createElement("canvas");
  guidesCanvas.className = "guides-overlay";
  canvasHolderEl.elt.appendChild(guidesCanvas);
  guidesCtx = guidesCanvas.getContext("2d");

  audioEl = createElement("audio");
  audioEl.hide();
  audioEl.parent(canvasHolderEl);
  audioEl.elt.addEventListener("ended", () => {
    playing = false;
    if (playButton) playButton.html("Play");
  });

  boxes = [createBox({ id: nextBoxId++, label: "Text 1" })];
  activeBoxIndex = 0;

  buildGlobalControls();
  loadFontFile(FONT_FILES[0]);
  updateTimelineRange();

  playStartMillis = millis();
}

// Controls:

function section(title, parent) {
  createElement("h3", title).parent(parent || panelEl);
}

function fieldRow(parent) {
  const row = createDiv("").parent(parent || panelEl);
  row.addClass("field-row");
  return row;
}

function fieldLabel(container, name, valueText) {
  const row = createDiv("").parent(container);
  row.addClass("field-label");
  createSpan(name).parent(row);
  if (valueText === undefined) return null;
  const v = createSpan(valueText).parent(row);
  v.addClass("val");
  return v;
}

function sliderField(parent, name, min, max, val, step, onChange, fmt) {
  const wrap = createDiv("").parent(parent);
  wrap.addClass("field");
  const valSpan = fieldLabel(wrap, name, fmt ? fmt(val) : String(val));
  const s = createSlider(min, max, val, step).parent(wrap);
  s.input(() => {
    const v = s.value();
    onChange(v);
    if (valSpan) valSpan.html(fmt ? fmt(v) : String(v));
  });
  return s;
}

function colorField(parent, name, initial, onChange) {
  const wrap = createDiv("").parent(parent);
  wrap.addClass("field");
  const valSpan = fieldLabel(wrap, name, String(initial).toUpperCase());

  // Free color picker; the palette colors show up as quick picks in its dropdown.
  const input = createElement("input").parent(wrap);
  input.attribute("type", "color");
  input.attribute("list", ensurePaletteDatalist());
  input.elt.value = String(initial).toLowerCase();
  input.elt.addEventListener("input", () => {
    const v = input.elt.value.toUpperCase();
    onChange(v);
    valSpan.html(v);
  });

  return input;
}

function ensurePaletteDatalist() {
  const id = "palette-colors";
  if (!document.getElementById(id)) {
    const list = document.createElement("datalist");
    list.id = id;
    PALETTE.forEach((c) => {
      const opt = document.createElement("option");
      opt.value = c.hex.toLowerCase();
      opt.label = c.name;
      list.appendChild(opt);
    });
    document.body.appendChild(list);
  }
  return id;
}

function setFieldOpacity(fieldEl, opacity) {
  if (fieldEl && fieldEl.elt && fieldEl.elt.parentElement) {
    fieldEl.elt.parentElement.style.opacity = opacity;
  }
}

function updateRenderModeUI(box) {
  const usesStroke = box.renderMode === "stroke" || box.renderMode === "fill-outline";
  const usesRings = box.renderMode === "rings";
  const usesOverlap = box.renderMode === "fill-evenodd";
  setFieldOpacity(box.ui.strokeWidthField, usesStroke || usesRings ? "1" : "0.4");
  setFieldOpacity(box.ui.ringCountField, usesRings ? "1" : "0.4");
  setFieldOpacity(box.ui.ringIntervalField, usesRings ? "1" : "0.4");
  setFieldOpacity(box.ui.overlapColorField, usesOverlap ? "1" : "0.4");
}

// Global Controls

function buildGlobalControls() {
  statusEl = createDiv("Loading font...");
  statusEl.addClass("status");
  statusEl.parent(panelEl);

  // Font source:
  section("Font");
  const fontWrap = createDiv("").parent(panelEl);
  fontWrap.addClass("field");
  fieldLabel(fontWrap, "Font file (shared by every text box, must be variable)");
  const fontSelect = createSelect().parent(fontWrap);
  FONT_FILES.forEach((f) => fontSelect.option(f));
  fontSelect.changed(() => loadFontFile(fontSelect.value()));

  const fileWrap = createDiv("").parent(panelEl);
  fileWrap.addClass("field");
  fieldLabel(fileWrap, "...or load a local variable font file");
  createFileInput((file) => {
    if (file && file.data) {
      currentFontPath = file.name;
      fetch(file.data)
        .then((r) => r.arrayBuffer())
        .then((buf) => onFontLoaded(buf, file.name));
    }
  }).parent(fileWrap);

  // Canvas-level settings:
  section("Canvas");
  colorField(panelEl, "Background", bgColor, (v) => (bgColor = v));
  const transparentCb = createCheckbox("Transparent background", transparentBg).parent(panelEl);
  transparentCb.style("color", "#ccc");
  transparentCb.style("font-size", "12px");
  transparentCb.style("margin-bottom", "10px");
  transparentCb.changed(() => {
    transparentBg = transparentCb.checked();
    p5Canvas.elt.classList.toggle("transparent-bg", transparentBg);
  });
  sliderField(panelEl, "Zoom (centered)", 1, 5, zoom, 0.01, (v) => (zoom = v), (v) => Number(v).toFixed(2) + "x");

  // Audio:
  section("Audio");
  audioStatusEl = createDiv("No audio loaded -- reactive axes will stay flat.");
  audioStatusEl.addClass("status");
  audioStatusEl.parent(panelEl);

  const audioFileWrap = createDiv("").parent(panelEl);
  audioFileWrap.addClass("field");
  fieldLabel(audioFileWrap, "Audio track");
  const audioInput = createFileInput((file) => {
    if (file && file.data) loadAudioFile(file);
  }).parent(audioFileWrap);
  audioInput.attribute("accept", "audio/*");

  sliderField(
    panelEl,
    "Sampling detail (samples/sec)",
    2,
    60,
    envelopeRate,
    1,
    (v) => {
      envelopeRate = Math.round(v);
      if (audioBuffer) computeEnvelope();
    }
  );

  soundMeterEl = createDiv("").parent(panelEl);
  soundMeterEl.addClass("status");

  // Text boxes (Tabs):
  section("Text boxes");
  tabBarEl = createDiv("").parent(panelEl);
  tabBarEl.id("tab-bar");
  boxSettingsEl = createDiv("").parent(panelEl);
  boxSettingsEl.id("box-settings");
  buildTabBar();
  renderBoxSettingsUI();

  // Margins & guides:
  buildGuidesControls();

  // Playback:
  section("Playback");
  let row = fieldRow(panelEl);
  const playWrap = createDiv("").parent(row);
  playWrap.addClass("field");
  playButton = createButton("Play").parent(playWrap).addClass("full-btn");
  playButton.mousePressed(togglePlay);
  const restartWrap = createDiv("").parent(row);
  restartWrap.addClass("field");
  createButton("Restart")
    .addClass("full-btn")
    .parent(restartWrap)
    .mousePressed(() => {
      currentT = 0;
      if (audioLoaded) audioEl.elt.currentTime = 0;
      playStartMillis = millis();
      timeSlider.value(0);
      if (scrubValEl) scrubValEl.html("0.00s");
    });

  const scrubWrap = createDiv("").parent(panelEl);
  scrubWrap.addClass("field");
  scrubValEl = fieldLabel(scrubWrap, "Timeline", "0.00s");
  timeSlider = createSlider(0, FALLBACK_DURATION, 0, 0.01).parent(scrubWrap);
  timeSlider.input(() => {
    playing = false;
    playButton.html("Play");
    if (audioLoaded) audioEl.elt.pause();
    currentT = timeSlider.value();
    if (audioLoaded) audioEl.elt.currentTime = currentT;
    scrubValEl.html(currentT.toFixed(2) + "s");
  });

  sliderField(panelEl, "Export FPS", 12, 60, fps, 1, (v) => (fps = Math.round(v)));

  // Export:
  section("Export");
  row = fieldRow(panelEl);
  const pngWrap = createDiv("").parent(row);
  pngWrap.addClass("field");
  createButton("Save as PNG").parent(pngWrap).addClass("full-btn").mousePressed(exportPNG);
  const svgWrap = createDiv("").parent(row);
  svgWrap.addClass("field");
  createButton("Save as SVG").parent(svgWrap).addClass("full-btn").mousePressed(exportSVG);
  createButton("Export PNG sequence").parent(panelEl).addClass("full-btn").mousePressed(exportPNGSequence);
  createButton("Record video (WebM, with audio)").parent(panelEl).addClass("full-btn").mousePressed(recordVideo);
}

// Margins & guides (UI):

function showCheckbox(parent, checked, onChange) {
  const cb = createCheckbox("Show", checked).parent(parent);
  cb.style("color", "#ccc");
  cb.style("font-size", "12px");
  cb.style("margin-bottom", "10px");
  cb.changed(() => onChange(cb.checked()));
  return cb;
}

function buildGuidesControls() {
  section("Margins");
  showCheckbox(panelEl, margins.show, (v) => (margins.show = v));
  let row = fieldRow(panelEl);
  sliderField(row, "Top", 0, CANVAS_H / 2, margins.top, 1, (v) => (margins.top = v));
  sliderField(row, "Bottom", 0, CANVAS_H / 2, margins.bottom, 1, (v) => (margins.bottom = v));
  row = fieldRow(panelEl);
  sliderField(row, "Left", 0, CANVAS_W / 2, margins.left, 1, (v) => (margins.left = v));
  sliderField(row, "Right", 0, CANVAS_W / 2, margins.right, 1, (v) => (margins.right = v));
  colorField(panelEl, "Color", margins.color, (v) => (margins.color = v));

  section("Grid");
  showCheckbox(panelEl, grid.show, (v) => (grid.show = v));
  const gridRow = fieldRow(panelEl);
  sliderField(gridRow, "Rows", 1, 24, grid.rows, 1, (v) => (grid.rows = Math.round(v)));
  sliderField(gridRow, "Columns", 1, 24, grid.columns, 1, (v) => (grid.columns = Math.round(v)));
  colorField(panelEl, "Grid color", grid.color, (v) => (grid.color = v));

  section("Custom guide lines");
  guideTabBarEl = createDiv("").parent(panelEl);
  guideTabBarEl.id("guide-tab-bar");
  guideSettingsEl = createDiv("").parent(panelEl);
  guideSettingsEl.id("guide-settings");
  buildGuideTabBar();
  renderGuideSettingsUI();
}

function addGuide() {
  guides.push({
    id: nextGuideId,
    label: `Guide ${nextGuideId}`,
    show: false,
    orientation: "horizontal",
    position: Math.round(CANVAS_H / 2),
    color: GUIDE_COLOR,
  });
  nextGuideId++;
  activeGuideIndex = guides.length - 1;
  buildGuideTabBar();
  renderGuideSettingsUI();
}

function removeGuide(index) {
  guides.splice(index, 1);
  activeGuideIndex = Math.max(0, Math.min(activeGuideIndex, guides.length - 1));
  buildGuideTabBar();
  renderGuideSettingsUI();
}

function buildGuideTabBar() {
  guideTabBarEl.html("");
  guides.forEach((g, i) => {
    const btn = createButton(g.label).parent(guideTabBarEl);
    if (i === activeGuideIndex) btn.addClass("tab-active");
    btn.mousePressed(() => {
      activeGuideIndex = i;
      buildGuideTabBar();
      renderGuideSettingsUI();
    });
  });
  const addBtn = createButton("+ Add").parent(guideTabBarEl);
  addBtn.addClass("tab-add");
  addBtn.mousePressed(addGuide);
}

function renderGuideSettingsUI() {
  guideSettingsEl.html("");
  const g = guides[activeGuideIndex];
  guideSettingsEl.style("display", g ? "block" : "none");
  if (!g) return;

  const row = fieldRow(guideSettingsEl);
  const showWrap = createDiv("").parent(row);
  showWrap.addClass("field");
  showCheckbox(showWrap, g.show, (v) => (g.show = v));
  const removeWrap = createDiv("").parent(row);
  removeWrap.addClass("field");
  createButton("Remove")
    .addClass("full-btn")
    .parent(removeWrap)
    .mousePressed(() => removeGuide(activeGuideIndex));

  const orientWrap = createDiv("").parent(guideSettingsEl);
  orientWrap.addClass("field");
  fieldLabel(orientWrap, "Orientation");
  const orientSelect = createSelect().parent(orientWrap);
  orientSelect.option("Horizontal", "horizontal");
  orientSelect.option("Vertical", "vertical");
  orientSelect.selected(g.orientation);
  orientSelect.changed(() => {
    g.orientation = orientSelect.value();
    const max = g.orientation === "horizontal" ? CANVAS_H : CANVAS_W;
    g.position = Math.min(g.position, max);
    renderGuideSettingsUI();
  });

  const horizontal = g.orientation === "horizontal";
  sliderField(guideSettingsEl, horizontal ? "Position (y)" : "Position (x)", 0, horizontal ? CANVAS_H : CANVAS_W, g.position, 1, (v) => (g.position = v));
  colorField(guideSettingsEl, "Color", g.color, (v) => (g.color = v));
}

// Tabs:

function buildTabBar() {
  tabBarEl.html("");
  boxes.forEach((box, i) => {
    const btn = createButton(box.label).parent(tabBarEl);
    btn.addClass("tab-btn");
    if (i === activeBoxIndex) btn.addClass("tab-active");
    btn.mousePressed(() => {
      activeBoxIndex = i;
      buildTabBar();
      renderBoxSettingsUI();
    });
    box.tabButtonEl = btn;
  });

  const addBtn = createButton("+ Add").parent(tabBarEl);
  addBtn.addClass("tab-add");
  addBtn.mousePressed(addBox);
}

// Box forms:

function renderBoxSettingsUI() {
  boxSettingsEl.html("");
  const box = boxes[activeBoxIndex];
  if (!box) return;
  box.ui = {};

  let row = fieldRow(boxSettingsEl);
  const nameWrap = createDiv("").parent(row);
  nameWrap.addClass("field");
  fieldLabel(nameWrap, "Tab name");
  const nameInput = createInput(box.label, "text").parent(nameWrap);
  nameInput.input(() => {
    box.label = nameInput.value() || box.label;
    if (box.tabButtonEl) box.tabButtonEl.html(box.label);
  });

  const actionsWrap = createDiv("").parent(row);
  actionsWrap.addClass("field");
  fieldLabel(actionsWrap, " ");
  createButton("Duplicate")
    .parent(actionsWrap)
    .mousePressed(() => duplicateBox(activeBoxIndex));
  createButton("Remove")
    .parent(actionsWrap)
    .mousePressed(() => removeBox(activeBoxIndex));

  buildTextSectionForBox(box, boxSettingsEl);
  buildLayoutSectionForBox(box, boxSettingsEl);
  buildAnimationSectionForBox(box, boxSettingsEl);
  buildSoundCirclesSectionForBox(box, boxSettingsEl);
  buildRenderSectionForBox(box, boxSettingsEl);
}

function buildTextSectionForBox(box, parent) {
  section("Text", parent);
  const textWrap = createDiv("").parent(parent);
  textWrap.addClass("field");
  const ta = createElement("textarea", box.uiText).parent(textWrap);
  ta.attribute("rows", 4);
  ta.input(() => (box.uiText = ta.value()));
}

function buildLayoutSectionForBox(box, parent) {
  section("Layout", parent);
  let row = fieldRow(parent);
  sliderField(row, "Font size", 20, 1000, box.fontSize, 1, (v) => (box.fontSize = v));
  sliderField(row, "Line height", 40, 1000, box.lineHeight, 1, (v) => (box.lineHeight = v));
  row = fieldRow(parent);
  sliderField(row, "X", -1440, CANVAS_W, box.offsetX, 1, (v) => (box.offsetX = v));
  sliderField(row, "Y", -1080, CANVAS_H, box.offsetY, 1, (v) => (box.offsetY = v));
  sliderField(parent, "Kerning", -500, 1000, box.kerning, 1, (v) => (box.kerning = v));
}

function buildAnimationSectionForBox(box, parent) {
  section("Variable Font Settings", parent);

  const note = createDiv("").addClass("axis-note").parent(parent);

  if (!fvarAxes.length) {
    note.html("This font has no variable axes (already a static instance) -- nothing to animate.");
    return;
  }

  fvarAxes.forEach((axis) => {
    if (!(axis.tag in box.axisValues)) box.axisValues[axis.tag] = axis.default;
    const axisName = axis.tag;
    const step = (axis.max - axis.min) / 200 || 0.1;

    const rowEl = createDiv("").addClass("axis-row").parent(parent);

    const sliderWrap = createDiv("").parent(rowEl);
    sliderWrap.addClass("field");
    const valSpan = fieldLabel(sliderWrap, `${axisName}`, Number(box.axisValues[axis.tag]).toFixed(2));
    const s = createSlider(axis.min, axis.max, box.axisValues[axis.tag], step).parent(sliderWrap);
    s.input(() => {
      const v = s.value();
      box.axisValues[axis.tag] = v;
      if (valSpan) valSpan.html(Number(v).toFixed(2));
    });

    if (axis.tag === "wght") return;

    const reactWrap = createDiv("").parent(rowEl);
    const reactLabel = createElement("label", "").addClass("axis-checkbox-label").parent(reactWrap);
    const reactCheckbox = createElement("input").parent(reactLabel);
    reactCheckbox.attribute("type", "checkbox");
    if (box.axisReactive[axis.tag]) reactCheckbox.attribute("checked", "checked");
    reactCheckbox.elt.addEventListener("change", () => {
      box.axisReactive[axis.tag] = reactCheckbox.elt.checked;
    });
    createSpan("React").parent(reactLabel);
  });

  const row = fieldRow(parent);
  sliderField(row, "Min reactivity (%)", 0, 100, box.minReactThreshold, 1, (v) => (box.minReactThreshold = v));
  sliderField(row, "Max reactivity (%)", 0, 100, box.maxReactThreshold, 1, (v) => (box.maxReactThreshold = v));
}

// Scatter -- animation:
function buildSoundCirclesSectionForBox(box, parent) {
  section("Animation -- Scatter", parent);

  const toggle = createCheckbox("Enable", box.soundCirclesEnabled).parent(parent);
  toggle.style("color", "#ccc");
  toggle.style("font-size", "12px");
  toggle.style("margin-bottom", "10px");

  const fieldsWrap = createDiv("").parent(parent);
  fieldsWrap.style("opacity", box.soundCirclesEnabled ? "1" : "0.4");
  toggle.changed(() => {
    box.soundCirclesEnabled = toggle.checked();
    fieldsWrap.style("opacity", box.soundCirclesEnabled ? "1" : "0.4");
  });

  let row = fieldRow(fieldsWrap);
  const wght = fvarAxes.find((a) => a.tag === "wght");
  if (wght) {
    const step = (wght.max - wght.min) / 200 || 0.1;
    sliderField(row, "wght loud", wght.min, wght.max, box.circleMax, step, (v) => (box.circleMax = v), (v) => Number(v).toFixed(2));
  }
  sliderField(row, "Points loud", 1, 10, box.pointsMax, 1, (v) => (box.pointsMax = Math.round(v)));

  row = fieldRow(fieldsWrap);
  sliderField(row, "Size variation loud", 0, 1, box.sizeVariationMax, 0.05, (v) => (box.sizeVariationMax = v), (v) => Number(v).toFixed(2));
  sliderField(row, "Contrast", 0, 5, box.contrast, 0.1, (v) => (box.contrast = v), (v) => Number(v).toFixed(1));

  row = fieldRow(fieldsWrap);
  sliderField(row, "Scatter quiet", 0, 10, box.scatterMin, 0.1, (v) => (box.scatterMin = v), (v) => Number(v).toFixed(1));
  sliderField(row, "Scatter loud", 0, 100, box.scatterMax, 1, (v) => (box.scatterMax = v));

  row = fieldRow(fieldsWrap);
  sliderField(row, "Static flicker", 0, 3, box.flicker, 0.05, (v) => (box.flicker = v), (v) => Number(v).toFixed(2));
  sliderField(row, "Reactivity speed", 0.01, 1, box.speed, 0.01, (v) => (box.speed = v), (v) => Number(v).toFixed(2));
}

function buildRenderSectionForBox(box, parent) {
  section("Render", parent);
  const modeWrap = createDiv("").parent(parent);
  modeWrap.addClass("field");
  fieldLabel(modeWrap, "Mode");
  const modeSelect = createSelect().parent(modeWrap);
  modeSelect.option("Outline-only", "stroke");
  modeSelect.option("Fill-only", "fill-nonzero");
  modeSelect.option("Fill-only (Overlap)", "fill-evenodd");
  modeSelect.option("Fill + outline", "fill-outline");
  modeSelect.option("Rings", "rings");
  modeSelect.selected(box.renderMode);
  modeSelect.changed(() => {
    box.renderMode = modeSelect.value();
    updateRenderModeUI(box);
  });

  box.ui.strokeWidthField = sliderField(parent, "Stroke width", 0.5, 12, box.strokeThickness, 0.5, (v) => (box.strokeThickness = v));

  let row = fieldRow(parent);
  box.ui.ringCountField = sliderField(row, "Ring count", 1, 12, box.ringCount, 1, (v) => (box.ringCount = Math.round(v)));
  box.ui.ringIntervalField = sliderField(row, "Ring interval (px)", 1, 40, box.ringInterval, 1, (v) => (box.ringInterval = v));

  row = fieldRow(parent);
  colorField(row, "Stroke", box.strokeColor, (v) => (box.strokeColor = v));
  colorField(row, "Fill", box.fillColor, (v) => (box.fillColor = v));

  box.ui.overlapColorField = colorField(parent, "Overlap color", box.overlapColor, (v) => (box.overlapColor = v));

  updateRenderModeUI(box);
}

// Font Load:

function loadFontFile(path) {
  currentFontPath = path;
  statusEl.html(`Loading ${path} ...`);
  fetch(path)
    .then((r) => {
      if (!r.ok) throw new Error(`HTTP ${r.status}`);
      return r.arrayBuffer();
    })
    .then((buf) => onFontLoaded(buf, path))
    .catch((err) => {
      statusEl.html(
        `Could not load ${path} (${err.message}). If you opened this file ` +
          `directly (file://), serve the folder instead, e.g. ` +
          `"python3 -m http.server" then open this page over http.`
      );
    });
}

function onFontLoaded(buf, name) {
  hbReady
    .then(() => {
      const blob = new HB.Blob(buf);
      const face = new HB.Face(blob, 0);
      hbFace = face;
      fvarAxes = Object.values(face.getAxisInfos());
      statusEl.html(
        `Loaded ${name} -- upem ${face.upem}, ${fvarAxes.length} ${fvarAxes.length === 1 ? "axis" : "axes"}`
      );
      for (const box of boxes) {
        box.hbFont = null;
        box.hbBuffer = null;
        box.hbFaceRef = null;
        applyDefaultAxesToBox(box);
      }
      renderBoxSettingsUI();
    })
    .catch((err) => {
      statusEl.html(`Failed to parse ${name}: ${err.message}`);
    });
}

// HarfBuzz helpers:

function ensureHbFontForBox(box) {
  if (!hbFace) return null;
  if (!box.hbFont || box.hbFaceRef !== hbFace) {
    box.hbFont = new HB.Font(hbFace);
    box.hbBuffer = new HB.Buffer();
    box.hbFaceRef = hbFace;
  }
  return box.hbFont;
}

function shapeText(box, font, text) {
  box.hbBuffer.clearContents();
  box.hbBuffer.addText(text);
  box.hbBuffer.guessSegmentProperties();
  HB.shape(font, box.hbBuffer);
  return box.hbBuffer.getGlyphInfosAndPositions();
}

// Sound reactivity:

function currentAxisValue(box, axis, env01) {
  const base = box.axisValues[axis.tag] !== undefined ? box.axisValues[axis.tag] : axis.default;
  if (axis.tag === "wght" || !box.axisReactive[axis.tag]) return base;
  const minT = box.minReactThreshold / 100;
  const maxT = box.maxReactThreshold / 100;
  const span = Math.max(1e-6, maxT - minT);
  const factor = Math.min(1, Math.max(0, (env01 - minT) / span));
  return base + (axis.max - base) * factor;
}

function setBoxVariations(box, font, env01, wghtOverride) {
  if (!fvarAxes.length) return;
  font.setVariations(
    fvarAxes.map((axis) => {
      const v = axis.tag === "wght" && wghtOverride !== undefined ? wghtOverride : currentAxisValue(box, axis, env01);
      return new HB.Variation(axis.tag, v);
    })
  );
}

// Positions of every glyph:
function layoutBoxGlyphs(box, font) {
  const lines = getWrappedLines(box, font);
  const trackingPx = (box.kerning / 1000) * box.fontSize;

  const placed = [];
  let y = box.offsetY;
  for (const line of lines) {
    if (line.length > 0) {
      const infos = shapeText(box, font, line);
      let x = box.offsetX;
      for (const g of infos) {
        placed.push({ codepoint: g.codepoint, originX: x + g.xOffset, originY: y - g.yOffset });
        x += g.xAdvance + trackingPx;
      }
    }
    y += box.lineHeight;
  }
  return placed;
}

function placedGlyphOps(font, placed) {
  const ops = [];
  for (const p of placed) {
    const cmds = font.glyphToJson(p.codepoint);
    for (const c of cmds) {
      const pts = [];
      for (let i = 0; i < c.values.length; i += 2) {
        pts.push([p.originX + c.values[i], p.originY - c.values[i + 1]]);
      }
      const op = { type: c.type, pts };
      if (c.type === "M") op.baseY = p.originY;
      ops.push(op);
    }
  }
  return ops;
}

function buildBoxContours(box, t) {
  const font = ensureHbFontForBox(box);
  if (!font) return [];
  const env01 = getEnvelopeAt(t);
  font.setScale(box.fontSize, box.fontSize);
  setBoxVariations(box, font, env01);

  const placed = layoutBoxGlyphs(box, font);
  const quiet = splitContours(placedGlyphOps(font, placed));
  if (!box.soundCirclesEnabled) return quiet;

  const extents = font.hExtents();
  let loud = null;
  if (fvarAxes.some((a) => a.tag === "wght")) {
    setBoxVariations(box, font, env01, box.circleMax);
    loud = splitContours(placedGlyphOps(font, placed));
  }
  return applySoundCircles(box, quiet, loud, extents);
}

function measureTextWidth(box, font, text) {
  if (!text) return 0;
  const infos = shapeText(box, font, text);
  const trackingPx = (box.kerning / 1000) * box.fontSize;
  let w = 0;
  for (const g of infos) w += g.xAdvance + trackingPx;
  return w;
}

function wrapParagraph(box, font, paragraph, maxWidth) {
  if (paragraph.length === 0) return [""];
  const words = paragraph.split(" ");
  const lines = [];
  let cur = "";
  for (const word of words) {
    const test = cur ? cur + " " + word : word;
    const w = measureTextWidth(box, font, test);
    if (w > maxWidth && cur) {
      lines.push(cur);
      cur = word;
    } else {
      cur = test;
    }
  }
  lines.push(cur);
  return lines;
}

function getWrappedLines(box, font) {
  const maxWidth = Math.max(20, CANVAS_W - box.offsetX - WRAP_RIGHT_PADDING);
  const paragraphs = box.uiText.split("\n");
  let result = [];
  for (const p of paragraphs) {
    result = result.concat(wrapParagraph(box, font, p, maxWidth));
  }
  return result;
}

// Audio loading + envelope extraction:

function ensureAudioCtx() {
  if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  return audioCtx;
}

function loadAudioFile(file) {
  audioStatusEl.html(`Loading ${file.name} ...`);
  audioLoaded = false;

  fetch(file.data)
    .then((r) => r.arrayBuffer())
    .then((buf) => {
      const blob = new Blob([buf], { type: file.type || "audio/mpeg" });
      const url = URL.createObjectURL(blob);
      audioEl.elt.src = url;
      audioEl.elt.load();

      const metadataReady = new Promise((resolve) => {
        audioEl.elt.onloadedmetadata = () => resolve();
      });

      const ctx = ensureAudioCtx();
      const decodePromise = ctx.decodeAudioData(buf.slice(0));

      return Promise.all([metadataReady, decodePromise]);
    })
    .then(([, decoded]) => {
      audioBuffer = decoded;
      quietLevel = 1;
      loudLevel = 0;
      audioDuration = audioEl.elt.duration;
      computeEnvelope();
      audioLoaded = true;
      updateTimelineRange();
      audioStatusEl.html(`Loaded ${file.name} -- ${audioDuration.toFixed(2)}s`);
    })
    .catch((err) => {
      audioStatusEl.html(`Failed to load audio: ${err.message}`);
    });
}

function computeEnvelope() {
  if (!audioBuffer) {
    envelope = null;
    return;
  }
  const rate = envelopeRate;
  const sr = audioBuffer.sampleRate;
  const numChannels = audioBuffer.numberOfChannels;
  const chData = [];
  for (let c = 0; c < numChannels; c++) chData.push(audioBuffer.getChannelData(c));

  const totalSamples = chData[0].length;
  const windowSec = 1 / rate;
  const numWindows = Math.max(2, Math.ceil(audioBuffer.duration * rate) + 1);
  const env = new Float32Array(numWindows);
  let peak = 1e-6;

  for (let i = 0; i < numWindows; i++) {
    const startSample = Math.floor(i * windowSec * sr);
    const endSample = Math.min(totalSamples, Math.floor((i + 1) * windowSec * sr));
    let sumSq = 0;
    let count = 0;
    for (let s = startSample; s < endSample; s++) {
      let v = 0;
      for (let c = 0; c < numChannels; c++) v += chData[c][s];
      v /= numChannels;
      sumSq += v * v;
      count++;
    }
    const rms = count > 0 ? Math.sqrt(sumSq / count) : 0;
    env[i] = rms;
    if (rms > peak) peak = rms;
  }
  for (let i = 0; i < env.length; i++) env[i] = Math.min(1, env[i] / peak);
  envelope = env;
}

function getEnvelopeAt(t) {
  if (!envelope || envelope.length === 0) return 0;
  const pos = Math.max(0, Math.min(envelope.length - 1, t * envelopeRate));
  const i0 = Math.floor(pos);
  const i1 = Math.min(envelope.length - 1, i0 + 1);
  const frac = pos - i0;
  return envelope[i0] * (1 - frac) + envelope[i1] * frac;
}

// Frequency analysis:
function ensureAudioGraph() {
  const ctx = ensureAudioCtx();
  if (!audioSourceNode) {
    audioSourceNode = ctx.createMediaElementSource(audioEl.elt);
    audioSourceNode.connect(ctx.destination);
  }
  if (!analyser) {
    analyser = ctx.createAnalyser();
    analyser.fftSize = 2048; // 1024 bands
    analyser.smoothingTimeConstant = 0.8;
    audioSourceNode.connect(analyser);
  }
}

function updateSound() {
  if (playing && audioLoaded && analyser) {
    analyser.getByteFrequencyData(spectrum);
    stepSound();
  } else if (!audioLoaded) {
    for (const box of boxes) box.chaos = 0;
  }

  if (soundMeterEl) {
    const box = boxes[activeBoxIndex];
    soundMeterEl.html(
      `Sound level: ${loudness.toFixed(2)} (quietest ${Math.min(quietLevel, loudLevel).toFixed(2)}, ` +
        `loudest ${loudLevel.toFixed(2)}) -- chaos (${box ? box.label : ""}): ${box ? box.chaos.toFixed(2) : "0.00"}`
    );
  }
}

// One step of the sound smoothing, from whatever is currently in `spectrum`:
function stepSound() {
  let sum = 0;
  for (let i = 0; i < BAND_RANGE; i++) sum += spectrum[i];
  loudness = sum / BAND_RANGE / 255;

  if (loudness < quietLevel) quietLevel = loudness;
  else quietLevel += (loudness - quietLevel) * ADAPT_SPEED;
  if (loudness > loudLevel) loudLevel = loudness;
  else loudLevel += (loudness - loudLevel) * ADAPT_SPEED;

  const range = Math.max(loudLevel - quietLevel, 0.05);
  const level = Math.min(1, Math.max(0, (loudness - quietLevel) / range));

  for (const box of boxes) {
    const target = Math.pow(level, box.contrast);

    box.chaos += (target - box.chaos) * (target > box.chaos ? 0.4 : 0.1) * box.speed;

    const bands = getBoxBands(box);
    for (let i = 0; i < BAND_RANGE; i++) bands[i] += (spectrum[i] / 255 - bands[i]) * box.speed;
    box.bandLoudness += (loudness - box.bandLoudness) * box.speed;

    box.flickerPhase += box.speed;
  }
}

function getBoxBands(box) {
  if (!(box.bands instanceof Float32Array)) box.bands = new Float32Array(BAND_RANGE);
  return box.bands;
}

function flickerTarget(boxId, pointIndex, step) {
  const r = seededRandom((boxId * 73856093) ^ (pointIndex * 19349663) ^ (step * 83492791));
  const angle = r() * Math.PI * 2;
  const dist = r();
  return [Math.cos(angle) * dist, Math.sin(angle) * dist];
}

function seededRandom(seed) {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function applySoundCircles(box, quiet, loud, extents) {
  const rand = seededRandom(box.id);
  const bands = getBoxBands(box);
  
  const fStep = Math.floor(box.flickerPhase);
  let fT = box.flickerPhase - fStep;
  fT = fT * fT * (3 - 2 * fT);
  const upem = hbFace ? hbFace.upem : 1000;
  const gridStep = (GRID_UNITS * box.fontSize) / upem;
  const asc = extents.ascender;
  const desc = extents.descender;
  const matching = loud && loud.length === quiet.length;
  const out = [];

  for (let i = 0; i < quiet.length; i++) {
    const q = quiet[i];
    const [qx, qy] = contourCentroid(q);

    const bandOffset = rand() * 0.3 - 0.15;

    const baseY = q.baseY !== undefined ? q.baseY : qy;
    const h = asc - desc !== 0 ? (baseY - qy - desc) / (asc - desc) : 0.5;

    const band = Math.floor(Math.min(1, Math.max(0, h + bandOffset)) * (BAND_RANGE - 1));

    const difference = bands[band] - box.bandLoudness;
    const c = Math.min(1, Math.max(0, box.chaos * (1 + difference * 3)));

    const flicker = box.flicker * gridStep * bands[band];

    const base = matching ? lerpContour(q, loud[i], c) : q;
    const [cx, cy] = contourCentroid(base);

    const points = 1 + (box.pointsMax - 1) * c;
    const sizeVariation = c * box.sizeVariationMax;
    const scatter = (box.scatterMin + (box.scatterMax - box.scatterMin) * c) * gridStep;

    for (let k = 0; k < box.pointsMax; k++) {
      const angle = rand() * Math.PI * 2;

      const distance = Math.pow(rand(), 3);
      const sizeChange = (rand() * 2 - 1) * sizeVariation;

      if (k >= points) continue;

      const dx = Math.cos(angle) * distance * scatter;
      const dy = Math.sin(angle) * distance * scatter;

      // Flicker:
      let fx = 0;
      let fy = 0;
      if (flicker > 0) {
        const pointIndex = i * 16 + k;
        const a = flickerTarget(box.id, pointIndex, fStep);
        const b = flickerTarget(box.id, pointIndex, fStep + 1);
        fx = (a[0] + (b[0] - a[0]) * fT) * flicker;
        fy = (a[1] + (b[1] - a[1]) * fT) * flicker;
      }
      out.push(transformContourCopy(base, cx, cy, 1 + sizeChange, dx + fx, dy + fy));
    }
  }
  return out;
}

function lerpContour(a, b, f) {
  if (f <= 0) return a;
  const lp = (p, q) => [p[0] + (q[0] - p[0]) * f, p[1] + (q[1] - p[1]) * f];
  return {
    baseY: a.baseY,
    anchors: a.anchors.map((p, i) => (b.anchors[i] ? lp(p, b.anchors[i]) : p)),
    ops: a.ops.map((op, i) => {
      const o = b.ops[i];
      if (!o || o.type !== op.type) return op;
      return { type: op.type, pts: op.pts.map((p, j) => lp(p, o.pts[j])) };
    }),
  };
}

// Playback:

function updateTimelineRange() {
  const dur = audioLoaded ? audioDuration : FALLBACK_DURATION;
  timeSlider.elt.max = dur;
}

function togglePlay() {
  playing = !playing;
  if (playing) {
    if (audioLoaded) {
      const ctx = ensureAudioCtx();
      if (ctx.state === "suspended") ctx.resume();
      ensureAudioGraph();
      audioEl.elt.currentTime = currentT;
      audioEl.elt.play();
    } else {
      playStartMillis = millis() - currentT * 1000;
    }
    playButton.html("Pause");
  } else {
    if (audioLoaded) audioEl.elt.pause();
    playButton.html("Play");
  }
}

function updatePlaybackClock() {
  if (!playing) return;

  if (audioLoaded) {
    currentT = audioEl.elt.currentTime;
    if (audioEl.elt.ended || currentT >= audioDuration - 0.01) {
      currentT = audioDuration;
      playing = false;
      playButton.html("Play");
    }
  } else {
    currentT = (millis() - playStartMillis) / 1000;
    if (currentT >= FALLBACK_DURATION) {
      currentT = FALLBACK_DURATION;
      playing = false;
      playButton.html("Play");
    }
  }

  timeSlider.value(currentT);
  if (scrubValEl) scrubValEl.html(currentT.toFixed(2) + "s");
}

// DRAW FUNCTION:

function draw() {
  updatePlaybackClock();
  updateSound();
  drawGuides();
  renderFrame();
}

function renderFrame() {
  if (transparentBg) clear();
  else background(bgColor);

  if (!hbFace) return;

  const ctx = drawingContext;
  ctx.save();
  ctx.translate(CANVAS_W / 2, CANVAS_H / 2);
  ctx.scale(zoom, zoom);
  ctx.translate(-CANVAS_W / 2, -CANVAS_H / 2);

  for (const box of boxes) {
    renderBox(ctx, box, currentT);
  }

  ctx.restore();
}

// Margins & guides:

// Overlay
function syncGuidesCanvas() {
  const c = p5Canvas.elt;
  const w = c.clientWidth;
  const h = c.clientHeight;
  const dpr = window.devicePixelRatio || 1;
  guidesCanvas.style.left = c.offsetLeft + "px";
  guidesCanvas.style.top = c.offsetTop + "px";
  guidesCanvas.style.width = w + "px";
  guidesCanvas.style.height = h + "px";
  const pw = Math.round(w * dpr);
  const ph = Math.round(h * dpr);
  if (guidesCanvas.width !== pw || guidesCanvas.height !== ph) {
    guidesCanvas.width = pw;
    guidesCanvas.height = ph;
  }
  return { sx: pw / CANVAS_W, sy: ph / CANVAS_H, dpr };
}

function drawGuides() {
  if (!guidesCanvas) return;
  const { sx, sy, dpr } = syncGuidesCanvas();
  const ctx = guidesCtx;
  ctx.clearRect(0, 0, guidesCanvas.width, guidesCanvas.height);
  ctx.lineWidth = dpr; // 1 px on screen

  // Snapping to the pixel grid
  const snap = (v) => Math.round(v) + (Math.round(dpr) % 2 ? 0.5 : 0);
  const hLine = (y, color) => {
    const py = snap(y * sy);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(0, py);
    ctx.lineTo(guidesCanvas.width, py);
    ctx.stroke();
  };
  const vLine = (x, color) => {
    const px = snap(x * sx);
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(px, 0);
    ctx.lineTo(px, guidesCanvas.height);
    ctx.stroke();
  };

  if (margins.show) {
    hLine(margins.top, margins.color);
    hLine(CANVAS_H - margins.bottom, margins.color);
    vLine(margins.left, margins.color);
    vLine(CANVAS_W - margins.right, margins.color);
  }
  if (grid.show) {
    const x0 = margins.left;
    const x1 = CANVAS_W - margins.right;
    const y0 = margins.top;
    const y1 = CANVAS_H - margins.bottom;
    for (let i = 1; i < grid.rows; i++) hLine(y0 + ((y1 - y0) * i) / grid.rows, grid.color);
    for (let i = 1; i < grid.columns; i++) vLine(x0 + ((x1 - x0) * i) / grid.columns, grid.color);
  }

  for (const g of guides) {
    if (!g.show) continue;
    if (g.orientation === "horizontal") hLine(g.position, g.color);
    else vLine(g.position, g.color);
  }
}

function opsToCanvasPath(ctx, ops) {
  ctx.beginPath();
  for (const op of ops) {
    const p = op.pts;
    if (op.type === "M") ctx.moveTo(p[0][0], p[0][1]);
    else if (op.type === "L") ctx.lineTo(p[0][0], p[0][1]);
    else if (op.type === "Q") ctx.quadraticCurveTo(p[0][0], p[0][1], p[1][0], p[1][1]);
    else if (op.type === "C") ctx.bezierCurveTo(p[0][0], p[0][1], p[1][0], p[1][1], p[2][0], p[2][1]);
    else if (op.type === "Z") ctx.closePath();
  }
}

function ensureOverlapMaskCanvas() {
  if (!overlapMaskCanvas) {
    overlapMaskCanvas = document.createElement("canvas");
    overlapMaskCanvas.width = CANVAS_W;
    overlapMaskCanvas.height = CANVAS_H;
    overlapMaskCtx = overlapMaskCanvas.getContext("2d");
  }
}

function fillWithOverlapHighlight(ctx, box, ops) {

  ctx.fillStyle = box.fillColor;
  opsToCanvasPath(ctx, ops);
  ctx.fill("nonzero");

  ensureOverlapMaskCanvas();
  const mctx = overlapMaskCtx;
  mctx.clearRect(0, 0, CANVAS_W, CANVAS_H);

  mctx.globalCompositeOperation = "source-over";
  mctx.fillStyle = "#fff";
  opsToCanvasPath(mctx, ops);
  mctx.fill("nonzero");

  mctx.globalCompositeOperation = "destination-out";
  opsToCanvasPath(mctx, ops);
  mctx.fill("evenodd");

  mctx.globalCompositeOperation = "source-in";
  mctx.fillStyle = box.overlapColor;
  mctx.fillRect(0, 0, CANVAS_W, CANVAS_H);
  mctx.globalCompositeOperation = "source-over";

  ctx.drawImage(overlapMaskCanvas, 0, 0);
}

// Render modes:

function renderBox(ctx, box, t) {
  const contours = buildBoxContours(box, t);
  if (contours.length === 0) return;

  if (box.renderMode === "rings") {
    drawRingsMode(ctx, box, contours);
    return;
  }

  const finalOps = contours.flatMap((c) => c.ops);

  if (box.renderMode === "fill-evenodd") {
    fillWithOverlapHighlight(ctx, box, finalOps);
    return;
  }

  const doFill = box.renderMode === "fill-nonzero" || box.renderMode === "fill-outline";
  const doStroke = box.renderMode === "stroke" || box.renderMode === "fill-outline";

  if (doFill) {
    ctx.fillStyle = box.fillColor;
    opsToCanvasPath(ctx, finalOps);
    ctx.fill("nonzero");
  }

  if (doStroke) {
    ctx.lineWidth = box.strokeThickness;
    ctx.strokeStyle = box.strokeColor;
    ctx.lineJoin = "round";
    ctx.lineCap = "round";
    opsToCanvasPath(ctx, finalOps);
    ctx.stroke();
  }
}

function splitContours(ops) {
  const contours = [];
  let cur = null;
  for (const op of ops) {
    if (op.type === "M") {
      if (cur) contours.push(cur);
      cur = { anchors: [], ops: [], baseY: op.baseY };
    }
    if (!cur) continue;
    cur.ops.push(op);
    if (op.pts.length) cur.anchors.push(op.pts[op.pts.length - 1]);
  }
  if (cur) contours.push(cur);
  return contours;
}

function contourCentroid(contour) {
  const n = contour.anchors.length || 1;
  let cx = 0,
    cy = 0;
  for (const [x, y] of contour.anchors) {
    cx += x;
    cy += y;
  }
  return [cx / n, cy / n];
}

function transformContourCopy(contour, cx, cy, scale, dx, dy) {
  const xf = ([x, y]) => [(x - cx) * scale + cx + dx, (y - cy) * scale + cy + dy];
  return {
    anchors: contour.anchors.map(xf),
    ops: contour.ops.map((op) => ({ type: op.type, pts: op.pts.map(xf) })),
  };
}

function pushRadial(x, y, cx, cy, offset) {
  if (offset === 0) return [x, y];
  const dx = x - cx;
  const dy = y - cy;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  const scale = (len + offset) / len;
  return [cx + dx * scale, cy + dy * scale];
}

function drawRingsMode(ctx, box, contours) {

  ctx.lineWidth = box.strokeThickness;
  ctx.strokeStyle = box.strokeColor;
  ctx.lineJoin = "round";
  ctx.lineCap = "round";

  for (const contour of contours) {
    const [cx, cy] = contourCentroid(contour);
    for (let k = 0; k < box.ringCount; k++) {
      const offset = k * box.ringInterval;
      ctx.beginPath();
      for (const op of contour.ops) {
        const p = op.pts.map(([x, y]) => pushRadial(x, y, cx, cy, offset));
        if (op.type === "M") ctx.moveTo(p[0][0], p[0][1]);
        else if (op.type === "L") ctx.lineTo(p[0][0], p[0][1]);
        else if (op.type === "Q") ctx.quadraticCurveTo(p[0][0], p[0][1], p[1][0], p[1][1]);
        else if (op.type === "C") ctx.bezierCurveTo(p[0][0], p[0][1], p[1][0], p[1][1], p[2][0], p[2][1]);
        else if (op.type === "Z") ctx.closePath();
      }
      ctx.stroke();
    }
  }
}

function ringsToSVGD(box, contours) {
  const parts = [];
  for (const contour of contours) {
    const [cx, cy] = contourCentroid(contour);
    for (let k = 0; k < box.ringCount; k++) {
      const offset = k * box.ringInterval;
      for (const op of contour.ops) {
        const p = op.pts.map(([x, y]) => pushRadial(x, y, cx, cy, offset));
        parts.push(opToSVGPart(op.type, p));
      }
    }
  }
  return parts.join(" ");
}

// Export:

function exportPNG() {
  saveCanvas(p5Canvas, "mbz34-sound-reactive", "png");
}

function opToSVGPart(type, pts) {
  if (type === "M") return `M${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  if (type === "L") return `L${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)}`;
  if (type === "Q") return `Q${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} ${pts[1][0].toFixed(2)} ${pts[1][1].toFixed(2)}`;
  if (type === "C")
    return `C${pts[0][0].toFixed(2)} ${pts[0][1].toFixed(2)} ${pts[1][0].toFixed(2)} ${pts[1][1].toFixed(2)} ${pts[2][0].toFixed(2)} ${pts[2][1].toFixed(2)}`;
  if (type === "Z") return "Z";
  return "";
}

function opsToSVGD(ops) {
  return ops.map((op) => opToSVGPart(op.type, op.pts)).join(" ");
}

function exportSVG() {
  if (!hbFace) return;

  const shapes = [];
  let maskCounter = 0;

  for (const box of boxes) {
    const contours = buildBoxContours(box, currentT);
    if (contours.length === 0) continue;
    const ops = contours.flatMap((c) => c.ops);

    if (box.renderMode === "rings") {
      const d = ringsToSVGD(box, contours);
      shapes.push(
        `<path d="${d}" fill="none" stroke="${box.strokeColor}" stroke-width="${box.strokeThickness}" stroke-linejoin="round" stroke-linecap="round"/>`
      );
    } else if (box.renderMode === "fill-evenodd") {
      const d = opsToSVGD(ops);
      const maskId = `overlapMask${maskCounter++}`;
      shapes.push(`<path d="${d}" fill="${box.fillColor}" fill-rule="nonzero"/>`);
      shapes.push(
        `<mask id="${maskId}"><path d="${d}" fill="#fff" fill-rule="nonzero"/><path d="${d}" fill="#000" fill-rule="evenodd"/></mask>` +
          `<rect x="0" y="0" width="${CANVAS_W}" height="${CANVAS_H}" fill="${box.overlapColor}" mask="url(#${maskId})"/>`
      );
    } else {
      const doFill = box.renderMode === "fill-nonzero" || box.renderMode === "fill-outline";
      const doStroke = box.renderMode === "stroke" || box.renderMode === "fill-outline";
      const d = opsToSVGD(ops);
      if (doFill) shapes.push(`<path d="${d}" fill="${box.fillColor}" fill-rule="nonzero" stroke="none"/>`);
      if (doStroke)
        shapes.push(
          `<path d="${d}" fill="none" stroke="${box.strokeColor}" stroke-width="${box.strokeThickness}" stroke-linejoin="round" stroke-linecap="round"/>`
        );
    }
  }

  const cx = CANVAS_W / 2;
  const cy = CANVAS_H / 2;
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${CANVAS_W}" height="${CANVAS_H}">\n` +
    (transparentBg ? "" : `  <rect width="100%" height="100%" fill="${bgColor}"/>\n`) +
    `  <g transform="translate(${cx} ${cy}) scale(${zoom}) translate(${-cx} ${-cy})">\n` +
    `    ${shapes.join("\n    ")}\n` +
    `  </g>\n` +
    `</svg>\n`;

  const blob = new Blob([svg], { type: "image/svg+xml" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "mbz34-sound-reactive.svg";
  a.click();
  URL.revokeObjectURL(url);
}

function recordVideo() {
  if (!hbFace) return;

  const canvasEl = p5Canvas.canvas;
  if (!canvasEl.captureStream) {
    statusEl.html("This browser doesn't support canvas.captureStream().");
    return;
  }

  const videoStream = canvasEl.captureStream(fps);
  let combinedStream = videoStream;

  if (audioLoaded) {
    const ctx = ensureAudioCtx();
    if (ctx.state === "suspended") ctx.resume();
    ensureAudioGraph();
    const dest = ctx.createMediaStreamDestination();
    audioSourceNode.connect(dest);
    combinedStream = new MediaStream([...videoStream.getVideoTracks(), ...dest.stream.getAudioTracks()]);
  }

  const mimeCandidates = ["video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  const mimeType = mimeCandidates.find((m) => MediaRecorder.isTypeSupported(m)) || "video/webm";
  const recorder = new MediaRecorder(combinedStream, { mimeType });
  const chunks = [];
  recorder.ondataavailable = (e) => {
    if (e.data.size > 0) chunks.push(e.data);
  };
  recorder.onstop = () => {
    const blob = new Blob(chunks, { type: "video/webm" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "mbz34-sound-reactive.webm";
    a.click();
    URL.revokeObjectURL(url);
    playing = wasPlayingBeforeRecord;
    playButton.html(playing ? "Pause" : "Play");
    statusEl.html("Saved mbz34-sound-reactive.webm");
  };

  wasPlayingBeforeRecord = playing;
  currentT = 0;
  if (audioLoaded) audioEl.elt.currentTime = 0;
  playing = true;
  playStartMillis = millis();
  if (audioLoaded) audioEl.elt.play();
  playButton.html("Pause");

  const durationS = audioLoaded ? audioDuration : FALLBACK_DURATION;
  recorder.start();
  statusEl.html(`Recording ${durationS.toFixed(1)}s at ${fps}fps${transparentBg ? " (transparent)" : ""} ...`);
  setTimeout(() => recorder.stop(), durationS * 1000 + 200);
}

// PNG sequence export:
// Renders frame by frame (not in real time), so no frames are dropped. The sound reaction is
// computed from the audio file offline, at the same rate as the live preview.

async function exportPNGSequence() {
  if (exportingFrames) {
    cancelFrameExport = true;
    return;
  }
  if (!hbFace) return;

  // Chrome/Edge: write the frames straight into a folder. Other browsers: download one ZIP.
  let outDir = null;
  if (window.showDirectoryPicker) {
    try {
      const parent = await window.showDirectoryPicker({ mode: "readwrite" });
      const stamp = new Date().toISOString().slice(0, 19).replace(/[-:T]/g, "");
      outDir = await parent.getDirectoryHandle(`mbz34-frames-${stamp}`, { create: true });
    } catch (e) {
      return; // picker cancelled
    }
  }

  exportingFrames = true;
  cancelFrameExport = false;
  const wasPlaying = playing;
  const savedT = currentT;
  playing = false;
  if (audioLoaded) audioEl.elt.pause();
  playButton.html("Play");
  noLoop();

  try {
    const durationS = audioLoaded ? audioDuration : FALLBACK_DURATION;
    const frameCount = Math.max(1, Math.round(durationS * fps));

    let spectra = null;
    if (audioLoaded && audioBuffer) {
      statusEl.html("Analysing audio ...");
      spectra = await analyseSpectraOffline(SIM_RATE);
    }

    // Start the sound smoothing from rest, like a fresh playback:
    loudness = 0;
    quietLevel = 1;
    loudLevel = 0;
    for (const box of boxes) {
      box.chaos = 0;
      box.bandLoudness = 0;
      box.flickerPhase = 0;
      getBoxBands(box).fill(0);
    }

    const zipEntries = outDir ? null : [];
    let simStep = 0;

    for (let f = 0; f < frameCount; f++) {
      if (cancelFrameExport) {
        statusEl.html(`PNG export cancelled after ${f} frames.`);
        return;
      }

      currentT = f / fps;
      if (spectra) {
        while (simStep <= currentT * SIM_RATE && simStep < spectra.length) {
          spectrum.set(spectra[simStep]);
          stepSound();
          simStep++;
        }
      } else {
        for (const box of boxes) box.chaos = 0;
      }

      renderFrame();
      const blob = await new Promise((resolve) => p5Canvas.elt.toBlob(resolve, "image/png"));
      const name = `mbz34_${String(f).padStart(5, "0")}.png`;

      if (outDir) {
        const fh = await outDir.getFileHandle(name, { create: true });
        const w = await fh.createWritable();
        await w.write(blob);
        await w.close();
      } else {
        zipEntries.push({ name, data: new Uint8Array(await blob.arrayBuffer()) });
      }

      if (f % 5 === 0 || f === frameCount - 1) {
        statusEl.html(`Exporting PNG frame ${f + 1} / ${frameCount} (click the button again to cancel) ...`);
      }
    }

    if (zipEntries) {
      statusEl.html("Packing ZIP ...");
      const url = URL.createObjectURL(makeZip(zipEntries));
      const a = document.createElement("a");
      a.href = url;
      a.download = "mbz34-frames.zip";
      a.click();
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    }
    statusEl.html(
      `Exported ${frameCount} PNG frames at ${fps} fps${outDir ? ` to folder ${outDir.name}` : ""}.`
    );
  } catch (err) {
    statusEl.html(`PNG export failed: ${err.message}`);
  } finally {
    exportingFrames = false;
    currentT = savedT;
    if (audioLoaded) audioEl.elt.currentTime = savedT;
    timeSlider.value(currentT);
    if (wasPlaying) togglePlay();
    loop();
  }
}

// Spectrum snapshots of the whole track, `rate` per second, using the same analyser
// settings as the live preview.
async function analyseSpectraOffline(rate) {
  const off = new OfflineAudioContext(audioBuffer.numberOfChannels, audioBuffer.length, audioBuffer.sampleRate);
  const src = off.createBufferSource();
  src.buffer = audioBuffer;
  const an = off.createAnalyser();
  an.fftSize = 2048;
  an.smoothingTimeConstant = 0.8;
  src.connect(an);
  an.connect(off.destination);

  const quantum = 128 / audioBuffer.sampleRate;
  const count = Math.floor((audioBuffer.duration - quantum) * rate);
  const out = [];
  for (let i = 0; i < count; i++) {
    const t = Math.max(quantum, i / rate);
    off
      .suspend(t)
      .then(() => {
        const s = new Uint8Array(an.frequencyBinCount);
        an.getByteFrequencyData(s);
        out[i] = s;
        off.resume();
      })
      .catch(() => {});
  }
  src.start(0);
  await off.startRendering();

  // Fill any gaps (e.g. two suspends landing in the same audio block):
  for (let i = 0; i < count; i++) if (!out[i]) out[i] = out[i - 1] || new Uint8Array(an.frequencyBinCount);
  return out;
}

// Minimal uncompressed ZIP writer (PNGs are already compressed):
const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(data) {
  let c = 0xffffffff;
  for (let i = 0; i < data.length; i++) c = CRC_TABLE[(c ^ data[i]) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function makeZip(entries) {
  const parts = [];
  const central = [];
  let offset = 0;
  const enc = new TextEncoder();

  for (const e of entries) {
    const name = enc.encode(e.name);
    const crc = crc32(e.data);
    const local = new DataView(new ArrayBuffer(30));
    local.setUint32(0, 0x04034b50, true);
    local.setUint16(4, 20, true);
    local.setUint32(14, crc, true);
    local.setUint32(18, e.data.length, true);
    local.setUint32(22, e.data.length, true);
    local.setUint16(26, name.length, true);
    parts.push(local, name, e.data);

    const cd = new DataView(new ArrayBuffer(46));
    cd.setUint32(0, 0x02014b50, true);
    cd.setUint16(4, 20, true);
    cd.setUint16(6, 20, true);
    cd.setUint32(16, crc, true);
    cd.setUint32(20, e.data.length, true);
    cd.setUint32(24, e.data.length, true);
    cd.setUint16(28, name.length, true);
    cd.setUint32(42, offset, true);
    central.push(cd, name);

    offset += 30 + name.length + e.data.length;
  }

  const cdSize = central.reduce((n, p) => n + p.byteLength, 0);
  const end = new DataView(new ArrayBuffer(22));
  end.setUint32(0, 0x06054b50, true);
  end.setUint16(8, entries.length, true);
  end.setUint16(10, entries.length, true);
  end.setUint32(12, cdSize, true);
  end.setUint32(16, offset, true);

  return new Blob([...parts, ...central, end], { type: "application/zip" });
}
