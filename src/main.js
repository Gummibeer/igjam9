var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors');
var user = require('./server/models/user.js');
var helpers = require('./server/helpers.js');

var port = 666; //63350;
var users = [];

colors.setTheme({
    info: 'cyan',
    warn: 'yellow',
    debug: 'gray',
    error: 'red'
});

console.log('starting game server');

io.on('connection', function (socket) {
    var userID = users.push(new user.model('', socket, 0)) - 1;
    users[userID].id = userID;
    socket.emit('userID', userID);
    console.log(colors.info('user connected #%s'), userID);
    console.log(colors.debug('now are %s users on the server'), users.length);

    socket.on('disconnect', function () {
        users.splice(userID, 1);
        io.emit('userList', { usersList: helpers.getUsersList(users) });
        console.log(colors.magenta('user disconnected #%s'), userID);
        console.log(colors.debug('now are %s users on the server'), users.length);
    });

    socket.on('joinLobby', function (userData) {
        console.log(colors.green('user joined lobby #%s - %s'), userData.id, userData.name);
        users[userData.id].name = userData.name;
        users[userData.id].status = 1;
        io.emit('userList', { usersList: helpers.getUsersList(users) });
    });

    socket.on('requestGame', function (id) {
        console.log(colors.debug('user #%s has requested a game against #%s'), userID, id);
        users[userID].socket.emit('gameRequest', { userData: helpers.getUserData(users[id]) });
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