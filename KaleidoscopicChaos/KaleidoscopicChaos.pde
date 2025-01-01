int numCircles = 65;
float[] x = new float[numCircles];
float[] y = new float[numCircles];
float[] xSpeed = new float[numCircles];
float[] ySpeed = new float[numCircles];
boolean recording = false;


void keyPressed() {
  if (key == 'r' || key == 'R') {
    recording = !recording;
  }
}

void setup() {
  size(600, 600);
  noStroke();
  for (int i = 0; i < numCircles; i++) {
    x[i] = random(width);
    y[i] = random(height);
    xSpeed[i] = random(2, 5) * (random(1) > 0.5 ? 1 : -1);
    ySpeed[i] = random(2, 5) * (random(1) > 0.5 ? 1 : -1);
  }
}

float angleX = 0;
float angleY = 0;
float angleZ = 0;

void draw() {
  background(0);
    
  for (int i = 0; i < numCircles; i++) {
    ellipse(x[i], y[i], random(50), random(50));
    stroke(random(0, 255));
    
    noFill();
    x[i] += xSpeed[i];
    y[i] += ySpeed[i];
    
    if (x[i] > width || x[i] < 0) {
      xSpeed[i] = -xSpeed[i];
    }
    if (y[i] > height || y[i] < 0) {
      ySpeed[i] = -ySpeed[i];
    }
  }
  
   if (recording) {
    saveFrame("output/#####.png");
  }
}
