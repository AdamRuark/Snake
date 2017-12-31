function getScoreList(){
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() { 
		if (xhttp.readyState == 4 && xhttp.status == 200){
			fillTopList(JSON.parse(xhttp.responseText));
		}
	}
	xhttp.open("GET", "getScore", true);
	xhttp.send();
}

function fillTopList(data){
	var previewScores = document.getElementById("preview-list");
	var allScores = document.getElementById("score-list");
	previewScores.innerHTML = "";
	allScores.innerHTML = "";

	var headers = ["Name", "Score"];
	var labels = document.createElement("tr");
	for(var i = 0; i < 2; ++i){
		var th = document.createElement("th");
		var text = document.createTextNode(headers[i]);
		th.classList.add("score-cell");
		th.appendChild(text);
		labels.appendChild(th);
	}
	labels.classList.add("underline");
	previewScores.appendChild(labels.cloneNode(true));
	allScores.appendChild(labels);

	for(var i = 0; i < data.length; ++i){
		var row = document.createElement("tr");
		for(value in data[i]){
			var td = document.createElement("td");
			var text = document.createTextNode(data[i][value]);
			// td.classList.add("score-cell");
			td.appendChild(text);
			row.appendChild(td);
		}
		if(i < 5){
			previewScores.appendChild(row.cloneNode(true));
		}
		allScores.appendChild(row);
	}
}

function fillAllList(data){

}