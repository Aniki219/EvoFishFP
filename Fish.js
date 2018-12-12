function newFish(x, y) {
    var fish = {
      x: x,
      y: y,

      xvel: 0,
      yvel: 0,

      size: 15,
      speed: 3,
      hue: 10,
      age: 0,
      sight: 0,

      food: 50,
      maxfood: 50,
      timing: floor(random(120)),

      angle: 0,
      dead: false
    }
    mutate(fish);
    return fish;
  }

function fishSee(fish) {
    let seen = plantsArray.filter((p) => dist(fish.x, fish.y, p.x, p.y) < fish.sight/2);
    let xx = 0;
    let yy = 0;

    if (seen.length == 0) {
      fish.xinf = 0;
      fish.yinf = 0;
      return;
    }
    seen.forEach((p) => {
      xx += p.x - fish.x;
      yy += p.y - fish.y;
    })
    let theta = atan2(yy,xx);
    let xinf = 2*cos(theta);
    let yinf = 2*sin(theta);

    fish.xvel = xinf;
    fish.yvel = yinf;
  }

function mutate(fish) {
    if (random(2) < 1) {return;}
    fish.size += random(-4, 4);
    fish.speed += random(-1, 1);
    fish.sight += random(-20, 20);

    fish.size = max(fish.size, 5);
    fish.speed = max(fish.speed, 3);
    fish.sight = max(fish.sight, 0);

    fish.hue += random(-5, 5);
    if (fish.hue < 0) { fish.hue = 100; }
    if (fish.hue > 100) { fish.hue = 0; }
    fish.maxfood = round(fish.size*3+10);
  }

function drawFish(fish) {
    noStroke();
    push()
      translate(fish.x, fish.y);
      rotate(fish.angle);
      fill(fish.hue,100,100);
      ellipse(0, 0, fish.size*1.25, fish.size);
      triangle(-fish.size/2, 0, -fish.size, -fish.size/3, -fish.size, fish.size/3);
    pop();
      fill(100,0,50,50);
      rect(fish.x-fish.size, fish.y-fish.size/2-5, fish.size*2, 3);
      fill(10,100,100,150);
      rect(fish.x-fish.size, fish.y-fish.size/2-5, (fish.food/fish.maxfood)*fish.size*2, 3);

  }

function moveFish(fish) {
    if (frameCount % 120 == fish.timing) {
      fishSee(fish);
      fish.xvel += random(-fish.speed, fish.speed);
      fish.yvel += random(-fish.speed, fish.speed);
      fish.angle = atan2(fish.yvel, fish.xvel);
      if (fish.food >= 30 && random(100) < 10) {
        reproduceFish(fish);
      }
      fish.food-=round(max((fish.size + fish.speed)/5,1));
    }

    if (fish.food <= 0) {
      fish.dead = true;
    }

    if (placeFree(fish, fish.x + fish.xvel, fish.y)) {
      fish.x += fish.xvel;
    }
    if (placeFree(fish, fish.x , fish.y + fish.yvel)) {
      fish.y += fish.yvel;
    }
    fish.xvel *= 0.95;
    fish.yvel *= 0.95;
  }

function reproduceFish(parent) {
    let fish = newFish(parent.x, parent.y);
    parent.food = floor(parent.food/1.5);
    fish.food = parent.food;
    fish.size = parent.size;
    fish.speed = parent.speed;
    fish.sight = parent.sight;
    fish.hue = parent.hue;

    mutate(fish);
  }

function fishEat(fish) {
    if (fish.food >= fish.maxfood) {
      fish.food = fish.maxfood;
      return;
    }

    plantsArray.forEach((plant) => {
      if (plant.food <= 0) {return;}
      if (dist(plant.x, plant.y, fish.x, fish.y) < (plant.size + fish.size)) {
        plant.food-=2;
        fish.food+=2;
      }
    })
  }

function updateFish(fish) {
    moveFish(fish);
    drawFish(fish);
    fishEat(fish);
    fish.age++;
  }
