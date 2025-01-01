float angle = 0; // Initialize rotation angle
float scaleFactor = 1; // Initialize scale factor
boolean scalingUp = true; // Direction of scaling
int numRects = 12; // Number of rectangles to draw
boolean recording = false;

void keyPressed() {
  if (key == 'r' || key == 'R') {
    recording = !recording;
  }
}

void setup() {
  size(700, 700);
  rectMode(CENTER); // Set rectangle mode to center
}

void draw() {
  background(0);
  
  loadPixels();
  for (int i = 0; i < width * height; i++) {
    pixels[i] = color(0, 0, 0);
    if (random(1) < 0.0025) { // Randomly introduce white pixels
      pixels[i] = color(255);
    }
  }
  updatePixels();

  if (scalingUp) {
    scaleFactor += 0.005;
    if (scaleFactor > 5) {
      scalingUp = false;
    }
  } else {
    scaleFactor -= 0.005;
    if (scaleFactor < 0.005) {
      scalingUp = true;
    }
  }
  
  angle += 0.05;
  translate(width / 2, height / 2);

  for (int i = 0; i < numRects; i++) {
    float rectAngle = TWO_PI / numRects * i + angle;
    float rectX = cos(rectAngle) * 120;
    float rectY = sin(rectAngle) * 120;

    pushMatrix();
    translate(rectX, rectY);     
    rotate(angle + PI / numRects * i); 
    scale(scaleFactor / 2);
    ellipse(0, 0, 100, 100);
    stroke(random(0, 255));
    noFill();
    popMatrix();
  }

  if (recording) {
    saveFrame("output/#####.png");
  }
}
