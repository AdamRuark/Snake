function getScoreList(){
	var xhttp = new XMLHttpRequest();

	xhttp.onreadystatechange = function() { 
		if (xhttp.readyState == 4 && xhttp.status == 200){
			displayScoreList(JSON.parse(xhttp.responseText));
		}
	}
	xhttp.open("GET", "getScore", true);
	xhttp.send();
}

function displayScoreList(data){
	var scores = document.getElementById("score-list");
	scores.innerHTML = "";

	var headers = ["Name", "Score"];
	var labels = document.createElement("tr");
	for(var i = 0; i < 2; ++i){
		var th = document.createElement("th");
		var text = document.createTextNode(headers[i]);
		th.appendChild(text);
		labels.appendChild(th);
	}
	scores.appendChild(labels);

	for(var i = 0; i < 5; ++i){
		if(i < data.length){
			var row = document.createElement("tr");
			for(value in data[i]){
				var td = document.createElement("td");
				var text = document.createTextNode(data[i][value]);
				td.appendChild(text);
				row.appendChild(td);
			}
		scores.appendChild(row);
		}
	}
}