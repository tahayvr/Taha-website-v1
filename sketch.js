let inc = 0.1;
let scl = 10;
let cols, rows;
let zoff = 0;

let particles = [];
let flowfield;

let centerX;
let centerY;

let circleRadius;

let cnv;

function setup() {
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style("z-index", "-1");
  cnv.style("position", "fixed");
  cnv.style("bottom", "0");
  cnv.style("overflow", "hidden");

  cols = floor(windowWidth / scl);
  rows = floor(windowHeight / scl);
  flowfield = new Array(cols * rows);

  // Define the circle's center and radius based on the profile box.
  centerX = windowWidth / 2;
  centerY = windowHeight / 2;
  let profileBox = document.getElementById("profile-box");
  circleRadius = profileBox.offsetWidth / 2;
  console.log(circleRadius);
  // create particles
  for (let i = 0; i < 1000; i++) {
    particles[i] = new Particle();
  }
  background(0);
}

function draw() {
  let yoff = 0;
  for (let y = 0; y < rows; y++) {
    let xoff = 0;
    for (let x = 0; x < cols; x++) {
      let index = x + y * cols;
      let angle = noise(xoff, yoff, zoff) * TWO_PI * 4;
      let v = p5.Vector.fromAngle(angle);
      v.setMag(1);
      flowfield[index] = v;
      xoff += inc;
    }
    yoff += inc;
    zoff += 0.0003;
  }

  for (let i = 0; i < particles.length; i++) {
    // Check if the particle is outside the circle before updating and showing
    if (
      p5.Vector.dist(particles[i].pos, createVector(centerX, centerY)) >
      circleRadius
    ) {
      particles[i].follow(flowfield);
      particles[i].update();
      particles[i].edges();
      particles[i].show();
    }
  }
}

function Particle() {
  this.pos = createVector(random(width), random(height));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);
  this.maxspeed = 1;
  this.color = [random(255), random(255), random(255)]; // New color property

  this.prevPos = this.pos.copy();

  this.update = function () {
    this.vel.add(this.acc);
    this.vel.limit(this.maxspeed);
    this.pos.add(this.vel);
    this.acc.mult(0);
  };

  this.follow = function (vectors) {
    let x = floor(this.pos.x / scl);
    let y = floor(this.pos.y / scl);
    let index = x + y * cols;
    let force = vectors[index];
    this.applyForce(force);
  };

  this.applyForce = function (force) {
    this.acc.add(force);
  };

  this.show = function () {
    stroke(this.color[0], this.color[1], this.color[2], 50);
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  };

  this.updatePrev = function () {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  };

  this.edges = function () {
    if (this.pos.x > width) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = width;
      this.updatePrev();
    }
    if (this.pos.y > height) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = height;
      this.updatePrev();
    }
  };
}
function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  background(0);
  // redefine the circle
  centerX = windowWidth / 2;
  centerY = windowHeight / 2;
  let profileBox = document.getElementById("profile-box");
  circleRadius = profileBox.clientWidth / 2;

  cols = floor(windowWidth / scl);
  rows = floor(windowHeight / scl);
  flowfield = new Array(cols * rows);

  for (let i = 0; i < 1000; i++) {
    particles[i] = new Particle();
  }
}
