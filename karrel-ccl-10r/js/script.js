//ASSETS
let imgBG;
let imgButtonReset;
let imgLogo;
let imgCounter;
let genshinFont;

//SLIMES
let slimeOutline = "#786c3d";

//anemo
let anemoColor = "#a9e4d0";

//geo
let geoColor = "#7e7468";
let geoHorn = "#867a7a";

//dendro
let pyroColor = "#d46e37";

//hydro
let hydroColor = "#69c4d0";

//dendro
let dendroColor = "#74a14d";

//electro slime
let electroHorn = "#70537a";
let electroColor = "#9468a6";

//cryo slime
let cryoColor = "#b4d7e8";
let cryoHorn = "#f4faf6";

function preload() {
  imgBG = loadImage("assets/background.PNG");
  imgButtonReset = loadImage("assets/resetButton.PNG");
  imgCounter = loadImage("assets/counter.PNG");
}

function setup() {
  createCanvas(900, 600);

}

function draw() {
  //background
  push();
  background(220);
  image(imgBG, 0, 0);
  pop();

  //reset slime button: take out later!
  push();
  translate(670, 35);
  scale(0.3);
  image(imgButtonReset, 0, 0);
  pop();

  //counter
  push();
  translate(20, 35);
  scale(0.35);
  image(imgCounter, 0, 0);
  pop();

  //counter text
  push();
  fill(slimeOutline);
  // textFont(genshinFont);
  textSize(30);
  text(slimes.length, 185, 75);
  pop();

  for (a = 0; a < slimes.length; a++) {
    for (b = 0; b < slimes.length; b++) {
      if (a != b) {
        if (slimes[a].intersects(slimes[b])) {
          if (slimes[a].reaction(slimes[b]) == 1) {
            let newx = (slimes[a].x + slimes[b].x) / 2;
            let newy = (slimes[a].y + slimes[b].y) / 2;
            let kidSlime = new Slime(newx, newy, slimes[a].elem, 1);
            slimes.push(kidSlime);
          } else if (slimes[a].reaction(slimes[b]) == 2) {
            let t = check_reaction(slimes[a].elem, slimes[b].elem);
            let newx = (slimes[a].x + slimes[b].x) / 2;
            let newy = (slimes[a].y + slimes[b].y) / 2 - 50;
            if (t) {
              push();
              // textFont(genshinFont);
              fill(slimeOutline);
              textSize(20);
              text(t, newx, newy);
              pop();
            }
            slimes[a].state = 1;
            slimes[b].state = 1;
          }
        }
      }
    }
  }
  for (let s of slimes) {
    //call Slime method into draw
    s.move();
    s.keepInArea();
    s.grow();
    s.age();
    s.show();
  }

  // if it's done (state == 2), we kill the slimes, remove from array
  for (let i = slimes.length - 1; i >= 0; i--) {
    let s = slimes[i];
    if (s.state == 2) {
      slimes.splice(i, 1);
    }
  }
}

function check_reaction(e1, e2) {
  let arr = [e1, e2];
  if (arr.includes(0)) {
    if (!arr.includes(1)) {
      return "Swirl";
    }
  } else if (arr.includes(1)) {
    if (!arr.includes(0)) {
      return "Crystalize";
    }
  } else if (arr.includes(2)) {
    if (arr.includes(3)) {
      return "Melt";
    } else if (arr.includes(4)) {
      return "Freeze";
    } else if (arr.includes(6)) {
      return "Superconduct";
    }
  } else if (arr.includes(3)) {
    if (arr.includes(4)) {
      return "Vaporize";
    } else if (arr.includes(5)) {
      return "Burn";
    } else if (arr.includes(6)) {
      return "Overload";
    }
  } else if (arr.includes(4)) {
    if (arr.includes(6)) {
      return "Electro-charged";
    }
  }
  return "new reaction!";
}

class Slime {
  constructor(x, y, elem, isKid) {
    //place into canvas
    this.x = x;
    this.y = y;

    // for slime movement + speed
    this.spdMag = random(1, 2);
    this.xSpd = 0;
    this.ySpd = 0;

    // for noise random movement
    this.xOffset = random(0, 100); // to map onto mouseX
    this.yOffset = random(0, 100); // to map onto mouseY

    //bouncing
    this.bouncingFrq = random(5, 8);
    this.bouncingMag = 0.3;

    //for slime elem check + kid check
    this.elem = elem;
    this.isKid = isKid;
    if (isKid) {
      this.scale = 0.25;
      this.givebirth = false;
    } else {
      this.scale = 0.5;
      this.givebirth = true;
    }
    //for intersection
    this.xr = 250 * this.scale;
    this.yr = 185 * this.scale;

    this.state = 0;
    // 0: young
    // 1: just gave a birth (it will be aging)!
    // 2: Done!
    this.lifespan = 1.0;
    this.lifeReduction = random(0.02, 0.05);

    this.borntime = new Date(); // let's redesign with frameCount
  }
  //call draw functions into class
  show() {
    let elemf = [
      draw_anemo,
      draw_geo,
      draw_cryo,
      draw_pyro,
      draw_hydro,
      draw_dendro,
      draw_electro,
    ];
    push();
    translate(this.x, this.y);
    //slime bouncing action
    let bounceScale = map(
      sin(frameCount * this.bouncingFrq),
      -1,
      1,
      0.95,
      1.05
    );
    scale(bounceScale * this.lifespan);
    elemf[this.elem](0, 0, 0, this.scale);
    pop();
  }

