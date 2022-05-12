visibleTiles = [];
darkTiles = [];

class Tile{
	constructor(x, y, sprite, passable, structure){
    this.x = x;
    this.y = y;
    this.sprite = sprite;
    this.passable = passable;
    this.structure = structure;
    this.visible = false;

    this.prevNode = false; //not yet got one.
    this.travelled = 0; //high number to automatically be replaced
    this.remaining = 10000;
    this.estimate = 10000;
    this.fullyExplored = false;
    this.binoNode = false; //when adding the node to the binomial heap, this value refers to its position in the heap. Use this to find nodes to reduceKey externally (the only real way to do so)
    this.monster = false; 
	}
  updateVisibles(monster){
    if(monster.name != "aphid"){
      if(this.visible && monster.sprite > 31){
        monster.sprite -= 32;
      }
      else if(this.visible == false && monster.sprite < 32){
        monster.sprite += 32;
      }
    }
  }
  searchRadius(size,type){
    let y1 = this.y - size;
    if(y1 < 0){
      y1 = 0;
    }
    let y2 = this.y + size;
    if(y2 > 19){
      y2 = 19;
    }
    let x1 = this.x - size;
    if(x1 < 0){
      x1 = 0;
    }
    let x2 = this.x + size;
    if(x2 > 19){
      x2 = 19;
    }
    var neighbors = [];
    if(type == "monster"){
      neighbors.push(player.tile);
    }
    else{
      for(var i = x1; i < x2+1; i++){
        for(var j = y1; j < y2+1; j++){
          let theTile = getTile(i,j);
          if(theTile.visible == false){
            neighbors.push(theTile);
          }
          //else if(type == "monster"){
          //  if(theTile.passable == true){
          //    neighbors.push(theTile);
          //  }
          //}
        }
      }
    }
    
    //console.log("pickup ere");
    //so this == the start node.
    let viewableNeighbors = [];
    //console.log("pickup ere");
    for(var j = 0; j < neighbors.length; j++){
      //console.log(j);
      let m = (neighbors[j].y - this.y)/(neighbors[j].x - this.x+0.000000000000001);
      //console.log(m);
      //console.log(m,"m");
      //y = mx +c, c = y - mx
      var c = neighbors[j].y - (neighbors[j].x*m);
      var modifier = 1;
      
      //console.log("pickup ere");
      var blocked = false;
      if( m > 1 || m < -1){
        if(neighbors[j].y < this.y){
          modifier = -1;
        }
        for(var i = this.y; i != neighbors[j].y && blocked == false; i+= modifier){
          //console.log("pickup ere",Math.round(Math.round(((i-c)/m) * 10) /10),neighbors[j].y,i);
          if(getTile(Math.round(Math.round(((i-c)/m) * 10) /10),i).passable == false){   
            blocked = true;
            //console.log(neighbors[j].y, i,(i-c)/m);
            i = neighbors[j].y;
          }
          //console.log(neighbors[j].y, i, i != neighbors[j].y);
        }
      }
      else{
        if(neighbors[j].x < this.x){
          modifier = -1;
        }
        for(var i = this.x; i != neighbors[j].x && blocked == false; i+= modifier){
          //console.log("pickup ere",i,m,i,c);
          //console.log(i,Math.round(Math.round((m*i + c) * 10) / 10));
          if(getTile(i,Math.round(Math.round((m*i + c) * 10) / 10)).passable == false){
            blocked = true;
            
            i = neighbors[j].x -1;
            
          }
          //console.log(neighbors[j].x, i,modifier,blocked, Math.round(m*i + c));
          if(blocked == true){
            i =neighbors[j].y;
          }
        }
      }
      if(blocked == false){
        viewableNeighbors.push(neighbors[j]);
      }
      //console.log("pickup ere");
    }
    return viewableNeighbors
      
    
    //return lightUp

  
  }
  dist(other){
    return Math.abs(this.x-other.x)+Math.abs(this.y-other.y);
  }

  draw(){
    drawSprite(spritesheet0,this.sprite, this.x, this.y);
  }
  drawDark(){
    drawSprite(spritesheetDark,this.sprite, this.x, this.y)
  }

