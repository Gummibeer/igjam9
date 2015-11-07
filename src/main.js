var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors');
var user = require('./server/models/user.js');
var helpers = require('./server/helpers.js');

var port = 63350; //63350;
var users = {};

colors.setTheme({
    info: 'cyan',
    warn: 'yellow',
    debug: 'gray',
    error: 'red'
});

console.log('starting game server');

io.on('connection', function (socket) {
    users[socket.id] = new user.model('', socket, 0);
    users[socket.id].id = socket.id;
    users[socket.id].socket = socket;
    console.log(colors.info('user connected %s'), socket.id);
    console.log(colors.debug('now are %s users on the server'), Object.keys(users).length);

    socket.on('disconnect', function () {
        delete users[socket.id];
        io.emit('userList', { usersList: helpers.getUsersList(users) });
        console.log(colors.magenta('user disconnected %s'), socket.id);
        console.log(colors.debug('now are %s users on the server'), Object.keys(users).length);
    });

    socket.on('joinLobby', function (name) {
        console.log(colors.green('user joined lobby %s - %s'), socket.id, name);
        users[socket.id].name = name;
        users[socket.id].status = 1;
        io.emit('userList', { usersList: helpers.getUsersList(users) });
    });

    socket.on('requestGame', function (id) {
        console.log(colors.debug('user %s has requested a game against %s'), socket.id, id);
        users[id].socket.emit('gameRequest', { userData: helpers.getUserData(users[socket.id]) });
    });
});

http.listen(port, function () {
    console.log('listening on *:%s', port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');
});
app.get(/src\/(.*)/, function (req, res) {
    res.sendFile(__dirname + '/' + req.params[0]);
});