  move() {
    // update the speed by noise
    this.xSpd =
      map(noise(this.xOffset + frameCount * 0.01), 0, 1, -1, 1) * this.spdMag;
    this.ySpd =
      map(noise(this.yOffset + frameCount * 0.01), 0, 1, -1, 1) * this.spdMag;
    // move
    this.x += this.xSpd;
    this.y += this.ySpd;
    // bounce
    this.y += sin(frameCount * this.bouncingFrq) * this.bouncingMag;
  }
  keepInArea() {
    //keep slime within boundary, if not push into it
    let area = 200;
    if (this.x < area) {
      let mag = map(this.x, 0, area, 5, 0);
      this.x += mag;
    }
    if (this.x > width - area) {
      let mag = map(this.x, width - area, width, 0, 5);
      this.x -= mag;
    }
    if (this.y < area + 200) {
      let mag = map(this.y, 0, area, 5, 0);
      this.y += mag;
    }
    if (this.y > area) {
      let mag = map(this.y, height - area, height, 0, 5);
      this.y -= mag;
    }
  }

  intersects(other) {
    //check intersection between 2 ellipses (slimes)
    let dx = abs(this.x - other.x);
    let dy = abs(this.y - other.y);
    if (
      dx ** 2 * this.yr ** 2 + dy ** 2 * this.xr ** 2 <=
      this.xr ** 2 * this.yr ** 2
    ) {
      return true;
    } else {
      return false;
    }
  }

  //1: same element can have baby.
  //2: different element
  //3: same element cant have baby.
  reaction(other) {
    if (this.elem == other.elem) {
      if (this.givebirth && other.givebirth) {
        this.givebirth = false;
        other.givebirth = false;
        return 1;
      } else {
        return 3;
      }
    } else {
      return 2;
    }
  }

  grow() {
    // for slime kid
    if (new Date() - this.borntime > 10000 && this.isKid) {
      this.scale = 0.5;
      this.givebirth = true;
      this.isKid = false;
    }
  }

  age() {
    // for slime death
    if (this.state == 1) {
      this.lifespan -= this.lifeReduction;
      if (this.lifespan <= 0) {
        this.lifespan = 0;
        this.state = 2; // done!
      }
    }
  }
}

slimes = [];

function mousePressed() {
  // reset button
  if (710 <= mouseX && mouseX <= 840 && 45 <= mouseY && mouseY <= 85) {
    slimes = [];
  } else {
    element = floor(random(0, 7));
    let s = new Slime(mouseX, mouseY, element, 0);
    slimes.push(s);
  }
}

function draw_anemo(x, y, a, s) {
  push();
  translate(x, y);
  rotate(a);
  scale(s);
  draw_slimeWings(88, -85, 1, 1); // right
  draw_slimeWings(-90, -78, 1, -1); // left
  draw_slimeBody(1, 1, 0, 1, anemoColor);
  draw_slimeEyes(0, 0, 0, 1);
  pop();
}

function draw_geo(x, y, a, s) {
  angleMode(RADIANS);
  let sinValue = sin(frameCount * 7);
  let angle = map(sinValue, -1, 1, 5, 25);

  push();
  translate(x, y);
  rotate(a + 11);
  scale(s);
  stroke(slimeOutline);
  strokeWeight(6);
  fill(geoHorn);
  rect(30, -130 + angle, 50, 55);
  pop();

  push();
  translate(x, y);
  rotate(a - 11);
  scale(s);
  stroke(slimeOutline);
  strokeWeight(6);
  fill(geoHorn);
  rect(-80, -(110 + angle), 50, 55);
  pop();

  push();
  translate(x, y);
  rotate(a);
  scale(s);
  draw_slimeBody(1, 1, 0, 1, geoColor);
  draw_slimeEyes(0, 0, 0, 1);
  pop();
}

function draw_pyro(x, y, a, s) {
  push();
  translate(x, y);
  rotate(a);
  scale(s);
  draw_slimeBody(1, 1, 0, 1, pyroColor);
  draw_slimeEyes(0, 0, 0, 1);

  pop();
}

