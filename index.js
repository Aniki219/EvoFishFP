var fishArray = [];
var plantsArray = [];
var rocksArray = [];

var cWidth = 500;
var cHeight = 500;

function setup() {
  createCanvas(cWidth, cHeight + 150);
  colorMode(HSB, 100);
  while(fishArray.length < 5) {
    fishArray.push(newFish(50+random(width-100), 50+random(cHeight-100)));
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
  fishArray.forEach((fish) => {updateFish(fish)});

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
