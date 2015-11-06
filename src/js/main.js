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
        socket.emit('userList', { user: 'HansWurst' })
    });
});

http.listen(port, 'localhost' , function () {
    console.log('listening on *:' + port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');
});
app.get('/jquery', function (req, res) {
    res.sendFile(__dirname + '/libs/jquery-1.11.3.min.js');
});
app.get('/socketio', function (req, res) {
    res.sendFile(__dirname + '/libs/socket.io-1.3.7.min.js');
});
app.get('/main', function (req, res) {
    res.sendFile(__dirname + '/client/main.js');
});