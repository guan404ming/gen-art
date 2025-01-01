float angle = 0; // Initialize rotation angle
float scaleFactor = 0.5; // Initialize scale factor
boolean scalingUp = true; // Direction of scaling
int numLayers = 3; // Number of circle layers
int numCirclesPerLayer = 10; // Number of circles per layer
float[] layerRadius = {120, 240, 360}; // Radii for each layer
float[] layerSpeeds = {0.05, -0.03, -0.08}; // Speed of rotation for each layer, negative for reverse direction
boolean recording = false;

void keyPressed() {
  if (key == 'r' || key == 'R') {
    recording = !recording;
  }
}

void setup() {
  size(700, 700);
  rectMode(CENTER);
}

void draw() {
  background(0);

  // Introduce random flickering effect
  loadPixels();
  for (int i = 0; i < width * height; i++) {
    pixels[i] = color(0, 0, 0);
    if (random(1) < 0.0025) {
      pixels[i] = color(255);
    }
  }
  updatePixels();

  // Scale effect
  if (scalingUp) {
    scaleFactor += 0.05;
    if (scaleFactor > 30) {
      scalingUp = false;
    }
  } else {
    scaleFactor -= 0.05;
    if (scaleFactor < 0.05) {
      scalingUp = true;
    }
  }

  translate(width / 2, height / 2);
  angle += 0.5;

  // Multiple layers of circles
  for (int layer = 0; layer < numLayers; layer++) {
    for (int i = 0; i < numCirclesPerLayer; i++) {
      float rectAngle = TWO_PI / numCirclesPerLayer * i + angle * layerSpeeds[layer] * random(-1, 1);
      float rectX = cos(rectAngle) * layerRadius[layer] * i;
      float rectY = sin(rectAngle) * layerRadius[layer] * i;

      pushMatrix();
      translate(rectX, rectY);
      rotate(angle + PI / numCirclesPerLayer * i);
      scale(scaleFactor / 4);
      ellipse(0, 0, 100, 100);
      stroke(random(0, 255));
      noFill();
      popMatrix();
    }
  }

  if (recording) {
    saveFrame("output/#####.png");
  }
}
