var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors');
var helpers = require('./server/helpers.js');

var user = require('./server/models/user.js');
var item = require('./server/models/item.js');

console.log(helpers.prefix() + 'starting game server');

var port = 63350; //63350;
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

        users[socket.id].status = 2;
        users[id].status = 2;
        io.to('lobby').emit('userList', {usersList: helpers.getUsersList(users)});

        io.to(room).emit('initGame', {
            match: room, // matchname
            user1: helpers.getUserData(users[socket.id]), // accepted
            user1Items: [
                item.collection.random(),
                item.collection.random(),
                item.collection.random(),
                item.collection.random()
            ],
            user2: helpers.getUserData(users[id]), // requester
            user2Items: [
                item.collection.random(),
                item.collection.random(),
                item.collection.random(),
                item.collection.random()
            ]
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
    var parts = str.split(' ');
    parts[0] = parts[0].trim();
    console.log(colors.debug('your command: %s'), str);
    switch (parts[0]) {
        case '/userlist':
            console.log(helpers.c.getUsersNameList(users));
            break;
        case '/userkick':
            parts[1] = parts[1].trim();
            if (Object.keys(users).indexOf(parts[1]) !== -1) {
                users[parts[1]].socket.disconnect();
                console.log(helpers.prefix() + colors.info('kicked user %s'), parts[1]);
            } else {
                console.log(colors.error('es gibt keinen user mit der ID'));
            }
            break;
        case '/kickall':
            for (var id in users) {
                if (users.hasOwnProperty(id)) {
                    users[id].socket.disconnect();
                    console.log(helpers.prefix() + colors.info('kicked user %s'), id);
                }
            }
            break;
        default:
            console.log(colors.error('das ist kein command'));
            break;
    }
});

// ITEMS
item.collection.add(1, 'Item #1', 'url');
item.collection.add(2, 'Item #2', 'url');
item.collection.add(3, 'Item #3', 'url');
item.collection.add(4, 'Item #4', 'url');
item.collection.add(5, 'Item #5', 'url');
item.collection.add(6, 'Item #6', 'url');
item.collection.add(7, 'Item #7', 'url');
item.collection.add(8, 'Item #8', 'url');
item.collection.add(9, 'Item #9', 'url');
item.collection.add(10, 'Item #10', 'url');
item.collection.add(11, 'Item #11', 'url');
item.collection.add(12, 'Item #12', 'url');