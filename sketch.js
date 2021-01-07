var dog, dogHappy, dogSad, garden, washroom, bedroom;
var database, foodS, foodStock, currentTime;
var fedTime, lastFed, feed, addFoo, foodObj;
var gameState, readStock;

function preload(){
    dogSad = loadImage("Dog.png");
    dogHappy = loadImage("happydog.png");
    garden = loadImage("Garden.png");
    washroom = loadImage("Wash Room.png");
    bedroom = loadImage("Bed Room.png");  
}
function setup() {
  createCanvas(1000, 500);
  foodObj = new Food();

  database = firebase.database();
  dog = createSprite(800, 200, 10, 10);
  dog.addImage(dogSad);
  dog.scale = 0.2

  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
  database.ref('fedTime').on("value", function(data){
    lastFed = data.val();
  })
  feed = createButton("FEED");
  feed.position(600, 30);
  feed.mousePressed(feedDog);

  addFoo = createButton("ADD FOOD");
  addFoo.position(700, 30);
  addFoo.mousePressed(addFood);

foodStock = database.ref('Food');
foodStock.on("value", readStock);
}

function draw() {  
  console.log(database);
  currentTime=hour();
  if(currentTime==(lastFed+1)){
      update("Playing");
      foodObj.garden();
   }else if(currentTime==(lastFed+2)){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+2) && currentTime<=(lastFed+4)){
    update("Bathing");
      foodObj.washroom();
   }else{
    update("Hungry")
    foodObj.display();
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.remove();
   }else{
    feed.show();
    //addFood.show();
    dog.addImage(dogSad);
   }
   
  drawSprites();
  
} 
function readStock(data){
  foodS = data.val();
  foodObj.updateFoodStock(foodS)
}
function feedDog(){
  dog.addImage(dogHappy)
  foodObj.updateFoodStock(foodObj.getFoodStock()-1)
  database.ref('/').update({
    Food:foodObj.getFoodStock(), 
    fedTime:hour(),
    gameState:"Hungry"
  })
  }

function addFood(){
  foodObj.updateFoodStock(foodObj.getFoodStock()+1)
  database.ref('/').update({
    Food:foodS
  })
}
function update(state){
  database.ref('/').update({
    gameState:state
  })
}