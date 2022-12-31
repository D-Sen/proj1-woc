/*----- constants -----*/
const textStrings = [
  "Welcome, please select a theatre for battle.",
  "Ground zero for the conflict, if we win here, we will take hold of a vital control point.",  
  "Attacking their forces in the heart of the land, this will turn the tide of the war in our favor.",
  "We'll drive those filthy curs from the southern valley and proclaim victory over the main trading route.",
  "Exile the enemy's main contingent from this central battlefield, and send them fleeing into the outer regions.",
  "We were victorious in routing our enemy from this sacred land, god shines down upon us on this glorious day!",
  "We failed on this day but we will not fail again. Though this battle is lost, we must continue to fight."  
  ];


/*----- app's state (variables) -----*/
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
    
  let card1 = null;
  let card2 = null;


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
    this.cardStock = [null,null,4,4,4,4,4,
                      4,4,4,4,
                      4,4,4,4];
  }
}

// 0 - not yet started, 1 awaiting area selection, 2 area selected, 3 battling
const gameState = null;

/*----- cached element references -----*/
let currentArea = null;

/*----- event listeners -----*/

document.getElementById('battle').addEventListener('click', (evt) => {
  mainGameLogic();
});

document.getElementById('reset').addEventListener('click', (evt) => {
  resetGame();
});

document.getElementById('Portland').addEventListener('click', (evt) => {
  currentArea = "Portland";
  //handleClickArea(evt);
  render(1,evt,1);
  render(5,evt,1);
});

document.getElementById('Eugene').addEventListener('click', (evt) => {
  currentArea = "Eugene";
  //handleClickArea(evt);
  render(1,evt,2);
  render(5,evt,1);
});

document.getElementById('Medford').addEventListener('click', (evt) => {
  currentArea = "Medford";
  //handleClickArea(evt);
  render(1,evt,3);
  render(5,evt,1);
});

document.getElementById('Bend').addEventListener('click', (evt) => {
  currentArea = "Bend";
  //handleClickArea(evt);
  render(1,evt,4);
  render(5,evt,1);
});


/*----- functions -----*/
init();

//FIX SO NOT PLAGUEEEEE
function getRandInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function getCard(Player){
  let chosenCard = null;
  do {
    chosenCard = Math.floor(getRandInt(2,16));
  } while (Player.cardStock[chosenCard] === 0);
  return chosenCard;
};

function mainGameLogic() {

  winner = 0;
  player1war = [];
  player2war = [];
  p1wd = null;
  p2wd = null;
  p1realValue = null;
  p2realValue = null;
    
  card1 = getCard(you);
  card2 = getCard(cpu);
  console.log(`${card1} is the player`)
  console.log(`${card2} is the cpu`)
 
  if (card1 > 9 && card1 < 16) {
    p1realValue = 10;
  } else {
    p1realValue = card1;
  }
  if (card2 > 9 && card2 < 16) {
    p2realValue = 10;
  } else {
    p2realValue = card2;
  }
  
  console.log(`${p1realValue} RV player`)
  console.log(`${p2realValue} RVcpu`)
    
  if (p1realValue === p2realValue) {
    //WAR
    for(i = 0; i < 3; i++){
      player1war.push(getCard(you));
      player2war.push(getCard(cpu));
    } 
    console.log(`${player1war} player 1 war`)
    //war can only happen once, so check then redraw card if values match (until they dont)
    do {
      p1wd = getCard(you);
      p2wd = getCard(cpu);

      if (p1wd > 9 && p1wd < 16) {
        p1realValue = 10;
      } else {
        p1realValue = p1wd;
      }
      if (p2wd > 9 && p2wd < 16) {
        p2realValue = 10;
      } else {
        p2realValue = p2wd;
      }
    } while (p1realValue === p2realValue);
      //you win
      console.log(`${you.cardStock[player2war[0]]} <- number`);
      console.log(player2war);
      //console.log(you.cardStock[player2war[2]]);
      //console.log(player2war.length);
    

      if (p1realValue > p2realValue) {
        winner = 1; 
        for(i = 0; i < 3; i++){
           you.cardStock[player2war[i]]++;
        }
        you.cardStock[p2wd]++;
      }
      if (p1realValue < p2realValue) {
        winner = 2;
        for(i = 0; i < 3; i++){
           you.cardStock[player1war[i]]--;
        }
        you.cardStock[p1wd]--;
      }
    render(3,null,null);
    
  } else {
    if (p1realValue > p2realValue) winner = 1;
    if (p1realValue < p2realValue) winner = 2;

    render(2,null,null);
  }      
  if (winner > 0) {
    if (winner === 1) {
      render(4,null,null); 
      areas[currentArea] = 1;
      ++you.cardStock[card2];
      
    } else if (winner === 2) {
      render(4,null,null) ;
      areas[currentArea] = 2;
      --you.cardStock[card1];
      
    }        
    
  }  
};

