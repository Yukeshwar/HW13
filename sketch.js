// serial variables
let mSerial;

let connectButton;

let readyToReceive;

// project variables
let mElls = [];

function receiveSerial() {
  let line = mSerial.readUntil("\n");
  trim(line);
  if (!line) return;

  if (line.charAt(0) != "{") {
    print("error: ", line);
    readyToReceive = true;
    return;
  }

  // get data from Serial string
  let data = JSON.parse(line).data;
  let a0 = data.A0;
  let d2 = data.D2;

  // use data to update project variables
  if (d2.isPressed) {
    mElls.push({
      x: random(width),
      y: random(height),
      c: map(d2.count % 20, 0, 20, 155, 255),
      d: map(a0.value, 0, 4095, 20, 200),
    });
  }

  // serial update
  readyToReceive = true;
}

function connectToSerial() {
  if (!mSerial.opened()) {
    mSerial.open(9600);

    readyToReceive = true;
    connectButton.hide();
  }
}

function setup() {
  // setup project
  createCanvas(windowWidth, windowHeight);

  // setup serial
  readyToReceive = false;

  mSerial = createSerial();

  connectButton = createButton("Connect To Serial");
  connectButton.position(width / 2, height / 2);
  connectButton.mousePressed(connectToSerial);
}

function draw() {
  // project logic
  background(0);

  for (let i = 0; i < mElls.length; i++) {
    let me = mElls[i];
    fill(me.c, 0, 0);
    ellipse(me.x, me.y, me.d, me.d);
  }

  // update serial: request new data
  if (mSerial.opened() && readyToReceive) {
    readyToReceive = false;
    mSerial.clear();
    mSerial.write(0xab);
  }

  // update serial: read new data
  if (mSerial.availableBytes() > 8) {
    receiveSerial();
  }
}
