// MOLD CLASS
class moldRoots {
  constructor(posx, posy, minsize, maxsize) {
    this.vec = createVector(posx, posy);
    this.minsize = minsize;
    this.maxsize = maxsize;
  }

  updatePoint() {
    this.vec.x += randomInteger(-20, 20);
    this.vec.y += randomInteger(-20, 20);
    this.vec.x = constrain(this.vec.x, 0, width);
    this.vec.y = constrain(this.vec.y, 0, height);
  }

  makePoint() {
    //pass the buffer to draw into it
    moldBuffer.push();

    let dynamicSize = randomInteger(this.minsize, this.maxsize);

    moldBuffer.fill(someColors[randomInteger(0, 9)]);
    moldBuffer.noStroke();

    moldBuffer.drawingContext.shadowBlur = 50;
    moldBuffer.drawingContext.shadowColor = color(0, 94, 255);

    moldBuffer.circle(this.vec.x, this.vec.y, dynamicSize);
    moldBuffer.pop();
  }
}