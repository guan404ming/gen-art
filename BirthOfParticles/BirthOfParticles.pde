int num = 150;
Particle[] particles;
boolean recording = false;

void keyPressed() {
  if (key == 'r' || key == 'R') {
    recording = !recording;
  }
}

void setup() {
  size(800, 800);
  background(0);
  smooth();
  
  particles = new Particle[num];
  for (int i = 0; i < num; i++) {
    particles[i] = new Particle();
  }
}

void draw() {
  noStroke();
  float dir = random(360);
  
  for (Particle p : particles) {
    if (p.age < 1) {
      p.init(dir);
      break;
    }
  }
  
  for (Particle p : particles) {
    if (p.age > 0) {
      p.update();
    }
  }
  
   if (recording) {
    saveFrame("output/#####.png");
  }
}

class Particle {
  PVector position, velocity;
  float direction, speed;
  int age;
  
  Particle() {
    position = new PVector(width / 2, height / 2);
    velocity = new PVector(0, 0);
    age = 0;
  }

  void init(float dir) {
    direction = dir;
    age = random(1) < 0.8 ? int(random(15, 45)) : int(random(45, 150));
    speed = random(1) < 0.8 ? random(0.5, 2.5) : random(2, 4);
    
    float angle = radians(direction + 90 + (random(1) > 0.5 ? random(-20, 20) : random(-60, 60)));
    velocity.set(speed * cos(angle), speed * sin(angle));
  }
  
  void update() {
    age--;
    velocity.rotate(radians(1));
    velocity.mult(1.01);
    
    position.add(velocity);
    fill(255, 255, 255, random(10, 50));
    drawParticle();
  }
  
  void drawParticle() {
    pushMatrix();
    translate(position.x, position.y);
    rotate(radians(direction));
    rect(0, 0, 1, 16);
    popMatrix();
  }
}