function render(type,evt,areaNumber) {

  if (type === 1) {
    //mouse selection text
    document.getElementById('cardArea').innerText = "";
    document.getElementById('resultArea').innerText = "";
    if (areas[evt.target.id] === 0) {
      document.getElementById('mainText').innerText = textStrings[areaNumber];  
    } else if (areas[evt.target.id] === 1){
      document.getElementById('mainText').innerText = textStrings[5];
    } else if (areas[evt.target.id] === 2){
      document.getElementById('mainText').innerText = textStrings[6];
    }
    
  } else if (type === 2) {
    //part 1 of battle (use with type 4)
    document.getElementById('cardArea').innerHTML = `${faceCardReplace(card1)} &nbsp;&nbsp;&nbsp;&nbsp; ${faceCardReplace(card2)} <br>`;
document.getElementById('battle').disabled = true;
  } else if (type === 3) {
    //war cards & win
    //when using this, skip using type 4, redundant code due to complexity of faceCardReplace usage in playerXwar array
    for(i = 0; i < 3; i++){
    	player1war[i] = faceCardReplace(player1war[i]);
      player2war[i] = faceCardReplace(player2war[i]);
    }

    document.getElementById('cardArea').innerHTML = `${player1war} &nbsp;&nbsp;&nbsp;&nbsp; ${player2war} <br> ${faceCardReplace(p1wd)} &nbsp;&nbsp;&nbsp;&nbsp; ${faceCardReplace(p2wd)} <br>`;
      
  
  } else if (type === 4) {
    //win ONLY (combine with type 2)
    if (winner === 1) {
      document.getElementById('resultArea').innerHTML = `<br>VICTORY!`;  

    } else if (winner === 2) {  
      document.getElementById('resultArea').innerHTML = `<br>DEFEAT!`;    
    }
  } else if (type === 5) {
    //handle clicking on area
    let allAreas = document.getElementsByClassName("area");
    for(i = 0; i < allAreas.length; i++){
    	allAreas[i].style.border = "none"
    }
    evt.target.style.border="2px solid red";
    evt.target.style.borderRadius="50%";
    if (areas[evt.target.id] == 0) {
      document.getElementById('battle').disabled = false;
    } else if (areas[evt.target.id] == 1){
      document.getElementById('battle').disabled = true;
    } else if (areas[evt.target.id] == 2){
      document.getElementById('battle').disabled = true;
    }
      
  } else if ( type === 6) {
    //reset visual elements
    let allAreas = document.getElementsByClassName("area");
    for(i = 0; i < allAreas.length; i++){
    	allAreas[i].style.border = "none"
    }
    document.getElementById('battle').disabled = true;
    document.getElementById('cardArea').innerText = "";
    document.getElementById('resultArea').innerText = "";
    
  }
};

//Type conversion here number to char
function faceCardReplace(card) {
  if (card === 11) { card = 'J'; 
  } else if (card === 12) { card = 'Q';
  } else if (card === 13) { card = 'K';
  } else if (card === 14) { card = 'A';
  }
  return card;
}

function resetGame(){
  for (var iii in areas){
    if (areas.hasOwnProperty(iii)) {
      areas[iii] = 0;
    }
  }
  you = null;
  cpu = null;
  render(6,null,null);
  init();
};
/*
function handleClickArea(evt) {
  let currentArea = evt.target.id; 
  let allAreas = document.getElementsByClassName("area");

  //render(5,currentArea,null)
  for(i = 0; i < allAreas.length; i++){
  	allAreas[i].style.border = "none"
  }
  
  console.log(evt.target);
  //console.log(evt.target.id);
  evt.target.style.border="2px solid red";
  evt.target.style.borderRadius="50%";
  //evt.target.id
  if (areas[evt.target.id] == 0) {
    document.getElementById('battle').disabled = false;
  } else if (areas[evt.target.id] == 1){
    document.getElementById('battle').disabled = true;
  } else if (areas[evt.target.id] == 2){
    document.getElementById('battle').disabled = true;
  }
  
}
*/
function init(){
  you = new Player("person");
  cpu = new Player("cpu");
  
  document.getElementById('mainText').innerHTML = `${textStrings[0]} <br><br>Portland<br>Eugene<br>Medford<br>Bend`;
  
  document.getElementById('battle').disabled = true;
  console.log("init finished");
  
};
