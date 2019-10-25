let arrows = [];
let buttons = [];
let resetButton;
let gridSize = 20;
let offsetX = 0;
let offsetY = 0;
let filler;
let sumArrow;
let toggleSum;
let showSum = false;
let isHeadActivated;
let sumVec;
let toggleComponents;
let componentSetting = 0;
let theActivatedVec;
let img;
let gridOn = true;

function preload() {
  img = loadImage('trash.png');
}

function setup() {
  createCanvas(950, 600);
  rectMode(CENTER);
  sumArrow = new Arrow(5, 5, 0, 0, color(0, 180, 0));

  makeArrow = function() {
    sumArrow.comp.mult(0);
    arrows.push(new Arrow(26, 13, 1, 4, color(250, 0, 0)));
    for (const arrow of arrows) {
      sumArrow.comp.x += arrow.comp.x;
      sumArrow.comp.y += arrow.comp.y;
    };
    console.log(arrows);
  }

  toggleSum = function() {
    if (showSum) {
      buttons[2].text = "Hide Sum";
      showSum = false;
    } else {
      buttons[2].text = "Show Sum";
      showSum = true;
    }
  }

  isHeadActivated = function(obj) {
    if (obj.headActivated) {
      return true;
    }
  }

  toggleComponents = function() {
    componentSetting = (componentSetting + 1) % 4;
    if (componentSetting == 0) {
      buttons[3].text = "Show Components";
    }
    if (componentSetting == 1) {
      buttons[3].text = "Change Style";
    }
    if (componentSetting == 2) {
      buttons[3].text = "Change Style";
    }
    if (componentSetting == 3) {
      buttons[3].text = "Hide Components";
    }
  }

  toggleGrid = function() {
  gridOn = !gridOn;
    if (gridOn) {
      buttons[4].text = "Hide Grid";
    } else {
      buttons[4].text = "Show Grid";
    }

  }

  buttons[0] = new ScreenButton(880, 50, 100, 40, "Make a Vector", color(250, 155, 155), makeArrow);
  buttons[1] = new ScreenButton(880, 100, 100, 40, "Reset",
    color(250, 250, 100), () => {
      arrows = [];
      sumArrow.comp.mult(0)
      theActivatedVec = undefined;
    });
  buttons[2] = new ScreenButton(880, 150, 100, 40, "Show Sum", color(100, 250, 100), toggleSum);
  buttons[3] = new ScreenButton(880, 200, 100, 40, "Show Components", color(130, 230, 230), toggleComponents);
  buttons[4] = new ScreenButton(880, 250, 100, 40, "Hide Grid", color(240, 130, 240), toggleGrid);
}

function draw() {
  background(237);
  strokeWeight(.2);
  stroke(0);
  //grid
  if (gridOn) {
    for (let i = 0; i < 80; i++) {
      line(0, gridSize * i, width, gridSize * i);
      line(gridSize * i, 0, gridSize * i, height);
    }
  }

  //axes
  strokeWeight(2);
  line(2 * gridSize, 26 * gridSize, width - 3 * gridSize, 26 * gridSize);
  strokeWeight(2);
  line(80, 40, 80, height - 2 * gridSize);

  image(img, 860, 400, 60, 70);
  //Display buttons and arrows
  for (const button of buttons) {
    button.display();
  }
  for (const arrow of arrows) {
    arrow.display();
  }

  if (arrows.filter(isHeadActivated).length) {
    sumArrow.comp.mult(0);
    for (const arrow of arrows) {
      sumArrow.comp.x += arrow.comp.x;
      sumArrow.comp.y += arrow.comp.y;
    };

  }

  if (showSum && (sumArrow.comp.x || sumArrow.comp.y)) {
    sumArrow.display();
  }
  noStroke();
  fill(0);
  textSize(32);
  text('y', 75, 30);
  text('x', 912, 527);

  fill(255);
  rect(202, 40, 138, 40, 4);
  rect(337, 40, 112, 40, 4);
  rect(638, 40, 110, 40, 4);
  rect(760, 40, 110, 40, 4);
  fill(0);

  text("|R|=", 173, 50);
  text("θ=", 304, 50);

  text("R", 598, 50);
  textSize(16);
  text("x", 614, 50);
  textSize(32);
  text("= ", 633, 50);

  text("R", 720, 50);
  textSize(16);
  text("y", 735, 50);
  textSize(32);
  text("= ", 755, 50);

  textSize(32);
  if (typeof(theActivatedVec) != 'undefined') {
    text(theActivatedVec.x.toString(), 660, 50);
    text(theActivatedVec.y.toString(), 785, 50);
    text(theActivatedVec.mag().toFixed(1), 235, 50);
    text(degrees(theActivatedVec.heading()).toFixed(0), 352, 50);
  }



}

