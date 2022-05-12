//enemies planned:
//Mice
//Rats
//Spiders

//dogs
//goblins
//boars

//cows
//humans
//minotaurs

class Monster{
	constructor(tile, sprite, level, name){
    this.move(tile);
    this.sprite = sprite;
    this.level = level;
    this.hp = Math.floor(10 ** (level/4) )+1;
    this.attack = Math.floor(10 ** (level/4) /6)+1;
    this.lastSeenPlayer = false;
    this.name = name;
	}

  update(){
    this.doStuff();
    if(this.stunned){
      this.stunned = false;
      return;
    }
  }

  doStuff(){
    if (this.stunned == true){ //missses a turn. when adding the ability for enemies to hit you, make this only prevent movement....or dont and instead make it not apply as often. or both.
      return
    }
    let visibles = this.tile.searchRadius(5,"monster");
    
    if(visibles.length > 0){
      this.lastSeenPlayer = player.tile;
      var path = Astar(this.tile,player.tile,"astar");
      let success = this.tryMove(path[path.length-1].x - this.tile.x, path[path.length-1].y - this.tile.y);
    }
    else if(this.lastSeenPlayer != false){
      if(this.lastSeenPlayer == this.tile){
        this.lastSeenPlayer = false;
        return
      }
      var path = Astar(this.tile,this.lastSeenPlayer,"astar");
      let success = this.tryMove(path[path.length-1].x - this.tile.x, path[path.length-1].y - this.tile.y);
    }
    //console.log(visibles[0], visibles.length);
    //console.log("a2");
    //for(var h = 0;h<path.length;h++){
    
    //console.log("a3");
    //console.log(success);
  }
    
	draw(){
    drawSprite(spritesheet0, this.sprite, this.tile.x, this.tile.y);
    //if(this.tile.visible){
    //  drawSprite(spritesheet, this.sprite, this.tile.x, this.tile.y);
    //}
    //else{
    //  drawSprite(spritesheetDark, this.sprite, this.tile.x, this.tile.y);
    //}
    
    //this.drawHp();
	}
  //drawHp(){
    //drawSprite(this.sprite, this.tile.x+20, this.tile.y);
  //}

  tryMove(dx, dy){
    //console.log("0");
        //console.log(visibles.length);
    
    let newTile = this.tile.getNeighbor(dx,dy);
    if(newTile.passable){
      if(!newTile.monster){
        //console.log(newTile.monster);
        this.move(newTile);
        //console.log("a4");
        return true;
      }
      else{
        var monsterHp = newTile.monster.hp - this.attack;
        var monsterName = newTile.monster.name;
        var violenceWords = ["quashed", "initiated fracas on","wacked","slammed","eviscerated","slashed","cut","stomped","abused","wrangled","hurt","attacked"];
        
        textOutput(this.name+" "+violenceWords[randomRange(0, violenceWords.length -1)] +" "+ monsterName + " for "+ this.attack + ", it has " + monsterHp + " blood left. ");

        newTile.monster.stunned = true;
        newTile.monster.hit(this.attack, this);
        //document.getElementById("textChannel").innerHTML = "The "+monsterName+" was hit for " + this.attack + ", it has " + monsterHp + " blood remaining.";
        

        this.attackedThisTurn = true;
        
        return true;
      }
    }
  }
    
      //console.log("1");
  

  hit(damage,attacker){
    this.hp -= damage;
    if(this.hp <= 0){
      this.die();
    }
    attacker.hp -= Math.floor(attacker.attack / 6);
  }

  die(){
    var tribute = Math.floor(10 ** (this.level/4) );
    player.hp += tribute;
    textOutput(this.name + " was slain, it errupts a small fountain of tribute.");
    new splatter(this.tile.x,this.tile.y, tribute); 

    this.dead = true;
    this.tile.monster = false;
    if(this.name == "aphid"){
      gameState = "dead";
    }
    //this.sprite = 11;
    //this bit is running but not visible because they disappear as soon as its thier turn to move, which is right after u killed them. Consider corpses in the future. Or having enemy turns only initiate on confirmation of the previous one - kinda like in an rpg where u spam a through dialogue. except through text logs of their actions.
  }

  move(tile){
    
    if(this.tile){
      this.tile.monster = false;
    }
    this.tile = tile;
    tile.monster = this;
    tile.stepOn(this); 
  }

}
class Player extends Monster{
    constructor(tile){
        super(tile, 0, 3, "aphid");
        //this.isPlayer = true;
    }

    tryMove(dx, dy){
      //console.log("2");
      var time1=Date.now();
      if(super.tryMove(dx,dy)){
        tick();
        
        //let goal = getTile(19,19);
        //console.log("WHOAW");
        //let visibles = Astar(this.tile,getTile(19,19),"light");
        let visibles = this.tile.searchRadius(5,"player");
        //console.log(visibles.length);
        for(var i = 0; i < visibles.length; i++){
          visibles[i].visible = true;
          visibles[i].sprite -= 32;
        }
        //getTile(10,10).visible = true;
        //console.log(visibles);
      }
      var time2 = Date.now();
      var time3 = (time2 - time1);
      document.getElementById("3").innerHTML = time3 +"ms";
    }
}

class Slime extends Monster{
    constructor(tile,floorLevel){
        super(tile, 36, 3+floorLevel, "delicious slime");
        //this.isPlayer = false;
    }
    
}

class Mimic extends Monster{
    constructor(tile,floorLevel){
        super(tile, 38, 5+floorLevel, "mimic");
        //this.isPlayer = false;
    }
}

class Cake extends Monster{
    constructor(tile,floorLevel){
        super(tile, 40, 10+floorLevel, "birthday cake");
        //this.isPlayer = false;
    }
}

class Lizard extends Monster{
    constructor(tile,floorLevel){
        super(tile, 41, 1+floorLevel, "lizard");
        //this.isPlayer = false;
    }
}

class Cow extends Monster{
    constructor(tile,floorLevel){
        super(tile, 42, 5+floorLevel, "cattle");
        //this.isPlayer = false;
    }
}



//Final boss: The Firmament (big eye)