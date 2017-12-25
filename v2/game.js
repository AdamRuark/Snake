window.onload = startGame;
window.addEventListener('keydown', function(e){
	gameArea.key = e.keyCode;
	inputHandler(snake);
});

function startGame() {
	gameArea.start();
	board = new Board(25);
	snake = new Snake("green", 0, 0, 30);
}

function updateGameArea() {
	gameArea.clear();
	snake.move();
	board.draw();
	snake.draw();
}

var gameArea = {
	canvas : document.createElement("canvas"),
	start : function() {
		//TODO: Get start input from the user and define game state from that

		this.canvas.width = 700;
		this.canvas.height = 700;
		this.context = this.canvas.getContext("2d");
		this.ignoreMove = false;
		// this.key = 40 /*start game off moving down*/

		//add to window and set up main loop
		var main = document.getElementsByClassName("main-game")[0];
		main.insertBefore(this.canvas, main.childNodes[0]);
		this.interval = setInterval(updateGameArea, 100);
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
			gameArea.interval = setInterval(updateGameArea, 100);
			gameArea.ignoreMove = false;
		}
	}

	//handle snake direction
	else if(gameArea.key >= 37 && gameArea.key <= 40){
		snake.changeDirection();
	}
}

function Board(num){
	this.size = 700;
	this.num = num;
	this.width = this.size/this.num;

	this.draw = function(){
		ctx = gameArea.context;
		for (var i = 0; i <= this.size; i += this.width) {
			ctx.moveTo(i, 0);
			ctx.lineTo(i, this.size);

			ctx.moveTo(0, i);
			ctx.lineTo(this.size, i);
		}
		ctx.strokeStyle = "black";
		ctx.stroke();
	}
	this.draw();
}

function Snake(color, x, y, size) {
	this.size = size;
	this.x = x;
	this.y = y;

	this.draw = function(){
		ctx = gameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.size, this.size);
	};
	this.draw();

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
	}

	this.changeDirection = function(){
		//if we can changed the direction, change it.
		if(this.isValidMove()) {
			this.direction = gameArea.key;
		}
	}
}