//loc is in terms of screen location, pos and comps are in math co-Ords)
function Arrow(posX, posY, compX, compY, color) {
  this.pos = createVector(posX, posY);
  this.comp = createVector(compX, compY);
  this.loc = fromCoOrds(this.pos.x, this.pos.y)
  this.bodyActivated = false;
  this.headActivated = false;
  this.color = color;
}

Arrow.prototype.display = function() {

  if (this.loc.x > 850 && this.loc.x < 900 && this.loc.y > 400 && this.loc.y < 550 && !this.bodyActivated) {
    arrows.splice(arrows.indexOf(this), 1);
    theActivatedVec = undefined;
  }

  stroke(this.color);
  if (this.bodyActivated) {

    theActivatedVec = createVector(this.comp.x, this.comp.y);
    this.headActivated = false;
    this.loc = fromCoOrds(this.pos.x, this.pos.y);
    this.pos = toCoOrds((mouseX + offsetX), (mouseY + offsetY));
    this.pos.x = Math.round(this.pos.x);
    this.pos.y = Math.round(this.pos.y);

  }

  if (this.headActivated) {
    theActivatedVec = createVector(this.comp.x, this.comp.y);
    this.bodyActivated = false;
    let mouseVec = toCoOrds(mouseX, mouseY);
    this.comp.x = Math.round(mouseVec.x - this.pos.x);
    this.comp.y = Math.round(mouseVec.y - this.pos.y);
  }

  push();
  strokeWeight(3);
  strokeJoin(ROUND);

  translate(this.loc.x, this.loc.y);
  let R = this.comp.mag();
  rotate(-this.comp.heading());
  beginShape();
  vertex(0, 0);
  vertex(R * gridSize, 0);
  vertex(R * gridSize - 8, -5);
  vertex(R * gridSize, 0);
  vertex(R * gridSize - 8, 5);
  vertex(R * gridSize, 0);
  vertex(0, 0);
  endShape(CLOSE);
  pop();

  if (componentSetting == 1) {
    if (this.color.levels[0] == 250) {
      stroke(255, 120, 120);
    } else {
      stroke(20, 150, 20);
    }

    push();
    translate(this.loc.x, this.loc.y);
    beginShape();
    vertex(0, 0);
    vertex(this.comp.x * gridSize, 0);
    vertex(this.comp.x * gridSize - 8 * Math.sign(this.comp.x), -5);
    vertex(this.comp.x * gridSize, 0);
    vertex(this.comp.x * gridSize - 8 * Math.sign(this.comp.x), 5);
    vertex(this.comp.x * gridSize, 0);
    vertex(0, 0);
    endShape(CLOSE);

    beginShape();
    vertex(0, 0);
    vertex(0, -this.comp.y * gridSize);
    vertex(-5, -this.comp.y * gridSize + 8 * Math.sign(this.comp.y));
    vertex(0, -this.comp.y * gridSize);
    vertex(5, -this.comp.y * gridSize + 8 * Math.sign(this.comp.y));
    vertex(0, -this.comp.y * gridSize);
    vertex(0, 0);
    endShape(CLOSE);
    pop();
  }

  if (componentSetting == 2) {
    if (this.color.levels[0] == 250) {
      stroke(255, 120, 120);
    } else {
      stroke(20, 150, 20);
    }
    push();
    translate(this.loc.x, this.loc.y);
    beginShape();
    vertex(0, 0);
    vertex(this.comp.x * gridSize, 0);
    vertex(this.comp.x * gridSize - 8 * Math.sign(this.comp.x), -5);
    vertex(this.comp.x * gridSize, 0);
    vertex(this.comp.x * gridSize - 8 * Math.sign(this.comp.x), 5);
    vertex(this.comp.x * gridSize, 0);
    vertex(0, 0);
    endShape(CLOSE);

    beginShape();
    translate(this.comp.x * gridSize, 0);
    vertex(0, 0);
    vertex(0, -this.comp.y * gridSize);
    vertex(-5, -this.comp.y * gridSize + 8 * Math.sign(this.comp.y));
    vertex(0, -this.comp.y * gridSize);
    vertex(5, -this.comp.y * gridSize + 8 * Math.sign(this.comp.y));
    vertex(0, -this.comp.y * gridSize);
    vertex(0, 0);
    endShape(CLOSE);
    pop();
  }

  if (componentSetting == 3) {
    if (this.color.levels[0] == 250) {
      stroke(255, 120, 120);
    } else {
      stroke(20, 150, 20);
    }
    push();
    translate(this.loc.x, this.loc.y + this.pos.y * gridSize);
    beginShape();
    vertex(0, 0);
    vertex(this.comp.x * gridSize, 0);
    vertex(this.comp.x * gridSize - 8 * Math.sign(this.comp.x), -5);
    vertex(this.comp.x * gridSize, 0);
    vertex(this.comp.x * gridSize - 8 * Math.sign(this.comp.x), 5);
    vertex(this.comp.x * gridSize, 0);
    vertex(0, 0);
    endShape(CLOSE);
    line(0, 0, 0, -this.pos.y * gridSize);
    line(this.comp.x * gridSize, 0, this.comp.x * gridSize, -this.pos.y * gridSize - this.comp.y * gridSize);
    pop();

    push();
    beginShape();
    translate(this.loc.x - this.pos.x * gridSize, this.loc.y);
    vertex(0, 0);
    vertex(0, -this.comp.y * gridSize);
    vertex(-5, -this.comp.y * gridSize + 8 * Math.sign(this.comp.y));
    vertex(0, -this.comp.y * gridSize);
    vertex(5, -this.comp.y * gridSize + 8 * Math.sign(this.comp.y));
    vertex(0, -this.comp.y * gridSize);
    vertex(0, 0);
    endShape(CLOSE);
    line(0, 0, this.pos.x * gridSize, 0);
    line(0, -this.comp.y * gridSize, this.comp.x * gridSize + this.pos.x * gridSize, -this.comp.y * gridSize);
    pop();
  }
};

