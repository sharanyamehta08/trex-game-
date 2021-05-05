var cloudsGroup, ObstaclesGroup;
var PLAY=1;
var END=0;
var gameState = PLAY;
var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;
var clouds, cloudImage, rand;
var cactus, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;
var rando, score;
var gameOver, restart; 
var restart_image, gameOver_image; 
var jumpSound, dieSound, checkPointSound;
var highScore;

function preload() {
  trex_running = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  trex_collided = loadImage("trex_collided.png");

  groundImage = loadImage("ground2.png");
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  gameOver_image = loadImage("gameOver.png");
  restart_image = loadImage("restart.png");
  
  jumpSound = loadSound("jump.mp3");
  dieSound = loadSound("die.mp3");
  checkPointSound = loadSound("checkPoint.mp3");
}

function setup() {
  createCanvas(600, 200);
  
  score = 0; 
  
  cloudsGroup = createGroup ();
  obstaclesGroup = createGroup ();
  highScore = 0; 

  //create a trex sprite
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  trex.debug= false;
  trex.setCollider ("circle",-15,0,45);

  //create a ground sprite
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  
  invisibleGround = createSprite(300,190,600,20);
  invisibleGround.visible = false
  
  gameOver = createSprite(300,90,0,0);
  gameOver.addImage("gameOver",gameOver_image);
  gameOver.scale = 0.6;
  gameOver.visible = false; 
  
  restart = createSprite(300,130,0,0);
  restart.addImage("restart",restart_image)
  restart.scale = 0.5;
  restart.visible = false;
  
  console.count ("function setup has been executed");
  for (var i = 20; i < 100; i ++) {
    console.count ("for loop");
  }

}

function draw() {
  background(245);
  text ("score " + score,510,20)
  text ("high score " + highScore,50,20);

  if (gameState=== PLAY) {
    ground.velocityX = -6;
    //score = score + Math.round (frameCount/100);
    
    if (frameCount % 1 === 0) {
      score++
    }
      if (score % 100 === 0 && score > 0) {
        checkPointSound.play(); 
        ground.velocityX = ground.velocityX - 1;
      }
    
        
      if (keyDown("space") && trex.y >= 156.5) {
      trex.velocityY = -13;
      jumpSound.play();
       } 

      trex.velocityY = trex.velocityY + 0.8
    
      if (ground.x < 0) {
      ground.x = ground.width / 2;
      }
    
      spawnClouds ();
  
      spawnObstacles ();
    
      
      if (trex.isTouching(obstaclesGroup)){
        gameState = END; 
        dieSound.play();
      }
  }
  

  
  if (gameState===END) {
    ground.velocityX = 0;
    obstaclesGroup.setVelocityXEach(0)
    cloudsGroup.setVelocityXEach(0)
    cloudsGroup.setLifetimeEach(-1);
    obstaclesGroup.setLifetimeEach(-1);
    trex.changeAnimation("collided", trex_collided);
    trex.velocityY= 0;
    restart.visible = true; 
    gameOver.visible = true;
     if (highScore<score) {
       highScore = score; 
     }
    
    if (mousePressedOver (restart)) {
    restartGame (); 
  }
    
  }
 

  trex.collide(invisibleGround);
  drawSprites();
  

}


function restartGame () { 
 gameState = PLAY; 
  cloudsGroup.destroyEach (); 
  obstaclesGroup.destroyEach ();
  gameOver.visible = false; 
  restart.visible = false; 
  trex.changeAnimation ("running", trex_running);
  score = 0; 

}


function spawnClouds () {
  if (frameCount % 50 === 0){
    clouds = createSprite (600,100,10,10);
    clouds.addImage ("cloud",cloudImage);
    clouds.scale = 0.7
    clouds.tint = "darkgrey";
    clouds.velocityX = -4;
    rand = Math.round (random (20,120));
    clouds.y = rand;
    clouds.depth = trex.depth;
    trex.depth = trex.depth + 1;
    console.log (trex.depth);
    console.log (clouds.depth);
    clouds.lifetime = 600/4; 
    cloudsGroup.add(clouds);
  }
}

function spawnObstacles () {
  if (frameCount % 70 === 0){
    cactus = createSprite (600,160,10,10); 
    cactus.velocityX = -(5 + score / 100); 
    rando =  Math.round (random (1,6));
    switch (rando){
      case 1:cactus.addImage ("cactus1",obstacle1);
        break;
      case 2:cactus.addImage ("cactus2",obstacle2);
        break;
      case 3:cactus.addImage ("cactus3",obstacle3);
        break;
      case 4:cactus.addImage ("cactus4",obstacle4);
        break;
      case 5:cactus.addImage ("cactus5",obstacle5);
        break;
      case 6:cactus.addImage ("cactus6",obstacle6);
        break;
      default: 
        break;
      
    }
    cactus.scale = 0.5;
    cactus.lifetime = 600/4; 
    obstaclesGroup.add(cactus);
  }
}