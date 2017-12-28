var path = require('path');
var express = require('express');
var app = express();
var port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '/public/')));

app.get('/addScore', function(req, res){
	console.log("Score added");
});

app.get('/*', function (req, res) {
	res.render('public/index');
});

//set up server ports
app.listen(port, function(){
	console.log("Server has started on port: " + port + "\n");
});