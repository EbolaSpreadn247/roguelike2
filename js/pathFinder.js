var searchedNodes = [];
var 
fullySearchedNodes = [];
var finalPath = [];

function Astar(start, end, version){
  //if(version == "light"){console.log("alive");}
  for(var i = 0;i<searchedNodes.length;i++){
    searchedNodes[i].prevNode = false;
    searchedNodes[i].travelled = 0;
    searchedNodes[i].remaining = 10000;
    searchedNodes[i].estimate = 10000;
    searchedNodes[i].fullyExplored = false;
    searchedNodes[i].binoNode.priority = 10000;
    searchedNodes[i].binoNode.up = 0;
    searchedNodes[i].binoNode.down = 0;
    searchedNodes[i].binoNode.right = 0;
    searchedNodes[i].binoNode.size = 0;
    //searchedNodes[i].binoNode = false;
  }
  searchedNodes = [];
  fullySearchedNodes = [];
  binomialRoots = [0,0,0,0,0,0,0,0,0,0,0,0,0,0];
  minimum = 10000;
  //cleared the slate of previous paths found. Letsa gooo.
  //having to clear previous ones instead of just being able to overwrite them probably makes this entire operation x2 slower. Make a way to simply overwrite previous states instead. Like tagging them with a code or counter personal to each Astar search. As opposed to prevnode and fullyexplored being false or w/e.
  var minimumNode = start;
  minimumNode.tryEstimate(minimumNode,end);
  if(minimumNode.binoNode == false){
    m = new binoNode(minimumNode);
  }
  else{
    m = minimumNode.binoNode;
  }
  m.insert(0);
  //if(version == "light"){console.log("alive",version);}
  if(version == "light"){
    adjacentList = minimumNode.getAdjacentPassableNeighbors(start);
  }
  else{
    adjacentList = minimumNode.getAdjacentPassableNeighbors(version);
  }
  //if(version == "light"){console.log("alive");}
  minimumNode.fullyExplored = true;
  searchedNodes.push(minimumNode);
  fullySearchedNodes.push(minimumNode);
  deleteMinimum();

  //var adjacentListText = "";
  //for(i = 0;i in adjacentList;i++){
  //  adjacentListText += "("+adjacentList[i].x +","+adjacentList[i].y+"),";
  //}
  //console.log("MinimumNode: ("+minimumNode.x + ","+minimumNode.y +") ","limit: "+ limit, "searchedNodes: "+ searchedNodes.length, "FullySearchedNodes: "+ fullySearchedNodes.length ," adjacents: "+adjacentListText);
  //if(version == "light"){console.log("alive");}
  for(i = 0;i<adjacentList.length;i++){
    adjacentList[i].tryEstimate(minimumNode,end);
    if(adjacentList[i].binoNode == false){
      a = new binoNode(adjacentList[i]);
    }
    else{
      adjacentList[i].binoNode.priority = adjacentList[i].estimate;
      a = adjacentList[i].binoNode;
    }
    a.insert(0);
    searchedNodes.push(adjacentList[i]);
  }
  findMinimum();
  //now we have a starting base. start exploring these cells!
  
  //if(version == "light"){console.log("alive");}
  //now theyre all sorted within the binomial heap, too.
  //minimumNode.binoNode.reduceKey(-10);
   //this deletes the node for being fully searched, even if its no longer the minimum.
  var limit = 400;
  if(version == "light"){limit = 50;}
  while(limit > 0){
    //console.log(limit);
    limit -= 1;
    minimumNode = minimum.node;
    //console.log("#1 !",minimumNode.x, minimumNode.y);
    //findMinimum();
    //console.log("#2 !",minimumNode.x, minimumNode.y);
    if(version == "light"){
      adjacentList = minimumNode.getAdjacentPassableNeighbors(start);
    }
    else{
      adjacentList = minimumNode.getAdjacentPassableNeighbors(version);
    }
    fullySearchedNodes.push(minimumNode);
    minimumNode.fullyExplored = true;
    deleteMinimum();
    //if(version == "light"){console.log("alive");}
    //adjacentListText = "";
    //for(i = 0;i in adjacentList;i++){
    //  adjacentListText += "("+adjacentList[i].x +","+adjacentList[i].y+"),";
    //}
    //console.log("MinimumNode: ("+minimumNode.x + ","+minimumNode.y +") ","limit: "+ limit, "searchedNodes: "+ searchedNodes.length, "FullySearchedNodes: "+ fullySearchedNodes.length ,"adjacents: "+adjacentListText);
      
    for(i = 0;i<adjacentList.length;i++){
      
      if(adjacentList[i].prevNode == false){
        adjacentList[i].tryEstimate(minimumNode,end);
        if(adjacentList[i].binoNode == false){
          a = new binoNode(adjacentList[i]);
          
        }
        else{
          
          adjacentList[i].binoNode.priority = adjacentList[i].estimate;
          a = adjacentList[i].binoNode;
        }
        a.insert(0);
        searchedNodes.push(adjacentList[i]);
      }
      else{
        adjacentList[i].binoNode.reduceKey(adjacentList[i].estimate);
      }
      
    }
    //minimumNode.binoNode.reduceKey(-10);
    
    findMinimum();
    if(minimumNode.monster.name == "aphid"){
      limit = 1;
    }
    //console.log(minimumNode);
  }
  //console.trace();
  //console.log("limit " + limit);
  if(version == "astar"){
    
    finalPath = reconstructPath(end);
    //console.log("a");
    return finalPath
  }
  if(version == "light"){
    return searchedNodes
  }
  //finalPath.push(end);
  
}

function reconstructPath(node){
  //console.log(minimumNode);
  //console.log(searchedNodes);
  //console.log(binomialRoots);
  var path = [];
  while(node != false && (node != node.prevNode)){
    //console.log("prevNode WORLD: ", node.x,node.y);
    path.push(node);
    //node.sprite = 12;
    
    node = node.prevNode;
  }
  return path
}