var fishArray = [];
var plantsArray = [];
var rocksArray = [];

var cWidth = 500;
var cHeight = 500;

var fishPop = [];
var plantPop = [];
var oldestFishEver = 0;
var largestFishEver = 0;
var smallestFishEver = 1000;

function setup() {
  createCanvas(cWidth, cHeight + 150);
  colorMode(HSB, 100);
  while(fishArray.length < 5) {
    new Fish(50+random(width-100), 50+random(cHeight-100));
  }

  while(plantsArray.length < 35) {
    new Plant(50+random(cWidth-100), 50+random(cHeight-100));
  }

  while(rocksArray.length < round(random(20,50))) {
    console.log(1)
    new Rock(round(random(cWidth)), round(random(cHeight)));
  }
}

function draw() {
  background(65,70,70);

  rocksArray.forEach((rock) => {rock.draw()});

  plantsArray = plantsArray.filter((plant) => !plant.dead);
  plantsArray.forEach((plant) => {plant.update()});

  fishArray = fishArray.filter((fish) => !fish.dead);
  fishArray.forEach((fish) => {fish.update()});

  if (frameCount % 180 == 0 && random(1000) < 1) {
    new Plant(50+random(cWidth-100), 50+random(cHeight-100));
  }

  drawGraph();
}

function placeFree(obj, x, y) {
  if (x - obj.size < 0 || x + obj.size > cWidth) {return false;}
  if (y - obj.size < 0 || y + obj.size > cHeight) {return false;}
  for (var r of rocksArray) {
    if (dist(x, y, r.x, r.y) < obj.size/2 + r.size/2) {
      return false;
    }
  }
  return true;
}

function drawGraph() {
  if (frameCount % 60 == 0) {
    collectData();
  }
  let plantPopMax = Math.max.apply(null, plantPop);
  let fishPopMax = Math.max.apply(null, fishPop);

  fill(0);
  rect(0, cHeight, width, 150);
  noFill();
  stroke(0,100,90);

  beginShape();
    for (let [i, s] of fishPop.entries()) {
      vertex(120+width/(fishPop.length+1)*i, height - (s/fishPopMax * 120));
    }
  endShape(OPEN);

  stroke(30,100,100);
  beginShape();
    for (let [i, s] of plantPop.entries()) {
      vertex(120+width/(plantPop.length+1)*i, height - (s/plantPopMax * 120));
    }
  endShape(OPEN);

  let totalsize = 0;
  fishArray.forEach((fish) => {totalsize += fish.size;})
  let avgSize = round(totalsize/fishArray.length);
  fill(100,0,100);
  noStroke();
  textSize(10);
  let fishSizes = fishArray.map(f => f.size);
  let smallestFish = round(Math.min.apply(null, fishSizes));
  let largestFish = round(Math.max.apply(null, fishSizes));
  if (smallestFish < smallestFishEver) {smallestFishEver = smallestFish;}
  if (largestFish > largestFishEver) {largestFishEver = largestFish;}
  text("smallest size: " + smallestFish + " / " + smallestFishEver, 10, height-130);
  text("largest size: " + largestFish + " / " + largestFishEver, 10, height-110);
  text("average size: " + avgSize, 10, height-100);

  let oldestFishAge = Math.max.apply(null,fishArray.map((f) => f.age));
  if (oldestFishAge > oldestFishEver) {oldestFishEver = oldestFishAge;}
  let oldestFish = fishArray.find(f => f.age == oldestFishAge);
  text("oldest fish: " + round(oldestFishAge/60) + "s", 10, height-80);
  text("  speed: " + round(oldestFish.speed), 10, height-70);
  text("  size: " + round(oldestFish.size), 10, height-60);
  text("  sight: " + round(oldestFish.sight), 10, height-50);
  text("record oldest fish: " + round(oldestFishEver/60) + "s", 10, height-35);
    text("total time: " + round(frameCount/60) + "s", 10, height-25);
  fill(80,100,100,sin(frameCount/10)*50+50);
  ellipse(oldestFish.x, oldestFish.y, 5, 5);
}

function collectData() {
  fishPop.push(fishArray.map(f=> f.food).reduce((x,y) => x+y)/fishArray.length);
  plantPop.push(plantsArray.map(p => p.food).reduce((x,y)=>x+y)/plantsArray.length);

}
