let size; // Store the size of the canvas
let scaleFactor; // Store the scale factor
let backgroundColor; // Store the background color
let largeCircleColors = []; // Store the colors of the large circles
let smallCircleColors = []; // Store the colors of the small circles

// To store circles whose size and color can be modified together
let randomCircles = []; // Store circles whose size and color can be modified together
let angleOffsets = []; // Store the angle offsets for each circle
let speeds = []; // Store the speed of each circle
let patterns = []; // Store pattern information
let patternOffsets = []; // This technique comes from https://chatgpt.com Store the angle offsets for each pattern
let patternSpeeds = []; // Store the speed of each pattern
let noiseOffsets = []; // This technique comes from https://chatgpt.com Store the noise offsets for each pattern
let noiseStep = 0.03; // Use a small noise step to avoid abrupt changes in speed
let frameIncrement = 0;

function setup() {
  backgroundColor = color(0, 0, 0, 10); // Background color is black with added transparency for trail effect
  randomSeed(42); // Set the random seed

  // Calculate the size of the canvas
  size = Math.min(windowWidth, windowHeight); // Set the canvas size to the minimum of window width and height
  scaleFactor = Math.min(windowWidth, windowHeight) / 1024; // Calculate the scale factor
  createCanvas(size, size); // Set the canvas size to 'size'
  noStroke(); // Disable all shape outlines

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

  // Initialize the 'randomCircles' array
  for (let i = 0; i < 40; i++) {
    let x = random(1024); 
    let y = random(1024); 
    let r = random(5, 50); 
    randomCircles.push({
      fill: smallCircleColors[int(random(smallCircleColors.length))], // Randomly set the fill color of the circle from the 'smallCircleColors' array
      x: x,
      y: y, 
      r: r, 
      angleOffset: random(TWO_PI), // Set the angle offset of the circle
      noiseOffset: random(1000) // Set the noise offset of the circle
    });
  }

  // This technique comes from https://chatgpt.com Each object in the 'patterns' array contains information about the pattern (type, position, radius, etc.), facilitating the drawing of different patterns based on their types.
  patterns = [
    { type: 'duelCircle', x: 150, y: 780, radius: 30, delta: 10 },
    { type: 'duelCircle', x: 50, y: 30, radius: 15, delta: 5 },
    { type: 'specialCircle', x: 820, y: 200, outerRadius: 40, innerRadius: 30 },
    { type: 'specialCircle', x: 20, y: 60, outerRadius: 70, innerRadius: 50 },
    { type: 'duelCircle', x: 50, y: 730, radius: 15, delta: 5 },
    { type: 'complexCircle', x: 210, y: 790, outerRadius: 50, middleRadius: 25, innerRadius: 10 },
    { type: 'complexCircle', x: 220, y: 550, outerRadius: 80, middleRadius: 50, innerRadius: 20 },
    { type: 'duelCircle', x: 40, y: 320, radius: 30, delta: 20 },
    { type: 'specialCircle', x: 30, y: 30, outerRadius: 40, innerRadius: 30 },
    { type: 'moon', x: 500, y: 200, moonRadius: 100, offset: 45 }
  ];

  for (let i = 0; i < patterns.length; i++) {
    patterns[i].angleOffset = random(TWO_PI); // Add a random angle offset for each pattern
    patterns[i].noiseOffset = random(2000); // Initialize the noise offset for each pattern
  }

  loop(); // Ensure the 'draw' function is continuously called to create the animation
}

