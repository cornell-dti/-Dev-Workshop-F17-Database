var express = require('express');
var app = express();
var firebase = require("firebase");

var config = {
	apiKey: "AIzaSyCae6a4De24CVUI0bxi1nkgyMBXDVLdnjY",
	databaseURL: "https://devs-f17.firebaseio.com/"
};
firebase.initializeApp(config);

// Get a reference to the database service
var database = firebase.database();

app.set('port', (process.env.PORT || 5000));

app.use(express.static(__dirname + '/public'));

// views is directory for all template files
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.get('/', function(request, response) {
  response.render('pages/index');
});

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {

    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

// Gets all the entries in the DB
app.get('/:db/select', function(request, response) {
	var path = request.params.db+"/entries";
	responseList = [];
	firebase.database().ref(path).once("value", function(snapshot) {
		for (var key in snapshot.val()) {
			var singleObj = {};
			singleObj['key'] = key
			singleObj['value'] = snapshot.val()[key];
  			responseList.push(singleObj);
		}
		response.send(shuffle(responseList));
	});
});

// Gets one entry from the DB
app.get('/:db/selectKey/:key', function(request, response) {
	var path = request.params.db+"/entries/"+request.params.key;
	firebase.database().ref(path).once('value').then(function(snapshot) {
		response.send(snapshot.val());
	});
});

// Delete entries
app.get('/:db/delete/:key?', function(request, response) {
	var path = '';
	if(!request.params.key) {
		// Delete all entries
		path = request.params.db+'/entries';
	} else {
		// Delete specific key
		path = request.params.db+'/entries/'+request.params.key;
	}
	firebase.database().ref(path).remove();
	response.sendStatus(200);
});

// Update an entry's field
app.get('/:db/update/:key/:field/:newValue', function(request, response) {
	var path = request.params.db+'/entries/'+request.params.key+"/"+request.params.field;
	firebase.database().ref(path).set(request.params.newValue);
	response.sendStatus(200);
});

// Insert a new entry
app.get('/:db/insert/:name/:is_resolved', function(request, response) {
	var path = request.params.db+'/entries';
	var newRef = firebase.database().ref(path).push();
	newRef.set({
		timestamp: (new Date).getTime(),
		name: request.params.name,
		is_resolved: request.params.is_resolved
	});
	response.sendStatus(200);
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
