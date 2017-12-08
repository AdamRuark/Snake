window.onload = createBoard;
window.onkeydown = userInput;


function createBoard(){
	var tr, td;
	var main = document.getElementsByTagName("main");
	var table = document.createElement("table");
	main = main[0];

	//add all the columns and rows
	for(var i = 0; i < 20; i++){
		tr = document.createElement("tr");
		for(var j = 0; j < 20; j++){
			td = document.createElement("td");
			tr.appendChild(td);

		}
		table.appendChild(tr);
	}
	main.appendChild(table);
}


//global so move is only called once
var intervalId;
var key;

function userInput(e, row = 0, col = 0){
	key = e.keyCode
	if (intervalId == null) {
    	move(row, col);
    }
}

function move(row, col){
	//change the color
	changeColor("green", row, col);

	//increment the direction
	switch(key){
		case 37:
			col--;
			break;
		case 38:
			row--;
			break;
		case 39:
			col++;
			break;
		case 40:
			row++;
			break;
	}

	console.log(row + " " + col);

	//set it on loop until new input
	if(intervalId){
		clearInterval(intervalId);
	}
	intervalId = setInterval(function(){move(row, col);}, 100);
}

function changeColor(color, row, col){
	var tr = document.getElementsByTagName("tr");
	tr[row].childNodes[col].style.backgroundColor = color;
}
