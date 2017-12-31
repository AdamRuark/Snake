function getScoreList(){
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() { 
		if (xhttp.readyState == 4 && xhttp.status == 200){
			fillLists(JSON.parse(xhttp.responseText));
		}
	}
	xhttp.open("GET", "getScore", true);
	xhttp.send();
}

function fillLists(data){
	var previewScores = document.getElementById("preview-list");
	var allScores = document.getElementById("score-list");
	previewScores.innerHTML = "";
	allScores.innerHTML = "";

	var headers = ["Name", "Score"];

	//table header
	var labels = document.createElement("thead");
	var row = document.createElement("tr");
	labels.appendChild(row);
	labels.style.position = "sticky";
	labels.style.top = 0;

	for(var i = 0; i < 2; ++i){
		var th = document.createElement("th");
		var text = document.createTextNode(headers[i]);
		th.classList.add("score-cell");
		th.appendChild(text);
		labels.appendChild(th);
	}
	previewScores.appendChild(labels.cloneNode(true));
	allScores.appendChild(labels);

	//table contents
	var content = document.createElement("tbody");
	var clone = content.cloneNode(true);
	for(var i = 0; i < data.length; ++i){
		row = document.createElement("tr");
		for(value in data[i]){
			var td = document.createElement("td");
			var text = document.createTextNode(data[i][value]);
			td.appendChild(text);
			row.appendChild(td);
		}
		if(i < 5){
			clone.appendChild(row.cloneNode(true));
		}
		content.appendChild(row);
	}
	previewScores.appendChild(clone);
	allScores.appendChild(content);
}
