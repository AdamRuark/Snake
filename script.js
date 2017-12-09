window.onload = createBoard;
window.onkeydown = userInput;


function createBoard(){
	var tr, td;
	var main = document.getElementsByTagName("main");
	var table = document.createElement("table");
	main = main[0];

	//add all the columns and rows
	for(var i = 0; i < 30; i++){
		tr = document.createElement("tr");
		for(var j = 0; j < 30; j++){
			td = document.createElement("td");
			tr.appendChild(td);

		}
		table.appendChild(tr);
	}
	main.appendChild(table);
}


//global values. Only need to exist once
var intervalId = null;
var key = null;
var pos = {row: 15, col:15};

function userInput(e){

	changeKey(e.keyCode);

	//call gameLoop once here to initialize it. Start in center
	if (intervalId == null) {
    	gameLoop(pos);
    }
}

function changeKey(inputKey){

	//modulo math to determine if current key is opposite of input key
	var temp = (inputKey - 35)%4 + 37;

	//if not, change the current key
	if(temp != key){
		key = inputKey;
	}
}

//main game loop. Runs from game start.
function gameLoop(pos){
	if(checkCollision(pos)){
		console.log("GAME OVER");
		clearInterval(intervalId);
	}
	else{
		//change the color
		changeColor("green", pos);

		//change current position
		move(pos);

		//set it on loop indefinitely
		if(intervalId){
			clearInterval(intervalId);
		}
		intervalId = setInterval(function(){gameLoop(pos);}, 100);
	}
}

//increment or decrement current position based on direction
function move(pos){
	switch(key){
		//left
		case 37:
			pos.col--;
			break;
		//up
		case 38:
			pos.row--;
			break;
		//right
		case 39:
			pos.col++;
			break;
		//down
		case 40:
			pos.row++;
			break;
	}
}

function checkCollision(pos){

	//check if out of bounds
	if(pos.row < 0 || pos.row >= 30 || pos.col < 0 || pos.col >= 30){
		return true;
	}
	
	//TODO: check for collision with itself

	//otherwise, end the game
	return false;
}

function changeColor(color, pos){
	var tr = document.getElementsByTagName("tr");
	tr[pos.row].childNodes[pos.col].style.backgroundColor = color;
}
