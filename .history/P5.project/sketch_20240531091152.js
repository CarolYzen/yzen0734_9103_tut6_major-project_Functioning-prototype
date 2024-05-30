let fixedColor;
let size;
let scaleFactor;
let backgroundColor = [];
let largeCircleColors = [];
let smallCircleColors = [];

// To store circles whose size and color can be modified together
let randomCircles = [];
let patterns = [];
let angle = 0; // angle for circular motion
let centralCircleRadius = 70; // Initial radius for the central circle
let growthFactor = 1; // Growth factor for the central circle

function setup() {
  // Calculate the size of the canvas
  size = Math.min(windowWidth, windowHeight);
  scaleFactor = Math.min(windowWidth, windowHeight) / 1024;
  createCanvas(size, size);
  noStroke();
  
  // Colors of the circles in the middle
  largeCircleColors = [
    color(233, 75, 60), color(119, 197, 147), color(75, 156, 211),
    color(255, 215, 0), color(181, 101, 167), color(255, 165, 0)
  ];

  // Colors of the "randomCircles"
  smallCircleColors = [
    color(75, 156, 211), color(255, 215, 0), color(181, 101, 167),
    color(255, 165, 0), color(233, 75, 60)
  ];

  backgroundColor = [color(3, 61, 94)];

  // Initialize randomCircles
  for (let i = 0; i < 40; i++) {
    let x = random(1024);
    let y = random(1024);
    let r = random(5, 50);
    let randomCircle = {
      fill: smallCircleColors[i % smallCircleColors.length],
      x: x,
      y: y,
      r: r
    };
    randomCircles.push(randomCircle);
  }

  // Initialize patterns
  patterns = [
    { type: 'duelCircle', x: 550, y: 180, radius: 30, delta: 10 },
    { type: 'duelCircle', x: 650, y: 300, radius: 15, delta: 5 },
    { type: 'specialCircle', x: 820, y: 760, outerRadius: 20, innerRadius: 15 },
    { type: 'duelCircle', x: 500, y: 730, radius: 15, delta: 5 },
    { type: 'complexCircle', x: 210, y: 790, outerRadius: 50, middleRadius: 25, innerRadius: 10 },
    { type: 'complexCircle', x: 220, y: 550, outerRadius: 90, middleRadius: 70, innerRadius: 20 },
    { type: 'duelCircle', x: 400, y: 320, radius: 30, delta: 20 },
    { type: 'specialCircle', x: 160, y: 300, outerRadius: 20, innerRadius: 15 },
    { type: 'moon', x: 500, y: 200, moonRadius: 100, offset: 45 }
  ];
}

function draw() {
  push();
  // Fit the image to the window size
  scale(scaleFactor);
  originalImage();
  pop();

  // Update the central circle size and direction
  if (centralCircleRadius > 100 || centralCircleRadius < 70) {
    growthFactor *= -1;
  }
  centralCircleRadius += growthFactor;

  // Update the angle for circular motion
  angle += 0.01;
}

// Function of special pattern1
function drawDuelCircle(x, y, radius, delta) {
  fill(233, 75, 60);
  ellipse(x, y, radius * 2, radius * 2);
  fill(119, 197, 147);
  ellipse(x, y, radius - delta, radius - delta);
}

// Function of special pattern2
function drawCross(x, y, horizontalLength, verticalLength, lineWidth) {
  strokeWeight(lineWidth);
  stroke('#ffffff');
  line(x, y - verticalLength / 2, x, y + verticalLength / 2);
  line(x - horizontalLength / 2, y, x + horizontalLength / 2, y);
}

// Function of special pattern3
function drawSpecialCircle(x, y, outerRadius, innerRadius) {
  fill(75, 156, 211);
  arc(x, y, 2 * outerRadius, 2 * outerRadius, 0, PI);

  fill(255, 215, 0);
  arc(x, y, 2 * outerRadius, 2 * outerRadius, PI, TWO_PI);

  fill(181, 101, 167);
  ellipse(x, y, 2 * innerRadius, 2 * innerRadius);
}

// Function of special pattern4
function drawComplexCircle(x, y, outerRadius, middleRadius, innerRadius) {
  fill(255, 165, 0);
  ellipse(x, y, 2 * outerRadius, 2 * outerRadius);
  fill(233, 75, 60);
  ellipse(x, y, 2 * middleRadius, 2 * middleRadius);
  fill(119, 197, 147);
  ellipse(x, y, 2 * innerRadius, 2 * innerRadius);
}

// Function of drawing all patterns
function originalImage() {
  clear();
  background(3, 61, 94);

  let x = 512;
  let y = 512;

  // Circles in the middle with updated radius
  for (let r = centralCircleRadius * 5.5, i = 0; r >= centralCircleRadius; r -= centralCircleRadius / 2, i++) {
    fill(largeCircleColors[i % largeCircleColors.length]);
    ellipse(x, y, r, r);
  }

  // Two small circles in the middle
  fill(0, 0, 255);
  ellipse(x, y - 30, 30, 30);
  fill(0, 255, 0);
  ellipse(x, y + 30, 30, 30);

  // Draw "randomCircles" with circular motion
  for (let i = 0; i < randomCircles.length; i++) {
    let circle = randomCircles[i];
    let angleOffset = i * TWO_PI / randomCircles.length;
    let x = 512 + 400 * cos(angle + angleOffset);
    let y = 512 + 400 * sin(angle + angleOffset);
    fill(circle.fill);
    ellipse(x, y, circle.r, circle.r);
  }

  // Draw patterns with circular motion
  for (let i = 0; i < patterns.length; i++) {
    let pattern = patterns[i];
    let angleOffset = i * TWO_PI / patterns.length;
    let x = 512 + 300 * cos(angle + angleOffset);
    let y = 512 + 300 * sin(angle + angleOffset);
    if (pattern.type === 'duelCircle') {
      drawDuelCircle(x, y, pattern.radius, pattern.delta);
    } else if (pattern.type === 'specialCircle') {
      drawSpecialCircle(x, y, pattern.outerRadius, pattern.innerRadius);
    } else if (pattern.type === 'complexCircle') {
      drawComplexCircle(x, y, pattern.outerRadius, pattern.middleRadius, pattern.innerRadius);
    } else if (pattern.type === 'moon') {
      fill(255, 165, 0);
      ellipse(x, y, pattern.moonRadius * 2, pattern.moonRadius * 2);
      fill(3, 61, 94);
      ellipse(x + pattern.offset, y, pattern.moonRadius * 1.9, pattern.moonRadius * 1.9);
    }
  }
}

// Fit canvas and pattern to window size
function windowResized() {
  size = Math.min(windowWidth, windowHeight);
  scaleFactor = Math.min(windowWidth, windowHeight) / 1024;

  resizeCanvas(size, size);

  scale(scaleFactor);

  originalImage();
}
