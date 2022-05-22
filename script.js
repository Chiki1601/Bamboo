var shoots = [];
var breezeValue = 0;
var breezeSin = 0;
var leaves = [];

function setup()  {
  createCanvas(800, 600);

  var index = 0;
  var xValue = -100;
  var xIncrement = width / 10;
  var depth = 2;
  var weight = 10;
  var colors = [
    "#448912",
    "#30610d",
    "#142906"
  ];
  var colorsJoint = [
    "#c9f837",
    "#a1b955",
    "#616d3a"
  ];
  while(depth >= 0) {
    while(xValue < width + 100) {
      shoots.push(new bamboo(weight + random(5), colors[depth], colorsJoint[depth]));
      shoots[index].buildStalk(xValue, height);

      index++;
      xValue += random(xIncrement) + 15;
    }
    xValue = -100;
    depth--;
    weight += 2;
    xIncrement += 10;
  }
  for(let i = 0; i < 5; i++) {
    leaves.push(new leaf());
  }
}

function draw() {
  background("#23493d");
  breezeValue += 0.001;
  breezeSin += 0.01;
  
  var sinOutput = sin(breezeSin) * 0.5;
  var breezeNoise = (noise(breezeValue)) * sinOutput;
  
  for(var i = 0; i < shoots.length; i++)  {
    shoots[i].show();
    shoots[i].breeze(breezeNoise);
  }
  for(let i = 0; i < leaves.length; i++) {
    leaves[i].show();
  }
}

function leaf() {
  this.pos = new p5.Vector(random(width), random(height));
  this.width = random(20) + 30;
  this.height = this.width * 0.22; //arbitrary ratio that looked decent
  this.rotation = random(TWO_PI);
  this.leafColor = color(0, 100 + random(100), 0);
  this.speed = random(1) + 0.5;
  this.rotateSpeed = round(random(2) - 1);
  this.rotateSpeed = this.rotateSpeed == 0 ? 1 : this.rotateSpeed;
  this.show = function() {
    noStroke();
    fill(this.leafColor);
    push();
    translate(this.pos.x, this.pos.y);
    rotate(this.rotation);
    ellipse(0, 0, this.width, this.height);
    pop();
    this.rotation += 0.01 * this.rotateSpeed;
    this.pos.y += this.speed;
    if(this.pos.y > height + 40) {
      this.pos.y = - 40;
      this.pos.x = random(width);
      this.speed = random(1) + 0.5;
    }
  }
}

function bamboo(weight, color, jointColor) {
  this.segmentInfo = [];
  this.weight = weight;
  this.color = color;
  this.jointColor = jointColor;

  this.buildStalk = function(x, y)  {
    this.segmentInfo.push({
      pos: new p5.Vector(x, y)
    });
    
    var rotation = -HALF_PI;
    var length = 40 + random(40);
    var segmentCount = Math.round(random(5)) + 15;
    for(var i = 1; i <= segmentCount; i++) {
      var xx = this.segmentInfo[i - 1].pos.x + cos(rotation) * length;
      var yy = this.segmentInfo[i - 1].pos.y + sin(rotation) * length;
      
      this.segmentInfo.push({
        pos: new p5.Vector(xx, yy),
        windOffset: 0
      });
      length = 40 + random(40);
      rotation += (random(HALF_PI) - QUARTER_PI) * 0.05;
    }
  }
  this.show = function() {
    strokeWeight(this.weight);
    stroke(this.color);
    for(var i = 1; i < this.segmentInfo.length; i++)  {
      this.segmentInfo[i].pos.x += this.segmentInfo[i].windOffset;
      line(this.segmentInfo[i].pos.x, this.segmentInfo[i].pos.y, this.segmentInfo[i - 1].pos.x, this.segmentInfo[i - 1].pos.y);
    }
    stroke(this.jointColor);
    strokeWeight(2);
    var halfWeight = this.weight * 0.5;
    for(var i = 1; i < this.segmentInfo.length; i++)  {
      var xx = this.segmentInfo[i].pos.x,
          yy = this.segmentInfo[i].pos.y;

      line(xx - halfWeight, yy, xx + halfWeight, yy);
    }
  }
  this.breeze = function(value)  {
    var currentValue = 0;
    var increment = value / this.segmentInfo.length;

    for(var i = 0; i < this.segmentInfo.length; i++)  {
      this.segmentInfo[i].windOffset = currentValue;
      currentValue += increment;
    }
  }
}