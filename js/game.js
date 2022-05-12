//var userInput = [false,5];
function runGame(){
  checkInputs();
  draw();
}
function checkInputs(){
  
  if(userInput[0]){
    if(Number.isFinite(userInput[1])){
      if(userInput[1] > 6){
        if(userInput[1]==7) { player.tryMove(-1,-1);}
        else if(userInput[1]==8) { player.tryMove(0,-1);}
        else if(userInput[1]==9) { player.tryMove(1,-1);}
      }
      else if(userInput[1] > 3){
        if(userInput[1]==4) { player.tryMove(-1,0);}
        else if(userInput[1]==6) { player.tryMove(1,0);}

        else if(userInput[1]==5){ 
          tile = player.tile;
          tile.interact(player);
        }
      }
      else if(userInput[1] > 0){
        if(userInput[1]==1) { player.tryMove(-1,1);}
        else if(userInput[1]==2) { player.tryMove(0,1);}
        else if(userInput[1]==3) { player.tryMove(1,1);}
      }
    }
    else{
      if(userInput[1]=="q") { player.tryMove(-1,-1);}
      else if(userInput[1]=="w") { player.tryMove(0,-1);}
      else if(userInput[1]=="e") { player.tryMove(1,-1);}

      else if(userInput[1]=="z") { player.tryMove(-1,1);}
      else if(userInput[1]=="x") { player.tryMove(0,1);}
      else if(userInput[1]=="c") { player.tryMove(1,1);}

      else if(userInput[1]=="a") { player.tryMove(-1,0);}
      else if(userInput[1]=="d") { player.tryMove(1,0);}

      else if(userInput[1]=="s"){ 
        tile = player.tile;
        tile.interact(player);
      }
    }
    

    

    userInput[0] = false;
  }
  
}
function setupCanvas(){
  canvas = document.querySelector("canvas");
  ctx = canvas.getContext("2d");
  
  
  canvas.width = tileSize*(numTiles+uiWidth);
  canvas.height = tileSize*numTiles;
  canvas.style.width = canvas.width + 'px';
  canvas.style.height = canvas.height + 'px';
  ctx.imageSmoothingEnabled = false;

  canvas.addEventListener("click", function(event){
    
    var c = document.getElementById("canvas");
    
    var x = Math.floor((event.pageX - c.offsetLeft) /32);
    var y = Math.floor((event.pageY - c.offsetTop) / 32);
    //console.log(x,y);
    //console.log(tiles[x][y]);
    var tile = tiles[x][y];
    //console.log(tile);

    if(tile.monster){
      if(tile.monster.name == "mimic"){
        viewImage = viewImageList[1];
      }
      else if(tile.monster.name == "delicious slime"){
        viewImage = viewImageList[2];
      }
    }
    else if(tile.passable == true){
      viewImage = viewImageList[0];
    }
  });
  //ctx.font = "30px Arial";
  //ctx.fillText("Hello World", 10, 50);
}

function drawSprite(spritesheetGiven, sprite, x, y){
  if(sprite > 32){var tempSprite = sprite - 32;}
  else{var tempSprite = sprite;}
  ctx.drawImage(
  spritesheetGiven,
  tempSprite*32,
  Math.floor(sprite/32)*32,
  32,
  32,
  x*tileSize,
  y*tileSize,
  tileSize,
  tileSize
  );
}
function drawTitleScreen(){
  var t = document.createElement("IMG");
  t.setAttribute("src", "images/titlescreen.png");
  t.setAttribute("width", "960");
  t.setAttribute("height", "587");

  ctx.drawImage(
  t, 10, 10);
}
function drawViewScreen(){
  //console.log("images/" + viewImage);
  viewImageElement.src = "images/" + viewImage;
  ctx.drawImage(
  viewImageElement, 672, 288);
}
function drawAxis(){
  ctx.fillStyle = "white";
  ctx.font = 10 + "px monospace";
  for(let i=0;i<numTiles;i++){
    
    drawText(i, numTiles*32, (i+1)*32);
    //getTile(i,21).draw();
  }
  for(let j=0;j<numTiles;j++){
    
    drawText(j, j*32, numTiles*32 +8);
    //getTile(i,j).draw();
  }
}

