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

function displayScoreList(scores){
	var scoresDOM = document.getElementById("score-list");
	for(var i = 0; i < 5; ++i){
		if(i < scores.length){
			var bullet = document.createElement('li');
			var value = document.createTextNode(scores[i].name + " " + scores[i].score);
			bullet.appendChild(value);
			scoresDOM.appendChild(bullet);
		}
	}
}