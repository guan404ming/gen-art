void setup() {
  size(640, 360);
}

boolean recording = false;
void keyPressed() {
  if (key == 'r' || key == 'R') {
    recording = !recording;
  }
}

void draw() {
  loadPixels();
  float n = map(cos(frameCount * 0.01), -1, 1, 0, 10);
  float w = 16.0 * sin(frameCount * 0.01) + 20; // Vary the width with a sine function for scaling effect
  float h = 16.0 * cos(frameCount * 0.01) + 20; // Vary the height with a cosine function for scaling effect
  float dx = w / width;    // Increment x this amount per pixel
  float dy = h / height;   // Increment y this amount per pixel
  float xOrigin = -w/2;    // Start x at -1 * width / 2
  float yOrigin = -h/2;    // Start y at -1 * height / 2
  float rotation = frameCount * 0.02; // Increase rotation over time

  for (int i = 0; i < width; i++) {
    for (int j = 0; j < height; j++) {
      // Apply rotation and scale to the x and y coordinates
      float x = xOrigin + i * dx;
      float y = yOrigin + j * dy;
      float xRotated = x * cos(rotation) - y * sin(rotation);
      float yRotated = x * sin(rotation) + y * cos(rotation);

      float r = sqrt((xRotated*xRotated) + (yRotated*yRotated));
      float theta = atan2(yRotated, xRotated);
      float val = sin(n * cos(r) + cos(theta) + random(-1, 1));
      pixels[i + j * width] = color((val + 1.0) * 255.0 / 2.0);
    }
  }
  updatePixels();
  if (recording) {
    saveFrame("output/#####.png");
  }
}
