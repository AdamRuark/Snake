window.onload = startGame;
window.addEventListener('keydown', function(e){
	gameArea.key = e.keyCode;
	inputHandler(snake);
});

function startGame() {
	
	gameArea.width = 700;
	var cellCount = 25;

	var cellWidth = gameArea.width/cellCount;

	gameArea.create();
	board = new Board(gameArea.width, cellCount, cellWidth);
	snake = new Snake(cellWidth*Math.floor(cellCount/2), 0, cellWidth);
	star = new Star(cellWidth, cellCount);
}

function updateGameArea() {
	snake.move();
	if(snake.checkCollision()){
		gameArea.end();
	}
	gameArea.clear();
	board.draw();
	snake.draw();
}

var gameArea = {
	canvas : document.createElement("canvas"),
	rate : 100,
	running : false, 
	width : 700,
	create : function() {
		//TODO: Get start input from the user and define game state from that

		this.canvas.width = this.width+1;
		this.canvas.height = this.width+1;
		this.context = this.canvas.getContext("2d");
		this.context.globalAlpha = 1;
		this.context.translate(0.5, 0.5);
		this.ignoreMove = false;

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
		console.log("End Game");
		clearInterval(this.interval);
		this.running = false;

		/*TODO: Cheat, since game ends when snake goes 1 out of bounds
		add 1 to the tail to make it look like it hasn't moved*/
	}
}

function inputHandler(snake) {
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

	//handle snake direction
	else if(gameArea.key >= 37 && gameArea.key <= 40 && gameArea.running){
		snake.changeDirection();
	}

	else if(gameArea.key == 13 && !gameArea.running){
		gameArea.running = true;
		gameArea.start();
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
}

function Body(x, y, size){
	this.size = size;
	this.x = x;
	this.y = y;

	this.draw = function(newX, newY){
		this.x = newX;
		this.y = newY;
		ctx = gameArea.context;
		ctx.fillStyle = "green";
		ctx.fillRect(this.x+1, this.y+1, this.size-2, this.size-2);
	};
}

function Star(size, cellCount){
	this.size = size;
	

	this.validStarPos = function(){
		//check to see if star appears in/on snake
		for(var i = 0; i < snake.body.length; ++i){
			if(snake.body[i].x == this.x || snake.body[i].y == this.y){
				return false;
			}
		}
		return true;
	};

	this.create = function(){

		//get random location until star is in valid position
		do{
			this.x = size*Math.floor(Math.random()*cellCount);
			this.y = size*Math.floor(Math.random()*cellCount);
		} while(!this.validStarPos());

		console.log(this.x + " " + this.y);
		
	};
	this.create();

	this.draw = function(){
		ctx = gameArea.context;
		ctx.fillStyle = "yellow";
		ctx.fillRect(this.x+1, this.y+1, this.size-2, this.size-2);
	};
	this.draw();

	
}