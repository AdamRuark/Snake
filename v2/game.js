window.onload = startGame;
window.addEventListener('keydown', function(e){
	gameArea.key = e.keyCode;
	inputHandler(snake);
});

function startGame() {
	
	var size = 700;
	var num = 25;

	var width = size/num;

	gameArea.start(size);
	board = new Board(size, num, width);
	snake = new Snake("green", 0, 0, width);
}

function updateGameArea() {
	snake.move();
	if(snake.checkCollision()){
		gameArea.endGame();
	}
	gameArea.clear();
	board.draw();
	snake.draw();
}

var gameArea = {
	canvas : document.createElement("canvas"),
	start : function(size) {
		//TODO: Get start input from the user and define game state from that

		this.canvas.width = size;
		this.canvas.height = size;
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
	endGame : function(){
		console.log("End Game");
		clearInterval(this.interval);

		//this will have weird results when space is pressed i think, since the interval can be restarted
	}
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
		ctx.strokeStyle = "grey";
		ctx.lineWidth = 1;
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
		ctx.fillRect(this.x+1, this.y+1, this.size-2, this.size-2);
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

	this.checkCollision = function(){
		//do more testing. Try to check collision before it is out of bounds	

		if(this.x <= 0 && this.direction == 37) return true;
		if(this.y <= 0 && this.direction == 38) return true;
		if(this.x >= board.size && this.direction == 39) return true;
		if(this.y >= board.size && this.direction == 40) return true;
		return false;
	}
}

