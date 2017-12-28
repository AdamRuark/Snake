window.onload = function(){startGame(20, 200)};
window.addEventListener('keydown', function(e){
	gameArea.key = e.keyCode;
	inputHandler(snake);

});

function startGame(cellCount, speed) {
	gameArea.width = 700;
	var cellWidth = gameArea.width/cellCount;

	gameArea.create(speed);
	board = new Board(gameArea.width, cellCount, cellWidth);
	snake = new Snake(cellWidth*Math.floor(cellCount/2), 0, cellWidth);
	star = new Star(cellWidth, cellCount);
}

function addScore(){
	var score = gameArea.score;
	var username = document.getElementById("username").value;
	var xhttp = new XMLHttpRequest();
	
	xhttp.open("GET", "addScore/" + score + "/" + username, true);
	xhttp.send();
}

function updateGameArea() {
	//update the snake status
	snake.move();
	if(snake.checkCollision()){
		gameArea.end();
		return;
	}
	if(snake.onStar()){
		snake.pushBodyPart();
		gameArea.updateScore();
		star.move();
	}

	//redraw the game
	gameArea.clear();
	board.draw();
	star.draw();
	snake.draw();
	gameArea.locked = false;
}

var gameArea = {
	canvas : document.createElement("canvas"),
	scoreDOM : document.getElementsByClassName("score"),
	rate : 100,
	running : false, 
	width : 700,
	create : function(rate) {
		//TODO: Get start input from the user and define game state from that

		this.canvas.width = this.width+1;
		this.canvas.height = this.width+1;
		this.context = this.canvas.getContext("2d");
		this.context.globalAlpha = 1;
		this.context.translate(0.5, 0.5);
		this.context.imageSmoothingQuality = "high";
		this.ignoreMove = false;
		this.locked = true;
		this.running = false;
		this.score = 0;
		this.rate = rate;

		this.scoreDOM[0].innerHTML = "Score: " + this.score;
		this.scoreDOM[1].innerHTML = "Score: " + this.score;

		//add to main window
		var main = document.getElementsByClassName("main-game")[0];
		main.insertBefore(this.canvas, main.childNodes[0]);

		
	},
	start : function(){
		this.interval = setInterval(updateGameArea, this.rate);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	end : function(){
		modal.gameOver();
		clearInterval(this.interval);
		this.running = false;
		this.locked = true;
	},
	updateScore : function(){
		this.score++;
		this.scoreDOM[0].innerHTML = "Score: " + this.score;
		this.scoreDOM[1].innerHTML = "Score: " + this.score;
	}
}
 
var modal = {
	backdrop : document.getElementsByClassName("modal-backdrop")[0],
	endContents : document.getElementById("game-over"),
	settings : document.getElementById("settings"),
	sizeVal : document.getElementById("sizeVal"),
	sizeSlider : document.getElementById("size"),
	speedVal : document.getElementById("speedVal"),
	speedSlider: document.getElementById("speed"),


	gameOver : function(){
		this.backdrop.classList.remove("hidden");
		this.endContents.classList.remove("hidden");
	},
	newGame : function(){
		this.backdrop.classList.add("hidden");
		this.endContents.classList.add("hidden");
		var speed = 400 - (this.speedSlider.value*100);
		addScore();
		startGame(this.sizeSlider.value, speed);
		this.openSettings();
	},
	openSettings : function(){
		this.backdrop.classList.remove("hidden");
		this.settings.classList.remove("hidden");
		gameArea.locked = true;
	},
	closeSettings : function(save){
		if(save){
			var speed = 400 - (this.speedSlider.value*100);
			startGame(this.sizeSlider.value, speed);
		}
		this.backdrop.classList.add("hidden");
		this.settings.classList.add("hidden");
		gameArea.locked = false;
	},
	updateSlider: function(num){
		var types = ["Slow", "Medium", "Fast"];
		if(!num){
			var val = this.sizeSlider.value;
			this.sizeVal.innerHTML = val + " x " + val;
		}
		else {
			this.speedVal.innerHTML = types[this.speedSlider.value-1];
		}
	}
}

function inputHandler() {
	//if the user presses space and game is running, pause or play the game depending on current state
	if(gameArea.key == 32 && gameArea.running){
		if(gameArea.interval){
			clearInterval(gameArea.interval);
			gameArea.interval = null;
			gameArea.ignoreMove = true;
		}
		else {
			gameArea.interval = setInterval(updateGameArea, gameArea.rate);
			gameArea.ignoreMove = false;
		}
	}

	//if game input locked, don't parse movement or game start commands
	else if(gameArea.locked){
		return;
	}

	//handle snake direction
	else if(validMoveKey() && gameArea.running){
		snake.changeDirection();
		gameArea.locked = true;
	}

	//start the game if the user presses enter
	else if(gameArea.key == 13 && !gameArea.running){
		gameArea.running = true;
		gameArea.start();
	}
}

function validMoveKey(){
	switch(gameArea.key){
		//arrow keys, don't do anything
		case 37:
		case 38:
		case 39:
		case 40:
			break;

		//WASD keys, convert to arrow key codes			
		case 65:
			gameArea.key = 37;
			break;
		case 87:
			gameArea.key = 38;
			break;
		case 68:
			gameArea.key = 39;
			break;
		case 83:
			gameArea.key = 40;
			break;
		default:
			return false;
	}
	return true;
}

function Board(size, num, width){
	this.size = size;
	this.num = num;
	this.width = width;

	this.draw = function(){
		ctx = gameArea.context;
		for (var i = 0; i <= this.size; i += this.width) {
			ctx.moveTo(i, 0);
			ctx.lineTo(i, this.size);

			ctx.moveTo(0, i);
			ctx.lineTo(this.size, i);
		}
		ctx.strokeStyle = "#b8b8b8";
		ctx.lineWidth = 1;
		ctx.stroke();
	}
	this.draw();
}

function Snake(x, y, size) {
	this.size = size;
	this.x = x;
	this.y = y;
	this.body = [];
	this.direction = 40; /*temporary?*/

	this.initBody = function(){
		for(var i = 0; i < 6; ++i){
			this.body.push(new Body(this.x, this.y - (i*this.size), this.size));
		}
		
	}
	this.initBody();

	this.draw = function(){
		var newLocation = Object.assign({}, this);
		var oldLocation;

		for(var i = 0; i < this.body.length; ++i){
			oldLocation = Object.assign({}, this.body[i]);
			this.body[i].draw(newLocation.x, newLocation.y);
			newLocation = Object.assign({}, oldLocation);
		}

		this.body[0].smile((this.direction-37)*90);
	};

	this.move = function(){
		switch(this.direction){
			case 37: this.x -= this.size; break;
			case 38: this.y -= this.size; break;
			case 39: this.x += this.size; break;
			case 40: this.y += this.size; break;
		}
	};

	this.isValidMove = function(){
		var temp = (gameArea.key - 35)%4 + 37;
		return temp != this.direction && gameArea.ignoreMove == false;
	};

	this.changeDirection = function(){
		//if the new direction isn't the opposite direction, change it.
		if(this.isValidMove()) {
			this.direction = gameArea.key;
		}
	};

	this.checkCollision = function(){
		//collision with itself
		for(var i = 1; i < this.body.length; ++i){
			if(this.x == this.body[i].x && this.y == this.body[i].y){
				return true;
			}
		}

		//collision with borders
		return this.x < 0 || this.y <  0 || this.x >= board.size || this.y >= board.size;
	};

	this.onStar = function(){
		return this.x == star.x && this.y == star.y;
	};

	this.pushBodyPart = function(){
		var tail = this.body[this.body.length-1];
		this.body.push(new Body(tail.x, tail.y, this.size));
	}
}

function Body(x, y, size){
	this.size = size;
	this.x = x;
	this.y = y;
	this.left = document.getElementById("smile-left");
	this.up = document.getElementById("smile-up");
	this.right = document.getElementById("smile-right");
	this.down = document.getElementById("smile-down");

	this.draw = function(newX, newY){
		this.x = newX;
		this.y = newY;
		gameArea.context.fillStyle = "#d84a40";
		gameArea.context.fillRect(this.x+1, this.y+1, this.size-2, this.size-2);
	};

	this.smile = function(tilt){
		var icon;

		//define icon based on what direction the snake is travelling
		switch(tilt){
			case 0: icon = this.left; break;
			case 90: icon = this.up; break;
			case 180: icon = this.right; break;
			default: icon = this.down; break;
		}

		//draw the smile
		gameArea.context.drawImage(icon, this.x, this.y, this.size, this.size);
	}
}

function Star(cellSize, cellCount){
	this.icon = document.getElementById("star");

	this.validStarPos = function(){
		//check to see if star appears in/on snake
		for(var i = 0; i < snake.body.length; ++i){
			if(snake.body[i].x == this.x && snake.body[i].y == this.y){
				return false;
			}
		}
		return true;
	};

	this.move = function(){
		//get initial rand location
		this.x = cellSize*Math.floor(Math.random()*cellCount);
		this.y = cellSize*Math.floor(Math.random()*cellCount);

		//shift the star until in a valid position;
		while(!this.validStarPos()){
			this.shift();
		}

	};
	this.move();

	this.shift = function(){
		var boardSize = cellSize * cellCount;

		//move to the right one cell
		this.x += cellSize;

		//if end of the row, move down one row
		if(this.x >= boardSize) {
			this.x = 0;
			this.y += cellSize;
		}

		//if we reach the end of the board, start back at the top left
		if(this.y >= boardSize){
			this.y = 0;
			this.x = 0;
		}
	};

	this.draw = function(){
		gameArea.context.drawImage(this.icon, this.x, this.y, cellSize, cellSize);
	};
	this.draw();
}