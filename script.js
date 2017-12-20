window.onload = createGame;
window.onkeydown = userInput;

//User defined Global values
var speed = 50;
var size = 30;

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
	var main = document.getElementsByClassName("main-game");
	var table = document.createElement("table");
	main = main[0];

	//initialize to null, for game restarts
	main.innerHTML = null;

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

	//add initial star
	addStar();

	//set initial score
	updateScore();
}

function newGame(){
	location.reload();
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
	var fields = document.createElement("div");
	var sizeVal = document.createElement("input");
	var sizeSlider = "<input type='range' name='rangeInput' min='10' max='30' onchange='updateSlider(\"size\", this.value);' value=0>";

	//set input values
	acceptBtn.setAttribute("type", "button");
	acceptBtn.value = "Apply";
	acceptBtn.onclick = function(){updateSettings();};

	cancelBtn.setAttribute("type", "button");
	cancelBtn.value = "Cancel";
	cancelBtn.onclick = function(){
		elem.classList.add("hidden");
	};

	sizeVal.innerHTML = 0;


	//add classes
	header.classList.add("game-over-msg");
	div.classList.add("message");
	sizeVal.setAttribute("id", "size");

	//add them all to the DOM
	header.appendChild(msg);
	div.appendChild(header);
	fields.innerHTML += sizeSlider;
	fields.appendChild(sizeVal);
	div.appendChild(fields);
	div.appendChild(acceptBtn);
	div.appendChild(cancelBtn);
	elem.appendChild(div);

	//reveal this modal now
	elem.classList.remove("hidden");
}

function updateSlider(cls, val){
	document.getElementById(cls).value = val; 
}

function updateSettings(){
	var elem = document.getElementsByClassName("modal-backdrop");
	elem = elem[0];
	

	elem.classList.add("hidden");
}

function addStar(){
	//get random location
	do {
		var row = Math.floor(Math.random() * size);
		var col = Math.floor(Math.random() * size);
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
