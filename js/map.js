function generateLevel(){
  //console.log("B");
  var type = randomRange(0,8);
  //if( type <3){
  //  let passableTiles = generateTiles();
  //}
  if(type < 6){
    let passableTiles = generateMazeTiles(false);
  }
  else{
    let passableTiles = generateMazeTiles(true);//true == diagonal
  }
  
  
  //
  //console.log(passableTiles);
  let foundTiles = randomPassableTile().getConnectedTiles().length;
  //console.log(foundTiles);
  //console.log( passableTiles == foundTiles);


  //return passableTiles == foundTiles
  
  
  //return generateTiles() == randomPassableTile().getConnectedTiles().length;
  generateMonsters();
}
function generateMazeTiles(diag){
  //console.log("A");
  let passableTiles=0;


  
  tiles = [];
  tileRows = [];


  for (var h = 0; h < numTiles; h++){
    tileRows.push(0);
  }
  for (var h = 0; h < numTiles; h++){
    tiles[h] = tileRows.concat();
  }
  //console.log(tiles);

  var i = 0;
  var j = 0;
  branchList = [];
  var keepLoop = true;
  var keepLoopCounter = 0;
  branch = [];
  var n = 0;
  while (keepLoop){
    

    //console.log("A");
    
    tiles[i][j] = new Floor(i, j);
    passableTiles ++;

    branch.push(tiles[i][j]);
    var adjacentList = adjacencyList(i,j,tiles,diag);
    if( adjacentList.length == 0){
      var h = branch.length - 1;
      while(adjacentList.length == 0 && keepLoop == true){
        
        //console.log(branch.length, " : ",branch);
        
        i = branch[h].x;
        j = branch[h].y;
        
        adjacentList = adjacencyList(i,j,tiles,diag); //this loop is for backtracking
        h--;
        //console.log("h= ",h);
        if (h == -1){ //checked the first position in the branch and it has no adjacents
          keepLoop = false; //sign that the maze is finished!
          
        }
        
      }
     
    }
    
    if (adjacentList.length != 0){
      
      
      var coords = adjacentList[randomRange(0, adjacentList.length - 1)] //chooses a random direction of those available
      //console.log(adjacentList, seedRange(0, adjacentList.length - 1,n))
      //var coords = adjacentList[seedRange(0, adjacentList.length - 1,n)];
      n += 1;
      //console.log("coords", coords);
      i2 = coords[0];
      j2 = coords[1];
      
      if( i2 != i){var i3 = (i2 - i)/2 + i;} //the difference between i2 and i is like, always 2? So i3 is always the inbetween of i & i2. Its done like this to account for negatives -for direction. i & i2 r the "always floors" while i3 is actually variable
      else{ i3 = i;}
      if( j2 != j){var j3 = (j2 - j)/2 + j;}
      else{ j3 = j;}
      //console.log("i=",i,", i2=",i2,", i3=",i3);
      //console.log("i3=",i3," & j3=",j3);

      tiles[i3][j3] = new Floor(i3, j3);
      passableTiles ++;

      i = i2;
      j = j2;
      branchList.push(branch);

      keepLoopCounter++;
      //if (keepLoopCounter > 1){
      //  keepLoop = false;
      //}
      //console.log(keepLoop, keepLoopCounter);
    }

    
  }
  //console.log(tiles[19][19]);
  for (var i = 0; i < numTiles; i++){
    for (var j = 0; j < numTiles; j++){
      if(tiles[i][j] == 0){
        tiles[i][j] = new Wall(i,j); //because of how this specific maze works, when u split the entire maze into squares of 4 tiles, the top left is always floor, and the botoom right is always wall. So the bottomright ones can just be ignored until the end, where they're filled in -like flooding an ants nest

        //This also fills in tiles which couldnt be made into floors due totheir conditions -which is how every none-"always wall" works.
      }
  }
  }
  //console.log(tiles[19][19]);
  return passableTiles;
}
  
  
  //Math.floor(Math.random() * numTiles)

function adjacencyList(i,j,tiles,diag){
  adjacentList = [];
  if(diag == false){
    if( i != numTiles-2 && tiles[i+2][j] == 0){ adjacentList.push([i+2,j]);}
    if( j != numTiles-2 && tiles[i][j+2] == 0){ adjacentList.push([i,j+2]);}
    if( i != 0 && tiles[i-2][j] == 0){ adjacentList.push([i-2,j]);}
    if( j != 0 && tiles[i][j-2] == 0){ adjacentList.push([i,j-2]);}
  }

  if(diag == true){
    if( i != numTiles-2 && j != numTiles-2 && tiles[i+2][j+2] == 0){ adjacentList.push([i+2,j+2]);}
    if( i != 0 && j != numTiles-2 && tiles[i-2][j+2] == 0){ adjacentList.push([i-2,j+2]);}
    if( i != 0 && j != 0 && tiles[i-2][j-2] == 0){ adjacentList.push([i-2,j-2]);}
    if( i != numTiles-2 && j != 0 && tiles[i+2][j-2] == 0){ adjacentList.push([i+2,j-2]);}
  }
  //console.log("adjacentList" ,adjacentList);
  return adjacentList
}

