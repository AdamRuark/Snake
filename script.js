window.onload = createBoard;
window.onkeydown = userInput;

//global values. Only need to exist once
var intervalId = null;
var key = null;
var snake = {row: 15, col:15, len:6};
var psuedoTable = [];


//create html table and pseduotable for snake tracking
function createBoard(){
	var tr, td;
	var main = document.getElementsByTagName("main");
	var table = document.createElement("table");
	main = main[0];

	//add all the columns and rows
	for(var i = 0; i < 30; i++){
		tr = document.createElement("tr");
		psuedoTable[i] = [];
		for(var j = 0; j < 30; j++){
			td = document.createElement("td");
			td.classList.add("no-snake");
			tr.appendChild(td);
			psuedoTable[i][j] = 0;
		}
		table.appendChild(tr);
	}
	main.appendChild(table);
}

function userInput(e){

	changeKey(e.keyCode);

	//call gameLoop once here to initialize it. Start in center
	if (intervalId == null) {
    	gameLoop(snake);
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
function gameLoop(snake){
	//if snake runs into something, end game
	if(checkCollision(snake)){
		console.log("GAME OVER");
		clearInterval(intervalId);
	}
	else{
		//change the color
		changeClass("snake", snake);

		//change current position
		move(snake);

		//set it on loop indefinitely
		if(intervalId){
			clearInterval(intervalId);
		}
		intervalId = setInterval(function(){gameLoop(snake);}, 100);
	}
}

//increment or decrement current position based on direction
function move(snake){
	switch(key){
		//left
		case 37:
			snake.col--;
			break;
		//up
		case 38:
			snake.row--;
			break;
		//right
		case 39:
			snake.col++;
			break;
		//down
		case 40:
			snake.row++;
			break;
	}
}

function checkCollision(snake){

	//check if out of bounds
	if(snake.row < 0 || snake.row >= 30 || snake.col < 0 || snake.col >= 30){
		return true;
	}
	
	//check for collision with itself
	var curNode = document.getElementsByTagName("tr")[snake.row].childNodes[snake.col];
	if(curNode.classList.contains("snake")){
		return true;
	}

	//otherwise, end the game
	return false;
}

function changeClass(newClass, snake){
	var tr = document.getElementsByTagName("tr");
	tr[snake.row].childNodes[snake.col].classList.add(newClass);
}
