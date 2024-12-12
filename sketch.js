let mSerial;
let connectButton;
let readyToReceive = false;

// Variables for controlling the pyramid
let potValue = 512; 
let buttonCount = 0;
let baseSize = 100; 
let colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff'];
let currentColors = [...colors]; 

function setup() {
  createCanvas(windowWidth, windowHeight);

  // Setup serial communication
  mSerial = createSerial();
  connectButton = createButton("Connect to Serial");
  connectButton.position(width / 2 - 50, height / 2);
  connectButton.mousePressed(connectToSerial);

  readyToReceive = false;
}

function draw() {
  background(200);

  // Adjust base size dynamically based on potentiometer
  let dynamicSize = map(potValue, 0, 1023, 50, 300);

  // Draw the pyramid
  drawPyramid(width / 2, height / 2, dynamicSize);

  
  if (mSerial.opened() && readyToReceive) {
    mSerial.write(0xAB); // Request data
    readyToReceive = false;
  }

  // Read incoming serial data
  if (mSerial.availableBytes() > 0) {
    receiveSerial();
  }
}

function drawPyramid(centerX, centerY, size) {
  noStroke();

  // Base triangle
  fill(currentColors[0]);
  triangle(centerX - size, centerY + size, centerX, centerY - size, centerX + size, centerY + size);

  // Left trapezoid
  fill(currentColors[1]);
  beginShape();
  vertex(centerX - size, centerY + size);
  vertex(centerX - size / 2, centerY + size / 2);
  vertex(centerX, centerY + size);
  vertex(centerX - size / 2, centerY + size + size / 2);
  endShape(CLOSE);

  // Right trapezoid
  fill(currentColors[2]);
  beginShape();
  vertex(centerX + size, centerY + size);
  vertex(centerX + size / 2, centerY + size / 2);
  vertex(centerX, centerY + size);
  vertex(centerX + size / 2, centerY + size + size / 2);
  endShape(CLOSE);

  // Top trapezoid
  fill(currentColors[3]);
  beginShape();
  vertex(centerX, centerY - size);
  vertex(centerX - size / 2, centerY - size / 2);
  vertex(centerX + size / 2, centerY - size / 2);
  vertex(centerX, centerY);
  endShape(CLOSE);

  // Bottom trapezoid
  fill(currentColors[4]);
  beginShape();
  vertex(centerX - size / 2, centerY + size / 2);
  vertex(centerX + size / 2, centerY + size / 2);
  vertex(centerX + size, centerY + size + size / 2);
  vertex(centerX - size, centerY + size + size / 2);
  endShape(CLOSE);
}

function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600);
    connectButton.hide();
    readyToReceive = true;
  }
}

function receiveSerial() {
  let line = mSerial.readUntil("\n").trim(); 
  if (!line) return;

  try {
    if (!line.startsWith("{")) {
      console.error("Invalid JSON format:", line);
      readyToReceive = true;
      return;
    }

    
    let data = JSON.parse(line).data;

    potValue = data?.A0?.value ?? 512; 
    buttonCount = data?.D2?.count ?? 0;

    // Log the values for debugging
    console.log(`Potentiometer: ${potValue}, Button Count: ${buttonCount}`);

    // Update colors
    updateColors();
  } catch (error) {
    console.error("JSON Parsing Error:", error);
    console.error("Raw Data:", line);
  }

  readyToReceive = true;
}

function updateColors() {
  // Cycle colors based on buttonCount
  if (buttonCount > 0) {
    let shiftAmount = buttonCount % colors.length;
    currentColors = colors.slice(shiftAmount).concat(colors.slice(0, shiftAmount));
  }
}
