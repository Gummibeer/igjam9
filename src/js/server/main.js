var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var port = 666;

io.on('connection', function(socket){
    console.log('a user connected');
    socket.on('disconnect', function(){
        console.log('a user disconnected');
    });

    socket.on('joinLobby', function(name){
        console.log('user joined lobby: ' + name);
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');
});