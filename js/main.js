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

cardFaces = [null,null,"2_of_","3_of_","4_of_","5_of_","6_of_",
                  "7_of_","8_of_","9_of_","10_of_",
                  "jack_of_","queen_of_","king_of_","ace_of_"];

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

  let player1CardFace = "spades";
  let player2CardFace = "hearts";
  


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
  render(1,evt,1);
  render(5,evt,1);
});

document.getElementById('Eugene').addEventListener('click', (evt) => {
  currentArea = "Eugene";
  render(1,evt,2);
  render(5,evt,1);
});

document.getElementById('Medford').addEventListener('click', (evt) => {
  currentArea = "Medford";
  render(1,evt,3);
  render(5,evt,1);
});

document.getElementById('Bend').addEventListener('click', (evt) => {
  currentArea = "Bend";
  render(1,evt,4);
  render(5,evt,1);
});


/*----- functions -----*/
init();

function getRandInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); // The maximum is exclusive and the minimum is inclusive
}

function getCard(Player){
  let chosenCard = null;
  do {
    chosenCard = Math.floor(getRandInt(2,15));
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

  let tempCardFace = null;


  tempCardFace = getRandInt(0,4);
  if (tempCardFace === 0) { player1CardFace = "spades";
  } else if (tempCardFace === 0) { player1CardFace = "hearts";
  } else if (tempCardFace === 0) { player1CardFace = "diamonds";
  } else { player1CardFace = "clubs";
  }
  tempCardFace = getRandInt(0,4);
  if (tempCardFace === 0) { player2CardFace = "spades";
  } else if (tempCardFace === 0) { player2CardFace = "hearts";
  } else if (tempCardFace === 0) { player2CardFace = "diamonds";
  } else { player2CardFace = "clubs";
  }

  card1 = getCard(you);
  card2 = getCard(cpu);  
 
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
      
  if (p1realValue === p2realValue) {
    //WAR
    for(i = 0; i < 3; i++){
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
    } while (p1realValue === p2realValue);
      //you win

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
    document.getElementById('cardAreaWar').innerText = "";
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
    //part 1 of battle

	document.getElementById('cardArea').innerHTML = `<img src="./images/PNG-cards-1.3/${cardFaces[card1] + player1CardFace + ".png"}" width="100px" height="100px"> &nbsp;&nbsp;&nbsp;&nbsp; <img src="./images/PNG-cards-1.3/${cardFaces[card2] + player2CardFace + ".png"}" width="100px" height="100px">`;
	document.getElementById('battle').disabled = true;
	
  } else if (type === 3) {
    //part 1 of battle when "war" occurs
    for(i = 0; i < 3; i++){
	  player1war[i] = faceCardReplace(player1war[i]);
      player2war[i] = faceCardReplace(player2war[i]);
    }
    document.getElementById('cardAreaWar').innerHTML = `War!<br>${player1war} &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;&nbsp;${player2war}<br>`;
	document.getElementById('cardArea').innerHTML = `<img src="./images/PNG-cards-1.3/${cardFaces[p1wd] + player1CardFace + ".png"}" width="100px" height="100px"> &nbsp;&nbsp;&nbsp;&nbsp; <img src="./images/PNG-cards-1.3/${cardFaces[p2wd] + player2CardFace + ".png"}" width="100px" height="100px"><br>`;
    
  
  } else if (type === 4) {
    //part 2 of battle
    if (winner === 1) {
      document.getElementById('resultArea').innerHTML = `VICTORY!`;  

    } else if (winner === 2) {  
      document.getElementById('resultArea').innerHTML = `DEFEAT!`;    
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
    document.getElementById('cardAreaWar').innerText = "";
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

function init(){
  you = new Player("person");
  cpu = new Player("cpu");
  
  document.getElementById('mainText').innerHTML = `${textStrings[0]} <br><br>Portland<br>Eugene<br>Medford<br>Bend`;
  document.getElementById('battle').disabled = true;
    
};