Arrow.prototype.bodyCheck = function() {
  for (let i = 0; i < arrows.length; i++) {
    if (arrows[i].bodyActivated || arrows[i].headActivated) {
      this.bodyActivated = false;
      return;
    }
  }
  if (this.comp.x >= 0 && this.comp.y >= 0) {
    if (mouseX >= this.loc.x - gridSize / 5 &&
      mouseX <= this.loc.x + gridSize / 5 + .8 * this.comp.x * gridSize &&
      mouseY <= this.loc.y + gridSize / 5 &&
      mouseY >= this.loc.y - .8 * this.comp.y * gridSize - gridSize / 5 &&
      pointLineDist(mouseX, mouseY, this.loc.x, this.loc.y,
        this.loc.x + this.comp.x * gridSize, this.loc.y - this.comp.y * gridSize) < gridSize / 5
    ) {
      this.bodyActivated = !this.bodyActivated;
      offsetX = this.loc.x - mouseX;
      offsetY = this.loc.y - mouseY;
      return;
    }
  }
  if (this.comp.x <= 0 && this.comp.y >= 0) {
    if (mouseX <= this.loc.x + gridSize / 5 &&
      mouseX >= this.loc.x - gridSize / 5 + .8 * this.comp.x * gridSize &&
      mouseY <= this.loc.y + gridSize / 5 &&
      mouseY >= this.loc.y - .8 * this.comp.y * gridSize - gridSize / 5 &&
      pointLineDist(mouseX, mouseY, this.loc.x, this.loc.y,
        this.loc.x + this.comp.x * gridSize, this.loc.y - this.comp.y * gridSize) < gridSize / 5
    ) {
      this.bodyActivated = !this.bodyActivated;
      offsetX = this.loc.x - mouseX;
      offsetY = this.loc.y - mouseY;
      return;
    }
  }
  if (this.comp.x >= 0 && this.comp.y <= 0) {
    if (mouseX >= this.loc.x - gridSize / 5 &&
      mouseX <= this.loc.x + gridSize / 5 + .8 * this.comp.x * gridSize &&
      mouseY >= this.loc.y + gridSize / 5 &&
      mouseY <= this.loc.y - .8 * this.comp.y * gridSize - gridSize / 5 &&
      pointLineDist(mouseX, mouseY, this.loc.x, this.loc.y,
        this.loc.x + this.comp.x * gridSize, this.loc.y - this.comp.y * gridSize) < gridSize / 5
    ) {
      this.bodyActivated = !this.bodyActivated;
      offsetX = this.loc.x - mouseX;
      offsetY = this.loc.y - mouseY;
      return;
    }
  }
  if (this.comp.x <= 0 && this.comp.y <= 0) {
    if (mouseX <= this.loc.x + gridSize / 5 &&
      mouseX >= this.loc.x - gridSize / 5 + .8 * this.comp.x * gridSize &&
      mouseY >= this.loc.y + gridSize / 5 &&
      mouseY <= this.loc.y - .8 * this.comp.y * gridSize - gridSize / 5 &&
      pointLineDist(mouseX, mouseY, this.loc.x, this.loc.y,
        this.loc.x + this.comp.x * gridSize, this.loc.y - this.comp.y * gridSize) < gridSize / 5
    ) {
      this.bodyActivated = !this.bodyActivated;
      offsetX = this.loc.x - mouseX;
      offsetY = this.loc.y - mouseY;
      return;
    }
  }
};

