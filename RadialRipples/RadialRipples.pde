boolean recording = false;

void setup() {
  size(800, 600);
}

void keyPressed() {
  if (key == 'r' || key == 'R') {
    recording = !recording;
  }
}


void draw() {
  background(255); // White background
  translate(width / 2, height / 2); // Move the origin to the center of the screen
  
  int cols = 40; // Number of columns
  int rows = 40; // Number of rows
  float spacing = width / float(cols); // Spacing between each dot
  
  float time = millis() / 1000.0; // Use time to create animation
  
  for (int i = 0; i < cols; i++) {
    for (int j = 0; j < rows; j++) {
      float angle = map(i, 0, cols-1, 0, TWO_PI);
      float radius = map(j, 0, rows-1, 0, width / 2);
      
      float x = radius * cos(angle);
      float y = radius * sin(angle);
      
      float size = 10 + 10 * sin(radius / 50 - time * 2); // Modulate size over time
      
      fill(0); // Black fill
      
      ellipse(x, y, size, size);
    }
  }
  if (recording) {
    saveFrame("output/#####.png");
  }
}
