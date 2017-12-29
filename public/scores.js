function getScoreList(){
	var xhttp = new XMLHttpRequest();
	var scores;

	xhttp.onreadystatechange = function() { 
        if (xhttp.readyState == 4 && xhttp.status == 200){
        	scores = JSON.parse(xhttp.responseText);

        	displayScoreList(scores);
        }
    }
	xhttp.open("GET", "getScore", true);
	xhttp.send();
}

function displayScoreList(scores){
	var scoresDOM = document.getElementById("score-list");
	for(var i = 0; i < 5; ++i){
		var bullet = document.createElement('li');
		var value = document.createTextNode(scores[i].name + " " + scores[i].score);
		bullet.appendChild(value);
		scoresDOM.appendChild(bullet);
	}

	console.log(scores)
}