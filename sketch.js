var monsters = [];
var total = 8;
var paddle;
var teeth;
var winSound;
var loseSound;
var bgdMusic;
var deathSound;

var lives = 5;
var state = 0;


var startText = "Click your mouse to jump.\nReady to play?"
var endText = "Would you like to \n play again? ";
var winText = "Congrates! \n You win the game. \n Would you like to \n play again?";

var startX; 
var startY;
var startButton;

function preload(){
  winSound = loadSound("winSound.MP3");
  loseSound = loadSound("loseSound.MP3");
  bgdMusic = loadSound("bgdMusic.MP3");
  deathSound = loadSound("deathSound.MP3");
}


function setup() {
  createCanvas(800,600);
 
  textFont("Helvetica");
  textSize (50);
  textAlign(CENTER,CENTER);
  noStroke();
  fill(255);
  
  startX = width/2;
  startY = height-150;
  startButtonSize = 100;
  
  bgdMusic.loop();
}

function draw(){
  background(0);
  if(state == 0){
    introGame();
  } else if (state == 1){
    playGame();
  } else if (state == 2){
    drawEnd();
  } else if (state == 3){
    winGame();
  }
}

function introGame(){
  fill(255);
  textSize(30);
  text(startText, 0,0,width,height);

  fill("red");
  ellipse(startX,startY,startButtonSize,startButtonSize); 
  
  fill(255);
  text("Yes",startX,startY);
}



function startGame(){ // set up the default for beginning
  teeth = new Teeth();
  lives = 5;
  paddle = new Paddle(); 
  for(var i=0 ; i< total; i++){
    monsters[i] = new Monster(paddle);
  }
  
  state = 1;
}

function gameOver(){
  state = 2;
}

function drawEnd(){
  textSize(50);
  textAlign(CENTER,CENTER);
  fill(255);
  text(endText, 0,0,width,height-100);
 
  fill("red");
  ellipse(startX,startY,startButtonSize,startButtonSize); 
  
  fill(255);
  text("Yes",startX,startY);
}

function winGame(){
  textSize(35);
  textAlign(CENTER,CENTER);
  fill(255);
  text(winText, 0,0,width,3/5*height-100);
 
  fill("red");
  ellipse(startX,startY,startButtonSize,startButtonSize); 
  
  fill(255);
  text("Yes",startX,startY);
}

function playGame(){
  for(var i = 0; i < monsters.length ; i++){
    monsters[i].render();
    monsters[i].update();
  } 
  paddle.render();
  paddle.moveDown();
  teeth.render();

  
  
  if(lives <= 2){
    fill("red");
  } else{
    fill("white");
  }
  textSize(25);
  textAlign(RIGHT);
  strokeWeight(10);
  text("LIVES : " + lives, width-45,50);
  
  if(lives == 0){
    deathSound.play();
    gameOver();
  }
}

function gameOver(){
  state = 2;
}

function Teeth(){
  this.hr = random(0.1,0.12);
  this.slength = 20;

  this.render = function(){
    for(var i = 0 ; i < width/20 ;i++){
      fill(255);
      stroke(0,127+127*sin(frameCount* this.hr));
      strokeWeight(5);
      triangle(i*this.slength,height,i*this.slength + this.slength/2,height-20,(i+1)*this.slength,height);
    }
  }
}

function Monster(paddle){
  this.paddle = paddle;

  this.init = function(){
    this.x = random(-width,10);
    this.y = random(1/15*height,14/15*height);
    this.r = random(25,80);
    this.speedX = 5;
    this.goodMonster = (random(0,100) < 5);
  }
  
  this.render = function(){
    this.width = this.r*9/7;
    this.height = this.r;
    this.eWidth = this.r*2/3;
    this.eHeight = this.r* 2/5;
    this.eY = this.y-this.r/8;
    if(this.goodMonster){
      fill("yellow");
    } else{
      fill(255);
    }
    
    strokeWeight(3);
    stroke(0);
    ellipse(this.x, this.y,this.width , this.width);
    ellipse(this.x, this.eY, this.eWidth, this.eHeight);
    fill(0);
    this.eyeX = map(mouseX, 0, width,this.x-this.eWidth * 3/10, this.x+this.eWidth * 1/10);
    this.eyeY = map(mouseY, 0, height, this.eY -this.eHeight * 1/8, this.eY + this.eHeight * 1/8);
    ellipse(this.eyeX,this.eyeY,this.r/4,this.r/4);
  }
  
  this.update = function(){
    this.x += this.speedX;
    if(this.x > width+this.r){
     this.init();
    }
     this.testPaddle();
  }
  
  this.testPaddle = function(){
    var distant = dist(this.paddle.x,this.paddle.y,this.x,this.y);
    var radiusTotal = this.width/2 + this.paddle.size/2 ; 
    if (distant <= radiusTotal){
       if(this.goodMonster){
        this.paddle.score();
      } else{
        this.paddle.hit();
      }
      this.init();
    }
  }
  this.init();
}


function mousePressed(){

  if(state == 1){
    paddle.moveUp();
  }
  
  if(state == 0 || state == 2 || state == 3){
    var d = dist(mouseX,mouseY,startX,startY);
    if( d < startButtonSize/2){
      startGame();
    }
  } 
  
}

function Paddle(){
  this.x = width/2; 
  this.y = 10/15*height; 
  this.speed = 20;
  this.speedDown = 1;
  this.size = 30;
  this.render = function(){
    fill(0,0,255);
    noStroke();
    ellipse (this.x, this.y,this.size,this.size);
  }
  
  this.score = function(){
    lives ++ ; 
    this.color = color(0,0,255);
    this.size -= 5;
    winSound.play();
  }
  
  this.hit = function(){
    lives -- ;
    this.color = color(255,0,0);
    this.size += 5;
     loseSound.play();
  }
  
  this.moveUp= function(){
    this.y -= this.speed;
  //top winning state 
    if(this.y - this.size /2 < 0){
      state = 3;
    }
  }
  
  this.moveDown = function(){
    this.y += this.speedDown;
  //down - lose state  
    if(this.y + this.size/2 > height-20 ){
      state = 2;
    }
  }
}




 
