var path = require('path');
var fs = require('fs');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

const file = "public/scores.json";

app.use(express.static(path.join(__dirname, '/public/')));

app.get('/addScore/:score/:username', function(req, res, next){
	console.log(req.params.username + ": " + req.params.score);
	fs.appendFile(file, req.params.username + ": " + req.params.score + "\n");

});

app.get('/*', function (req, res) {
	res.render('public/index');
});

//set up server ports
app.listen(port, function(){
	console.log("Server has started on port: " + port + "\n");
});

//TODO: Score Json object
/*	Idea: One json object 'table'
	Each entry is a place on the table (so an array)
	Each array entry holds an object
	Each object contains 2 values: name, score	
	Sort by score
*/