/*----- constants -----*/
const textStrings = [
  "Welcome, please select a theatre for battle.",
  "Ground zero for the conflict, if we win here, we will take hold of a vital control point.",
  "We'll drive those filthy curs from the southern valley and proclaim victory over the main trading route.",
  "Attacking their forces in the heart of the land, this will turn the tide of the war in our favor.",
  "Exile the enemy's main contingent from this central battlefield, and send them fleeing into the outer regions.",
  "This area has been claimed for us, we cannot rest on laurels and must seek othe areas to conquer.",
  "We failed on this day but we will not fail again. Though this battle is lost, we must fight on in other venues.",
  "You call this victory!? Because of your foolishness we must retreat and attempt the campaign again!",
  "We are victorious in routing our enemy from this sacred land, god shines down upon us on this glorious day!"
  ];

// 0 - not yet started, 1 awaiting area selection, 2 area selected, 3 battling
const gameState = null;


/*----- app's state (variables) -----*/

// 0 - not fought(default), 1 - won, 2 - lost
let areas = {
  'Portland':0,
  'Eugene':0,
  'Medford':0,
  'Bend':0
};

class Player {
  constructor(playerName) {
    this.name = playerName;
    this.cardStock = [4,4,4,4,4,
                      4,4,4,4,4,
                      4,4,4,4];
    
  }
}

/*----- cached element references -----*/
let currentArea = null;

/*----- event listeners -----*/

document.getElementById('battle').addEventListener('click', (evt) => {
  console.log("Starting Battle")
  mainGameLogic();
});

document.getElementById('Portland').addEventListener('click', (evt) => {
  currentArea = 1;
  handleClickArea(evt);
  //render (key value pair area:x
  render(1,evt,currentArea);
});

document.getElementById('Eugene').addEventListener('click', (evt) => {
  currentArea = 4;
  handleClickArea(evt);
  //render (key value pair area:x
  render(1,evt,currentArea);
});

document.getElementById('Medford').addEventListener('click', (evt) => {
  currentArea = 2;
  handleClickArea(evt);
  //render (key value pair area:x
  render(1,evt,currentArea);
});

document.getElementById('Bend').addEventListener('click', (evt) => {
  currentArea = 3;
  handleClickArea(evt);
  //render (key value pair area:x
  render(1,evt,currentArea);
});


/*----- functions -----*/
init();

//FIX SO NOT PLAGUEEEEE
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}


function getCard(player){
  let chosenCard = null;
  
  do {
    chosenCard = Math.floor(getRandomInt(0,15));
  } while (player.cardStock[chosenCard] != 1);
  
  return chosenCard;
};

function mainGameLogic() {

  let winner = null; // 1 - player, 2 - cpu

  //3 card war chest per player
  let player1war = [];
  let player2war = [];

  //second 'war' card if war initiated
  let p1wd = null;
  let p2wd = null;
  
  //Lets cardStock track face cards while keeping card 'value' at 10
  let p1realValue = null;
  let p2realValue = null;
    
  let card1 = getCard(you);
  let card2 = getCard(cpu);

  if (card1 > 9 && card1 < 14) {
    p1realValue = 10;
  } else {
    p1realValue = card1;
  }
  if (card2 > 9 && card2 < 14) {
    p2realValue = 10;
  } else {
    p2realValue = card2;
  }
  
  console.log(`${card1} is the player`)
  console.log(`${card2} is the cpu`)
  prompt("break!")
    
  if (p1realValue > p2realValue) winner = 1;
  if (p1realValue < p2realValue) winner = 2;
  if (p1realValue === p2realValue) {
    //WAR
    for(i = 0; i < 4; i++){
      player1war.push(getCard(you));
      player2war.push(getCard(cpu));
    } 

    //war can only happen once, so check then redraw card if values match (until they dont)
    do {
      p1wd = getCard(you);
      p2wd = getCard(cpu);

      if (p1wd > 9 && p1wd < 14) {
        p1realValue = 10;
      } else {
        p1realValue = p1wd;
      }
      if (p2wd > 9 && p2wd < 14) {
        p2realValue = 10;
      } else {
        p2realValue = p2wd;
      }

      if (p1realValue > p2realValue) {
        winner = 1; 
        for(i = 0; i < player2war.length; i++){
           you.cardStock[player2war[i]]++;
        }
      }
      if (p1realValue < p2realValue) winner = 2;
   
    } while (p1realValue != p2realValue);

    render(4,null,null);
    
  }
  /*
  if (winner === 1) {
    render
    //keyvalue pair: area 1
    // win player. remove area, add new text,set area
      render(3,keyvaluepair,null) 
  } else {
      //keyvalue pair: area 2
    // lose player
    render(4,keyvaluepair,null) 
  }
  */
};

