window.onload = createGame;
window.onkeydown = userInput;

//User defined Global values
var speed = 50;
var size = 30;

//Interal global values. Only need to exist once
var intervalId;
var key;
var snake;
var star; 
var lockInput;
var gameStart;
var score;

//create html table and snake object
function createGame(){
	var tr, td;
	var main = document.getElementsByClassName("main-game");
	var table = document.createElement("table");
	main = main[0];
	table.classList.add("game-board");

	//initialize, for game restarts
	main.innerHTML = null;
	intervalId = null;
	key = 40;
	snake = {body:[], len:5};
	star = {row: null, col: null};
	lockInput = 0;
	gameStart = 0;
	score = 0; 

	//add all the columns and rows to display board
	for(var i = 0; i < size; i++){
		tr = document.createElement("tr");
		for(var j = 0; j < size; j++){
			td = document.createElement("td");
			td.classList.add("no-snake");
			tr.appendChild(td);
		}
		table.appendChild(tr);
	}
	main.appendChild(table);

	for(var i = 0; i < snake.len; i++){
		snake.body.push({row:(Math.floor(size/2))-i-1, col:Math.floor(size/2)});
	}

	console.log(snake.body[0].row + " " + snake.body[0].col);

	//add initial star
	addStar();

	//set initial score
	updateScore();
}

function newGame(){
	createGame();
	var elem = document.getElementsByClassName("modal-backdrop");
	elem = elem[0];
	elem.classList.add("hidden");

}

function userInput(e){
	//update direction
	if(gameStart == 1 && e.keyCode >= 37 && e.keyCode <= 40){
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
		gameOver();
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

function gameOver(){
	var elem = document.getElementsByClassName("modal-backdrop");
	elem = elem[0];

	//clear any previous values
	elem.innerHTML = null;

	//create all the modal elements
	var div = document.createElement("div");
	var header = document.createElement("h2");
	var msg = document.createTextNode("Game Over");
	var btn = document.createElement("input");

	//set button values
	btn.setAttribute("type", "button");
	btn.value = "New Game";
	btn.onclick = function(){newGame();};

	//add classes
	header.classList.add("game-over-msg");
	div.classList.add("message");

	//add them all to the DOM
	header.appendChild(msg);
	div.appendChild(header);
	div.appendChild(btn);
	elem.appendChild(div);

	//reveal this modal now
	elem.classList.remove("hidden");
}

//TODO: Don't ever look at this mess again. I'm lazy
function settingsMenu(){
	var elem = document.getElementsByClassName("modal-backdrop");
	elem = elem[0];

	//clear any previous values
	elem.innerHTML = null;

	//create all the modal elements
	var div = document.createElement("div");
	var header = document.createElement("h2");
	var msg = document.createTextNode("Settings");
	var acceptBtn = document.createElement("input");
	var cancelBtn = document.createElement("input");
	var fields = document.createElement("table");
	var sizeRow = document.createElement("tr");
	var sizeVal = document.createElement("td");
	var sizeLabel = document.createElement("td");
	var sizeSlider = "<td><input type='range' name='rangeInput' min='15' max='30' onchange='updateSlider(\"size\", this.value);' value=0></td>";
	var speedRow = document.createElement("tr");
	var speedVal = document.createElement("td");
	var speedLabel = document.createElement("td");
	var speedSlider = "<td><input type='range' name='rangeInput' min='1' max='3' onchange='updateSlider(\"speed\", this.value);' value=0></td>";

	//set input values
	acceptBtn.setAttribute("type", "button");
	acceptBtn.value = "Apply";
	acceptBtn.onclick = function(){updateSettings();};

	cancelBtn.setAttribute("type", "button");
	cancelBtn.value = "Cancel";
	cancelBtn.onclick = function(){
		elem.classList.add("hidden");
	};

	sizeVal.innerHTML = 10;
	speedVal.innerHTML = 1;
	sizeLabel.innerHTML = "Size";
	speedLabel.innerHTML = "Speed";


	//add classes
	header.classList.add("game-over-msg");
	div.classList.add("message");
	sizeVal.setAttribute("id", "size");
	speedVal.setAttribute("id", "speed");
	fields.classList.add("settings-list");

	//add them all to the DOM
	header.appendChild(msg);
	div.appendChild(header);
	sizeRow.appendChild(sizeLabel);
	sizeRow.innerHTML += sizeSlider;
	sizeRow.appendChild(sizeVal);
	speedRow.appendChild(speedLabel);
	speedRow.innerHTML += speedSlider;
	speedRow.appendChild(speedVal);
	fields.appendChild(sizeRow);
	fields.appendChild(speedRow);
	div.appendChild(fields);
	div.appendChild(acceptBtn);
	div.appendChild(cancelBtn);
	elem.appendChild(div);

	//reveal this modal now
	elem.classList.remove("hidden");
}

function updateSlider(cls, val){
	document.getElementById(cls).innerHTML = val; 
}

function updateSettings(){
	//hide modal
	var elem = document.getElementsByClassName("modal-backdrop");
	elem = elem[0];
	elem.classList.add("hidden");

	//grab the fields
	var fields = document.getElementsByClassName("settings-list");
	fields = fields[0];

	//set new values 
	size = fields.childNodes[0].childNodes[1].childNodes[0].value;
	speed = fields.childNodes[1].childNodes[1].childNodes[0].value * 75;

	console.log(size + " " + speed);

	createGame();

}

function addStar(){
	//get random location
	do {
		var row = Math.floor(Math.random() * size);
		var col = Math.floor(Math.random() * size);
	} while (checkStarPos(row, col));

	star.row = row;
	star.col = col;

	// console.log("Row: " + row + ", Col: " + col);
	changeClass("star", row, col); 
}

function updateGame(){
	if(snake.body[0].row == star.row && snake.body[0].col == star.col){

		score++;
		//get the location of the tail to add the new part
		var prevTail = JSON.parse(JSON.stringify(snake.body[snake.len-1]));
		addStar();
		addSnakePart(prevTail);
		updateScore();
	}
}

function updateScore(){
	//get score element
	var elem = document.getElementsByClassName("score");
	elem = elem[0];

	elem.innerHTML = "Score: " + score;
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
	if(snake.body[0].row < 0 || snake.body[0].row >= size || snake.body[0].col < 0 || snake.body[0].col >= size){
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
