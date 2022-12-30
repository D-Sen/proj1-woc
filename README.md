War Over Cascadia
by: Domonic Senesi
for SEI1212

A html-5/Javascript based game playable in a browser, that takes the standard ‘War’ card game and adds some special elements to it.

Sections

    • User Stories
    • PsuedoCode
    • Wireframe


User Stories
As a creator I want to implement the ‘War’ card game into a click-driven browser game because this is the project requirements
As a creator I want to base the game around a real-life setting because this will add an enticing new element to the gameplay.
As a user I want the game to be simple to understand and play because learning-curves can be off-putting.


PsuedoCode

//declare global const’s 
	//player/computer object – name, parallel array card #
	// Text strings – informative and reactive 

//init() - declare/set true non-const ‘let’ variables
	//wonAreas array
	//gamestate 

//reset game() - some specific reset items, calls init() as needed

//render() - show and change visual elements
	//show text
	//display buttons 

//handle click on map area
	//call render & set ‘start war’ button to active
	//call render to show text if area not available

//handle click on button to start round of ‘war’
	//call mainGameLogic

//get card : parameters(player obj, numberModifier*) – pulls a random card – return: pulledCard
	//checks number/type of cards available
	//produces card based on arithmetic



//mainGameLogic() - nuts and bolts/arithmetic of the core ‘War’ game.  
	//call get card for player
	//call get card for CPU
	//change state
	//prep/send info to render

