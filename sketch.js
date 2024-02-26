/*
 * This file contains the code for the particle system that is displayed on the index page.
 * The particle system is based on the flow field algorithm and is used to create a visual effect.
 * If you are annoyed by the amount of comments in this file, Keep in mind that I'm still learning this shit
 * and the comments help me in the process.
 * You can remove them by running the following command in the terminal:
 * sed -i '' '/^\/\//d' sketch.js
 * This command will remove all comments from the file.
 */

let inc = 0.1;
let scl = 10; // scale for the flow field (controls the number of columns and rows) - controlled by the user
let cols, rows;
let zoff = 0; // z offset for the noise function

let particles = []; // array to store the particles
let flowfield; // flow field array

let particleCount = 1000;

let particleAlpha = 70;

let centerX; // center of the circle
let centerY;

let circleRadius; // radius of the circle - based on the profile box

let cnv; // canvas

/**
 * Initializes the canvas, sets up the flow field, creates particles, and sets the background color.
 */
function setup() {
  // Create canvas
  cnv = createCanvas(windowWidth, windowHeight);
  cnv.position(0, 0);
  cnv.style("z-index", "-1");
  cnv.style("position", "fixed");
  cnv.style("bottom", "0");
  cnv.style("overflow", "hidden");

  // Calculate number of columns and rows
  cols = floor(windowWidth / scl);
  rows = floor(windowHeight / scl);

  // Create flow field
  flowfield = new Array(cols * rows);

  // Calculate circle's center and radius based on the profile box
  centerX = windowWidth / 2;
  centerY = windowHeight / 2;
  let profileBox = document.getElementById("profile-box");
  circleRadius = profileBox.offsetWidth / 2;
  console.log(circleRadius);

  // Create particles and set the number of particles with particleCount
  for (let i = 0; i < particleCount; i++) {
    particles[i] = new Particle();
  }

  // Set background color
  background(12, 12, 12);
}

function draw() {
  let yoff = 0; //
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
  this.pos = createVector(random(windowWidth), random(windowHeight));
  this.vel = createVector(0, 0);
  this.acc = createVector(0, 0);

  this.maxspeed = 0.8;

  this.color = [random(255), random(255), random(255)]; // New color property for the particles

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
    stroke(this.color[0], this.color[1], this.color[2], particleAlpha);
    strokeWeight(1);
    line(this.pos.x, this.pos.y, this.prevPos.x, this.prevPos.y);
    this.updatePrev();
  };

  this.updatePrev = function () {
    this.prevPos.x = this.pos.x;
    this.prevPos.y = this.pos.y;
  };

  this.edges = function () {
    if (this.pos.x > windowWidth) {
      this.pos.x = 0;
      this.updatePrev();
    }
    if (this.pos.x < 0) {
      this.pos.x = windowWidth;
      this.updatePrev();
    }
    if (this.pos.y > windowHeight) {
      this.pos.y = 0;
      this.updatePrev();
    }
    if (this.pos.y < 0) {
      this.pos.y = windowHeight;
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
  // create particles again
  for (let i = 0; i < particleCount; i++) {
    particles[i] = new Particle();
  }
}