Arrow.prototype.headCheck = function() {
  for (let i = 0; i < arrows.length; i++) {
    if (arrows[i].bodyActivated || arrows[i].headActivated) {
      this.headActivated = false;
      return;
    }
  }
  if (dist(this.loc.x + gridSize * this.comp.x,
      this.loc.y - gridSize * this.comp.y, mouseX, mouseY) < gridSize / 2) {
    sumArrow.comp.x = 0;
    sumArrow.comp.y = 0;
    for (const arrow of arrows) {
      sumArrow.comp.x += arrow.comp.x;
      sumArrow.comp.y += arrow.comp.y;
    };
    this.headActivated = !this.headActivated;
  }
}

function mousePressed() {
  for (const button of buttons) {
    if (mouseX > button.loc.x - button.w / 2 && mouseX < button.loc.x + button.w / 2 &&
      mouseY > button.loc.y - button.h / 2 && mouseY < button.loc.y + button.h / 2
    ) {
      button.myFunction();
    }
  }

  for (const arrow of arrows) {
    arrow.bodyCheck();
    arrow.headCheck();
  }

  sumArrow.bodyCheck();
}

function ScreenButton(locX, locY, w, h, text, color, myFunction) {
  this.loc = createVector(locX, locY);
  this.w = w;
  this.h = h;
  this.text = text;
  this.color = color;
  this.myFunction = myFunction;
}

ScreenButton.prototype.display = function() {
  fill(this.color);
  stroke(0);
  rect(this.loc.x, this.loc.y, this.w, this.h, 10);
  noStroke();
  textSize(16);
  textAlign(CENTER);
  fill(0);
  text(this.text, this.loc.x, this.loc.y + 2, this.w, this.h);

}

function toCoOrds(scrX, scrY) {
  let r = createVector();
  r.x = (scrX - 80) / gridSize;
  r.y = (-scrY + 520) / gridSize;
  return r;
}

function fromCoOrds(x, y) {
  let scrR = createVector();
  scrR.x = x * gridSize + 80;
  scrR.y = -y * gridSize + 520;
  return scrR;
}

function pointLineDist(x0, y0, x1, y1, x2, y2) {
  return Math.abs((y2 - y1) * x0 - (x2 - x1) * y0 + x2 * y1 - y2 * x1) /
    sqrt(sq(y2 - y1) + sq(x2 - x1));
}
