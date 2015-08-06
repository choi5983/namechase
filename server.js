// require express and path
var express = require("express");
var path = require("path");
var session = require('express-session');
// create the express app
var app = express();
app.use(session({secret: 'codingdojorocks'}));  // string for encryption

// static content 
app.use(express.static(path.join(__dirname, "./static")));
// setting up ejs and our views folder
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');
// root route to render the index.ejs view

app.get('/', function(req, res) {
 console.log('Index page requested; Session Info', req.sessionID);
 players[req.sessionID] = {name: 'blank', coordinates: {x: 0, y: 0}};
 res.render("index", {sessionID: req.sessionID});
})
// tell the express app to listen on port 8000
var server = app.listen(8000, function() {
 console.log("listening on port 8000");
})

var io = require('socket.io').listen(server);
var players = {};

io.sockets.on('connection', function (socket) {
  console.log("WE ARE USING SOCKETS!");
  console.log(socket.id);
  socket.on("got_name", function(data){
  	players[data.sessionID].name = data.name;
  	players[data.sessionID].coordinates.x = Math.floor(Math.random()*300);
	players[data.sessionID].coordinates.y = Math.floor(Math.random()*300);

  	console.log("Players", players);
  	io.emit("updated_players", {players: players});
  })

  socket.on("moved", function(data){
  	players[data.sessionID].coordinates.x += data.x*10;
	players[data.sessionID].coordinates.y += data.y*10;
	io.emit("updated_players", {players: players});
  })
  //all the socket code goes in here!
})