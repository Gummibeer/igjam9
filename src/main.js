var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var colors = require('colors');
var user = require('./server/models/user.js');

var port = 666;
var users = [];

colors.setTheme({
    info: 'cyan',
    warn: 'yellow',
    debug: 'gray',
    error: 'red'
});

io.on('connection', function (socket) {
    var userID = users.push(new user.model('', socket, 0)) - 1;
    users[userID].id = userID;
    console.log(colors.info('user connected #%s'), userID);
    console.log(colors.debug('now are %s users on the server'), users.length);

    socket.on('disconnect', function () {
        users.splice(userID, 1);
        console.log(colors.magenta('user disconnected #%s'), userID);
        console.log(colors.debug('now are %s users on the server'), users.length);
    });

    socket.on('joinLobby', function (name) {
        console.log(colors.green('user joined lobby #%s - %s'), userID, name);
        users[userID].name = name;
        var usersList = users.map(function(user) {
            return {
                id: user.id,
                name: user.name
            };
        });
        socket.emit('userList', { usersList: usersList });
    });
});

http.listen(port, function () {
    console.log('listening on *:' + port);
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/html/index.html');
});
app.get(/src\/(.*)/, function (req, res) {
    res.sendFile(__dirname + '/' + req.params[0]);
});