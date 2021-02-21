var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var backgroundImg
var score=0;
var jumpSound, collidedSound,back;

var gameOver, restart;


function preload(){
  jumpSound = loadSound("jump.wav")
  collidedSound = loadSound("collided.wav")

  backgroundImg = loadImage("backgroundImg.png")
  sunAnimation = loadImage("sun.png");
  
  trex_running = loadAnimation("trex_2.png","trex_1.png","trex_3.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("cloud.png");
  
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  sun = createSprite(width-50,100,10,10);
  sun.addAnimation("sun", sunAnimation);
  sun.scale = 0.1
  
  trex = createSprite(50,height-105,20,50);

  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.setCollider('circle',0,0,350)
  trex.scale = 0.08
  // trex.debug=true
  
  invisibleGround = createSprite(width/2,height-15,width,125);  
  invisibleGround.shapeColor = "0";
  invisibleGround.visible=false;
  
  ground = createSprite(width/2,height,width,2);
  ground.addImage("ground",groundImage);
  ground.x = width/2;
  ground.velocityX = (-6+score/100);
  
  gameOver = createSprite(width/2,height/2- 50);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(width/2,height/2);
  restart.addImage(restartImg);
  
  gameOver.scale = 0.5;
  restart.scale = 0.1;

  gameOver.visible = false;
  restart.visible = false;
  
 
  // invisibleGround.visible =false

  cloudsGroup = new Group();
  obstaclesGroup = new Group();
  
  score = 0;
}

function draw()
{
  background(backgroundImg);
  
  trex.collide(invisibleGround);
  if(gameState===PLAY)
    {
      if(ground.x<0)
        {
          ground.x=ground.width/2;
        }  
      spawnObstacles();
      spawnClouds();
      if(obstaclesGroup.isTouching(trex))
      {
        gameState=END;        
        collidedSound.play();
      }
      score=score+Math.round(getFrameRate()/60);
      if((touches.length>0 || keyDown("SPACE")) && trex.y>=height-120)
        {
          trex.velocityY=-12;
          jumpSound.play();
        }
      trex.velocityY+=0.5;
      
    }
  else if(gameState===END)
    {
      obstaclesGroup.setLifetimeEach(-1);
      cloudsGroup.setLifetimeEach(-1);
      trex.velocityX=0;
      trex.changeAnimation("collided",trex_collided);
      ground.velocityX=0;
      obstaclesGroup.setVelocityXEach(0);
      cloudsGroup.setVelocityXEach(0);
      gameOver.visible=true;
      restart.visible=true;
    }
  
  if((touches.length>0 || keyDown("SPACE"))&&gameState===END)
    {
      reset();
      touches=[];
    }
  drawSprites();
  textSize(20);
  fill("black")
  text("Score: "+ score,windowWidth/2,height/5);
}

function spawnObstacles()
{
  if(frameCount%80==0)
    {
      var speed=-(6+score/100);
      var obstacle=createSprite(width,height-100,5,5);
      obstacle.velocityX=speed;
      speed=constrain(1,40,speed);
      //obstacle.debug=true;
      obstacle.lifetime=300;
      obstaclesGroup.add(obstacle);
      switch(round(random(1,4)))
        {
          case 1: obstacle.addImage("image1",obstacle1);
                  obstacle.scale=0.3;
            break;
          case 2: obstacle.addImage("image2",obstacle2);
            obstacle.scale=0.3;
            break;
          case 3: obstacle.addImage("image3",obstacle3);
            obstacle.scale=0.2;
            obstacle.setCollider("rectangle",0,170,400,350);
            obstacle.y=height-130;
            break;
          case 4: obstacle.addImage("imag4",obstacle4);
            obstacle.scale=0.2;
            obstacle.setCollider("rectangle",40,170,550,360);
            obstacle.y=height-130;
            break;
        }
    }
}
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 45 === 0) {
    var cloud = createSprite(width+20,height-300,40,10);
    cloud.y = Math.round(random(50,width/4));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -(6+score/100);
    
     //assign lifetime to the variable
    cloud.lifetime = 300;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth+1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
  
}

function reset(){
  gameState = PLAY;
  World.frameRate=40;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running);
  ground.velocityX=-(6+score/100);
  score=0;
}
