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
  float w = 16.0;
  float h = 16.0;
  float dx = w / width;    // Increment x this amount per pixel
  float dy = h / height;   // Increment y this amount per pixel
  float x = -w/2;          // Start x at -1 * width / 2

  for (int i = 0; i < width; i++) {
    float y = -h / 2;
    for (int j = 0; j < height; j++) {
      float r = sqrt((x*x) + (y*y));
      float theta = atan2(y, x);
      float val = sin(n * cos(r) + cos(theta) + random(-1, 1));
      pixels[i + j * width] = color((val + 1.0) * 255.0 / 2.0);
      y += dy;
    }
    x += dx;
  }
  updatePixels();
  if (recording) {
    saveFrame("output/#####.png");
  }
}
