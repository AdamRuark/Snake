window.onload = createBoard;
window.onkeydown = userInput;

//global values. Only need to exist once
var intervalId = null;
var key = null;
var psuedoTable = [];
var snake = {row: 15, col:15, len:6};
var lockInput = 0;

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
			psuedoTable[i][j] = -1;
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

	if(lockInput){
		console.log("LOCKED");
	}
	//modulo math to determine if current key is opposite of input key
	var temp = (inputKey - 35)%4 + 37;

	//if not opposite direction and input unlocked, change the current key
	if(temp != key && lockInput == 0){
		key = inputKey;

		//lock so it can't be changed until the next cycle
		lockInput = 1;
	}



	
}

//main game loop. Runs from game start.
function gameLoop(){
	//unlock input
	lockInput = 0;

	//move snake, this always occurs
	move();

	//if snake runs into something, end game
	if(checkCollision()){
		console.log("GAME OVER");
		clearInterval(intervalId);
	}
	else{
		//change the color
		changeClass("snake", snake.row, snake.col);

		//update display to reflect move
		updateTable();

		//set it on loop indefinitely
		if(intervalId){
			clearInterval(intervalId);
		}
		intervalId = setInterval(gameLoop, 50);
	}
}

function updateTable(){
	//decrement the rest of the body
	for(var i = 0; i < 30; i++){
		for(var j = 0; j < 30; j++){
			if(psuedoTable[i][j] > 0){
				psuedoTable[i][j]--;
			}
			else if(psuedoTable[i][j] == 0){
				changeClass("no-snake", i, j);
				psuedoTable[i][j]--;
			}
		}
	}
	//set head to max value
	psuedoTable[snake.row][snake.col] = snake.len;
}

//increment or decrement current position based on direction
function move(){
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

function checkCollision(){

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

function changeClass(newClass, row, col){
	var tr = document.getElementsByTagName("tr");
	tr[row].childNodes[col].classList = newClass;
}
