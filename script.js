window.onload = createBoard;
window.onkeydown = userInput;


function createBoard(){
	var tr, td;
	var main = document.getElementsByTagName("main");
	var table = document.createElement("table");
	main = main[0];

	//add all the columns and rows
	for(var i = 0; i < 30; i++){
		tr = document.createElement("tr");
		for(var j = 0; j < 30; j++){
			td = document.createElement("td");
			tr.appendChild(td);

		}
		table.appendChild(tr);
	}
	main.appendChild(table);
}


//global so move is only called once
var intervalId;
var key = null;

function userInput(e, row = 0, col = 0){

	changeKey(e.keyCode);

	//call move once here to initialize it
	if (intervalId == null) {
    	move(row, col);
    }
}

function changeKey(inputKey){

	//modulo math to determine if current key is opposite of input key
	var temp = (inputKey - 35)%4 + 37;

	//if not, change the current key
	if(temp != key){
		key = inputKey;
	}
}

function move(row, col){
	//change the color
	changeColor("green", row, col);

	//increment the direction
	switch(key){
		//left
		case 37:
			col--;
			break;
		//up
		case 38:
			row--;
			break;
		//right
		case 39:
			col++;
			break;
		//down
		case 40:
			row++;
			break;
	}

	console.log(row + " " + col);

	//set it on loop indefinitely
	if(intervalId){
		clearInterval(intervalId);
	}
	intervalId = setInterval(function(){move(row, col);}, 100);
}

function changeColor(color, row, col){
	var tr = document.getElementsByTagName("tr");
	tr[row].childNodes[col].style.backgroundColor = color;
}