  getNeighbor(dx, dy){
    return getTile(this.x + dx, this.y + dy)
  }
  getAdjacentNeighbors(){
    return shuffle([
      this.getNeighbor(0, -1),
      this.getNeighbor(0, 1),
      this.getNeighbor(-1, 0),
      this.getNeighbor(1, 0),

      this.getNeighbor(1,1), //diagonals. easy to turn off
      this.getNeighbor(-1,-1),
      this.getNeighbor(1,-1),
      this.getNeighbor(-1,1)
    ]);
  }
  calculateRemaining(goal){
    var x = goal.x - this.x;
    var y = goal.y - this.y;
    
    this.remaining = Math.sqrt(x**2 + y**2); //manhatten / 2. So the heuristic is ALWAYS smaller.
      //normal manhatten doesnt work because diagonal is weighted 1.
      //also why direct distance doesnt work -ends up larger.
      //remaining = x**2 + y**2;
      //remaining = Math.sqrt(remaining); //does this always output as positive? i hope so.
  }
  tryEstimate(prevNode,goal){
    if(this != prevNode){
      var x = goal.x - this.x;
      var y = goal.y - this.y;
      if(x < 0){
        x *= -1;
      }
      if(y < 0){
        y *= -1;
      }
      var travelled = prevNode.travelled + 1;
      
      
    }
    else{
      var travelled = prevNode.travelled; //i dont want this to run
    }
    this.calculateRemaining(goal);
    var estimate = travelled + this.remaining;
    //if(estimate == this.estimate){
    //  if(prevNode.x == this.x || prevNode.y == this.y){
    //    estimate -= 0.01;
    //  }
    //  else if(this.prevNode.x == this.x || this.prevNode.y == this.y){
    //    estimate -= 0.01;
    //  }
    //}
    if(estimate < this.estimate){ //better route, switch tracks right on over!
      this.estimate = estimate;
      this.travelled = travelled;
      this.prevNode = prevNode;
      return true//ascend the heap!
    }
    
    return false
  }
  getAdjacentPassableNeighbors(aStar){
    if(aStar == "astar"){
      var x = this.x;
      var y = this.y;
      var adjacencyList = [];

      var lowI = -1;
      var highI = 1;
      var lowJ = -1;
      var highJ = 1;

      if(x < 1){ //to prevent checking out of bounds. limits the range of the for loops.
        lowI = 0;
      }
      if(x > numTiles -2){
        highI = 0;
      }
      if(y < 1){
        lowJ = 0;
      }
      if(y > numTiles -2){
        highJ = 0;
      }
      for(var i = lowI;i<highI+1;i++){ //so it goes from x-1 to x+1 and y-1 to y+1, the full circle around. but doesnt check none existent position and get undefined-caused errors >:/
        for(var j = lowJ;j<highJ+1;j++){
          if(tiles[x+i][y+j].passable){
            if(!(i==0 && j==0)){ //removes the center position because that is itself.
              adjacencyList.push(tiles[x+i][y+j]);
            }
          }
        }
      }
      return adjacencyList

      //the old version:
      //var a = this.getAdjacentNeighbors().filter(t => //t.film);
      //a = a.filter(t => t.film.notSearched);
      //var b = this.getAdjacentNeighbors().filter(t => //!t.film);
      //return [(a),(b)]
    }
    
    else{
      return this.getAdjacentNeighbors().filter(t => t.passable);
    }
  }

  getConnectedTiles(){
    let connectedTiles = [this];
    let frontier = [this];
      while(frontier.length){
        let neighbors = frontier.pop()
              .getAdjacentPassableNeighbors(false)
              .filter(t => !connectedTiles.includes(t));
        connectedTiles = connectedTiles.concat(neighbors);
        frontier = frontier.concat(neighbors);
      }
    return connectedTiles;
  }
}
class Floor extends Tile{
  constructor(x,y){
    super(x, y, 35, true, false);
  };
  stepOn(monster){
    //console.log(monster);
    //console.log(this);
    super.updateVisibles(monster);
  }
  interact(player){}
}

class Wall extends Tile{
  constructor(x, y){
    super(x, y, 34, false, false);
  }
}

class upExit extends Tile{
  constructor(x, y){
    super(x, y, 44, true, true);
  }

  stepOn(monster){
    super.updateVisibles(monster);
    if(monster.name == "aphid"){
      textOutput("Press 5. Ascend.")
    }
  }
  interact(monster){
    if(monster.name == "aphid"){
      if(floorLevel == 100){
        showTitle();
      }
      else{
        floorLevel++;
        seed = seedList[floorLevel];
        startLevel();
      }
    }
  }
}
class downExit extends Tile{
  constructor(x, y){
    super(x, y, 44, true, true);
  }

  stepOn(monster){
    super.updateVisibles(monster);
    if(monster.name == "aphid"){
      textOutput("Press 5. Descend.")
    }
  }
  interact(monster){
    if(monster.name == "aphid"){
      if(floorLevel == 100){
        showTitle();
      }
      else{
        floorLevel--;
        seed = seedList[floorLevel];
        startLevel();
      }
    }
  }
}

class MorningStar extends Tile{
  constructor(x, y){
    super(x, y, 45, true, true);
  }

  stepOn(monster){
    super.updateVisibles(monster);
    if(monster.name == "aphid"){
      textOutput("You walk by a Morning Star. Press 5 to rest upon it.");
    }
  }
  interact(player){
    var prevLevel = player.level;
    player.level = Math.floor(Math.log(player.hp)/Math.log(10) *4);

    //console.log(player.hp);
    //console.log(player.level);
    //console.log(10 **(player.level/4));
    //remove math.floor when testing. to see how close the equation is.

    player.attack = Math.floor(10 ** (player.level/4) /2);
    if(player.level > prevLevel){
      textOutput("You lay on the Morning Star and experience a world of accupunctures,Lv +"+(player.level-prevLevel)+" times!");
    }
    else{
      textOutput("You lay on the morning star and begin slowly slipping down a spike. Return when swelling with power");
    }
  }
}

class splatter extends Tile{
  constructor(x, y, blood){
    super(x, y, 46, true, true);
    this.blood = Math.floor(blood / 5);
    this.prevTile = tiles[x][y];
    tiles[x][y] = this;
  }

  stepOn(monster){
    super.updateVisibles(monster);
    //console.log("A");
    if(monster.name != "aphid"){
      //monster.hp += this.blood;
      //tiles[this.x][this.y] = this.prevTile;
      //this is code to let monsters consume blood curdles. Readd in a preventabvle way,later.
      monster.hp += 1; //lol?
    }
    else{
      textOutput("Blood curdles.");
    }
  }
  interact(player){
    player.hp += this.blood;
    //tiles[this.x][this.y] = new Floor(this.x, this.y);
    tiles[this.x][this.y] = this.prevTile;
    player.tile = this.prevTile;
    this.prevTile.monster = player;
    textOutput("You feed nicely.");
  }
}