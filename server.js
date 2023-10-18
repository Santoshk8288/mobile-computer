var express 	 = require('express');
var app 			 = express();
var http 			 = require('http')
var server  	 = http.createServer(app);
var bodyParser = require('body-parser');
var io 				 = require('socket.io').listen(server);
var device     = require('express-device');
var robot      = require("robotjs");

app.use(device.capture());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/client'));
app.use(function(req,res,next){
  res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});

app.get('/', function(req, res){
	if(req.device.type === 'desktop'){
		res.sendFile(__dirname+'/client/desktop.html')	
	}
	else{
		res.sendFile(__dirname+'/client/mobile.html')
	}
})

server.listen(process.env.PORT || 3000, function(){
	console.log('Running on port %d...',process.env.PORT || 3000);	
});



io.on('connection', function(socket){
	handshake = socket.handshake;
  code = handshake.query.code;
  socket.room = code
  var mouse=robot.getMousePos();
  socket.x = mouse.x
  socket.y = mouse.y
  socket.join(code)
  var room = io.sockets.adapter.rooms[code]
  if(room.length == 2){
  	io.sockets.in(code).emit('main page')
  }

  socket.on('move-x', function(x){
		socket.x += x
		robot.moveMouse(socket.x,socket.y);
	})

	socket.on('move-y', function(y){
		socket.y -= y
		robot.moveMouse(socket.x,socket.y);
	})
  
  socket.on('click', function(){	
		robot.mouseClick();
  }) 
})
