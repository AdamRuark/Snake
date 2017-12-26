window.onload = startGame;
window.addEventListener('keydown', function(e){
	gameArea.key = e.keyCode;
	inputHandler(snake);
});

function startGame() {
	
	var boardWidth = 700;
	var cellCount = 25;

	var cellWidth = boardWidth/cellCount;

	gameArea.start(boardWidth);
	board = new Board(boardWidth, cellCount, cellWidth);
	snake = new Snake("green", cellWidth*(5), 0, cellWidth);
}

function updateGameArea() {
	snake.move();
	if(snake.predictMove()){
		gameArea.end();
	}
	gameArea.clear();
	board.draw();
	snake.draw();

}

var gameArea = {
	canvas : document.createElement("canvas"),
	rate : 100,
	start : function(size) {
		//TODO: Get start input from the user and define game state from that

		this.canvas.width = size;
		this.canvas.height = size;
		this.context = this.canvas.getContext("2d");
		this.ignoreMove = false;

		//add to window and set up main loop
		var main = document.getElementsByClassName("main-game")[0];
		main.insertBefore(this.canvas, main.childNodes[0]);
		this.interval = setInterval(updateGameArea, this.rate);
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	},
	end : function(){
		console.log("End Game");
		clearInterval(this.interval);

		//this will have weird results when space is pressed I think, since the interval can be restarted
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
			gameArea.interval = setInterval(updateGameArea, gameArea.rate);
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
	this.body = [];
	this.direction = 40; /*temporary?*/

	this.initBody = function(){
		for(var i = 0; i < 6; ++i){
			this.body.push(new Body(color, this.x, this.y - (i*this.size), this.size));
			console.log(this.body[i]);
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
		// this.body[this.body.length-1].draw(newLocation.x, newLocation.y);

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
		//if we new direction isn't the opposite direction, change it.
		if(this.isValidMove()) {
			this.direction = gameArea.key;
		}
	};

	this.checkCollision = function(){

		//TODO: Check collision with itself
		return this.x < 0 || this.y <  0 || this.x >= board.size || this.y >= board.size;
	};

	this.predictMove = function(){
		//store values to replace later
		var tempX = this.x;
		var tempY = this.y;

		//temporarily move (future move) to check collision in next turn
		this.move();
		var val = this.checkCollision();

		//reset values
		this.x = tempX;
		this.y = tempY;

		//return collision result
		return val;
	};
}

function Body(color, x, y, size){
	this.size = size;
	this.x = x;
	this.y = y;

	this.draw = function(newX, newY){
		this.x = newX;
		this.y = newY;
		ctx = gameArea.context;
		ctx.fillStyle = color;
		ctx.fillRect(this.x+1, this.y+1, this.size-2, this.size-2);
	};
}