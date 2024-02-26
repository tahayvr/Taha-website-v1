//
class Particle {
  constructor(x, y) {
    this.pos = new Vector(x, y);
    this.prevPos = new Vector(x, y);
    this.vel = new Vector(Math.random() - 0.5, Math.random() - 0.5);
    this.acc = new Vector(0, 0);
    this.size = 2;
  }

  move(acc) {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
    if (acc) {
      this.acc.addTo(acc);
    }
    this.vel.addTo(this.acc);
    this.pos.addTo(this.vel);
    if (this.vel.getLength() > particleSpeed / 50) {
      this.vel.setLength(particleSpeed / 50);
    }
    this.acc.x = 0;
    this.acc.y = 0;
  }

  draw() {
    ctx.fillRect(this.pos.x, this.pos.y, this.size, this.size);
  }

  drawLine() {
    ctx.beginPath();
    ctx.moveTo(this.prevPos.x, this.prevPos.y);
    ctx.lineTo(this.pos.x, this.pos.y);
    ctx.stroke();
  }

  wrap() {
    if (this.pos.x > w) {
      this.prevPos.x = this.pos.x = 0;
    } else if (this.pos.x < -this.size) {
      this.prevPos.x = this.pos.x = w - 1;
    }
    if (this.pos.y > h) {
      this.prevPos.y = this.pos.y = 0;
    } else if (this.pos.y < -this.size) {
      this.prevPos.y = this.pos.y = h - 1;
    }
  }
}

let canvas;
let ctx;
let field;
let w, h;
let size;
let columns;
let rows;
let noiseZ;
let particles;
let config;
let colorConfig;
let settings;
let colorSettings;
let requestId;

// user controlled variables
var slider2 = document.getElementById("slider2");
var output2 = document.getElementById("value2");
let noiseSpeed = slider2.value;
output2.innerHTML = noiseSpeed;
console.log("NoiseSpeed" + ":  " + noiseSpeed);
slider2.oninput = function () {
  noiseSpeed = this.value;
  output2.innerHTML = noiseSpeed;
  console.log("New NoiseSpeed" + ":  " + noiseSpeed);
};

var slider1 = document.getElementById("slider1");
var output1 = document.getElementById("value1");
let angleZoom = slider1.value;
output1.innerHTML = angleZoom;
console.log("AngleZoom" + ":  " + angleZoom);
slider1.oninput = function () {
  angleZoom = this.value;
  output1.innerHTML = angleZoom;
  console.log("New AngleZoom" + ":  " + angleZoom);
};

let lineMode = true; // UI option will be added later - CHECKBOX

var slider3 = document.getElementById("slider3");
var output3 = document.getElementById("value3");
let particleSpeed = slider3.value;
output3.innerHTML = particleSpeed;
console.log("ParticleSpeed" + ":  " + particleSpeed);
slider3.oninput = function () {
  particleSpeed = this.value;
  output3.innerHTML = particleSpeed;
  console.log("New ParticleSpeed" + ":  " + particleSpeed);
};

var slider9 = document.getElementById("slider9");
var output9 = document.getElementById("value9");
let colorSaturation = slider9.value;
output9.innerHTML = colorSaturation;
console.log("ColorSaturation" + ":  " + colorSaturation);
slider9.oninput = function () {
  colorSaturation = this.value;
  output9.innerHTML = colorSaturation;
  console.log("New ColorSaturation" + ":  " + colorSaturation);
};

var slider4 = document.getElementById("slider4");
var output4 = document.getElementById("value4");
let baseHue = slider4.value;
output4.innerHTML = baseHue;
console.log("BaseHue" + ":  " + baseHue);
slider9.style.background = `linear-gradient(90deg, hsla(${baseHue}, 100%, 50%, 0), hsla(${baseHue}, 100%, 50%, 1)`;
slider4.oninput = function () {
  baseHue = this.value;
  output4.innerHTML = baseHue;
  console.log("New BaseHue" + ":  " + baseHue);
  slider9.style.background = `linear-gradient(90deg, hsla(${baseHue}, 100%, 50%, 0), hsla(${baseHue}, 100%, 50%, 1)`;
};

