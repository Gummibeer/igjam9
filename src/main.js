var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors');
var user = require('./server/models/user.js');
var helpers = require('./server/helpers.js');

console.log(helpers.prefix() + 'starting game server');

var port = 666; //63350;
var users = {};

colors.setTheme({
    info: 'cyan',
    warn: 'yellow',
    debug: 'gray',
    error: 'red'
});

// SOCKETS
io.on('connection', function (socket) {
    users[socket.id] = new user.model(socket, 0, '');
    users[socket.id].id = socket.id;
    users[socket.id].socket = socket;
    console.log(helpers.prefix() + colors.info('user connected %s'), socket.id);
    console.log(helpers.prefix() + colors.debug('now are %s users on the server'), Object.keys(users).length);

    socket.on('disconnect', function () {
        socket.leave('lobby');
        delete users[socket.id];
        io.to('lobby').emit('userList', {usersList: helpers.getUsersList(users)});
        console.log(helpers.prefix() + colors.magenta('user disconnected %s'), socket.id);
        console.log(helpers.prefix() + colors.debug('now are %s users on the server'), Object.keys(users).length);
    });

    socket.on('joinLobby', function (name) {
        socket.join('lobby');
        console.log(helpers.prefix() + colors.green('user joined lobby %s - %s'), socket.id, name);
        users[socket.id].name = name;
        users[socket.id].status = 1;
        io.to('lobby').emit('userList', {usersList: helpers.getUsersList(users)});
    });

    socket.on('requestGame', function (id) {
        console.log(helpers.prefix() + colors.debug('user %s has requested a game against %s'), socket.id, id);
        users[id].socket.emit('gameRequest', {userData: helpers.getUserData(users[socket.id])});
    });

    socket.on('abortRequest', function (id) {
        console.log(helpers.prefix() + colors.debug('user %s has aborted the game requested from %s'), socket.id, id);
        users[id].socket.emit('requestAborted', {userData: helpers.getUserData(users[socket.id])});
    });

    socket.on('acceptRequest', function (id) {
        console.log(helpers.prefix() + colors.debug('user %s has accepted the game requested from %s'), socket.id, id);

        var room = 'match-' + Date.now();
        socket.join(room);
        users[id].socket.join(room);
        console.log(helpers.prefix() + colors.debug('match-room created %s for: %s vs %s'), room, socket.id, id);

        io.to(room).emit('initGame', {
            match: room,
            user1: helpers.getUserData(users[socket.id]),
            user2: helpers.getUserData(users[id])
        });
    });
});

// HTTP
http.listen(port, function () {
    console.log(helpers.prefix() + 'listening on *:%s', port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');
});
app.get(/src\/(.*)/, function (req, res) {
    res.sendFile(__dirname + '/' + req.params[0]);
});

// CONSOLE
var stdin = process.openStdin();
stdin.addListener('data', function (d) {
    var str = d.toString().trim();
    console.log(colors.debug('your command: %s'), str);
    switch (str) {
        case '/userlist':
            console.log(helpers.c.getUsersNameList(users));
            break;
        default:
            console.log(colors.error('das ist kein command'));
            break;
    }
});