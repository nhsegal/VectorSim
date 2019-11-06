const gridSize = 20;
const arrowSize = 9;
const originX = 80;
const originY = 520;
let resetButton;
let img;
let offsetX = 0;
let offsetY = 0;
let sumArrow;
let toggleSum;
let showSum = false;
let isHeadActivated;
let sumVec;
let toggleComponents;
let componentSetting = 0;
let theActivatedVec;
let gridOn = true;
let arrows = [];
let buttons = [];


function preload() {
  img = loadImage('trash.png');
}

function setup() {
  createCanvas(950, 600);
  rectMode(CENTER);
  sumArrow = new Arrow(5, 5, 0, 0, color(0, 180, 0));
  makeArrow = function addNewArrowToArrows() {
    sumArrow.comp.mult(0);
    arrows.push(new Arrow(26, 13, 1, 4, color(250, 0, 0)));
    arrows.forEach((arrow) => {
      sumArrow.comp.x += arrow.comp.x;
      sumArrow.comp.y += arrow.comp.y;
    });
  }

  toggleSum = function toggleDisplayOfSumOfVectors() {
    if (showSum) {
      buttons[2].text = "Hide Sum";
      showSum = false;
    } else {
      buttons[2].text = "Show Sum";
      showSum = true;
    }
  }

  isHeadActivated = function checkIfObjectHeadActivated(obj) {
    if (obj.headActivated) {
      return true;
    }
  }

  toggleComponents = function toggleDifferentComponentStyles() {
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

  toggleGrid = function ShowOrHideGrid() {
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
  //Draw grid
  if (gridOn) {
    for (let i = 0; i < 80; i++) {
      line(0, gridSize * i, width, gridSize * i);
      line(gridSize * i, 0, gridSize * i, height);
    }
  }

  //Axes
  strokeWeight(2);
  line(originX - 2 * gridSize, originY, originX + 40 * gridSize, originY);
  strokeWeight(2);
  line(originX, 2 * gridSize, originX, originY + 2 * gridSize);

  //TrashCan
  image(img, 860, 400, 60, 70);

  buttons.forEach((button) => {
    button.display();
  });

  arrows.forEach((arrow) => {
    arrow.display();
  });


  if (arrows.filter(isHeadActivated).length) {
    sumArrow.comp.mult(0);

    arrows.forEach((arrow) => {
      sumArrow.comp.x += arrow.comp.x;
      sumArrow.comp.y += arrow.comp.y;
    })
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
  rect(342, 40, 118, 40, 4);
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
    text(degrees(theActivatedVec.heading()).toFixed(0)+'°', 362, 50);


  }
}

//loc is in terms of screen location, pos and comps are in math co-Ords)
class Arrow {
  constructor(posX, posY, compX, compY, color) {
    this.pos = createVector(posX, posY);
    this.comp = createVector(compX, compY);
    this.loc = fromCoOrds(this.pos.x, this.pos.y)
    this.bodyActivated = false;
    this.headActivated = false;
    this.color = color;
  }
  display() {
    //Garbage
    if (this.loc.x + this.comp.x * gridSize / 2 > 860 && this.loc.x + this.comp.x * gridSize / 2 < 920 && this.loc.y - this.comp.y * gridSize / 2 > 400 && this.loc.y - this.comp.y * gridSize / 2 < 470 && !this.bodyActivated) {
      arrows.splice(arrows.indexOf(this), 1);
      theActivatedVec = undefined;
      sumArrow.comp.mult(0);
      arrows.forEach((arrow) => {
        sumArrow.comp.x += arrow.comp.x;
        sumArrow.comp.y += arrow.comp.y;
      });
    }
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
    drawArrow(this.loc, this.comp.mag(), arrowSize, this.comp.heading(), this.color, 255);
    if (componentSetting == 1) {
      if (this.comp.x != 0) {
        drawArrow(this.loc, abs(this.comp.x), arrowSize / 2, createVector(this.comp.x, 0).heading(), this.color, 100);
      }
      if (this.comp.y != 0) {
        drawArrow(this.loc, abs(this.comp.y), arrowSize / 2, createVector(0, this.comp.y).heading(), this.color, 100);
      }
    }
    if (componentSetting == 2) {
      if (this.comp.x != 0) {
        drawArrow(this.loc, abs(this.comp.x), arrowSize / 2, createVector(this.comp.x, 0).heading(), this.color, 100);
      }
      if (this.comp.y != 0) {
        drawArrow(createVector(this.comp.x * gridSize + this.loc.x, this.loc.y), abs(this.comp.y), arrowSize / 2, createVector(0, this.comp.y).heading(), this.color, 100);
      }
    }
    if (componentSetting == 3) {
      if (this.comp.x != 0) {
        drawArrow(createVector(this.loc.x, this.loc.y + this.pos.y * gridSize), abs(this.comp.x), arrowSize / 2, createVector(this.comp.x, 0).heading(), this.color, 250);
      }
      if (this.comp.y != 0) {
        drawArrow(createVector(-this.pos.x * gridSize + this.loc.x, this.loc.y), abs(this.comp.y), arrowSize / 2, createVector(0, this.comp.y).heading(), this.color, 250);
      }
      strokeWeight(.6);
      line(this.loc.x, this.loc.y, this.loc.x, originY);
      line(this.loc.x + this.comp.x * gridSize, this.loc.y - this.comp.y * gridSize, this.loc.x + this.comp.x * gridSize, originY);
      line(this.loc.x, this.loc.y, originX, this.loc.y);
      line(this.loc.x + this.comp.x * gridSize, this.loc.y - this.comp.y * gridSize, originX, this.loc.y - this.comp.y * gridSize);
    }
  }
  bodyCheck() {
    arrows.forEach((arrow) => {
      if (arrow.bodyActivated || arrow.headActivated) {
        this.bodyActivated = false;
        console.log('here');
        return;
      }
    });

    let upperBoundX = Math.max(this.loc.x + 2, this.loc.x + this.comp.x * gridSize - arrowSize * Math.sign(this.comp.x));
    let lowerBoundX = Math.min(this.loc.x - 2, this.loc.x + this.comp.x * gridSize - arrowSize * Math.sign(this.comp.x));
    let upperBoundY = Math.max(this.loc.y + 2, this.loc.y - this.comp.y * gridSize + arrowSize * Math.sign(this.comp.y));
    let lowerBoundY = Math.min(this.loc.y - 2, this.loc.y - this.comp.y * gridSize + arrowSize * Math.sign(this.comp.y));

    if (mouseX >= lowerBoundX &&
      mouseX <= upperBoundX &&
      mouseY >= lowerBoundY &&
      mouseY <= upperBoundY &&
      pointLineDist(mouseX, mouseY, this.loc.x, this.loc.y,
        this.loc.x + this.comp.x * gridSize, this.loc.y - this.comp.y * gridSize) < gridSize / 5
    ) {
      this.bodyActivated = !this.bodyActivated;

      if (this.bodyActivated) {
        arrows.forEach((arrow) => {
          if (arrow != this) {
            arrow.bodyActivated = false;
          }
        });
      }
      offsetX = this.loc.x - mouseX;
      offsetY = this.loc.y - mouseY;
      return;
    }
  }
  headCheck() {
    arrows.forEach((arrow) => {
      if (arrow.bodyActivated || arrow.headActivated) {
        this.headActivated = false;
        return;
      }
    });

    let lowerBoundX = Math.min(this.loc.x + this.comp.x * gridSize - arrowSize * Math.sign(this.comp.x) - 4, this.loc.x + this.comp.x * gridSize - 4);
    let upperBoundX = Math.max(this.loc.x + this.comp.x * gridSize - arrowSize * Math.sign(this.comp.x) + 4, this.loc.x + this.comp.x * gridSize + 4);
    let lowerBoundY = Math.min(this.loc.y - this.comp.y * gridSize + arrowSize * Math.sign(this.comp.y) - 4, this.loc.y - this.comp.y * gridSize - 4);
    let upperBoundY = Math.max(this.loc.y - this.comp.y * gridSize + arrowSize * Math.sign(this.comp.y) + 4, this.loc.y - this.comp.y * gridSize + 4);

    if (mouseX >= lowerBoundX &&
      mouseX <= upperBoundX &&
      mouseY >= lowerBoundY &&
      mouseY <= upperBoundY) {
      sumArrow.comp.mult(0);
      arrows.forEach((arrow) => {
        sumArrow.comp.x += arrow.comp.x;
        sumArrow.comp.y += arrow.comp.y;
      });
      this.headActivated = !this.headActivated;
      if (this.headActivated) {
        arrows.forEach((arrow) => {
          if (arrow != this) {
            arrow.headActivated = false;
            arrow.headActivated = false;
          }
        });
      }
    }
  }
}

function mouseReleased() {
  buttons.forEach((button) => {
    if (mouseX > button.loc.x - button.w / 2 && mouseX < button.loc.x + button.w / 2 &&
      mouseY > button.loc.y - button.h / 2 && mouseY < button.loc.y + button.h / 2
    ) {
      button.myFunction();
    }
  });

  arrows.forEach((arrow) => {
    arrow.bodyCheck();
    arrow.headCheck();
  });

  sumArrow.bodyCheck();
};

class ScreenButton{
  constructor(locX, locY, w, h, text, color, myFunction){
    this.loc = createVector(locX, locY);
    this.w = w;
    this.h = h;
    this.text = text;
    this.color = color;
    this.myFunction = myFunction;
  }
  display(){
    fill(this.color);
    stroke(0);
    rect(this.loc.x, this.loc.y, this.w, this.h, 10);
    noStroke();
    textSize(16);
    textAlign(CENTER);
    fill(0);
    text(this.text, this.loc.x, this.loc.y + 2, this.w, this.h);
  }

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

function drawArrow(location, arrowLength, headSize, heading, col, alpha) {
  col.setAlpha(alpha);
  fill(col);
  stroke(col);
  push();
  strokeWeight(3);
  translate(location.x, location.y);
  rotate(-heading);
  let R = arrowLength * gridSize - gridSize / 4;
  line(0, 0, R, 0);
  translate(R - headSize, 0);
  triangle(0, headSize / 2, 0, -headSize / 2, headSize, 0);
  pop();
}
