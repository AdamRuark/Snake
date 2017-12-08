window.onload = createBoard;
window.onkeydown = userInput;


function createBoard(){
	//get main element
	var tr, td;
	var table = document.createElement("table");
	var main = document.getElementsByTagName("main");
	main = main[0];
	main.appendChild(table);

	for(var i = 0; i < 20; i++){
		tr = document.createElement("tr");
		tr.className += "row" + i; 

		for(var j = 0; j < 20; j++){
			td = document.createElement("td");
			td.className += "col" + j;
			tr.appendChild(td);

		}
		table.appendChild(tr);
	}
	main.appendChild(table);
}

function userInput(e){
	var td = document.getElementsByTagName("td");
	if(e.keyCode == 37){
		for(var i = 0; i < td.length; i++){
			td[i].style.backgroundColor = "green";
		}
	}
	else {
		for(var i = 0; i < td.length; i++){
			td[i].style.backgroundColor = "red";
		}
	}
}