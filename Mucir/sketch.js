let circles = [];
let connections = [];
let currentCircle = null;
let clickX = 0;
let clickY = 0;
let connectionDistance = 300;
let recording = false;
let frameCounter = 0;
let isDoubleClick = false;
let audioStarted = false;

let synth;
let fmSynth;
let amSynth;
let duoSynth;
let monoSynth;
let membraneSynths = [];
let metalSynths = [];
let reverb;
let delay;
let chorus;

function setup() {
  createCanvas(windowWidth, windowHeight);
  background(0);

  reverb = new Tone.Reverb({
    decay: 8,
    wet: 0.4,
    preDelay: 0.01,
  }).toDestination();

  delay = new Tone.FeedbackDelay({
    delayTime: "8n",
    feedback: 0.6,
    wet: 0.4,
  }).connect(reverb);

  chorus = new Tone.Chorus({
    frequency: 2,
    delayTime: 3.5,
    depth: 0.5,
    wet: 0.3,
  }).connect(delay);

  chorus.start();

  synth = new Tone.PolySynth({
    maxPolyphony: 64,
    voice: Tone.Synth,
  }).connect(chorus);
  synth.volume.value = -12;
  synth.set({
    envelope: {
      attack: 0.5,
      decay: 0.3,
      sustain: 0.7,
      release: 2,
    },
  });

  fmSynth = new Tone.PolySynth({
    maxPolyphony: 64,
    voice: Tone.FMSynth,
  }).connect(chorus);
  fmSynth.volume.value = -15;
  fmSynth.set({
    envelope: {
      attack: 0.3,
      decay: 0.2,
      sustain: 0.6,
      release: 1.5,
    },
  });

  amSynth = new Tone.PolySynth({
    maxPolyphony: 64,
    voice: Tone.AMSynth,
  }).connect(chorus);
  amSynth.volume.value = -15;
  amSynth.set({
    envelope: {
      attack: 0.4,
      decay: 0.2,
      sustain: 0.6,
      release: 1.8,
    },
  });

  duoSynth = new Tone.PolySynth({
    maxPolyphony: 64,
    voice: Tone.DuoSynth,
  }).connect(chorus);
  duoSynth.volume.value = -18;
  duoSynth.set({
    voice0: {
      envelope: {
        attack: 0.6,
        decay: 0.3,
        sustain: 0.7,
        release: 2,
      },
    },
    voice1: {
      envelope: {
        attack: 0.7,
        decay: 0.3,
        sustain: 0.8,
        release: 2.5,
      },
    },
  });

  monoSynth = new Tone.PolySynth({
    maxPolyphony: 64,
    voice: Tone.MonoSynth,
  }).connect(chorus);
  monoSynth.volume.value = -12;
  monoSynth.set({
    envelope: {
      attack: 0.5,
      decay: 0.3,
      sustain: 0.7,
      release: 2,
    },
  });

  for (let i = 0; i < 8; i++) {
    let membrane = new Tone.MembraneSynth().connect(reverb);
    membrane.volume.value = -12;
    membraneSynths.push(membrane);
  }

  for (let i = 0; i < 4; i++) {
    let metal = new Tone.MetalSynth().connect(reverb);
    metal.volume.value = -25;
    metalSynths.push(metal);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function draw() {
  background(0, 0, 0, 25);

  drawCircles();
  drawConnections();

  if (currentCircle) {
    currentCircle.update();
    currentCircle.display();
  }

  if (recording) {
    frameCounter++;
    saveCanvas(`frame_${nf(frameCounter, 5)}`, "png");
  }
}

async function mousePressed() {
  if (!audioStarted) {
    await Tone.start();
    audioStarted = true;
  }

  if (isDoubleClick) {
    isDoubleClick = false;
    return;
  }

  clickX = mouseX;
  clickY = mouseY;
  currentCircle = new Circle(clickX, clickY);
  currentCircle.radius = 1;
}

function mouseDragged() {
  if (currentCircle) {
    let distance = dist(clickX, clickY, mouseX, mouseY);
    currentCircle.radius = distance;
    currentCircle.originalRadius = distance;
    currentCircle.targetRadius = distance;
    currentCircle.setupInstrument();
  }
}

function mouseReleased() {
  if (isDoubleClick) {
    currentCircle = null;
    return;
  }

  if (currentCircle && currentCircle.radius > 5) {
    if (circles.length > 0) {
      let closestCircle = null;
      let minDistance = connectionDistance;

      for (let c of circles) {
        let d = dist(currentCircle.x, currentCircle.y, c.x, c.y);
        if (d < minDistance) {
          minDistance = d;
          closestCircle = c;
        }
      }

      if (closestCircle) {
        let connection = new Connection(closestCircle, currentCircle);
        connections.push(connection);
      }
    }

    circles.push(currentCircle);
  }
  currentCircle = null;
}

function doubleClicked() {
  isDoubleClick = true;

  for (let i = circles.length - 1; i >= 0; i--) {
    let d = dist(mouseX, mouseY, circles[i].x, circles[i].y);
    if (d < circles[i].radius) {
      let removedCircle = circles[i];
      circles.splice(i, 1);

      connections = connections.filter((conn) => {
        return conn.from !== removedCircle && conn.to !== removedCircle;
      });

      break;
    }
  }

  return false;
}

function keyPressed() {
  if (key === "r" || key === "R") {
    recording = !recording;
  }
  if (key === "c" || key === "C") {
    circles = [];
    connections = [];
    background(0);
  }
}

function drawConnections() {
  for (let conn of connections) {
    conn.update();
    conn.display();
  }
}

function drawCircles() {
  for (let c of circles) {
    c.update();
    c.display();
  }
}

class Circle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.radius = 10;
    this.originalRadius = 10;
    this.targetRadius = 10;
    this.grayValue = random(100, 255);
    this.isHit = false;
    this.instrument = null;
    this.instrumentIndex = 0;
    this.totalHits = 0;

    this.attack = random(0.1, 0.8);
    this.decay = random(0.1, 0.6);
    this.sustain = random(0.4, 0.9);
    this.release = random(1, 3);

    this.setupInstrument();
  }

  setupInstrument() {
    let radiusNorm = constrain(this.originalRadius / 150, 0, 1);
    let grayNorm = map(this.grayValue, 100, 255, 0, 1);

    let cannonNotes = ["D", "A", "B", "F#", "G", "D", "G", "A"];
    let noteIndex = floor(map(grayNorm, 0, 1, 0, 8));

    let octaveVariation = floor(random(0, 3));

    if (radiusNorm < 0.12) {
      this.instrumentType = "metal";
      this.instrumentIndex = floor(random(metalSynths.length));
      this.note = null;
    } else if (radiusNorm < 0.24) {
      this.instrument = fmSynth;
      this.instrumentType = "fm";
      this.note = cannonNotes[noteIndex] + (5 + (octaveVariation % 2));
    } else if (radiusNorm < 0.36) {
      this.instrument = duoSynth;
      this.instrumentType = "duo";
      this.note = cannonNotes[noteIndex] + (5 - (octaveVariation % 2));
    } else if (radiusNorm < 0.48) {
      this.instrument = amSynth;
      this.instrumentType = "am";
      this.note = cannonNotes[noteIndex] + (4 + (octaveVariation % 2));
    } else if (radiusNorm < 0.6) {
      this.instrument = monoSynth;
      this.instrumentType = "mono";
      this.note = cannonNotes[noteIndex] + (4 - (octaveVariation % 2));
    } else if (radiusNorm < 0.72) {
      this.instrument = synth;
      this.instrumentType = "synth";
      this.note = cannonNotes[noteIndex] + (3 + (octaveVariation % 2));
    } else if (radiusNorm < 0.86) {
      this.instrument = fmSynth;
      this.instrumentType = "fm";
      this.note = cannonNotes[noteIndex] + (3 - (octaveVariation % 2));
    } else {
      this.instrumentType = "membrane";
      this.instrumentIndex = floor(random(membraneSynths.length));
      this.note = cannonNotes[noteIndex] + (2 + (octaveVariation % 2));
    }
  }

  hit() {
    this.isHit = true;
    this.targetRadius = this.originalRadius * 1.5;
    this.totalHits++;
    this.playSound();

    if (this.totalHits >= 20) {
      this.die();
      return;
    }

    if (random(1) < 0.2) {
      this.spawnNewCircle();
    }
  }

  die() {
    let index = circles.indexOf(this);
    if (index > -1) {
      circles.splice(index, 1);

      connections = connections.filter((conn) => {
        return conn.from !== this && conn.to !== this;
      });
    }
  }

  spawnNewCircle() {
    if (circles.length >= 50) {
      return;
    }

    let allowOverlap = random(1) < 0.5;
    let newX, newY, newRadius;
    let validPosition = false;

    if (allowOverlap) {
      newX = randomGaussian(width / 2, width / 6);
      newY = randomGaussian(height / 2, height / 6);

      newX = constrain(newX, 50, width - 50);
      newY = constrain(newY, 50, height - 50);

      newRadius = random(5, 200);
      validPosition = true;
    } else {
      let maxAttempts = 50;

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        newX = randomGaussian(width / 2, width / 6);
        newY = randomGaussian(height / 2, height / 6);

        newX = constrain(newX, 50, width - 50);
        newY = constrain(newY, 50, height - 50);

        newRadius = random(5, 200);

        validPosition = true;
        for (let c of circles) {
          let d = dist(newX, newY, c.x, c.y);
          if (d < newRadius + c.radius + 10) {
            validPosition = false;
            break;
          }
        }

        if (validPosition) {
          break;
        }
      }
    }

    if (!validPosition) {
      return;
    }

    let newCircle = new Circle(newX, newY);
    newCircle.radius = newRadius;
    newCircle.originalRadius = newRadius;
    newCircle.targetRadius = newRadius;
    newCircle.setupInstrument();

    circles.push(newCircle);

    if (circles.length > 1) {
      let closestCircle = null;
      let minDistance = connectionDistance;

      for (let c of circles) {
        if (c !== newCircle) {
          let d = dist(newCircle.x, newCircle.y, c.x, c.y);
          if (d < minDistance) {
            minDistance = d;
            closestCircle = c;
          }
        }
      }

      if (closestCircle) {
        let connection = new Connection(closestCircle, newCircle);
        connections.push(connection);
      }
    }
  }

  playSound() {
    if (!audioStarted) return;

    let circleIndex = circles.indexOf(this);
    let isActive = circleIndex >= circles.length - 15;

    if (!isActive) return;

    try {
      if (this.instrumentType === "metal") {
        metalSynths[this.instrumentIndex].triggerAttackRelease("16n");
      } else if (this.instrumentType === "membrane") {
        membraneSynths[this.instrumentIndex].triggerAttackRelease(
          this.note,
          "8n"
        );
      } else {
        this.instrument.triggerAttackRelease(this.note, "8n");
      }
    } catch (e) {
      console.log("Audio error:", e);
    }
  }

  reset() {
    this.isHit = false;
    this.targetRadius = this.originalRadius;
  }

  update() {
    this.radius = lerp(this.radius, this.targetRadius, 0.2);
  }

  display() {
    let circleIndex = circles.indexOf(this);
    let isActive = circleIndex >= circles.length - 15;
    let opacity = isActive ? 150 : 30;
    let centerOpacity = isActive ? 255 : 60;

    let lifeRatio = 1 - this.totalHits / 30;
    let ageRatio = this.totalHits / 30;
    let fadedOpacity = opacity * lifeRatio;

    let currentGrayValue = lerp(255, this.grayValue, ageRatio);

    fill(currentGrayValue, fadedOpacity);
    noStroke();
    circle(this.x, this.y, this.radius * 2);

    stroke(currentGrayValue, fadedOpacity * 1.5);
    strokeWeight(2);
    noFill();
    circle(this.x, this.y, this.radius * 2 + 4);
  }
}

class Connection {
  constructor(fromCircle, toCircle) {
    this.from = fromCircle;
    this.to = toCircle;
    this.progress = 0;
    this.speed = 0.03;
    this.direction = 1;
  }

  update() {
    this.progress += this.speed * this.direction;

    if (this.progress >= 1) {
      this.progress = 1;
      this.direction = -1;
      this.to.hit();
    } else if (this.progress <= 0) {
      this.progress = 0;
      this.direction = 1;
      this.from.hit();
    }

    if (this.progress > 0.1 && this.from.isHit) {
      this.from.reset();
    }
    if (this.progress < 0.9 && this.to.isHit) {
      this.to.reset();
    }
  }

  display() {
    let colorValue = map(
      sin(frameCount * 0.05 + this.from.x * 0.01),
      -1,
      1,
      0,
      255
    );

    stroke(colorValue, 0);
    strokeWeight(2);
    line(this.from.x, this.from.y, this.to.x, this.to.y);

    let dotX = lerp(this.from.x, this.to.x, this.progress);
    let dotY = lerp(this.from.y, this.to.y, this.progress);

    fill(255);
    noStroke();
    circle(dotX, dotY, 8);
  }
}
