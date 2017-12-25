window.onload = startGame;

function startGame() {
	gameArea.start();
	snake = new Snake("green", 10, 120);
}

var gameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		this.canvas.width = 500;
		this.canvas.height = 500;
		this.context = this.canvas.getContext("2d");
		this.ignoreInput = false;
		this.key = 40 /*start game off moving down*/

		//add to window and set up main loop
		var main = document.getElementsByClassName("main-game")[0];
		main.insertBefore(this.canvas, main.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);

		//event listener
		window.addEventListener('keydown', eventHandler);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	inputHandler: function (currentKey) {

		//if the user presses space, pause or play the game depending on current state
		if(currentKey == 32){
			console.log(this.interval);
			if(this.interval){
				clearInterval(this.interval);
				this.interval = null;
				this.ignoreInput = true;
			}
			else {
				this.interval = setInterval(updateGameArea, 20);
				this.ignoreInput = false;
			}
		}
	}
}


function eventHandler(e){
	gameArea.key = e.keyCode;
	gameArea.inputHandler(gameArea.key);
}

function Snake(color, x, y) {
	this.width = 30;
	this.height = 30;
	this.x = x;
	this.y = y;
	this.prevDir = 0;
	
	ctx = gameArea.context;
	ctx.fillStyle = color;
	ctx.fillRect(this.x, this.y, this.width, this.height);

	this.update = function(){
		ctx = gameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};

	this.move = function(){

		//store current key incase key value changes while processing
		var key = gameArea.key;

		//if not a valid move, keep going in same direction
		if(!this.isValidMove(key)) {
			key = this.prevDir;
		}


		switch(key){
			case 37: this.x -= 1; break;
			case 38: this.y -= 1; break;
			case 39: this.x += 1; break;
			case 40: this.y += 1; break;
		}
		this.prevDir = key;
	};

	this.isValidMove = function (key){
		var temp = (key - 35)%4 + 37;
		return temp != this.prevDir && gameArea.ignoreInput == false;
	}
}

function updateGameArea() {
	gameArea.clear();
	snake.move();
	snake.update();
}