var slider5 = document.getElementById("slider5");
var output5 = document.getElementById("value5");
let hueRange = slider5.value;
output5.innerHTML = hueRange;
console.log("HueRange" + ":  " + hueRange);
slider5.oninput = function () {
  hueRange = this.value;
  output5.innerHTML = hueRange;
  console.log("New HueRange" + ":  " + hueRange);
};

var slider6 = document.getElementById("slider6");
var output6 = document.getElementById("value6");
let clearAlpha = slider6.value;
output6.innerHTML = clearAlpha;
console.log("ClearAlpha" + ":  " + clearAlpha);
slider6.oninput = function () {
  clearAlpha = this.value;
  output6.innerHTML = clearAlpha;
  console.log("New ClearAlpha" + ":  " + clearAlpha);
};

var slider7 = document.getElementById("slider7");
var output7 = document.getElementById("value7");
let fieldForce = slider7.value;
output7.innerHTML = fieldForce;
console.log("FieldForce" + ":  " + fieldForce);
slider7.oninput = function () {
  fieldForce = this.value;
  output7.innerHTML = fieldForce;
  console.log("New FieldForce" + ":  " + fieldForce);
};

var slider8 = document.getElementById("slider8");
var output8 = document.getElementById("value8");
let particleOpacity = slider8.value;
output8.innerHTML = particleOpacity;
console.log("ParticleOpacity" + ":  " + particleOpacity);
slider8.oninput = function () {
  particleOpacity = this.value;
  output8.innerHTML = particleOpacity;
  console.log("New ParticleOpacity" + ":  " + particleOpacity);
};

function setup() {
  size = 5;
  noiseZ = 0;
  canvas = document.querySelector("#canvas");
  ctx = canvas.getContext("2d");
  reset();
  window.addEventListener("resize", reset);
}

function reset() {
  noise.seed(Math.random());
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  columns = Math.floor(w / size) + 1;
  rows = Math.floor(h / size) + 1;
  drawBackground(1);
  initParticles();
  initField();
  //ctx.shadowBlur = 10;
  //ctx.globalCompositeOperation = "lighter";
  //ctx.lineWidth = 3;
}

function initParticles() {
  particles = [];
  let numberOfParticles = (w * h) / 1000;
  for (let i = 0; i < numberOfParticles; i++) {
    let particle = new Particle(Math.random() * w, Math.random() * h);
    particles.push(particle);
  }
}

function draw() {
  drawBackground();
  requestId = requestAnimationFrame(draw);
  calculateField();
  noiseZ += noiseSpeed / 10000; // user controlled
  drawParticles();
}

function initField() {
  field = new Array(columns);
  for (let x = 0; x < columns; x++) {
    field[x] = new Array(columns);
    for (let y = 0; y < rows; y++) {
      field[x][y] = new Vector(0, 0);
    }
  }
}

function calculateField() {
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let angle =
        noise.simplex3(x / angleZoom / 5, y / angleZoom / 5, noiseZ) *
        Math.PI *
        2;
      let length =
        (noise.simplex3(x / 50 + 40000, y / 50 + 40000, noiseZ) * fieldForce) /
        20;
      field[x][y].setLength(length);
      field[x][y].setAngle(angle);
    }
  }
}

function drawBackground(alpha) {
  ctx.fillStyle = `rgba(0, 0, 0, ${alpha || clearAlpha})`;
  ctx.fillRect(0, 0, w, h);
}

function drawParticles() {
  let pos = new Vector(0, 0);
  let hue = Math.sin(noiseZ) * hueRange + baseHue;
  let color = `hsla(${hue}, ${colorSaturation}%, 50%, ${
    particleOpacity / 500
  })`;
  ctx.fillStyle = color;
  ctx.strokeStyle = color;
  //ctx.shadowColor = color;

  particles.forEach((p) => {
    if (lineMode) {
      p.drawLine();
    } else {
      p.draw();
    }
    pos.x = p.pos.x / size;
    pos.y = p.pos.y / size;

    let v;
    if (pos.x >= 0 && pos.x < columns && pos.y >= 0 && pos.y < rows) {
      v = field[Math.floor(pos.x)][Math.floor(pos.y)];
    }
    p.move(v);
    p.wrap();
  });
}

function pause() {
  cancelAnimationFrame(requestId);
  settings.hideControl("Pause");
  settings.showControl("Resume");
}

function resume() {
  settings.hideControl("Resume");
  settings.showControl("Pause");
  draw();
}

setup();
draw();
