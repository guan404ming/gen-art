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
      float x = map(i, 0, cols-1, -width / 2, width / 2);
      float y = map(j, 0, rows-1, -height / 2, height / 2);
      
      float distance = dist(x, y, 0, 0); // Calculate distance from center
      float maxDistance = dist(0, 0, width / 2, height / 2); // Maximum distance from the center
      // Use a non-linear function to map size based on distance for more variation
      float size = 20 * (1 - pow(distance / maxDistance, 2)); // Quadratic relationship
      size *= 1 + 0.5 * sin(distance / 50 - time * 2); // Modulate size over time

      if (i % 2 == 0) { // Alternate rows to shift every second column to create a wave effect
        y += spacing / 2;
      }
      
      fill(0); // Black fill
      ellipse(x, y, size, size);
    }
  }
  if (recording) {
    saveFrame("output/#####.png");
  }
}