function draw_hydro(x, y, a, s) {
  let sinValue = sin(frameCount * 3);
  let alpha = map(sinValue, 0.5, 1, 70, 100);

  push();
  translate(x, y);
  rotate(a);
  scale(s);
  draw_slimeBody(1, 1, 0, 1, hydroColor);
  draw_slimeEyes(0, 0, 0, 1);
  pop();

  push();
  translate(x, y);
  noStroke();
  scale(s)

  fill(232, 250, 255, alpha)
  ellipse(60, 20, 15, 30);
  ellipse(-60, 20, 15, 30)
  pop();
}

function draw_electro(x, y, a, s) {
  push();
  translate(x, y - 5);
  rotate(a);
  scale(s);

  let sinValue = sin(frameCount * random(6, 7));
  let alpha = map(sinValue, 0.5, 1, 70, 100);

  fill(3, 252, 252, alpha);
  noStroke();
  circle(40, -150, 100);

  pop();

  push();
  translate(x, y - 5);
  rotate(s + 15);
  scale(s);
  strokeWeight(5);
  stroke(slimeOutline);
  fill(electroHorn);
  triangle(-60, 0, -0, -150, 70, 0);
  pop();

  push();
  translate(x, y - 5);
  rotate(a);
  scale(s);
  strokeWeight(5);
  stroke(slimeOutline);
  colorMode(HSB);

  let h = map(mouseX, 0, width, 0, 90);

  fill(306, h, 85);
  circle(40, 150, 50);
  pop();

  push();
  translate(x, y);
  rotate(a);
  scale(s);
  draw_slimeBody(1, 1, 0, 1, electroColor);
  draw_slimeEyes(0, 0, 0, 1);
  pop();
}

function draw_cryo(x, y, a, s) {
  push();
  translate(x, y);
  rotate(a);
  scale(s);
  strokeWeight(5);
  stroke(slimeOutline);
  fill(cryoHorn);
  triangle(-70, 0, -0, -150, 70, 0);
  pop();

  push();
  translate(x, y);
  rotate(a - 10);
  scale(s);
  strokeWeight(5);
  stroke(slimeOutline);
  fill(cryoHorn);
  triangle(-120, -0, -70, -120, 0, 0);
  pop();

  push();
  scale(s);
  translate(x + 115, y + 25);
  rotate(s + 20);
  strokeWeight(5);
  stroke(slimeOutline);
  fill(cryoHorn);
  triangle(-120, -0, -70, -120, 0, 0);
  pop();

  push();
  translate(x, y);
  rotate(a);
  scale(s);
  draw_slimeBody(1, 1, 0, 1, cryoColor);
  draw_slimeEyes(0, 0, 0, 1);
  pop();
}

function draw_dendro(x, y, a, s) {
  push();
  scale(s);
  translate(x, y);

  let sinValue = sin(frameCount * 7);
  let angle = map(sinValue, -1, 1, 5, 25);

  rotate(angle);
  strokeWeight(6);
  stroke(slimeOutline);
  fill("#6e9b53");
  ellipse(-5, -110, 35, 75);
  pop();

  push();
  translate(x, y);
  rotate(a);
  scale(s);
  draw_slimeBody(1, 1, 0, 1, dendroColor);
  draw_slimeEyes(0, 0, 0, 1);
  pop();
}

function draw_slimeBody(x, y, a, s, color) {
  //shadow

  push();
  noStroke();
  fill(128, 128, 128, 65);
  ellipse(0, 76, 230, 90);

  pop();

  //body
  push();
  translate(x, y);
  rotate(a);
  scale(s);
  fill(color);
  stroke(slimeOutline);
  strokeWeight(6);
  ellipse(0, 0, 250, 185);

  //body_details
  fill(255, 255, 255, 120);
  noStroke();
  ellipse(0, -62, 150, 50);
  pop(); //

  //cheeks
  push();
  noStroke();
  fill("#FFB6C180");
  ellipse(-65, 25, 40, 20);
  ellipse(65, 25, 40, 20);
  pop();
}

function draw_slimeEyes(x, y, a, s) {
  //eyes_normal
  push();
  translate(x, y);
  stroke("#ca6a74");
  strokeWeight(6);
  fill("white");
  ellipse(-45, -20, 35, 55);
  ellipse(45, -20, 35, 55);
  pop();
}

function draw_slimeWings(x, y, s_x, s_y) {
  //left_wing
  push();
  translate(x, y);
  scale(s_x, s_y);

  let sinValue = sin(frameCount * 7);
  let angle = map(sinValue, -1, 1, 15, 45);

  rotate(angle);
  stroke(slimeOutline);
  strokeWeight(5);

  fill("white");

  ellipse(20, 0, 25, 50);
  ellipse(0, 0, 30, 60);
  pop();
}
