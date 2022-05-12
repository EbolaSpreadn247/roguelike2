invRoots = []; //list of the accessible nodes?
//would this be minimum for a binoheap or binomialRoots?
//the top item of a stack?
//branches of a tree, etc

class InvNode{
  constructor(linkedNodes, item){
    if( ){//store somewhere the type of data structure being used

    }
  }
}

class Item{
  constructor(name){
    this.name = name;
  }
}

class bloodVial extends Item{
  constructor(name){
    super(name);
  }
  use(user){
    user.hp += 10;
    emptyVial(user);
  }
  emptyVial(user){
    //makes a glass vial item and replaces this with it in the player's inventory.
    //deletes this item.
  }
}