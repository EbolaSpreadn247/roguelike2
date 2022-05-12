var binomialRoots = [0,0,0,0,0,0,0,0,0,0,0,0,0,0]; //where the roots are stored
//console.log(binomialRoots);
var minimum = 10000; //the highest priority node

class binoNode{
  constructor(node){
    this.node = node;
    this.priority = node.estimate;
    this.up = 0;
    this.down = 0;
    this.right = 0;
    this.size = 0;
    node.binoNode = this; //when a binoNode is retrieved, use this to find which node of the grid it refers to.
  }

  insert(order){
    //this.size = order;
    if(minimum == 10000){
      minimum = this;
    }
    if (this.priority < minimum.priority){
      minimum = this;
    }
    //console.log(binomialRoots);
    if(binomialRoots[order] == 0){
      binomialRoots[order] = this;
      //console.log("order ",order);
      
    }
    else{
      //console.log("B",order);
      //console.log("A",binomialRoots[order]);
      
      var superiorNode = this.merge(binomialRoots[order], order);
      superiorNode.size += 1;
      if( superiorNode.priority == 6){
        //console.log("THIS HAPPENED ", superiorNode.size-1," to ",superiorNode.size);
      }
      //binomialRoots[order] = superiorNode;
    }
    //console.log(binomialRoots);
  }

  merge(node2, order){
    //console.log("A");
    if (this.priority < node2.priority){

      if(this.down != 0){
        node2.right = this.down;
      }
      this.down = node2;
      node2.up = this;

      binomialRoots[order] = 0;
      this.insert(order+1);
      
      return this
    }
    else{
      if(node2.down != 0){
        this.right = node2.down;
      }
      node2.down = this;
      this.up = node2;

      binomialRoots[order] = 0;
      node2.insert(order+1);
      
      return node2
    }

    
  }

  reduceKey(newValue){
    this.priority = newValue;
    
    var priority1 = newValue;
    var priority2 = this.up.priority;
    while(this.up != 0 && priority1 < priority2){
      var up1 = this.up;
      var right1 = this.right; //this values
      var down1 = this.down;
      var size1 = this.size;

      var up2 = up1.up;
      var right2 = up1.right; //this.up values
      var down2 = up1.down;
      var size2 = up1.size;

      var currentNode = 0;
      if(up2 != 0){
        if(up2.down == up1){
          up2.down = this;
        }//up2 done
        else{
          currentNode = up2.down;
          while(currentNode.right != up1){
            currentNode = currentNode.right;
          }
          currentNode.right = this;
        }//left1 done
      }
      //this should always be able to run. If not, there might be a problem. Lol.
      currentNode = up1.down;
      while(currentNode != 0){
        currentNode.up = this;
        if(currentNode.right == this){
          currentNode.right = up1;//left1 #2 done
        }
        currentNode = currentNode.right;
      }//leftX done

      if(down1 != 0){
        while(currentNode != 0){
          currentNode.up = this;
          currentNode = currentNode.right;
        }
      }//leftX #2 done
      
    //         up2
    //left1    up1
    //left1+X  this
    //leftX
      this.up = up2;
      this.right = right2; //this = this.up values
      this.down = down2;
      this.size = size2;

      up1.up = up1;
      up1.right = right1; //this.up = this values
      up1.down = down1;
      up1.size = size1;
      
      
      //this fucking works, somehow. Woohoo!
      //wait nvm
      //it doesnt work.
      //it doesnt account for nodes above the upper node.
      //that thing's neighbors need to know how to refer to it in the same way the lower node here does.
      var up1 = this.up;
      if(this.up == 0){
        priority2 = 100000;
      }
      else{
        priority2 = this.up.priority;
      }
      //console.log(up1.priority, this.priority, identifier1);
    }
    findMinimum();
  }

  
}
function deleteMinimum(){
  //visualise();
  //console.log("minimum size ",minimum.size);
  binomialRoots[minimum.size] = 0;
  var branches = [];
  var rightNode = minimum.down;
  while(rightNode != 0){
    //console.log("rightNode size ",rightNode.size);
    //console.log(rightNode);
    //rightNode.size -= 1;
    //console.log(rightNode);
    rightNode.up = 0;
    var next = rightNode.right;
    rightNode.right = 0;

    branches.push(rightNode);
    rightNode = next;
  }
  this.up = 0;
  this.down = 0;
  this.right = 0;
  this.size = 0;
  for(var h = 0;h in branches;h++){
    
    //console.log("C",branches[h].size);
    branches[h].insert( branches[h].size);
  }
  findMinimum();
}

function findMinimum(){
  var minimumValue = 100000;
  for(var h = 0;h < binomialRoots.length;h++){
    //var emptyHeap = true;
    if(binomialRoots[h] != 0){
      if(binomialRoots[h].priority < minimumValue){
        minimum = binomialRoots[h];
        minimumValue = minimum.priority;
      }
      //emptyHeap = false;
    }
    //if(emptyHeap){
    //  minimum = 10000;
    //}
  }
  //console.log("minimum",minimum);
}

function drawBino(){
  var c = document.getElementById("canvas2");
  var ctx = c.getContext("2d");
  ctx.clearRect(0, 0, c.width, c.height);
  visualise();

}

function drawNode1(x,y){
  var c = document.getElementById("canvas2");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.arc(x,y,15,0,2*Math.PI);
  ctx.stroke();
}
function drawSpace(x,y){ //for empty roots, just a line
  var c = document.getElementById("canvas2");
  var ctx = c.getContext("2d");
  ctx.beginPath();
  ctx.moveTo(x-15,y-15);
  ctx.lineTo(x+15,y+15);
  ctx.stroke();
}
function drawText2(node, textX, textY){
  var c = document.getElementById("canvas2");
  var ctx = c.getContext("2d");
  var size = 9;
  var text = node.node.x + "," + node.node.y;
  ctx.fillStyle = "red";
  ctx.font = size + "px monospace";
  ctx.fillText(text, textX, textY);
}
function fullPrint(node){
  output = "Node: ("+ node.priority+") ";
  if(node.down != 0){
    output += "Down: ("+ node.down.priority+") ";
  }
  if(node.up != 0){
    output += "Up: ("+ node.up.priority+") ";
  }
  if(node.right != 0){
    output += "Right: ("+ node.right.priority+") ";
  }
  //console.log(output);
}
function visualise(){
  //console.log("=");
  var node = 0;
  var output = 0;
  var x = 0;
  var y = 0;
  for(var i = 0;i<binomialRoots.length;i++){
    //console.log("==");
    //console.log("WHOA");
    node = binomialRoots[i];
    while( node != 0){ //itll be 0 when it goes node.right on the root node.
    
      //console.log(i + ":");
      while (node.down != 0 ){
        node = node.down;
        y += 1;
        //console.log("Ayup");
        //console.log(node.down);
      }
      //fullPrint(node);
      drawNode1(15+ i*130 + x*30,220 + y*30);
      drawText2(node, 3+ i*130 + x*30,223 + y*30)
      if(node.up != 0){
        node = node.up;
        y -= 1;
        //fullPrint(node);
        drawNode1(15 + i*130 + x*30,220 + y*30);
        drawText2(node, 3+ i*130 + x*30,223 + y*30)
      }
      node = node.right;
      x += 1;
    }
    
    if(binomialRoots[i] == 0){
      drawSpace(15+ i*130 + x*30,220 + y*30);
      //console.log(i + "---------------");
    }
    x = 0;
    y = 0;
  }
  //console.log("______________");
} 