function draw(){

  ctx.clearRect(0,0,canvas.width,canvas.height);
  drawAxis();
  if(gameState == "running" || gameState == "dead"){
    
    //ctx.fillRect (x*tileSize,y*tileSize,tileSize,tileSize);
          
    //ctx.drawImage(spritesheet, x*tileSize, y*tileSize);
    for(let i=0;i<numTiles;i++){
      for(let j=0;j<numTiles;j++){
        getTile(i,j).draw();
        //let tileCheck = getTile(i,j);
        //if(tileCheck.visible){
        //  tileCheck.draw();
        //}
        //else{
        //  tileCheck.drawDark();
        //}
        //getTile(i,j).draw();
      }
    }
          
    player.draw();
    for(let i=0;i<monsters.length;i++){
      monsters[i].draw();
    }
    ctx.fillStyle = "red";
    ctx.font = 30 + "px monospace";
    drawText("Level: "+floorLevel, 32*(numTiles+1), 40);
    drawText("Blood: "+player.hp, 32*(numTiles+1), 80); //being draw every tick. Because its text is an attribute of an object, it updates automatically when the value is updated internally.
    ctx.fillStyle = channel1.colour;
    ctx.font = channel1.size + "px monospace";
    channel9.draw();
    channel8.draw();
    channel7.draw();
    channel6.draw();
    channel5.draw();
    channel4.draw();
    channel3.draw();
    channel2.draw();
    channel1.draw();
    drawViewScreen(ctx);
    drawBino();
    /////////////////////////////////////////////
  } 
  else if(gameState == "title"){
    
    ctx.fillStyle = 'rgba(200,0,100,.75)';
    ctx.fillRect(0,0,canvas.width, canvas.height);
    drawTitleScreen();
  }
}

function tick(spawnCounter){
  for(let k=monsters.length-1;k>=0;k--){
    if(!monsters[k].dead){
      monsters[k].update();
    }
    else{
      monsters.splice(k,1);
    }
  }
}

function showTitle(){                                          
    ctx.fillStyle = 'rgba(78,0,0,.75)';
    ctx.fillRect(0,0,canvas.width, canvas.height);

    gameState = "title";
}

function startGame(){ 
  //if(savedSeed == false){
  //  seedList = [];
  //}                                  
  //for(let i = 0; i < 100;i++){
    //let newSeed = generateSeed();
    //seedList.push(newSeed); //seedList is a  dimensional array now....dont like this direction. Is just that each seed is segmented to 4 digit length 10 of denary into base36 -for ease of use..
  //}
  //seed = seedList[0];
  level = 0;
  let downTile = startLevel();
  player = new Player(downTile);
  //player.tile = downTile;
  downTile.monster = player;
  gameState = "running";
  console.log(gameState);
}

function startLevel(){    
  //console.log("A");                      
  generateLevel();
  //tile = seedPassableTile();console.log("1"); 
  tile = randomPassableTile();
  tiles[tile.x][tile.y] = new upExit(tile.x,tile.y); console.log("1.5"); 
  //tile = seedPassableTile();console.log("2"); 
  tile = randomPassableTile();
  tiles[tile.x][tile.y] = new downExit(tile.x,tile.y);  
  var downTile = tiles[tile.x][tile.y];
  //tile = seedPassableTile();console.log("3"); 
  tile = randomPassableTile();
  tiles[tile.x][tile.y] = new MorningStar(tile.x,tile.y); 
  if (gameState == "running"){
    player.tile = downTile;
    downTile.monster = player;
  }
  return downTile
}

//class hpBar{
  //constructor(maxHp, hp){
    //this.maxHp = maxHp;
    //this.hp = hp;
    //this.sprite = sprite;
  //}

  //update(maxHp, hp){
    //this.maxHp = maxHp;
    //this.hp = hp;
  //}
//}