function draw() {
  // Adjust the size of the image based on the scale factor
  scale(scaleFactor);
  background(backgroundColor);

  // The x and y coordinates of the center circle
  let x = 512;
  let y = 512;

  // Use frame count and sin function to achieve the zoom in and out effect
  frameIncrement += 0.01; // Control the frame increment
  let expansionFactor = 0.7 + sin(frameIncrement*1.5 - 900) * 0.6; // Adjust the range and speed
  let baseRadius = 300 * expansionFactor; // Adjust the radius of the central circle

  // Draw multiple concentric circles
  for (let r = baseRadius, i = 0; r >= 70; r -= 40, i++) {
    fill(largeCircleColors[i % largeCircleColors.length]);
    ellipse(x, y, r, r);
  }

  // Draw random circles that move in a circular motion
  for (let i = 0; i < randomCircles.length; i++) {
    let circle = randomCircles[i];
    let noiseSpeed = noise(circle.noiseOffset + frameIncrement * noiseStep) * 1; // Adjust speed using noise
    let angle = circle.angleOffset + frameCount * noiseSpeed * 0.01; // Calculate the current angle of the circle
    let radius = 300 * expansionFactor; // Adjust the radius of the circular motion
    let cx = x + radius * cos(angle);
    let cy = y + radius * sin(angle);
    fill(circle.fill);
    ellipse(cx, cy, circle.r * expansionFactor, circle.r * expansionFactor); // Draw the circle
  }

  // Draw patterns that move in a circular motion
  for (let i = 0; i < patterns.length; i++) {
    let pattern = patterns[i];
    let noiseSpeed = noise(pattern.noiseOffset + frameIncrement * noiseStep) * 2; // Adjust speed using noise
    let angle = pattern.angleOffset + frameCount * noiseSpeed * 0.01; // Calculate the current angle of the pattern
    let radius = 300 * expansionFactor; // Adjust the radius of the circular motion
    let px = x + radius * cos(angle);
    let py = y + radius * sin(angle);
    let noiseScalePattern = 0.5 + (noise(pattern.noiseOffset + frameCount * noiseStep) - 0.5) * 0.5; // Adjust size using Perlin noise
    // This technique comes from https://chatgpt.com Check the 'type' property of the pattern object using conditional statements and call the corresponding drawing function. The 'type' property distinguishes different types of patterns.
    if (pattern.type === 'duelCircle') {
      drawDuelCircle(px, py, pattern.radius * noiseScalePattern * expansionFactor, pattern.delta * noiseScalePattern * expansionFactor);
    } else if (pattern.type === 'specialCircle') {
      drawSpecialCircle(px, py, pattern.outerRadius * noiseScalePattern * expansionFactor, pattern.innerRadius * noiseScalePattern * expansionFactor);
    } else if (pattern.type === 'complexCircle') {
      drawComplexCircle(px, py, pattern.outerRadius * noiseScalePattern * expansionFactor, pattern.middleRadius * noiseScalePattern * expansionFactor, pattern.innerRadius * noiseScalePattern * expansionFactor);
    } else if (pattern.type === 'moon') {
      drawMoon(px, py, pattern.moonRadius * noiseScalePattern * expansionFactor, pattern.offset * noiseScalePattern * expansionFactor);
    }
  }
}

// Function of special pattern1
function drawDuelCircle(x, y, radius, delta) {
  fill(233, 75, 60);
  ellipse(x, y, radius * 2, radius * 2);
  fill(119, 197, 147);
  ellipse(x, y, radius - delta, radius - delta);
}

// Function of special pattern2
function drawSpecialCircle(x, y, outerRadius, innerRadius) {
  fill(75, 156, 211);
  arc(x, y, 2 * outerRadius, 2 * outerRadius, 0, PI); // This technique comes from https://chatgpt.com patterns Use the 'arc' function to draw an arc at the given position.
  fill(255, 215, 0);
  arc(x, y, 2 * outerRadius, 2 * outerRadius, PI, TWO_PI);
  fill(181, 101, 167);
  ellipse(x, y, 2 * innerRadius, 2 * innerRadius);
}

// Function of special pattern3
function drawComplexCircle(x, y, outerRadius, middleRadius, innerRadius) {
  fill(255, 165, 0);
  ellipse(x, y, 1.5 * outerRadius, 1.5 * outerRadius);
  fill(233, 75, 60);
  ellipse(x, y, 1.5 * middleRadius, 1.5 * middleRadius);
  fill(119, 197, 147);
  ellipse(x, y, 1.5 * innerRadius, 1.5 * innerRadius);
}

// Function of moon shape
function drawMoon(x, y, moonRadius, offset) {
  fill(255, 165, 0);
  ellipse(x, y, moonRadius * 1.5, moonRadius * 1.5);
  fill(0, 10, 20);
  ellipse(x + offset, y, moonRadius * 1.4, moonRadius * 1.4);
}

// Fit canvas and pattern to window size
function windowResized() {
  size = Math.min(windowWidth, windowHeight);
  scaleFactor = Math.min(windowWidth, windowHeight) / 1024;
  resizeCanvas(size, size);
  scale(scaleFactor);
}