window.onload = createGame;
window.onkeydown = userInput;

//User defined Global values
var speed = 50;

//Interal global values. Only need to exist once
var intervalId = null;
var key = 40;
var snake = {body:[], len:6};
var star = {row: null, col: null};
var lockInput = 0;
var gameStart = 0;
var score = 0;

//create html table and snake object
function createGame(){
	var tr, td;
	var main = document.getElementsByTagName("main");
	var table = document.createElement("table");
	main = main[0];

	//add all the columns and rows to display board
	for(var i = 0; i < 30; i++){
		tr = document.createElement("tr");
		for(var j = 0; j < 30; j++){
			td = document.createElement("td");
			td.classList.add("no-snake");
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	main.appendChild(table);

	for(var i = 0; i < snake.len; i++){
		snake.body.push({row:15-i, col:15});
	}

	//add initial star
	addStar();
}

function userInput(e){
	//update direction
	if(gameStart == 1){
		changeKey(e.keyCode);
	}

	// call gameLoop once here to initialize it. Start in center
	if (intervalId == null && e.keyCode == 32) {
		gameStart = 1;
    	gameLoop();
    }
}

function changeKey(inputKey){
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

	//store previous head location in case of move
	var prevHead = JSON.parse(JSON.stringify(snake.body[0]));

	//move head, this always occurs
	move();

	//if snake runs into edge or itself, end game
	if(checkCollision()){
		console.log("GAME OVER");
		clearInterval(intervalId);
	}
	else{

		//update score, snake length, and star location if needed
		updateGame();

		//update snake part locations
		updateSnakeLocation(prevHead);

		//set game on loop indefinitely
		if(intervalId){
			clearInterval(intervalId);
		}
		intervalId = setInterval(gameLoop, speed);
	}
}

function addStar(){
	//get random location
	do {
		var row = Math.floor(Math.random() * 30);
		var col = Math.floor(Math.random() * 30);
	} while (checkStarPos(row, col));

	star.row = row;
	star.col = col;
	changeClass("star", row, col); 
}

function updateGame(){
	if(snake.body[0].row == star.row && snake.body[0].col == star.col){

		score++;
		//get the location of the tail to add the new part
		var prevTail = JSON.parse(JSON.stringify(snake.body[snake.len-1]));
		addStar();
		addSnakePart(prevTail);
	}
}

//add new body part at end of snake body
function addSnakePart(prevTail){
	snake.len++;
	snake.body.push(prevTail);
}

function checkStarPos(row, col){
	for(var i = 0; i < snake.len; i++){
		if(snake.body[i].row == row || snake.body[i].col == col){
			return true;
		}
	}
	return false;
}

function updateSnakeLocation(prevHead){
	//remove tail
	var row = snake.body[snake.len-1].row;
	var col = snake.body[snake.len-1].col;
	changeClass("no-snake", row, col);

	//update current head
	row = snake.body[0].row;
	col = snake.body[0].col;
	changeClass("snake", row, col);

	//cycle body part coordinates
	var prev = prevHead;
	var next;
	for(var i = 1; i < snake.len; i++){
		//store previous value to replace next in body
		next = snake.body[i];
		snake.body[i] = prev;
		prev = next;
	}
}

//increment or decrement current position based on direction
function move(){
	switch(key){
		//left
		case 37:
			snake.body[0].col--;
			break;
		//up
		case 38:
			snake.body[0].row--;
			break;
		//right
		case 39:
			snake.body[0].col++;
			break;
		//down
		case 40:
			snake.body[0].row++;
			break;
	}
}

function checkCollision(){
	//check if out of bounds
	if(snake.body[0].row < 0 || snake.body[0].row >= 30 || snake.body[0].col < 0 || snake.body[0].col >= 30){
		return true;
	}
	
	//check for collision with itself
	var curNode = document.getElementsByTagName("tr")[snake.body[0].row].childNodes[snake.body[0].col];
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
