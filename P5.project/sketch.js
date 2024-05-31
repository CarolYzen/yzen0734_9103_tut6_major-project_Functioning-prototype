let size; 
let scaleFactor; 
let backgroundColor = []; 
let largeCircleColors = []; 
let smallCircleColors = []; 


let randomCircles = []; 
let angleOffsets = []; 
let speeds = []; 
let patterns = []; 
let patternOffsets = []; 
let patternSpeeds = []; 
let noiseOffsets = []; 

function setup() {
  size = Math.min(windowWidth, windowHeight); 
  scaleFactor = Math.min(windowWidth, windowHeight) / 1024; 
  createCanvas(size, size);
  noStroke(); 

  largeCircleColors = [ 
    color(233, 75, 60), color(119, 197, 147), color(75, 156, 211),
    color(255, 215, 0), color(181, 101, 167), color(255, 165, 0)
  ];


  smallCircleColors = [ 
    color(75, 156, 211), color(255, 215, 0), color(181, 101, 167),
    color(255, 165, 0), color(233, 75, 60)
  ];

  backgroundColor = [color(3, 61, 94)]; 

  let randomCircle; 

  for (let i = 0; i < 40; i++) { 
    let x = random(1024); 
    let y = random(1024); 
    let r = random(5, 50); 
    randomCircle = {
      fill: smallCircleColors[i % smallCircleColors.length], 
      x: x, 
      y: y, 
      r: r  
    };
    randomCircles.push(randomCircle); 
    angleOffsets.push(random(TWO_PI)); 
    speeds.push(random(0.01, 0.08)); 
  }

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

  for (let i = 0; i < patterns.length; i++) { 
    patternOffsets.push(random(TWO_PI)); 
    patternSpeeds.push(random(0.01, 0.1)); 
    noiseOffsets.push(random(2000)); 
  }
  
  loop(); 
}

function draw() {
  scale(scaleFactor); 
  background(3, 61, 94); 
  let time = millis() / 1000; 

  let expansionFactor =0.8 + sin(time * 0.8) * 0.7; 
  let x = 512; 
  let y = 512; 
  let baseRadius = 300; 
  let breathingRadius = baseRadius * expansionFactor; 
  
  for (let r = breathingRadius, i = 0; r >= 70; r -= 40, i++) { 
    fill(largeCircleColors[i % largeCircleColors.length]); 
    ellipse(x, y, r, r); 
  }

  
  for (let i = 0; i < randomCircles.length; i++) { 
    let circle = randomCircles[i]; 
    let angle = angleOffsets[i] + time * 2 * speeds[i]; 
    let radius = 300 * expansionFactor;
    let cx = x + radius * cos(angle);
    let cy = y + radius * sin(angle); 
    fill(circle.fill); 
    ellipse(cx, cy, circle.r * expansionFactor, circle.r * expansionFactor); 
  }

  for (let i = 0; i < patterns.length; i++) { 
    let pattern = patterns[i]; 
    let angle = patternOffsets[i] + time * patternSpeeds[i]; 
    let radius = 300 * expansionFactor; 
    let px = x + radius * cos(angle); 
    let py = y + radius * sin(angle); 
    let noiseScale = noise(noiseOffsets[i] + time * 0.3); 
    if (pattern.type === 'duelCircle') { 
      drawDuelCircle(px, py, pattern.radius * noiseScale * expansionFactor, pattern.delta * noiseScale * expansionFactor); 
    } else if (pattern.type === 'specialCircle') {
      drawSpecialCircle(px, py, pattern.outerRadius * noiseScale * expansionFactor, pattern.innerRadius * noiseScale * expansionFactor); 
    } else if (pattern.type === 'complexCircle') {
      drawComplexCircle(px, py, pattern.outerRadius * noiseScale * expansionFactor, pattern.middleRadius * noiseScale * expansionFactor, pattern.innerRadius * noiseScale * expansionFactor); 
    } else if (pattern.type === 'moon') {
      drawMoon(px, py, pattern.moonRadius * noiseScale * expansionFactor, pattern.offset * noiseScale * expansionFactor); 
    }
  }
}

function drawDuelCircle(x, y, radius, delta) {
  fill(233, 75, 60); 
  ellipse(x, y, radius * 2, radius * 2); 
  fill(119, 197, 147); 
  ellipse(x, y, radius - delta, radius - delta); 
}



function drawSpecialCircle(x, y, outerRadius, innerRadius) {
  fill(75, 156, 211); 
  arc(x, y, 2 * outerRadius, 2 * outerRadius, 0, PI);
  fill(255, 215, 0); 
  arc(x, y, 2 * outerRadius, 2 * outerRadius, PI, TWO_PI); 
  fill(181, 101, 167); 
  ellipse(x, y, 2 * innerRadius, 2 * innerRadius); 
}

function drawComplexCircle(x, y, outerRadius, middleRadius, innerRadius) {
  fill(255, 165, 0); 
  ellipse(x, y, 2 * outerRadius, 2 * outerRadius); 
  fill(233, 75, 60); 
  ellipse(x, y, 2 * middleRadius, 2 * middleRadius); 
  fill(119, 197, 147);
  ellipse(x, y, 2 * innerRadius, 2 * innerRadius);
}

function drawMoon(x, y, moonRadius, offset) {
  fill(255, 165, 0);
  ellipse(x, y, moonRadius * 2, moonRadius * 2); 
  fill(3, 61, 94); 
  ellipse(x + offset, y, moonRadius * 1.9, moonRadius * 1.9); 
}

function windowResized() {
  size = Math.min(windowWidth, windowHeight); 
  scaleFactor = Math.min(windowWidth, windowHeight) / 1024; 
  resizeCanvas(size, size); 
  scale(scaleFactor); 
}