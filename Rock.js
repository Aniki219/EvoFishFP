class Rock {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = round(random(10,20));
    this.brightness = random(60,80)

    rocksArray.push(this);
  }

  draw() {
    noStroke();
    fill(30,0,this.brightness);
    ellipse(this.x, this.y, this.size, this.size);
  }
}
