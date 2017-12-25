window.onload = startGame;
window.addEventListener('keydown', function(e){
	gameArea.key = e.keyCode;
	inputHandler(snake);
});

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
		this.ignoreMove = false;
		// this.key = 40 /*start game off moving down*/

		//add to window and set up main loop
		var main = document.getElementsByClassName("main-game")[0];
		main.insertBefore(this.canvas, main.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	
}

function inputHandler(snake) {

	//if the user presses space, pause or play the game depending on current state
	if(gameArea.key == 32){
		if(gameArea.interval){
			clearInterval(gameArea.interval);
			gameArea.interval = null;
			gameArea.ignoreMove = true;
		}
		else {
			gameArea.interval = setInterval(updateGameArea, 20);
			gameArea.ignoreMove = false;
		}
	}

	//handle snake direction
	else if(gameArea.key >= 37 && gameArea.key <= 40){
		snake.changeDirection();
	}
}


function Snake(color, x, y) {
	this.width = 30;
	this.height = 30;
	this.x = x;
	this.y = y;
	
	ctx = gameArea.context;
	ctx.fillStyle = color;
	ctx.fillRect(this.x, this.y, this.width, this.height);

	this.update = function(){
		ctx = gameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};

	this.move = function(){
		switch(this.direction){
			case 37: this.x -= 1; break;
			case 38: this.y -= 1; break;
			case 39: this.x += 1; break;
			case 40: this.y += 1; break;
		}
	};

	this.isValidMove = function(key){
		var temp = (key - 35)%4 + 37;
		return temp != this.direction && gameArea.ignoreMove == false;
	}

	this.changeDirection = function(){
		//if we can changed the direction, change it.
		if(this.isValidMove(gameArea.key)) {
			this.direction = gameArea.key;
		}
	}
}

function updateGameArea() {
	gameArea.clear();
	snake.move();
	snake.update();
}