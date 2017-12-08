window.onload = createBoard;


function createBoard(){
	//get main element
	var tr, td;
	var table = document.createElement("table");
	var main = document.getElementsByTagName("main");
	main = main[0];
	main.appendChild(table);

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