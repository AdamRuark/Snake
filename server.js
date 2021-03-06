var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

var jsonpath = './public/scores.json';
var data;
try{
	data = require(jsonpath);
}
catch(err) {
	data = [];
}

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

	//limit length to 100 scores
	if(data.length > 100) {
		data = data.slice(0, 100);
	}

	//copy data table to json file
	fs.writeFileSync(jsonpath, JSON.stringify(data, null, "\t"));
});

//send scores to client
app.get('/getScore', function(req, res){
	res.send(data);
});

//special command to purge score list
app.get('/purge', function(req, res){
	data = [];
	fs.writeFileSync(jsonpath, JSON.stringify(data, null, "\t"));
	res.sendFile(__dirname + '/public/index.html');

});

//set up server port
app.listen(port, function(){
	console.log("Server has started on port: " + port + "\n");
});

function compare(a, b){
	return b.score - a.score;
}
