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

		//add to window and set up main loop
		var main = document.getElementsByClassName("main-game")[0];
		main.insertBefore(this.canvas, main.childNodes[0]);
		this.interval = setInterval(updateGameArea, 20);

		//event listener
		window.addEventListener('keydown', function (e) {
			gameArea.key = e.keyCode;
		})
	},
	clear : function() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
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
		var key = gameArea.key;

		//verify current key is valid input
		if(key < 37 || key > 40) return;

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
		return temp != this.prevDir;
	}
}

function updateGameArea() {
	gameArea.clear();
	snake.move();
	snake.update();
}