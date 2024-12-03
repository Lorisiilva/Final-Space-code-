// Global variables
let tposX, tposY;
let tSize = 50;
let hoverSize = tSize;
let texts = ["LORIS SPACE", "ART WORK", "CODES", "CONTACT", "GRAPHICS"];
let currentTextIndex = 0;
let font;
let planets = [];
let spaceMode = false;
let swirlParticles = [];
let currentPlanet = null;
let bgColor = [0, 0, 0];
let clickSound;
let currentStarColor;

function preload() {
  font = loadFont("AvenirNextLTPro-Demi.otf");
  clickSound = loadSound("click.mp3"); // Load the click sound file
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  textFont(font);

  setTextPosition();

  // Initialize swirling particles
  currentStarColor = color(200, 100, 255, 150); // Default star color
  for (let i = 0; i < 200; i++) {
    swirlParticles.push(new SwirlParticle(random(width), random(height), random(1, 3), random(0, TWO_PI)));
  }
}

function draw() {
  background(0);

  // Draw the shared swirling particles in all scenes
  for (let p of swirlParticles) {
    p.update();
    p.show();
  }

  if (currentPlanet) {
    // Display the title page for the clicked planet
    fill(255);
    textSize(60);
    textAlign(CENTER, TOP);
    text(currentPlanet.name, width / 2, 50); // Display the name of the planet at the top
  } else {
    if (!spaceMode) {
      drawHoverableText();
    } else {
      // Draw the planets when in space mode
      for (let planet of planets) {
        planet.move();
        planet.checkHover();
        planet.show();
      }
    }
  }
}

function setTextPosition() {
  tposX = width / 2 - textWidth(texts[currentTextIndex]) / 2;
  tposY = height / 2 + tSize / 4;
}
function mousePressed() {
  if (currentPlanet) {
    // If a planet is selected, clicking resets the scene
    currentPlanet = null;
    currentStarColor = color(200, 100, 255, 10); // Reset stars to default purple
    clickSound.play(); // Play click sound when resetting the scene
  } else if (!spaceMode) {
    // Switch to space mode on first click
    spaceMode = true;
    createPlanets();
    clickSound.play(); // Play click sound when entering space mode
  } else {
    // Check if a planet was clicked
    for (let planet of planets) {
      let distance = dist(mouseX, mouseY, planet.pos.x, planet.pos.y);
      if (distance < planet.size / 2) {
        currentPlanet = planet; // Set the clicked planet as the current
        bgColor = planet.color; // Change background color
        currentStarColor = planet.color; // Change star color to match planet
        clickSound.play(); // Play click sound when a planet is clicked
        break;
      }
    }
  }
}


function createPlanets() {
  let planetSpeed = 0.01;
  planets.push(new Planet("CONTACT", 150, 0, planetSpeed, 100, color(255, 179, 186)));
  planets.push(new Planet("CODES", 200, PI / 2, planetSpeed, 120, color(179, 255, 179)));
  planets.push(new Planet("ART WORK", 250, PI, planetSpeed, 140, color(0, 0, 255)));
  planets.push(new Planet("GRAPHICS", 300, -PI / 2, planetSpeed, 160, color(255, 223, 186)));
}

// Function to draw hoverable text
function drawHoverableText() {
  let targetSize = tSize;
  let hover = mouseX > tposX && mouseX < tposX + textWidth(texts[currentTextIndex]) &&
              mouseY > tposY - tSize / 2 && mouseY < tposY + tSize / 2;

  if (hover) {
    targetSize = tSize * 1.2;
    cursor(HAND);
  } else {
    cursor(ARROW);
  }

  // Smoothly interpolate text size for hover effect
  hoverSize = lerp(hoverSize, targetSize, 0.1);

  fill(255);
  textSize(hoverSize);
  text(texts[currentTextIndex], width / 2, height / 2);
}

// SwirlParticle class
class SwirlParticle {
  constructor(x, y, speed, angle) {
    this.pos = createVector(x, y);
    this.vel = createVector(cos(angle) * speed, sin(angle) * speed);
    this.acc = createVector();
    this.size = random(5, 10);
  }

  update() {
    let force = createVector(random(-0.1, 0.1), random(-0.1, 0.1));
    this.acc.add(force);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);

    if (this.pos.x > width) this.pos.x = 0;
    if (this.pos.x < 0) this.pos.x = width;
    if (this.pos.y > height) this.pos.y = 0;
    if (this.pos.y < 0) this.pos.y = height;
  }

  show() {
    noStroke();
    fill(currentStarColor);
    ellipse(this.pos.x, this.pos.y, this.size, this.size);
  }
}

// Planet class
class Planet {
  constructor(name, radius, angle, speed, size, color) {
    this.name = name;
    this.radius = radius;
    this.angle = angle;
    this.speed = speed;
    this.size = size;
    this.baseSize = size;
    this.color = color;
    this.pos = createVector(
      width / 2 + this.radius * cos(this.angle),
      height / 2 + this.radius * sin(this.angle)
    );
    this.isHovered = false;
    this.hoverSize = this.size * 1.3;
  }

  move() {
    this.angle += this.speed;
    this.pos.x = width / 2 + this.radius * cos(this.angle);
    this.pos.y = height / 2 + this.radius * sin(this.angle);
  }

  show() {
    let currentSize = this.isHovered ? this.hoverSize : this.size;

    fill(this.color);
    noStroke();
    ellipse(this.pos.x, this.pos.y, currentSize, currentSize);

    fill(0);
    textSize(currentSize / 6);
    textAlign(CENTER, CENTER);
    text(this.name, this.pos.x, this.pos.y);
  }

  checkHover() {
    let distance = dist(mouseX, mouseY, this.pos.x, this.pos.y);
    this.isHovered = distance < this.size / 2;
  }
}