function render(type,evt,areaNumber) {

  if (type === 1) {
    //mouse selection text
    if (areas[evt.target.id] == 0) {
      document.getElementById('mainText').innerText = textStrings[areaNumber];  
    } else if (areas[evt.target.id] == 1){
      document.getElementById('mainText').innerText = textStrings[8];
    } else if (areas[evt.target.id] == 2){
      document.getElementById('mainText').innerText = textStrings[9];
    }
    
  } else if (type === 2) {
    //part 1 of battle (use with type 4)
    document.getElementById('mainText').innerHTML = `${faceCardReplace(card1)} &nbsp;&nbsp;&nbsp;&nbsp;`; //card1    
    document.getElementById('mainText').innerHTML = `${faceCardReplace(card2)} <br>`;  //card2

  } else if (type === 3) {
    //war cards & win
    //when using this, skip using type 4, redundant code due to complexity of faceCardReplace usage in playerXwar array
    for(i = 0; i < player1war.length; i++){
    	player1war[i] = faceCardReplace(player1war[i]);
    }
    for(i = 0; i < player2war.length; i++){
    	player2war[i] = faceCardReplace(player2war[i]);
    }
    
    document.getElementById('mainText').innerHTML = `${player1war} &nbsp;&nbsp;&nbsp;&nbsp;`; 
    document.getElementById('mainText').innerHTML = `${player2war} <br>`;  
    
      
    document.getElementById('mainText').innerHTML = `<br><br>VICTORY!`;  

    document.getElementById('mainText').innerHTML = `<br><br>DEFEAT!`;    
  
  } else if (type === 4) {
    //win ONLY (combine with type 2)
    document.getElementById('mainText').innerHTML = `<br><br>VICTORY!`;  

    document.getElementById('mainText').innerHTML = `<br><br>DEFEAT!`;    
  }
};

//Type conversion here number to char
function faceCardReplace(card) {
  if (card = 11) { card = 'J'; break;
  } else if (card = 12) { card = 'Q'; break;
  } else if (card = 13) { card = 'K'; break;
  } else if (card = 14) { card = 'A'; break;
  }
}

function resetGame(){
  for (var iii in areas){
    if (areas.hasOwnProperty(iii)) {
      areas[iii] = 0;
    }
  }
  you = null;
  cpu = null;
  init();
};

function handleClickArea(evt) {
  let currentArea = evt.target.id; 
  let allAreas = document.getElementsByClassName("area");
  
  for(i = 0; i < allAreas.length; i++){
  	allAreas[i].style.border = "none"
  }
  
  //console.log(evt.target);
  //console.log(evt.target.id);
  evt.target.style.border="2px solid red";
  evt.target.style.borderRadius="50%";
  
  if (areas[evt.target.id] == 0) {
    document.getElementById('battle').disabled = false;
  } else if (areas[evt.target.id] == 1){
    document.getElementById('battle').disabled = true;
  } else if (areas[evt.target.id] == 2){
    document.getElementById('battle').disabled = true;
  }
  
}

function init(){
  you = new Player("person");
  cpu = new Player("cpu");
  
  document.getElementById('mainText').innerHTML = `${textStrings[0]} <br><br>Portland<br>Eugene<br>Medford<br>Bend`;
  
  document.getElementById('battle').disabled = true;
  console.log("init finished");
  
};
