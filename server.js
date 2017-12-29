var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var jsonpath = './public/scores.json';
var data = require(jsonpath);

//serve static files
app.use(express.static(path.join(__dirname, '/public/')));

//save current score
app.get('/addScore/:score/:username', function(req, res){

	//create new score object
	var obj = {
		name: req.params.username,
		score: req.params.score
	};

	//add to data table
	data.push(obj);
	data.sort(compare);

	//copy data table to json file
	fs.writeFileSync(jsonpath, JSON.stringify(data, null, "\t"));
	console.log("Score Saved");
});

//send scores to client
app.get('/getScore', function(req, res){
	console.log("Sent Score");
	res.send(data);
});

//special command to purge score list
app.get('/purge', function(req, res){
	data = [];
	fs.writeFileSync(jsonpath, JSON.stringify(data, null, "\t"));
	console.log("Scores purged");
	res.sendFile(__dirname + '/public/index.html');

});

//set up server port
app.listen(port, function(){
	console.log("Server has started on port: " + port + "\n");
});

function compare(a, b){
	return b.score - a.score;
}