function generateTiles(){
  let passableTiles=0;
  //var rate = Math.random();
  var rate = 0.3;

  tiles = [];
  for(let i=0;i<numTiles;i++){
    tiles[i] = [];
    for(let j=0;j<numTiles;j++){
      
      //let numba = Math.random();
      //console.log(numba);
      //console.log( numba > 0);
      //console.log(i,j);
      //console.log(inBounds(i,j));
      //console.log(numba > 0 && inBounds(i,j))
      
      if((Math.random() > rate) && (inBounds(i,j))){
          tiles[i][j] = new Floor(i,j);
          passableTiles++;
      }
      else{
          tiles[i][j] = new Wall(i,j);
      }
    }
  }
  return passableTiles;
}

function inBounds(x,y){
  return x>-1 && y>-1 && x<numTiles && y<numTiles; //This is dictating the walls via exclusion of their area.
}
function getTile(x, y){
  if(inBounds(x,y)){
    return tiles[x][y];
  }
  else{
    return new Wall(x,y);
  }
}

function randomPassableTile(){
    let tile;
    tryTo('get random passable tile', function(){
        let x = randomRange(0,numTiles-1);
        let y = randomRange(0,numTiles-1);
        tile = getTile(x, y);
        if(tile.passable && !tile.monster && !tile.structure){
          return tile
        }
    });
    return tile;
}
function seedPassableTile(){
    let tile;
    let n = 0;
    let x = 0;
    let y = 0;
    while(n > -1){
      let x = seedRange(0, numTiles-1, n);
      n+=1;
      let y = seedRange(0, numTiles-1, n);
      console.log("x,y",x,y);
      tile = getTile(x, y);
      n += 1;
      if(tile.passable && !tile.monster && !tile.structure){
        return tile;
      }
      //console.log("UOHO",tile.x,tile.y);
    }
    //console.log("tile",tile);
    
}

function linePassableTile(){
  let tile;
  let x = randomRange(0,numTiles-1);
  let y = randomRange(0,numTiles-1);
  tile = getTile(x, y);
  while( !tile.passable || tile.monster){
    var xmod = randomRange(0,2) - 1;
    if (xmod == 0){
      var ymod = (randomRange(0,1) * -2) + 1;
    }
    else{
      var ymod = randomRange(0,1) - 1;
    }

    x += xmod;
    y += ymod;
    if( x > numTiles - 1 || x < 0 || y > numTiles-1 || y < 0){
      let x = randomRange(0,numTiles-1);
      let y = randomRange(0,numTiles-1);
    }
    tile = getTile(x, y);
  }
}

function generateMonsters(){
    monsters = [];
    //var n = 0;
    //var n = seedRange(0,1000, floorLevel);
    let numMonsters = floorLevel+3;
    for(let i=0;i<numMonsters;i++){
      spawnMonster();
      //n+=floorLevel; //this is weird. This means that the first monster generated on a floor == the 2nd generated on the one below.....Not desirable at all, but what do? I guess i need to seperate randomness of monster-to-monster from randomness of floor-to-floor. Or maybe floor-to-floor need to affect the monster-to-monster....Like a 3rd dimension hassling the 2nd?
      //so instead of incrementing n, perhaps its modifier should change based fof floorLevel. just gonna add floorLevel to itself. Not great, because the numbers will have similiarities too.
      //like if floorLevel is 5 then n = 5,10,15,20.
      //if floorLevel is 10 then n = 10,20,30,40
      //both these floors will have some of their monsters identical. If floor 5 had its #2 monster as a slime, floor 10 will have its #1 guaranteed as a slime
      //To make it less predictable we seedRanging this garbage. Hope this works cus i cba to think about it more.
    }
}

function spawnMonster(n){
    let monsterList = [Slime, Mimic, Cake, Lizard, Cow];
    let monsterType = monsterList[randomRange(0, monsterList.length -1)];
    //console.log(monsterType);
    //let monsterType = shuffle([Cake])[0];
    
    //let tile = seedPassableTile();
    let tile = randomPassableTile();
    //n+= 1;
    // while(tile.passable == false){
      //console.log(n);
      //tile = seedPassableTile();
      //n+= 1;
    //}
    let monster = new monsterType(tile,floorLevel);
    tile.monster = monster;
    monsters.push(monster);
    //return n
}