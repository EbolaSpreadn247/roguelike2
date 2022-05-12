var seed=[];
var savedSeed = true;
var seedList = [];

var to36List = ["0","1","2","3","4","5","6","7","8","9","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"];
function generateSeed(){
  let newSeed = [denaryTo36(generateDenary()) , denaryTo36(generateDenary()) , denaryTo36(generateDenary()) , denaryTo36(generateDenary())];
  return newSeed
}
function generateDenary(){
  //console.log("we here");
  let num = Math.random();
  
  num = num *10**(num.toString().length - 2);
  num = num.toString().slice(0,10); //first 10 positions
  //console.log(num);
  return parseInt(num)
}
function denaryTo36(num){
  let place1 = 1000000;
  let place2 = 1000000;
  let base36 = "1";
  let digit = 0;
  let power = 0;
  //console.log(num);
  power = Math.floor(log(36,num));
  let remaining = num;
  let result = "";
  for(var i = power; i > -1; i--){
    digit = Math.floor(remaining / (36**i));
    result = result + to36List[digit];
    remaining = remaining - digit*(36**i);
    //console.log(i, digit, remaining);
  }
  //console.log(result);
  return result
}
function base36To10(base36){
  //console.log(base36);
  //console.log(Array.isArray(base36));
  let result = 0;
  var resultList = [];
  
  if(Array.isArray(base36)){
    let power = base36[0].length - 1;
    for(let j = 0; j < 4; j++){
      for(let i = power; i > -1; i--){
        result = result + parseInt(to36List.indexOf(base36[j][power - i])*(36**i));
        //console.log(i,result);
        if(result.toString().length == 10){
          resultList.push(result.toString());
        }
        //console.log(i, result);
      }
      result = 0;
    }
  }
  else{
    let power = base36.length - 1;
    for(let i = power; i > -1; i--){
      result = result + parseInt(to36List.indexOf(base36[power - i])*(36**i));
      //console.log(i,result);
      if(result.toString().length == 10){
        resultList.push(result.toString());
        result = 0;
      }
      //console.log(i, result);
    }
  }
  if(result != ""){
    console.log(result,"util, base36To10(base36), not all of the input is outputted cus its too short or u baaad at couting");
  }
  return resultList
}
function log(x, y) { //x = base, y = number, result = power
  return Math.log(y) / Math.log(x);
}

function randomRange(min, max){
    return Math.floor(Math.random()*(max-min+1))+min;
}
function seedRange(min, max, n){
  //console.log("n",n);
  let fraction = seed;
  fraction = base36To10(fraction);
  //console.log(fraction);
  n = (n % (fraction[0].length * 4));
  nList = Math.floor((n % 4) + 0.99999); //rounds up if its even slightly over pure integer.
  //because the denary integers are 0-9, my current method of using seed digits to randomly move around the list can't leavet he first list anyway: instead, ill keep it within the same nList as the original n (rather than update nList for each and making this less random)
  //console.log("n",n);
  //console.log(n, nList);
  let num1 = fraction[nList].charAt(n);
  let num2 = fraction[nList].charAt(parseInt(num1));
  let num3 = fraction[nList].charAt(parseInt(num2));
  //if(parseInt(fraction.charAt(n)) < 5){
  fraction = num1+num2+num3;
  //console.log(num1,num2,num3);
  //console.log("fraction #type1",fraction);
  //}
  //else{
  //  let chars3 = fraction.charAt(num1) + fraction.charAt(num2) + fraction.charAt(num3);
  //  let numOne = fraction.charAt(Math.round( (parseInt(chars3)/1000) *10) );
  //  chars3 = fraction.charAt(num2) + fraction.charAt(num1) + fraction.charAt(num3);
  //  let numTwo = fraction.charAt(Math.round((parseInt(chars3)/1000) *10));
  //  chars3 = fraction.charAt(num3) + fraction.charAt(num1) + fraction.charAt(num2);
  //  let numThree = fraction.charAt(Math.round((parseInt(chars3)/1000) *10));
  //  fraction = numOne+numTwo+numThree;
  //  console.log("fraction #type2",fraction,"1: " +num1,"2: "+num2,"3: "+num3);
  //}
  

  //console.log(fraction.charAt(n) + fraction.charAt(parseInt(fraction.charAt(n))) + fraction.charAt(parseInt(fraction.charAt(parseInt(fraction.charAt(n))))));

  //console.log("frac1",fraction);
  fraction = parseInt(fraction) / 999;
  //console.log(fraction);
  //console.log(Math.floor(fraction * (max-min+1)) + min);
  //console.log("frac2",fraction);
  //console.log(Math.floor(fraction * (max-min+1)) + min);
  return Math.floor(fraction * (max-min+1)) + min;
}



function tryTo(description, callback){
    for(let timeout=1000;timeout>0;timeout--){
        if(callback()){
          //console.log("yo" + "_" + timeout + "_" + description);
          return;
        }
    }
    throw 'Timeout while trying to '+description;
}

function shuffle(arr){
    let temp, r;
    for (let i = 1; i < arr.length; i++) {
        r = randomRange(0,i);
        temp = arr[i];
        arr[i] = arr[r];
        arr[r] = temp;
    }
    return arr;
}

function textOutput(text){
  var i = 0;
  //text1 = document.getElementById("channel"+i).innerHTML;
  text1 = textChannels[i].text;

  for(var i = 0;i<8;i++){
    //text2 = document.getElementById("channel"+(i+1)).innerHTML;
    text2 = textChannels[i+1].text;

    //document.getElementById("channel"+(i+1)).innerHTML = text1;
    textChannels[i+1].text = text1;

    text1 = text2;
  }
  //document.getElementById("channel"+1).innerHTML = text;
  textChannels[0].text = text;
}

function drawText(text, textX, textY){
    //ctx.fillStyle = colour;
    //ctx.font = size + "px monospace";
    
    //if(centered){
    //    textX = (canvas.width-ctx.measureText(text).width)/2;
    //}else{
    //    textX = canvas.width-uiWidth*tileSize+25;
    //}

    ctx.fillText(text, textX, textY);
}

class textChannel {
  constructor(text,colour,textX,textY){
    this.text = text;
    this.colour = colour;
    //this.font = arial;
    this.size = 15;
    this.textY = textY;
    this.textX = textX;
  }

  draw(){
    drawText(this.text, this.textX, this.textY);
  }
}